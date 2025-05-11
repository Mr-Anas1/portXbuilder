"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";

export const usePortfolioRedirect = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkPortfolio = async () => {
      if (loading || !user) return;

      const { data, error } = await supabase
        .from("portfolios")
        .select("id")
        .eq("user_id", user.id)
        .single();

      const hasPortfolio = !!data;

      const pathname = window.location.pathname;

      if (!hasPortfolio && pathname !== "/create") {
        router.replace("/create"); // force onboarding
      } else if (hasPortfolio && pathname === "/create") {
        router.replace("/dashboard"); // prevent re-creating
      }
    };

    checkPortfolio();
  }, [user, loading]);
};
