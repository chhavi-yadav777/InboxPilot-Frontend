import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, HealthStatus } from "../types";
import {
  loadCurrentUser,
  startGoogleSignIn,
  signOut,
  checkBackendHealth,
} from "../services/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  backendHealth: HealthStatus;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [backendHealth, setBackendHealth] = useState<HealthStatus>({ status: "checking" });

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      localStorage.removeItem("inboxpilot_demo_mode");
    } catch {}

    try {
      const health = await checkBackendHealth();
      setBackendHealth(health);

      // Verify session with backend: GET http://127.0.0.1:8000/users/me with credentials: "include"
      const profile = await loadCurrentUser();
      if (profile) {
        setUser(profile);
      } else {
        // No session cookie or 401: user is not logged in!
        setUser(null);
      }
    } catch (err) {
      console.error("Auth initialization error:", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const loginWithGoogle = async () => {
    await startGoogleSignIn();
  };

  const logout = async () => {
    await signOut();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const profile = await loadCurrentUser();
      setUser(profile);
    } catch (e) {
      console.warn("Could not refresh user profile", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token: null,
        isAuthenticated: !!user,
        isLoading,
        backendHealth,
        loginWithGoogle,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
