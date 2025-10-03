# Firebase Integration Setup

This project now includes comprehensive Firebase integration with Firestore, Authentication, and Storage.

## Setup Instructions

### 1. Firebase Project Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication, Firestore Database, and Storage
4. Get your Firebase configuration from Project Settings > General > Your apps
5. Update `/src/lib/firebase.ts` with your actual Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-actual-app-id",
};
```

### 2. Firestore Security Rules

Set up your Firestore security rules in the Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
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
  }
}
```

### 3. Storage Security Rules

Set up your Storage security rules:

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

## Available Hooks

### Authentication Hooks

#### `useAuth()` - Main authentication hook

```typescript
import { useAuth } from "./contexts/AuthContext";

const {
  user,
  isAuthenticated,
  loading,
  error,
  login,
  signup,
  logout,
  updateProfile,
  resetPassword,
} = useAuth();
```

### Firestore Hooks

#### `useAddDocument(collectionName)` - Add documents

```typescript
import { useAddDocument } from "./hooks/useFirestore";

const { addDocument, loading, error } = useAddDocument("properties");
const propertyId = await addDocument({ title: "New Property", price: 100000 });
```

#### `useUpdateDocument(collectionName)` - Update documents

```typescript
import { useUpdateDocument } from "./hooks/useFirestore";

const { updateDocument, loading, error } = useUpdateDocument("properties");
await updateDocument("propertyId", { price: 150000 });
```

#### `useDeleteDocument(collectionName)` - Delete documents

```typescript
import { useDeleteDocument } from "./hooks/useFirestore";

const { deleteDocument, loading, error } = useDeleteDocument("properties");
await deleteDocument("propertyId");
```

#### `useGetDocument(collectionName, id)` - Get single document

```typescript
import { useGetDocument } from "./hooks/useFirestore";

const { data, loading, error, refetch } = useGetDocument(
  "properties",
  "propertyId"
);
```

#### `useGetDocuments(collectionName, constraints)` - Get multiple documents

```typescript
import { useGetDocuments } from "./hooks/useFirestore";
import { where, orderBy } from "firebase/firestore";

const { data, loading, error, refetch } = useGetDocuments("properties", [
  where("status", "==", "available"),
  orderBy("createdAt", "desc"),
]);
```

#### `useRealtimeDocument(collectionName, id)` - Real-time single document

```typescript
import { useRealtimeDocument } from "./hooks/useFirestore";

const { data, loading, error } = useRealtimeDocument(
  "properties",
  "propertyId"
);
```

#### `useRealtimeDocuments(collectionName, constraints)` - Real-time multiple documents

```typescript
import { useRealtimeDocuments } from "./hooks/useFirestore";

const { data, loading, error } = useRealtimeDocuments("properties", [
  where("isActive", "==", true),
]);
```

### Storage Hooks

#### `useFirestoreStorage()` - General file operations

```typescript
import { useFirestoreStorage } from "./hooks/useFirestoreStorage";

const {
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
  getFileUrl,
  listFiles,
  loading,
  error,
} = useFirestoreStorage();

const imageUrl = await uploadFile(file, "images/property1.jpg");
```

#### `useImageUpload()` - Specialized image operations

```typescript
import { useImageUpload } from "./hooks/useFirestoreStorage";

const {
  uploadImage,
  uploadPropertyImages,
  uploadUserAvatar,
  deleteFile,
  loading,
  error,
} = useImageUpload();

const avatarUrl = await uploadUserAvatar(file, userId);
const propertyImages = await uploadPropertyImages(files, propertyId);
```

### Property-Specific Hooks

#### `useProperties()` - Get all properties

```typescript
import { useProperties } from "./hooks/useProperties";

const { properties, loading, error, refetch } = useProperties();
```

#### `usePropertySearch(filters)` - Search properties with filters

```typescript
import { usePropertySearch } from "./hooks/useProperties";

const { properties, loading, error, refetch } = usePropertySearch({
  propertyType: "apartment",
  minPrice: 100000,
  maxPrice: 500000,
  city: "New York",
  bedrooms: 2,
});
```

#### `useAddProperty()` - Add new property

```typescript
import { useAddProperty } from "./hooks/useProperties";

const { addProperty, loading, error } = useAddProperty();
const propertyId = await addProperty({
  title: "Beautiful Apartment",
  price: 300000,
  propertyType: "apartment",
  // ... other property fields
});
```

#### `useSavedProperties(userId)` - Get user's saved properties

```typescript
import { useSavedProperties } from "./hooks/useSavedProperties";

const { savedProperties, loading, error, refetch } = useSavedProperties(userId);
```

#### `useToggleSavedProperty()` - Toggle save status

```typescript
import { useToggleSavedProperty } from "./hooks/useSavedProperties";

const { toggleSavedProperty, loading, error } = useToggleSavedProperty();
await toggleSavedProperty(
  userId,
  propertyId,
  isCurrentlySaved,
  savedPropertyId
);
```

## Data Models

### Property

```typescript
interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  propertyType: "apartment" | "house" | "villa" | "commercial" | "land";
  status: "available" | "sold" | "rented" | "pending";
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit: "sqft" | "sqm";
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    coordinates?: { lat: number; lng: number };
  };
  images: string[];
  features: string[];
  amenities: string[];
  ownerId: string;
  agentId?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  isActive: boolean;
}
```

### User

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
    priceRange: { min: number; max: number };
    locations: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}
```

## Example Usage

See `/src/examples/FirebaseUsageExample.tsx` for a complete example of how to use all the hooks together.

## Collections

The following Firestore collections are set up:

- `users` - User profiles and authentication data
- `properties` - Property listings
- `savedProperties` - User's saved properties
- `propertyInquiries` - Property inquiry messages
- `agents` - Real estate agent profiles
- `reviews` - Property and agent reviews

## Error Handling

All hooks include error handling and loading states. Always check the `error` and `loading` states before using the data:

```typescript
const { data, loading, error } = useGetDocuments("properties");

if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;
if (!data) return <div>No data found</div>;

return (
  <div>
    {data.map((item) => (
      <div key={item.id}>{item.title}</div>
    ))}
  </div>
);
```
