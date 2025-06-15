"use client";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function PayPalButton() {
  const paypalRef = useRef();
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    if (window.paypal && paypalRef.current) {
      window.paypal
        .Buttons({
          style: {
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "subscribe",
          },
          createSubscription: function (data, actions) {
            return actions.subscription.create({
              plan_id: "P-0CF348034T804343WNBGDFZY",
              application_context: {
                user_action: "SUBSCRIBE_NOW",
                return_url: `${window.location.origin}/dashboard`,
                cancel_url: `${window.location.origin}/pricing`,
              },
              custom_id: user.id,
            });
          },
          onApprove: async function (data, actions) {
            try {
              setIsLoading(true);
              // Handle successful subscription
              const response = await fetch("/api/update-plan", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userId: user.id,
                  plan: "pro",
                  subscriptionId: data.subscriptionID,
                }),
              });

              if (!response.ok) {
                throw new Error("Failed to update plan");
              }

              toast.success("Successfully upgraded to Pro plan!");
              // Reload the page to update the UI
              window.location.reload();
            } catch (error) {
              console.error("Error updating plan:", error);
              toast.error("Failed to update plan. Please contact support.");
            } finally {
              setIsLoading(false);
            }
          },
          onError: function (err) {
            console.error("PayPal Subscription Error:", err);
            toast.error("Payment failed. Please try again.");
          },
        })
        .render(paypalRef.current);
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="w-full">
      <div
        ref={paypalRef}
        className={isLoading ? "opacity-50 pointer-events-none" : ""}
      ></div>
    </div>
  );
}
