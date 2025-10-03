import { createContext, useContext, ReactNode } from "react";
import { useAuth as useFirebaseAuth, User } from "../hooks/useAuth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
    phone?: string,
    role?: "user" | "agent" | "admin"
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updateUserPreferences: (
    preferences: Partial<User["preferences"]>
  ) => Promise<void>;
  verifyUser: (userId: string) => Promise<void>;
  updateUserRole: (
    userId: string,
    role: "user" | "agent" | "admin"
  ) => Promise<void>;
  loading: boolean;
  error: string | null;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const firebaseAuth = useFirebaseAuth();

  return (
    <AuthContext.Provider
      value={{
        user: firebaseAuth.user,
        isAuthenticated: firebaseAuth.isAuthenticated,
        login: firebaseAuth.login,
        signup: firebaseAuth.signup,
        logout: firebaseAuth.logout,
        updateProfile: firebaseAuth.updateProfile,
        updateUserPreferences: firebaseAuth.updateUserPreferences,
        verifyUser: firebaseAuth.verifyUser,
        updateUserRole: firebaseAuth.updateUserRole,
        loading: firebaseAuth.loading,
        error: firebaseAuth.error,
        resetPassword: firebaseAuth.resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
