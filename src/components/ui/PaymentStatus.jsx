import React, { useState } from "react";
import { Button } from "./button";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";

const PaymentStatus = ({ subscriptionInfo }) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const handleRetryPayment = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Create a new subscription
      const response = await fetch("/api/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.fullName || user.username,
          email: user.emailAddresses[0].emailAddress,
          contact: user.phoneNumbers[0]?.phoneNumber || "",
          billingPeriod: "monthly", // Default to monthly for retry payments
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create subscription");
      }

      // Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: data.subscriptionId,
        name: "PortX Builder",
        description: "Pro Plan Subscription",
        handler: async function (response) {
          try {
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
              throw new Error(result.error || "Payment verification failed");
            }

            toast.success(
              <div className="flex flex-col gap-1">
                <p className="font-semibold">Payment Successful!</p>
                <p className="text-sm text-gray-600">
                  Your subscription has been reactivated.
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
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } catch (error) {
            toast.error(
              <div className="flex flex-col gap-1">
                <p className="font-semibold">Payment Failed</p>
                <p className="text-sm text-gray-600">
                  {error.message}. Please try again.
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
          name: user.fullName || user.username,
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
