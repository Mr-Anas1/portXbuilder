"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function SubscribeButton() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        setError("Please sign in to subscribe");
        return;
      }

      console.log("Creating subscription for user:", user.id);

      // First, ensure user exists in Supabase
      const { data: supabaseUser, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("clerk_id", user.id)
        .single();

      if (userError) {
        console.error("Error finding user in Supabase:", userError);
        setError("Error finding user account");
        return;
      }

      // Create subscription
      const response = await fetch("/api/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.fullName || user.username || "User",
          email: user.emailAddresses[0].emailAddress,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create subscription");
      }

      const { subscriptionId, customerId } = await response.json();
      console.log("Subscription created:", subscriptionId);

      // Store subscription info in Supabase
      const { error: updateError } = await supabase
        .from("users")
        .update({
          subscription_id: subscriptionId,
          subscription_status: "pending",
        })
        .eq("clerk_id", user.id);

      if (updateError) {
        console.error(
          "Error updating user with subscription info:",
          updateError
        );
        setError("Error updating subscription information");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: subscriptionId,
        name: "PortX Builder",
        description: "Pro Plan Subscription",
        handler: async function (response) {
          try {
            console.log("Payment successful:", response);
            const verifyResponse = await fetch("/api/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const result = await verifyResponse.json();

            if (!verifyResponse.ok) {
              console.error("Payment verification failed:", result);
              throw new Error(result.error || "Payment verification failed");
            }

            console.log("Payment verified:", result);
            toast.success(
              <div className="flex flex-col gap-1">
                <p className="font-semibold">Subscription Successful!</p>
                <p className="text-sm text-gray-600">
                  Welcome to the Pro plan. Enjoy all premium features!
                </p>
              </div>,
              {
                duration: 5000,
                style: {
                  background: "#fff",
                  color: "#333",
                  boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  borderRadius: "0.5rem",
                  padding: "1rem",
                },
              }
            );
            router.refresh();
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error(
              <div className="flex flex-col gap-1">
                <p className="font-semibold">Payment Verification Failed</p>
                <p className="text-sm text-gray-600">
                  {error.message}. Please contact support.
                </p>
              </div>,
              {
                duration: 5000,
                style: {
                  background: "#fff",
                  color: "#333",
                  boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  borderRadius: "0.5rem",
                  padding: "1rem",
                },
              }
            );
          }
        },
        prefill: {
          name: user.fullName || user.username || "User",
          email: user.emailAddresses[0].emailAddress,
          contact: user.phoneNumbers[0]?.phoneNumber || "",
        },
        theme: {
          color: "#6366f1",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Subscription error:", error);
      setError(error.message || "Failed to create subscription");
      toast.error(
        <div className="flex flex-col gap-1">
          <p className="font-semibold">Subscription Error</p>
          <p className="text-sm text-gray-600">
            {error.message || "Failed to create subscription"}
          </p>
        </div>,
        {
          duration: 5000,
          style: {
            background: "#fff",
            color: "#333",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            borderRadius: "0.5rem",
            padding: "1rem",
          },
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Processing...
        </>
      ) : (
        "Subscribe Now"
      )}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </button>
  );
}
