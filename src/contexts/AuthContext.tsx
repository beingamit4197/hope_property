import { createContext, useContext, ReactNode } from "react";
import { useAuth as useFirebaseAuth } from "../hooks/useAuth";

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
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
