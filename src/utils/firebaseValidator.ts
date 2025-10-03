import { useState } from "react";
import { auth, db, storage } from "../lib/firebase";
import { signInAnonymously, signOut, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export interface ValidationResult {
  service: string;
  status: "success" | "error" | "warning";
  message: string;
  details?: any;
}

export class FirebaseValidator {
  private results: ValidationResult[] = [];

  async validateAll(): Promise<ValidationResult[]> {
    this.results = [];

    console.log("🔍 Starting Firebase validation...");

    await this.validateAuth();
    await this.validateFirestore();
    await this.validateStorage();
    await this.validateEnvironmentVariables();

    this.printResults();
    return this.results;
  }

  private async validateAuth(): Promise<void> {
    try {
      console.log("🔐 Testing Authentication...");

      // Test anonymous sign-in
      const { user } = await signInAnonymously(auth);

      if (user) {
        this.addResult({
          service: "Authentication",
          status: "success",
          message: "Authentication is working correctly",
          details: { uid: user.uid },
        });

        // Sign out after test
        await signOut(auth);
      }
    } catch (error: any) {
      this.addResult({
        service: "Authentication",
        status: "error",
        message: "Authentication failed",
        details: error.message,
      });
    }
  }

  private async validateFirestore(): Promise<void> {
    try {
      console.log("🗄️ Testing Firestore...");

      // Test write operation
      const testDoc = await addDoc(collection(db, "test"), {
        message: "Firebase validation test",
        timestamp: new Date(),
        testId: Math.random().toString(36).substr(2, 9),
      });

      // Test read operation
      const snapshot = await getDocs(collection(db, "test"));
      const docs = snapshot.docs;

      if (docs.length > 0) {
        this.addResult({
          service: "Firestore",
          status: "success",
          message: "Firestore read/write operations working",
          details: {
            testDocId: testDoc.id,
            totalDocs: docs.length,
          },
        });

        // Clean up test document
        await deleteDoc(testDoc);
      }
    } catch (error: any) {
      this.addResult({
        service: "Firestore",
        status: "error",
        message: "Firestore operations failed",
        details: error.message,
      });
    }
  }

  private async validateStorage(): Promise<void> {
    try {
      console.log("📁 Testing Storage...");

      // Create a test file
      const testContent = "Firebase storage validation test";
      const testBlob = new Blob([testContent], { type: "text/plain" });
      const testRef = ref(storage, `test/validation-${Date.now()}.txt`);

      // Test upload
      await uploadBytes(testRef, testBlob);

      // Test download URL
      const downloadURL = await getDownloadURL(testRef);

      if (downloadURL) {
        this.addResult({
          service: "Storage",
          status: "success",
          message: "Storage upload/download working",
          details: { downloadURL },
        });

        // Clean up test file
        await deleteObject(testRef);
      }
    } catch (error: any) {
      this.addResult({
        service: "Storage",
        status: "error",
        message: "Storage operations failed",
        details: error.message,
      });
    }
  }

  private async validateEnvironmentVariables(): Promise<void> {
    const requiredVars = [
      "VITE_FIREBASE_API_KEY",
      "VITE_FIREBASE_AUTH_DOMAIN",
      "VITE_FIREBASE_PROJECT_ID",
      "VITE_FIREBASE_STORAGE_BUCKET",
      "VITE_FIREBASE_MESSAGING_SENDER_ID",
      "VITE_FIREBASE_APP_ID",
    ];

    const missingVars = requiredVars.filter(
      (varName) => !import.meta.env[varName]
    );

    if (missingVars.length === 0) {
      this.addResult({
        service: "Environment Variables",
        status: "success",
        message: "All required environment variables are set",
      });
    } else {
      this.addResult({
        service: "Environment Variables",
        status: "error",
        message: `Missing environment variables: ${missingVars.join(", ")}`,
        details: {
          missing: missingVars,
          instructions:
            "Create a .env.local file with your Firebase configuration",
        },
      });
    }
  }

  private addResult(result: ValidationResult): void {
    this.results.push(result);
  }

  private printResults(): void {
    console.log("\n📊 Firebase Validation Results:");
    console.log("=".repeat(50));

    this.results.forEach((result) => {
      const icon =
        result.status === "success"
          ? "✅"
          : result.status === "error"
          ? "❌"
          : "⚠️";

      console.log(`${icon} ${result.service}: ${result.message}`);

      if (result.details) {
        console.log(`   Details:`, result.details);
      }
    });

    const successCount = this.results.filter(
      (r) => r.status === "success"
    ).length;
    const totalCount = this.results.length;

    console.log("=".repeat(50));
    console.log(
      `📈 Summary: ${successCount}/${totalCount} services working correctly`
    );

    if (successCount === totalCount) {
      console.log("🎉 All Firebase services are working perfectly!");
    } else {
      console.log("🔧 Please fix the issues above before proceeding.");
    }
  }

  // Helper method to test specific functionality
  async testUserCreation(): Promise<boolean> {
    try {
      console.log("👤 Testing user creation...");

      // This would test the actual user creation flow
      // You can call this after setting up your auth system
      return true;
    } catch (error) {
      console.error("User creation test failed:", error);
      return false;
    }
  }

  // Helper method to test Firestore security rules
  async testSecurityRules(): Promise<void> {
    try {
      console.log("🔒 Testing security rules...");

      // Test that unauthenticated users can't access protected data
      // This would require more complex testing with different auth states
      console.log("Security rules test would go here...");
    } catch (error) {
      console.error("Security rules test failed:", error);
    }
  }
}

// Export a singleton instance
export const firebaseValidator = new FirebaseValidator();

// Helper function to run validation
export const validateFirebase = async (): Promise<ValidationResult[]> => {
  return await firebaseValidator.validateAll();
};

// React hook for validation

export const useFirebaseValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [results, setResults] = useState<ValidationResult[]>([]);

  const runValidation = async () => {
    setIsValidating(true);
    try {
      const validationResults = await validateFirebase();
      setResults(validationResults);
    } catch (error) {
      console.error("Validation failed:", error);
    } finally {
      setIsValidating(false);
    }
  };

  return {
    isValidating,
    results,
    runValidation,
    isAllValid:
      results.length > 0 && results.every((r) => r.status === "success"),
  };
};
