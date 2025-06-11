"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";

export function useProStatusClient() {
  const { user } = useAuthContext();
  const [hasProPlan, setHasProPlan] = useState(false);

  useEffect(() => {
    const checkProStatus = async () => {
      if (!user?.id) return;

      try {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("plan")
          .eq("clerk_id", user.id)
          .single();

        if (userError) {
          console.error("Error fetching user:", userError);
          return;
        }

        setHasProPlan(userData?.plan === "pro");
      } catch (error) {
        console.error("Error checking pro status:", error);
      }
    };

    checkProStatus();
  }, [user?.id]);

  return hasProPlan;
}
