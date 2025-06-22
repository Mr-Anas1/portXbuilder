"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function SubscribeButton({ billingPeriod = "yearly" }) {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubscribe = async () => {
    if (!user) {
      toast.error("Please sign in to subscribe");
      return;
    }

    try {
      setLoading(true);
      console.log("Starting subscription process...");

      // Create subscription with the correct data format
      const requestBody = {
        name: user.fullName || user.firstName + " " + user.lastName || "User",
        email: user.primaryEmailAddress?.emailAddress || "",
        contact: user.phoneNumbers?.[0]?.phoneNumber || "",
        billingPeriod: billingPeriod,
      };

      console.log("Sending request with body:", requestBody);

      const response = await fetch("/api/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response text:", errorText);

        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { error: errorText || "Unknown error" };
        }

        toast.error(errorData.error || "Failed to create subscription");
        return;
      }

      const responseText = await response.text();
      console.log("Success response text:", responseText);

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse response JSON:", e);
        toast.error("Invalid response from server");
        return;
      }

      const { subscriptionId } = responseData;
      console.log("Subscription ID received:", subscriptionId);

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: subscriptionId,
        name: "PortXBuilder",
        description: `Pro Plan - ${
          billingPeriod === "monthly" ? "Monthly" : "Yearly"
        }`,
        handler: async function (response) {
          try {
            // Verify payment
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
              const result = await verifyResponse.json();
              toast.error(result.error || "Payment verification failed");
              return;
            }

            const result = await verifyResponse.json();
            toast.success("Payment successful! Welcome to Pro!");
            window.location.reload();
          } catch (error) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: user.fullName || "",
          email: user.primaryEmailAddress?.emailAddress || "",
        },
        theme: {
          color: "#6366f1",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Subscription error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className="w-full bg-primary-500 text-white py-2 px-4 rounded-md hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
