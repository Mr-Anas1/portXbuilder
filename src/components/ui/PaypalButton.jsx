"use client";
import { useEffect, useRef } from "react";

export default function PayPalButton() {
  const paypalRef = useRef();

  useEffect(() => {
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
              plan_id: "P-0CF348034T804343WNBGDFZY", // 🟡 Replace with your real Plan ID
            });
          },
          onApprove: function (data, actions) {
            alert("Subscription successful! ID: " + data.subscriptionID);
          },
          onError: function (err) {
            console.error("PayPal Subscription Error:", err);
          },
        })
        .render(paypalRef.current);
    }
  }, []);

  return <div ref={paypalRef}></div>;
}
