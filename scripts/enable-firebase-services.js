#!/usr/bin/env node

const { execSync } = require("child_process");

console.log("🔥 Enabling Firebase Services for Hope Property");
console.log("===============================================\n");

console.log(
  "Please follow these steps to enable the required Firebase services:\n"
);

console.log("1. 🌐 Open Firebase Console:");
console.log(
  "   https://console.firebase.google.com/project/hope-property/overview\n"
);

console.log("2. 🔐 Enable Authentication:");
console.log("   - Go to Authentication > Sign-in method");
console.log('   - Enable "Email/Password" provider');
console.log('   - Click "Save"\n');

console.log("3. 🗄️ Firestore Database (Already enabled):");
console.log("   ✅ Firestore is already set up with security rules\n");

console.log("4. 📁 Enable Storage:");
console.log("   - Go to Storage > Get started");
console.log('   - Choose "Start in test mode" (we\'ll update rules later)');
console.log("   - Select a location (choose closest to your users)");
console.log('   - Click "Done"\n');

console.log("5. 🔧 After enabling Storage, run:");
console.log("   firebase deploy --only storage\n");

console.log("6. 🚀 Deploy your app:");
console.log("   firebase deploy --only hosting\n");

console.log("7. 🧪 Test your setup:");
console.log("   - Visit the deployed URL");
console.log("   - Go to /firebase-test to validate everything\n");

console.log("📋 Quick Links:");
console.log(
  "- Firebase Console: https://console.firebase.google.com/project/hope-property/overview"
);
console.log(
  "- Authentication: https://console.firebase.google.com/project/hope-property/authentication"
);
console.log(
  "- Firestore: https://console.firebase.google.com/project/hope-property/firestore"
);
console.log(
  "- Storage: https://console.firebase.google.com/project/hope-property/storage"
);
console.log(
  "- Hosting: https://console.firebase.google.com/project/hope-property/hosting\n"
);

console.log("Once you've enabled Storage, come back and run:");
console.log("npm run deploy-firebase\n");
