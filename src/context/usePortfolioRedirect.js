"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuthContext } from "@/context/AuthContext";

export const usePortfolioRedirect = () => {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    const checkPortfolio = async () => {
      if (loading || !user) return;

      try {
        // First get the user's Supabase ID from the users table using the API route
        const response = await fetch("/api/sync-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error("Error syncing user:", error);
          return;
        }

        const userData = await response.json();

        if (!userData) {
          console.error("No user data found");
          return;
        }

        // Then check for portfolio using the Supabase user ID
        const { data, error } = await supabase
          .from("portfolios")
          .select("id")
          .eq("user_id", userData.id)
          .single();

        const hasPortfolio = !!data;

        const pathname = window.location.pathname;

        if (!hasPortfolio && pathname !== "/create") {
          router.replace("/create"); // force onboarding
        } else if (hasPortfolio && pathname === "/create") {
          router.replace("/dashboard"); // prevent re-creating
        }
      } catch (error) {
        console.error("Error in checkPortfolio:", error);
      }
    };

    checkPortfolio();
  }, [user, loading]);
};
