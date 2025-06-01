"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";

export function useProStatusClient() {
  const { has } = useAuth();
  const { user } = useAuthContext();

  // Check if user has pro plan using Clerk's has() method
  const hasProPlan = has?.({ plan: "pro" }) ?? false;

  // Sync with Supabase when subscription status changes
  useEffect(() => {
    const syncWithSupabase = async () => {
      if (!user?.id) return;

      try {
        // First get the user's Supabase ID from the users table
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("clerk_id", user.id)
          .single();

        if (userError) {
          console.error("Error fetching user:", userError);
          return;
        }

        // Update plan status if it has changed
        if (userData && userData.plan !== (hasProPlan ? "pro" : "free")) {
          console.log("Updating user plan in Supabase:", {
            from: userData.plan,
            to: hasProPlan ? "pro" : "free",
          });

          const { error: updateError } = await supabase
            .from("users")
            .update({
              plan: hasProPlan ? "pro" : "free",
              updated_at: new Date().toISOString(),
            })
            .eq("clerk_id", user.id);

          if (updateError) {
            console.error("Error updating user plan:", updateError);
          } else {
            console.log("Successfully updated user plan in Supabase");
          }
        }
      } catch (error) {
        console.error("Error syncing with Supabase:", error);
      }
    };

    syncWithSupabase();
  }, [user?.id, hasProPlan]);

  return hasProPlan;
}
