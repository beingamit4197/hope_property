import { useCallback } from "react";
import {
  useGetDocuments,
  useAddDocument,
  useDeleteDocument,
  useRealtimeDocuments,
} from "./useFirestore";
import {
  SavedProperty,
  Property,
  COLLECTIONS,
  createUserSavedPropertiesQuery,
} from "../lib/collections";
import { where, orderBy } from "firebase/firestore";

// Hook for managing saved properties
export function useSavedProperties(userId: string) {
  const {
    data: savedProperties,
    loading,
    error,
    refetch,
  } = useRealtimeDocuments<SavedProperty>(
    COLLECTIONS.SAVED_PROPERTIES,
    createUserSavedPropertiesQuery(userId)
  );

  return { savedProperties, loading, error, refetch };
}

// Hook for saving a property
export function useSaveProperty() {
  const { addDocument, loading, error } = useAddDocument<SavedProperty>(
    COLLECTIONS.SAVED_PROPERTIES
  );

  const saveProperty = useCallback(
    async (userId: string, propertyId: string, notes?: string) => {
      return await addDocument({
        userId,
        propertyId,
        savedAt: new Date(),
        notes,
      });
    },
    [addDocument]
  );

  return { saveProperty, loading, error };
}

// Hook for removing a saved property
export function useRemoveSavedProperty() {
  const { deleteDocument, loading, error } = useDeleteDocument(
    COLLECTIONS.SAVED_PROPERTIES
  );

  const removeSavedProperty = useCallback(
    async (savedPropertyId: string) => {
      return await deleteDocument(savedPropertyId);
    },
    [deleteDocument]
  );

  return { removeSavedProperty, loading, error };
}

// Hook for checking if a property is saved
export function useIsPropertySaved(userId: string, propertyId: string) {
  const {
    data: savedProperties,
    loading,
    error,
  } = useRealtimeDocuments<SavedProperty>(COLLECTIONS.SAVED_PROPERTIES, [
    where("userId", "==", userId),
    where("propertyId", "==", propertyId),
  ]);

  const isSaved = savedProperties && savedProperties.length > 0;
  const savedPropertyId = isSaved ? savedProperties[0].id : null;

  return { isSaved, savedPropertyId, loading, error };
}

// Hook for toggling saved status
export function useToggleSavedProperty() {
  const {
    saveProperty,
    loading: saveLoading,
    error: saveError,
  } = useSaveProperty();
  const {
    removeSavedProperty,
    loading: removeLoading,
    error: removeError,
  } = useRemoveSavedProperty();

  const toggleSavedProperty = useCallback(
    async (
      userId: string,
      propertyId: string,
      isCurrentlySaved: boolean,
      savedPropertyId?: string,
      notes?: string
    ) => {
      if (isCurrentlySaved && savedPropertyId) {
        return await removeSavedProperty(savedPropertyId);
      } else {
        return await saveProperty(userId, propertyId, notes);
      }
    },
    [saveProperty, removeSavedProperty]
  );

  return {
    toggleSavedProperty,
    loading: saveLoading || removeLoading,
    error: saveError || removeError,
  };
}
