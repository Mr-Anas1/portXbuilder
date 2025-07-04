"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function SubscribeButton({ billingPeriod = "yearly" }) {
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
      const product_id =
        billingPeriod === "monthly"
          ? "pdt_JEwkqh6Ji8GK9iHUjCpzs"
          : "pdt_5JbylGSK2FKHuXwOOJ3eX";
      // Pass clerk_id as a query param
      const url = `/api/subscription?productId=${product_id}&clerk_id=${user.id}`;
      const response = await fetch(url, { method: "GET" });
      const data = await response.json();

      if (!response.ok || !data.payment_link) {
        throw new Error(data.error || "Failed to create subscription");
      }

      window.location.href = data.payment_link;
    } catch (error) {
      toast.error("Subscription error: " + (error.message || error));
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
    </button>
  );
}
