"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { syncUserData } from "@/lib/userSync";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user: clerkUser, isLoaded: isUserLoaded } = useUser();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const router = useRouter();

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Retry syncing when back online
      if (clerkUser) {
        syncUser(clerkUser);
      }
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check initial online status
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [clerkUser]);

  const syncUser = async (user) => {
    if (!isUserLoaded) return;

    try {
      if (user) {
        console.log("Syncing user data for:", user.id);
        const syncedUser = await syncUserData(user);

        if (!syncedUser) {
          console.error("Failed to sync user data");
          return;
        }

        console.log("User data synced successfully:", syncedUser);
        setUserData(syncedUser);

        // Redirect to dashboard after successful sign in
        if (
          window.location.pathname === "/sign-in" ||
          window.location.pathname === "/sign-up"
        ) {
          router.push("/dashboard");
        }
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error("Error in syncUser:", error);
      // Check if it's a network error
      if (
        error.message?.includes("Failed to fetch") ||
        error.message?.includes("Network error")
      ) {
        setIsOffline(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isUserLoaded) {
      if (clerkUser && !isOffline) {
        syncUser(clerkUser);
      } else {
        setLoading(false);
      }
    }
  }, [clerkUser, isUserLoaded, router, isOffline]);

  return (
    <AuthContext.Provider
      value={{
        user: clerkUser,
        userData,
        loading,
        isOffline,
        retrySync: () => clerkUser && syncUser(clerkUser),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
