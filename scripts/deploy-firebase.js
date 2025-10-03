#!/usr/bin/env node

const { execSync } = require("child_process");

console.log("🚀 Deploying Hope Property to Firebase");
console.log("=====================================\n");

try {
  console.log("1. Building the application...");
  execSync("npm run build", { stdio: "inherit" });
  console.log("✅ Build completed\n");

  console.log("2. Deploying Firestore rules...");
  execSync("firebase deploy --only firestore:rules", { stdio: "inherit" });
  console.log("✅ Firestore rules deployed\n");

  console.log("3. Deploying Storage rules...");
  execSync("firebase deploy --only storage", { stdio: "inherit" });
  console.log("✅ Storage rules deployed\n");

  console.log("4. Deploying to Firebase Hosting...");
  execSync("firebase deploy --only hosting", { stdio: "inherit" });
  console.log("✅ Hosting deployed\n");

  console.log("🎉 Deployment completed successfully!");
  console.log("\n📋 Next steps:");
  console.log("1. Visit your deployed app URL");
  console.log("2. Go to /firebase-test to validate everything");
  console.log("3. Test user registration and login");
  console.log("4. Check Firestore for user data\n");
} catch (error) {
  console.error("❌ Deployment failed:", error.message);
  console.log("\n🔧 Troubleshooting:");
  console.log("1. Make sure you're logged in: firebase login");
  console.log("2. Check if all services are enabled in Firebase Console");
  console.log("3. Verify your project is selected: firebase use hope-property");
  console.log("4. Try running individual commands manually\n");

  process.exit(1);
}
