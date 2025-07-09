import React, { useState } from "react";
import { Button } from "./button";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useUser } from "@clerk/nextjs";

const PaymentStatus = ({ subscriptionInfo }) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const handleRetryPayment = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Prepare billing and customer info (replace with real data as needed)
      const billing = {
        city: "YourCity",
        country: "IN",
        state: "YourState",
        street: "YourStreet",
        zipcode: 123456,
      };
      const customer = {
        email: user.emailAddresses[0]?.emailAddress || "",
        name: user.fullName || user.username || "User",
        phone_number: user.phoneNumbers[0]?.phoneNumber || "",
      };
      // Select product_id based on plan type if available, otherwise default to monthly
      const planType = subscriptionInfo?.plan_type || "monthly";
      const product_id =
        planType === "yearly"
          ? "pdt_5JbylGSK2FKHuXwOOJ3eX"
          : "pdt_JEwkqh6Ji8GK9iHUjCpzs";

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
        throw new Error(data.error || "Failed to create payment link");
      }
      // Redirect to Dodo Payments payment link
      window.location.href = data.paymentLink;
    } catch (error) {
      toast.error(
        <div className="flex flex-col gap-1">
          <p className="font-semibold">Error</p>
          <p className="text-sm text-gray-600">{error.message}</p>
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

  const renderPaymentStatus = () => {
    if (!subscriptionInfo) return null;

    const isPaymentFailed =
      subscriptionInfo.subscription_status === "payment_failed";
    const gracePeriodEnd = subscriptionInfo.grace_period_end
      ? new Date(subscriptionInfo.grace_period_end)
      : null;
    const now = new Date();
    const isInGracePeriod = gracePeriodEnd && now < gracePeriodEnd;
    const daysRemaining = gracePeriodEnd
      ? Math.ceil((gracePeriodEnd - now) / (1000 * 60 * 60 * 24))
      : 0;

    if (isPaymentFailed) {
      return (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          <h3 className="text-amber-800 font-semibold mb-2">Payment Failed</h3>
          <p className="text-amber-700 mb-4">
            {isInGracePeriod
              ? `Your payment failed. You have ${daysRemaining} days remaining in your grace period to resolve this issue.`
              : "Your payment failed. Please update your payment information to continue using Pro features."}
          </p>
          <Button
            onClick={handleRetryPayment}
            disabled={loading}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              "Retry Payment"
            )}
          </Button>
        </div>
      );
    }

    return null;
  };

  return renderPaymentStatus();
};

export default PaymentStatus;
