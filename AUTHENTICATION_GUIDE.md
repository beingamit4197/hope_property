# Authentication System Guide

This guide explains the comprehensive authentication system implemented in the Hope Property application.

## Features

### 🔐 Core Authentication

- **Email/Password Authentication** - Secure login and registration
- **User Roles** - Support for user, agent, and admin roles
- **User Verification** - Admin-controlled user verification system
- **Password Reset** - Email-based password recovery
- **Profile Management** - Complete user profile management

### 👤 User Management

- **Comprehensive User Data** - Name, email, phone, avatar, role, verification status
- **Property Preferences** - Customizable property type, price range, and location preferences
- **Admin Controls** - User verification and role management
- **User Statistics** - Dashboard with user analytics

### 🛡️ Security Features

- **Environment Variables** - Secure Firebase configuration
- **Input Validation** - Comprehensive form validation
- **Error Handling** - Detailed error messages and handling
- **Firestore Security** - Proper security rules for data access

## Setup Instructions

### 1. Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication, Firestore Database, and Storage
3. Copy your Firebase configuration
4. Create a `.env.local` file in the project root:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=your-app-id
```

### 2. Firestore Security Rules

Set up these security rules in your Firebase Console:

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
  }
}
```

## Usage Examples

### Basic Authentication

```typescript
import { useAuth } from "./contexts/AuthContext";

function LoginComponent() {
  const { login, signup, user, loading, error } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      console.log("User logged in successfully");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleSignup = async (
    name: string,
    email: string,
    password: string,
    phone?: string
  ) => {
    try {
      await signup(name, email, password, phone, "user");
      console.log("User registered successfully");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div>
      {user ? (
        <p>Welcome, {user.name}!</p>
      ) : (
        <div>{/* Login/Signup form */}</div>
      )}
    </div>
  );
}
```

### User Profile Management

```typescript
import { UserProfileForm } from "./components/UserProfileForm";

function ProfilePage() {
  const { user } = useAuth();

  if (!user) return <div>Please log in</div>;

  return (
    <div>
      <h1>My Profile</h1>
      <UserProfileForm
        user={user}
        isEditable={true}
        onUpdate={(updatedUser) => {
          console.log("Profile updated:", updatedUser);
        }}
      />
    </div>
  );
}
```

### Admin User Management

```typescript
import { useUserManagement, useUserStats } from "./hooks/useUserManagement";

function AdminDashboard() {
  const { users, loading, error, refetch } = useUserManagement({
    role: "user",
    isVerified: false,
    limit: 20,
  });

  const { stats, loading: statsLoading } = useUserStats();

  return (
    <div>
      <h1>User Management</h1>
      <div className="stats">
        <p>Total Users: {stats.totalUsers}</p>
        <p>Verified Users: {stats.verifiedUsers}</p>
        <p>Agents: {stats.agents}</p>
        <p>Admins: {stats.admins}</p>
      </div>

      <div className="user-list">
        {users.map((user) => (
          <div key={user.id}>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <p>Role: {user.role}</p>
            <p>Verified: {user.isVerified ? "Yes" : "No"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Updating User Preferences

```typescript
import { useAuth } from "./contexts/AuthContext";

function PreferencesComponent() {
  const { updateUserPreferences } = useAuth();

  const handleUpdatePreferences = async () => {
    try {
      await updateUserPreferences({
        propertyTypes: ["apartment", "house"],
        priceRange: { min: 100000, max: 500000 },
        locations: ["Mumbai", "Delhi"],
      });
      console.log("Preferences updated successfully");
    } catch (error) {
      console.error("Failed to update preferences:", error);
    }
  };

  return <button onClick={handleUpdatePreferences}>Update Preferences</button>;
}
```

## User Data Structure

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: "user" | "agent" | "admin";
  isVerified: boolean;
  preferences: {
    propertyTypes: string[];
    priceRange: {
      min: number;
      max: number;
    };
    locations: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}
```

## Available Hooks

### `useAuth()`

Main authentication hook providing:

- `user` - Current user data
- `isAuthenticated` - Boolean authentication status
- `login(email, password)` - Sign in user
- `signup(name, email, password, phone?, role?)` - Register new user
- `logout()` - Sign out user
- `updateProfile(data)` - Update user profile
- `updateUserPreferences(preferences)` - Update user preferences
- `verifyUser(userId)` - Verify user (admin only)
- `updateUserRole(userId, role)` - Update user role (admin only)
- `resetPassword(email)` - Send password reset email
- `loading` - Loading state
- `error` - Error message

### `useUserManagement(filters)`

Admin hook for user management:

- `users` - List of users
- `loading` - Loading state
- `error` - Error message
- `hasMore` - Pagination support
- `refetch()` - Refresh user list
- `loadMore()` - Load more users

### `useUserStats()`

Admin hook for user statistics:

- `stats` - User statistics object
- `loading` - Loading state
- `error` - Error message
- `refetch()` - Refresh statistics

## Components

### `LoginModal`

Complete login/signup modal with:

- Email/password authentication
- Phone number support
- Role selection
- Form validation
- Error handling

### `UserProfileForm`

Comprehensive profile management form with:

- Basic information editing
- Property preferences
- Account information display
- Validation and error handling

## Security Considerations

1. **Environment Variables** - Never commit Firebase keys to version control
2. **Input Validation** - All user inputs are validated on both client and server
3. **Role-based Access** - Admin functions are protected by role checks
4. **Firestore Rules** - Proper security rules prevent unauthorized access
5. **Error Handling** - Sensitive information is not exposed in error messages

## Error Handling

The system provides comprehensive error handling:

- Form validation errors
- Network errors
- Authentication errors
- Permission errors
- User-friendly error messages

## Best Practices

1. Always check `loading` and `error` states before using data
2. Use the provided hooks instead of direct Firebase calls
3. Implement proper error boundaries in your components
4. Validate user inputs on both client and server
5. Use environment variables for sensitive configuration
6. Implement proper loading states for better UX

## Troubleshooting

### Common Issues

1. **Firebase not initialized** - Check your environment variables
2. **Permission denied** - Verify Firestore security rules
3. **User not found** - Check if user document exists in Firestore
4. **Validation errors** - Ensure all required fields are provided

### Debug Mode

Enable debug logging by setting:

```javascript
localStorage.setItem("debug", "firebase:*");
```

This will provide detailed Firebase logs in the browser console.
