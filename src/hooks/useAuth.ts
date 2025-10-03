import { useState, useEffect } from "react";
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          try {
            // Get user data from Firestore
            const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setUser({
                id: firebaseUser.uid,
                name: userData.name || firebaseUser.displayName || "",
                email: firebaseUser.email || "",
                phone: userData.phone || "",
                avatar: userData.avatar || firebaseUser.photoURL || "",
                createdAt: userData.createdAt?.toDate(),
                updatedAt: userData.updatedAt?.toDate(),
              });
            } else {
              // Create user document if it doesn't exist
              const newUser: User = {
                id: firebaseUser.uid,
                name: firebaseUser.displayName || "",
                email: firebaseUser.email || "",
                avatar: firebaseUser.photoURL || "",
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              await setDoc(doc(db, "users", firebaseUser.uid), {
                ...newUser,
                createdAt: new Date(),
                updatedAt: new Date(),
              });
              setUser(newUser);
            }
          } catch (err) {
            console.error("Error fetching user data:", err);
            setError("Failed to fetch user data");
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const { user: firebaseUser } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update Firebase Auth profile
      await updateFirebaseProfile(firebaseUser, { displayName: name });

      // Create user document in Firestore
      const newUser: User = {
        id: firebaseUser.uid,
        name,
        email,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, "users", firebaseUser.uid), {
        ...newUser,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) throw new Error("No user logged in");

    try {
      setError(null);
      setLoading(true);

      // Update Firestore document
      await setDoc(
        doc(db, "users", user.id),
        {
          ...data,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      // Update local state
      setUser((prev) =>
        prev ? { ...prev, ...data, updatedAt: new Date() } : null
      );
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    updateProfile,
    resetPassword,
  };
}
