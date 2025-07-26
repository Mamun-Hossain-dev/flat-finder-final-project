// hooks/useAuth.tsx
"use client";
import { createContext, useContext, useEffect } from "react";
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { User } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  setUser,
  setLoading,
  setError,
  logout as logoutAction,
  fetchUserProfile,
} from "@/store/userSlice";
import React from "react";

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: (email: string, password: string, userData: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    currentUser: userProfile,
    loading,
    error,
  } = useSelector((state: RootState) => state.user);

  const [currentUser, setCurrentUser] = React.useState<FirebaseUser | null>(
    null
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const register = async (email: string, password: string, userData: any) => {
    try {
      dispatch(setLoading(true));

      // Create user profile in MongoDB and Firebase via backend
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          ...userData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }

      const newUser = await response.json();
      dispatch(setUser(newUser));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const login = async (email: string, password: string) => {
    try {
      dispatch(setLoading(true));

      const { user } = await signInWithEmailAndPassword(auth, email, password);

      if (!user.emailVerified) {
        throw new Error("Please verify your email before logging in");
      }

      // Get Firebase ID token
      const idToken = await user.getIdToken();

      // Send ID token to backend to set auth cookie
      const authResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!authResponse.ok) {
        const errorData = await authResponse.json();
        throw new Error(errorData.error || "Failed to set authentication cookie");
      }

      // Fetch user profile from MongoDB
      await dispatch(fetchUserProfile(user.uid)).unwrap();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      let errorMessage = error.message;
      if (error.code === 'auth/invalid-credential') {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = "No user found with this email.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed login attempts. Please try again later.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email format.";
      }
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // Call the backend logout API to clear the cookie
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      dispatch(logoutAction());
    } catch (error: any) {
      dispatch(setError(error.message));
      throw error;
    }
  };

  const refreshProfile = async () => {
    if (currentUser) {
      await dispatch(fetchUserProfile(currentUser.uid));
    }
  };

  // Update MongoDB user verification status when Firebase email is verified
  const updateEmailVerificationStatus = async (user: FirebaseUser) => {
    if (user.emailVerified && userProfile && !userProfile.isVerified) {
      try {
        await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firebaseUid: user.uid }),
        });
        // Refresh user profile
        await dispatch(fetchUserProfile(user.uid));
      } catch (error) {
        console.error("Error updating verification status:", error);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          await dispatch(fetchUserProfile(user.uid)).unwrap();
          if (user.emailVerified) {
            await updateEmailVerificationStatus(user);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          dispatch(setError("Failed to load user profile"));
        }
      } else {
        dispatch(setUser(null));
      }

      dispatch(setLoading(false));
    });

    return unsubscribe;
  }, [dispatch]);

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    login,
    register,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
