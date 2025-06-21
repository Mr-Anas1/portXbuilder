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
    if (!user) return;

    try {
      const response = await fetch("/api/sync-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error("Failed to sync user data");
      }

      const syncedUser = await response.json();
      return syncedUser;
    } catch (error) {
      throw new Error("Failed to sync user data");
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
