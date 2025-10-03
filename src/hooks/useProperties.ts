import { useCallback } from "react";
import {
  useGetDocuments,
  useAddDocument,
  useUpdateDocument,
  useDeleteDocument,
  useRealtimeDocuments,
} from "./useFirestore";
import { Property, COLLECTIONS, createPropertyQuery } from "../lib/collections";
import { where, orderBy, limit } from "firebase/firestore";

// Hook for managing properties
export function useProperties() {
  const {
    data: properties,
    loading,
    error,
    refetch,
  } = useGetDocuments<Property>(COLLECTIONS.PROPERTIES, [
    where("isActive", "==", true),
    orderBy("createdAt", "desc"),
  ]);

  return { properties, loading, error, refetch };
}

// Hook for property search with filters
export function usePropertySearch(filters: {
  propertyType?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  bedrooms?: number;
  bathrooms?: number;
  limitCount?: number;
}) {
  const constraints = createPropertyQuery(filters);
  if (filters.limitCount) {
    constraints.push(limit(filters.limitCount));
  }

  const {
    data: properties,
    loading,
    error,
    refetch,
  } = useRealtimeDocuments<Property>(COLLECTIONS.PROPERTIES, constraints);

  return { properties, loading, error, refetch };
}

// Hook for adding a new property
export function useAddProperty() {
  const { addDocument, loading, error } = useAddDocument<Property>(
    COLLECTIONS.PROPERTIES
  );

  const addProperty = useCallback(
    async (propertyData: Omit<Property, "id" | "createdAt" | "updatedAt">) => {
      return await addDocument({
        ...propertyData,
        isActive: true,
        publishedAt: new Date(),
      });
    },
    [addDocument]
  );

  return { addProperty, loading, error };
}

// Hook for updating a property
export function useUpdateProperty() {
  const { updateDocument, loading, error } = useUpdateDocument<Property>(
    COLLECTIONS.PROPERTIES
  );

  const updateProperty = useCallback(
    async (propertyId: string, updates: Partial<Property>) => {
      return await updateDocument(propertyId, updates);
    },
    [updateDocument]
  );

  return { updateProperty, loading, error };
}

// Hook for deleting a property
export function useDeleteProperty() {
  const { deleteDocument, loading, error } = useDeleteDocument(
    COLLECTIONS.PROPERTIES
  );

  const deleteProperty = useCallback(
    async (propertyId: string) => {
      return await deleteDocument(propertyId);
    },
    [deleteDocument]
  );

  return { deleteProperty, loading, error };
}

// Hook for getting properties by owner
export function usePropertiesByOwner(ownerId: string) {
  const {
    data: properties,
    loading,
    error,
    refetch,
  } = useRealtimeDocuments<Property>(COLLECTIONS.PROPERTIES, [
    where("ownerId", "==", ownerId),
    orderBy("createdAt", "desc"),
  ]);

  return { properties, loading, error, refetch };
}

// Hook for getting featured properties
export function useFeaturedProperties(limitCount: number = 6) {
  const {
    data: properties,
    loading,
    error,
    refetch,
  } = useRealtimeDocuments<Property>(COLLECTIONS.PROPERTIES, [
    where("isActive", "==", true),
    where("status", "==", "available"),
    orderBy("createdAt", "desc"),
    limit(limitCount),
  ]);

  return { properties, loading, error, refetch };
}
