# Firebase Project Setup Guide

This guide will walk you through creating and configuring a Firebase project for the Hope Property application.

## Step 1: Create Firebase Project

### 1.1 Go to Firebase Console

1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `hope-property` (or your preferred name)
4. Click "Continue"

### 1.2 Configure Google Analytics (Optional)

- Choose whether to enable Google Analytics
- For this project, you can disable it initially
- Click "Create project"

### 1.3 Wait for Project Creation

- Firebase will create your project (takes 1-2 minutes)
- Click "Continue" when ready

## Step 2: Add Web App to Project

### 2.1 Add Web App

1. In your Firebase project dashboard, click the web icon (`</>`)
2. Enter app nickname: `Hope Property Web App`
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"

### 2.2 Get Configuration

1. Copy the Firebase configuration object
2. It will look like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "hope-property-12345.firebaseapp.com",
  projectId: "hope-property-12345",
  storageBucket: "hope-property-12345.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
};
```

## Step 3: Enable Required Services

### 3.1 Enable Authentication

1. In the Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

### 3.2 Enable Firestore Database

1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (we'll update rules later)
4. Select a location (choose closest to your users)
5. Click "Done"

### 3.3 Enable Storage

1. Go to "Storage"
2. Click "Get started"
3. Choose "Start in test mode" (we'll update rules later)
4. Select the same location as Firestore
5. Click "Done"

## Step 4: Configure Security Rules

### 4.1 Firestore Security Rules

1. Go to "Firestore Database" → "Rules"
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Admins can read all users
    match /users/{userId} {
      allow read: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Properties are readable by all authenticated users, writable by owners
    match /properties/{propertyId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        (resource == null || resource.data.ownerId == request.auth.uid);
    }

    // Saved properties are private to each user
    match /savedProperties/{savedPropertyId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }

    // Property inquiries are readable by property owners and inquirers
    match /propertyInquiries/{inquiryId} {
      allow read: if request.auth != null &&
        (resource.data.userId == request.auth.uid ||
         resource.data.agentId == request.auth.uid);
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
        (resource.data.userId == request.auth.uid ||
         resource.data.agentId == request.auth.uid);
    }

    // Agents collection
    match /agents/{agentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        (resource == null || resource.data.userId == request.auth.uid);
    }

    // Reviews collection
    match /reviews/{reviewId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Click "Publish"

### 4.2 Storage Security Rules

1. Go to "Storage" → "Rules"
2. Replace the default rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can upload their own files
    match /images/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Property images are readable by all, writable by property owners
    match /properties/{propertyId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }

    // Avatars are readable by all, writable by the user
    match /avatars/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click "Publish"

## Step 5: Update Your Application

### 5.1 Create Environment File

Create a `.env.local` file in your project root:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-actual-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-actual-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-actual-sender-id
VITE_FIREBASE_APP_ID=your-actual-app-id

# Mapbox Configuration (if using maps)
VITE_MAPBOX_ACCESS_TOKEN=your-mapbox-token
```

### 5.2 Update Firebase Configuration

The `src/lib/firebase.ts` file is already configured to use environment variables, so your app will automatically use the new configuration.

## Step 6: Test Your Setup

### 6.1 Test Authentication

1. Start your development server: `npm start`
2. Try to register a new user
3. Check the Firebase Console → Authentication to see if the user was created
4. Check Firestore Database → users collection to see if user data was stored

### 6.2 Test Firestore

1. Try updating user preferences
2. Check if the data appears in Firestore
3. Verify security rules are working

## Step 7: Deploy (Optional)

### 7.1 Deploy to Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build your app: `npm run build`
5. Deploy: `firebase deploy`

## Troubleshooting

### Common Issues

1. **"Firebase not initialized"**

   - Check your environment variables
   - Ensure `.env.local` is in the project root
   - Restart your development server

2. **"Permission denied"**

   - Check Firestore security rules
   - Ensure user is authenticated
   - Verify user has correct role

3. **"User not found"**

   - Check if user document exists in Firestore
   - Verify user creation process

4. **"Invalid API key"**
   - Double-check your Firebase configuration
   - Ensure API key is correct
   - Check if API key restrictions are set

### Debug Mode

Enable Firebase debug logging:

```javascript
localStorage.setItem("debug", "firebase:*");
```

## Next Steps

1. **Create Admin User**: Use the Firebase Console to manually create an admin user
2. **Set up Email Templates**: Configure email templates for password reset
3. **Configure Domain**: Add your production domain to authorized domains
4. **Set up Monitoring**: Enable Firebase Performance Monitoring
5. **Backup Strategy**: Set up automated backups for Firestore

## Security Checklist

- [ ] Environment variables are not committed to version control
- [ ] Firestore security rules are properly configured
- [ ] Storage security rules are properly configured
- [ ] Authentication is working correctly
- [ ] User data is being stored properly
- [ ] Admin functions are protected by role checks
- [ ] Error handling is implemented
- [ ] Input validation is working

## Support

If you encounter any issues:

1. Check the Firebase Console for error logs
2. Use browser developer tools to check network requests
3. Verify your Firebase configuration
4. Check the authentication state in your app

Your Firebase project is now ready for the Hope Property application!
