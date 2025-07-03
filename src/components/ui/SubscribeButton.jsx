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

    try {
      setLoading(true);

      // Prepare billing and customer info (replace with real data as needed)
      const billing = {
        city: "YourCity",
        country: "IN",
        state: "YourState",
        street: "YourStreet",
        zipcode: 123456,
      };
      const customer = {
        email: user.primaryEmailAddress?.emailAddress || "",
        name: user.fullName || user.firstName + " " + user.lastName || "User",
        phone_number: user.phoneNumbers?.[0]?.phoneNumber || "",
      };
      const product_id =
        billingPeriod === "monthly"
          ? "pdt_JEwkqh6Ji8GK9iHUjCpzs"
          : "pdt_5JbylGSK2FKHuXwOOJ3eX";

      console.log("Sending to backend:", { billing, customer, product_id });
      const response = await fetch("/api/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billing,
          customer,
          product_id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create subscription");
      }

      // Redirect to Dodo Payments payment link
      window.location.href = data.paymentLink;
    } catch (error) {
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
    </button>
  );
}
