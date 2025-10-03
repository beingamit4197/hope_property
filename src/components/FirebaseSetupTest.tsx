import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react";
import { validateFirebase, ValidationResult } from "../utils/firebaseValidator";

export function FirebaseSetupTest() {
  const [isValidating, setIsValidating] = useState(false);
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [lastValidated, setLastValidated] = useState<Date | null>(null);

  const runValidation = async () => {
    setIsValidating(true);
    try {
      const validationResults = await validateFirebase();
      setResults(validationResults);
      setLastValidated(new Date());
    } catch (error) {
      console.error("Validation failed:", error);
    } finally {
      setIsValidating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case "error":
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      default:
        return null;
    }
  };

  const isAllValid =
    results.length > 0 && results.every((r) => r.status === "success");
  const hasErrors = results.some((r) => r.status === "error");

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔥 Firebase Setup Test
          </CardTitle>
          <CardDescription>
            Test your Firebase configuration and services to ensure everything
            is working correctly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={runValidation}
              disabled={isValidating}
              className="flex items-center gap-2"
            >
              {isValidating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Run Validation"
              )}
              {isValidating ? "Testing..." : "Test Firebase"}
            </Button>

            {lastValidated && (
              <p className="text-sm text-muted-foreground">
                Last tested: {lastValidated.toLocaleTimeString()}
              </p>
            )}
          </div>

          {results.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Test Results</h3>
                {isAllValid ? (
                  <Badge className="bg-green-100 text-green-800">
                    All Systems Working
                  </Badge>
                ) : hasErrors ? (
                  <Badge className="bg-red-100 text-red-800">
                    Issues Found
                  </Badge>
                ) : (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    Warnings
                  </Badge>
                )}
              </div>

              <div className="grid gap-4">
                {results.map((result, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getStatusIcon(result.status)}
                          <div>
                            <h4 className="font-medium">{result.service}</h4>
                            <p className="text-sm text-muted-foreground">
                              {result.message}
                            </p>
                            {result.details && (
                              <details className="mt-2">
                                <summary className="text-sm cursor-pointer text-blue-600 hover:text-blue-800">
                                  View Details
                                </summary>
                                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                                  {JSON.stringify(result.details, null, 2)}
                                </pre>
                              </details>
                            )}
                          </div>
                        </div>
                        {getStatusBadge(result.status)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {hasErrors && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Action Required:</strong> Please fix the errors above
                before using the application. Check the Firebase Console and
                ensure your configuration is correct.
              </AlertDescription>
            </Alert>
          )}

          {isAllValid && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Great!</strong> All Firebase services are working
                correctly. You can now use the authentication system and other
                Firebase features.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
          <CardDescription>
            Follow these steps to set up your Firebase project
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div>
                <h4 className="font-medium">Create Firebase Project</h4>
                <p className="text-sm text-muted-foreground">
                  Go to{" "}
                  <a
                    href="https://console.firebase.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Firebase Console
                  </a>{" "}
                  and create a new project
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div>
                <h4 className="font-medium">Enable Services</h4>
                <p className="text-sm text-muted-foreground">
                  Enable Authentication (Email/Password), Firestore Database,
                  and Storage
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div>
                <h4 className="font-medium">Get Configuration</h4>
                <p className="text-sm text-muted-foreground">
                  Add a web app to your project and copy the configuration
                  object
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                4
              </div>
              <div>
                <h4 className="font-medium">Update Environment</h4>
                <p className="text-sm text-muted-foreground">
                  Create a{" "}
                  <code className="bg-gray-100 px-1 rounded">.env.local</code>{" "}
                  file with your Firebase configuration
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                5
              </div>
              <div>
                <h4 className="font-medium">Test Configuration</h4>
                <p className="text-sm text-muted-foreground">
                  Run the validation test above to ensure everything is working
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
