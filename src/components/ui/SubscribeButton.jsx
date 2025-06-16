import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SubscribeButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const router = useRouter();

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
          userId: user.id,
          email: user.emailAddresses[0].emailAddress,
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
    <div>
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
      >
        {loading ? "Subscribing..." : "Subscribe Now"}
      </button>
      {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
    </div>
  );
}
