import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  useProperties,
  usePropertySearch,
  useAddProperty,
  useUpdateProperty,
  useDeleteProperty,
} from "../hooks/useProperties";
import {
  useSavedProperties,
  useToggleSavedProperty,
} from "../hooks/useSavedProperties";
import { useImageUpload } from "../hooks/useFirestoreStorage";
import { Property } from "../lib/collections";

// Example component showing how to use all Firebase hooks
export function FirebaseUsageExample() {
  const {
    user,
    isAuthenticated,
    login,
    signup,
    logout,
    updateProfile,
    loading: authLoading,
    error: authError,
  } = useAuth();
  const { properties, loading: propertiesLoading } = useProperties();
  const { addProperty, loading: addLoading } = useAddProperty();
  const { updateProperty, loading: updateLoading } = useUpdateProperty();
  const { deleteProperty, loading: deleteLoading } = useDeleteProperty();
  const {
    uploadPropertyImages,
    uploadUserAvatar,
    loading: uploadLoading,
  } = useImageUpload();
  const { savedProperties, loading: savedLoading } = useSavedProperties(
    user?.id || ""
  );
  const { toggleSavedProperty, loading: toggleLoading } =
    useToggleSavedProperty();

  // Search filters
  const [searchFilters, setSearchFilters] = useState({
    propertyType: "",
    minPrice: 0,
    maxPrice: 1000000,
    city: "",
    bedrooms: 0,
  });

  const { properties: searchResults, loading: searchLoading } =
    usePropertySearch(searchFilters);

  // Form states
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [propertyForm, setPropertyForm] = useState<Partial<Property>>({
    title: "",
    description: "",
    price: 0,
    propertyType: "apartment",
    bedrooms: 1,
    bathrooms: 1,
    area: 0,
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
    images: [],
    features: [],
    amenities: [],
  });

  // Authentication handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginForm.email, loginForm.password);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(signupForm.name, signupForm.email, signupForm.password);
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Property handlers
  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const propertyData = {
        ...propertyForm,
        ownerId: user.id,
        status: "available" as const,
        currency: "USD",
        areaUnit: "sqft" as const,
        isActive: true,
      };

      const propertyId = await addProperty(propertyData as Property);
      console.log("Property added with ID:", propertyId);

      // Reset form
      setPropertyForm({
        title: "",
        description: "",
        price: 0,
        propertyType: "apartment",
        bedrooms: 1,
        bathrooms: 1,
        area: 0,
        address: {
          street: "",
          city: "",
          state: "",
          country: "",
          zipCode: "",
        },
        images: [],
        features: [],
        amenities: [],
      });
    } catch (error) {
      console.error("Failed to add property:", error);
    }
  };

  const handleUpdateProperty = async (
    propertyId: string,
    updates: Partial<Property>
  ) => {
    try {
      await updateProperty(propertyId, updates);
      console.log("Property updated successfully");
    } catch (error) {
      console.error("Failed to update property:", error);
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    try {
      await deleteProperty(propertyId);
      console.log("Property deleted successfully");
    } catch (error) {
      console.error("Failed to delete property:", error);
    }
  };

  // Image upload handlers
  const handleImageUpload = async (files: FileList, propertyId: string) => {
    try {
      const fileArray = Array.from(files);
      const imageUrls = await uploadPropertyImages(fileArray, propertyId);
      console.log("Images uploaded:", imageUrls);

      // Update property with new image URLs
      await handleUpdateProperty(propertyId, { images: imageUrls });
    } catch (error) {
      console.error("Failed to upload images:", error);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!user) return;

    try {
      const avatarUrl = await uploadUserAvatar(file, user.id);
      await updateProfile({ avatar: avatarUrl });
      console.log("Avatar uploaded:", avatarUrl);
    } catch (error) {
      console.error("Failed to upload avatar:", error);
    }
  };

  // Saved properties handlers
  const handleToggleSaved = async (
    propertyId: string,
    isCurrentlySaved: boolean,
    savedPropertyId?: string
  ) => {
    if (!user) return;

    try {
      await toggleSavedProperty(
        user.id,
        propertyId,
        isCurrentlySaved,
        savedPropertyId
      );
      console.log("Saved status toggled");
    } catch (error) {
      console.error("Failed to toggle saved status:", error);
    }
  };

  if (authLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Firebase Integration Example</h1>

      {/* Authentication Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Authentication</h2>

        {!isAuthenticated ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Login Form */}
            <div className="border p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3">Login</h3>
              <form onSubmit={handleLogin} className="space-y-3">
                <input
                  type="email"
                  placeholder="Email"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  Login
                </button>
              </form>
            </div>

            {/* Signup Form */}
            <div className="border p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3">Sign Up</h3>
              <form onSubmit={handleSignup} className="space-y-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={signupForm.name}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, name: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={signupForm.email}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, email: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={signupForm.password}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, password: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
                >
                  Sign Up
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="border p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Welcome, {user?.name}!</h3>
            <p>Email: {user?.email}</p>
            <button
              onClick={handleLogout}
              className="mt-3 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}

        {authError && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
            Error: {authError}
          </div>
        )}
      </div>

      {/* Properties Section */}
      {isAuthenticated && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Properties</h2>

          {/* Add Property Form */}
          <div className="border p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium mb-3">Add New Property</h3>
            <form onSubmit={handleAddProperty} className="space-y-3">
              <input
                type="text"
                placeholder="Property Title"
                value={propertyForm.title}
                onChange={(e) =>
                  setPropertyForm({ ...propertyForm, title: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
              <textarea
                placeholder="Description"
                value={propertyForm.description}
                onChange={(e) =>
                  setPropertyForm({
                    ...propertyForm,
                    description: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                rows={3}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Price"
                  value={propertyForm.price}
                  onChange={(e) =>
                    setPropertyForm({
                      ...propertyForm,
                      price: Number(e.target.value),
                    })
                  }
                  className="p-2 border rounded"
                />
                <select
                  value={propertyForm.propertyType}
                  onChange={(e) =>
                    setPropertyForm({
                      ...propertyForm,
                      propertyType: e.target.value as any,
                    })
                  }
                  className="p-2 border rounded"
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Land</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={addLoading}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {addLoading ? "Adding..." : "Add Property"}
              </button>
            </form>
          </div>

          {/* Properties List */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              All Properties ({properties?.length || 0})
            </h3>
            {propertiesLoading ? (
              <div>Loading properties...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {properties?.map((property) => (
                  <div key={property.id} className="border p-4 rounded-lg">
                    <h4 className="font-medium">{property.title}</h4>
                    <p className="text-gray-600">
                      ${property.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {property.propertyType}
                    </p>
                    <p className="text-sm text-gray-500">
                      {property.bedrooms} bed, {property.bathrooms} bath
                    </p>
                    <div className="mt-3 space-x-2">
                      <button
                        onClick={() =>
                          handleUpdateProperty(property.id, { status: "sold" })
                        }
                        disabled={updateLoading}
                        className="text-sm bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 disabled:opacity-50"
                      >
                        Mark Sold
                      </button>
                      <button
                        onClick={() => handleDeleteProperty(property.id)}
                        disabled={deleteLoading}
                        className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
