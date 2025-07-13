"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function SubscribeButton({
  billingPeriod = "yearly",
  id,
  style,
}) {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!user) {
      toast.error("Please sign in to subscribe");
      return;
    }

    setLoading(true);
    try {
      const monthlyPlanId =
        process.env.NEXT_PUBLIC_DODO_PAYMENTS_MONTHLY_PLAN_ID;
      const yearlyPlanId = process.env.NEXT_PUBLIC_DODO_PAYMENTS_YEARLY_PLAN_ID;

      const product_id =
        billingPeriod === "monthly" ? monthlyPlanId : yearlyPlanId;

      if (!product_id) {
        throw new Error(
          `Plan ID not found for ${billingPeriod} billing period`
        );
      }

      // Pass clerk_id as a query param
      const url = `/api/subscription?productId=${product_id}&clerk_id=${user.id}`;

      const response = await fetch(url, { method: "GET" });
      const data = await response.json();

      if (!response.ok || !data.payment_link) {
        throw new Error(data.error || "Failed to create subscription");
      }

      window.location.href = data.payment_link;
    } catch (error) {
      // Provide more user-friendly error messages
      let errorMessage = "Subscription error: ";
      if (error.message?.includes("Payment service is not configured")) {
        errorMessage =
          "Payment service is temporarily unavailable. Please try again later or contact support.";
      } else if (error.message?.includes("Invalid response")) {
        errorMessage = "Payment service error. Please try again.";
      } else {
        errorMessage += error.message || "Unknown error occurred";
      }

      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <button
      id={id}
      style={style}
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
    </button>
  );
}
