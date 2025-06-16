import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

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
        throw new Error("Please sign in to subscribe");
      }

      console.log("Creating subscription for user:", user.id);
      const res = await fetch("/api/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.fullName || user.username,
          email: user.primaryEmailAddress?.emailAddress,
          contact: user.phoneNumbers?.[0]?.phoneNumber,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create subscription");
      }

      const { subscriptionId } = await res.json();
      console.log("Subscription created:", subscriptionId);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: subscriptionId,
        name: "PortXbuilder",
        description: "Monthly Subscription",
        // image: '/logo.png',
        handler: async function (response) {
          console.log("Payment successful:", response);
          try {
            // Verify the payment on the backend
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyRes.ok) {
              throw new Error("Payment verification failed");
            }

            alert(
              "Subscription successful! Your plan has been upgraded to Pro."
            );
            router.refresh(); // Refresh the page to show updated plan
          } catch (err) {
            console.error("Payment verification error:", err);
            alert(
              "Payment successful but verification failed. Please contact support."
            );
          }
        },
        prefill: {
          name: user.fullName || user.username,
          email: user.primaryEmailAddress?.emailAddress,
          contact: user.phoneNumbers?.[0]?.phoneNumber,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error("Subscription error:", err);
      setError(err.message);
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
