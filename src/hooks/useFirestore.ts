import { useState, useCallback } from "react";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  QueryConstraint,
  DocumentData,
  QueryDocumentSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export interface FirestoreHookResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface FirestoreListHookResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}

// Hook for adding documents
export function useAddDocument<T = any>(collectionName: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addDocument = useCallback(
    async (data: Omit<T, "id"> & { id?: string }) => {
      try {
        setLoading(true);
        setError(null);

        const docRef = await addDoc(collection(db, collectionName), {
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        return docRef.id;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [collectionName]
  );

  return { addDocument, loading, error };
}

// Hook for updating documents
export function useUpdateDocument<T = any>(collectionName: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateDocument = useCallback(
    async (id: string, data: Partial<T>) => {
      try {
        setLoading(true);
        setError(null);

        await updateDoc(doc(db, collectionName, id), {
          ...data,
          updatedAt: new Date(),
        });
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [collectionName]
  );

  return { updateDocument, loading, error };
}

// Hook for deleting documents
export function useDeleteDocument(collectionName: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteDocument = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);

        await deleteDoc(doc(db, collectionName, id));
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [collectionName]
  );

  return { deleteDocument, loading, error };
}

// Hook for getting a single document
export function useGetDocument<T = any>(collectionName: string, id: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getDocument = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setData({ id: docSnap.id, ...docSnap.data() } as T);
      } else {
        setData(null);
      }
    } catch (err: any) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [collectionName, id]);

  // Auto-fetch on mount
  React.useEffect(() => {
    if (id) {
      getDocument();
    }
  }, [getDocument, id]);

  return { data, loading, error, refetch: getDocument };
}

// Hook for getting multiple documents with query constraints
export function useGetDocuments<T = any>(
  collectionName: string,
  constraints: QueryConstraint[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const q = query(collection(db, collectionName), ...constraints);
      const querySnapshot = await getDocs(q);

      const documents: T[] = [];
      querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        documents.push({ id: doc.id, ...doc.data() } as T);
      });

      setData(documents);
    } catch (err: any) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [collectionName, constraints]);

  // Auto-fetch on mount
  React.useEffect(() => {
    getDocuments();
  }, [getDocuments]);

  return { data, loading, error, refetch: getDocuments };
}

// Hook for real-time document updates
export function useRealtimeDocument<T = any>(
  collectionName: string,
  id: string
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (!id) return;

    setLoading(true);
    const docRef = doc(db, collectionName, id);

    const unsubscribe: Unsubscribe = onSnapshot(
      docRef,
      (doc) => {
        if (doc.exists()) {
          setData({ id: doc.id, ...doc.data() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, id]);

  return { data, loading, error };
}

// Hook for real-time collection updates
export function useRealtimeDocuments<T = any>(
  collectionName: string,
  constraints: QueryConstraint[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    setLoading(true);
    const q = query(collection(db, collectionName), ...constraints);

    const unsubscribe: Unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const documents: T[] = [];
        querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          documents.push({ id: doc.id, ...doc.data() } as T);
        });
        setData(documents);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, constraints]);

  return { data, loading, error };
}

// Import React for useEffect
import React from "react";
