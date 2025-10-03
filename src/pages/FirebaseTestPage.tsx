import React from "react";
import { FirebaseSetupTest } from "../components/FirebaseSetupTest";

export function FirebaseTestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Firebase Setup Test
          </h1>
          <p className="text-gray-600">
            Test your Firebase configuration and ensure all services are working
            correctly
          </p>
        </div>

        <FirebaseSetupTest />
      </div>
    </div>
  );
}
