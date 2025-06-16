"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

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
          razorpay_customer_id: customerId,
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

            if (!verifyResponse.ok) {
              const error = await verifyResponse.json();
              throw new Error(error.error || "Payment verification failed");
            }

            const result = await verifyResponse.json();
            console.log("Payment verified:", result);
            alert("Subscription successful! Welcome to the Pro plan!");
            router.refresh();
          } catch (error) {
            console.error("Payment verification error:", error);
            alert(
              "Payment successful but verification failed. Please contact support."
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Processing..." : "Subscribe Now"}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </button>
  );
}
