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

      // Find user in Supabase
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, razorpay_customer_id")
        .eq("clerk_id", user.id)
        .single();

      if (userError) {
        toast.error("Error finding user");
        return;
      }

      // Create subscription
      const response = await fetch("/api/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData.id,
          billingPeriod: billingPeriod,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "Failed to create subscription");
        return;
      }

      const { subscriptionId, orderId } = await response.json();

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: billingPeriod === "monthly" ? 199 : 1499, // Amount in paise
        currency: "INR",
        name: "PortXBuilder",
        description: `Pro Plan - ${
          billingPeriod === "monthly" ? "Monthly" : "Yearly"
        }`,
        order_id: orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
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
      toast.error("Subscription error");
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
