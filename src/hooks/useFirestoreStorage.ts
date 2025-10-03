import { useState, useCallback } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
  UploadResult,
  StorageReference,
} from "firebase/storage";
import { storage } from "../lib/firebase";

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  percentage: number;
}

export interface StorageHookResult {
  uploadFile: (file: File, path: string) => Promise<string>;
  uploadMultipleFiles: (files: File[], path: string) => Promise<string[]>;
  deleteFile: (path: string) => Promise<void>;
  getFileUrl: (path: string) => Promise<string>;
  listFiles: (path: string) => Promise<string[]>;
  loading: boolean;
  error: string | null;
  uploadProgress: UploadProgress | null;
}

export function useFirestoreStorage(): StorageHookResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(
    null
  );

  const uploadFile = useCallback(
    async (file: File, path: string): Promise<string> => {
      try {
        setLoading(true);
        setError(null);
        setUploadProgress(null);

        // Create a reference to the file
        const fileRef = ref(storage, path);

        // Upload the file
        const snapshot: UploadResult = await uploadBytes(fileRef, file);

        // Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        return downloadURL;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
        setUploadProgress(null);
      }
    },
    []
  );

  const uploadMultipleFiles = useCallback(
    async (files: File[], path: string): Promise<string[]> => {
      try {
        setLoading(true);
        setError(null);
        setUploadProgress(null);

        const uploadPromises = files.map(async (file, index) => {
          const filePath = `${path}/${file.name}`;
          return await uploadFile(file, filePath);
        });

        const downloadURLs = await Promise.all(uploadPromises);
        return downloadURLs;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [uploadFile]
  );

  const deleteFile = useCallback(async (path: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const fileRef = ref(storage, path);
      await deleteObject(fileRef);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFileUrl = useCallback(async (path: string): Promise<string> => {
    try {
      setLoading(true);
      setError(null);

      const fileRef = ref(storage, path);
      const downloadURL = await getDownloadURL(fileRef);

      return downloadURL;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const listFiles = useCallback(async (path: string): Promise<string[]> => {
    try {
      setLoading(true);
      setError(null);

      const listRef = ref(storage, path);
      const result = await listAll(listRef);

      const fileUrls: string[] = [];
      for (const itemRef of result.items) {
        const url = await getDownloadURL(itemRef);
        fileUrls.push(url);
      }

      return fileUrls;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    uploadFile,
    uploadMultipleFiles,
    deleteFile,
    getFileUrl,
    listFiles,
    loading,
    error,
    uploadProgress,
  };
}

// Hook for image uploads with specific handling
export function useImageUpload() {
  const { uploadFile, uploadMultipleFiles, deleteFile, loading, error } =
    useFirestoreStorage();

  const uploadImage = useCallback(
    async (file: File, userId?: string): Promise<string> => {
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const path = userId
        ? `images/${userId}/${fileName}`
        : `images/${fileName}`;

      return await uploadFile(file, path);
    },
    [uploadFile]
  );

  const uploadPropertyImages = useCallback(
    async (files: File[], propertyId: string): Promise<string[]> => {
      const timestamp = Date.now();
      const uploadPromises = files.map(async (file, index) => {
        const fileName = `${timestamp}_${index}_${file.name}`;
        const path = `properties/${propertyId}/images/${fileName}`;
        return await uploadFile(file, path);
      });

      return await Promise.all(uploadPromises);
    },
    [uploadFile]
  );

  const uploadUserAvatar = useCallback(
    async (file: File, userId: string): Promise<string> => {
      const timestamp = Date.now();
      const fileName = `avatar_${timestamp}_${file.name}`;
      const path = `avatars/${userId}/${fileName}`;

      return await uploadFile(file, path);
    },
    [uploadFile]
  );

  return {
    uploadImage,
    uploadPropertyImages,
    uploadUserAvatar,
    deleteFile,
    loading,
    error,
  };
}
