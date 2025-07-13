"use client";

import React, { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

const CustomerPortalButton = ({
  variant = "default",
  size = "default",
  className = "",
  children,
  showIcon = true,
  disableDefaultStyle = false,
}) => {
  const { user } = useAuthContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenPortal = async () => {
    console.log("CustomerPortalButton clicked, user:", user);

    if (!user?.id) {
      console.error("No user ID found:", user);
      toast.error("Please sign in to manage your subscription");
      return;
    }

    setIsLoading(true);
    console.log("Making API call with clerk_id:", user.id);

    try {
      const response = await fetch("/api/create-customer-portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerk_id: user.id,
        }),
      });

      console.log("API response status:", response.status);

      const data = await response.json();
      console.log("API response data:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to open customer portal");
      }

      if (!data.url) {
        throw new Error("No portal URL received from API");
      }

      console.log("Redirecting to portal URL:", data.url);
      // Redirect to the customer portal
      window.location.href = data.url;
    } catch (error) {
      console.error("Error opening customer portal:", error);

      // Provide more user-friendly error messages
      let errorMessage = "Failed to open subscription settings";
      if (error.message?.includes("Payment service is not configured")) {
        errorMessage =
          "Payment service is temporarily unavailable. Please try again later or contact support.";
      } else if (error.message?.includes("No subscription found")) {
        errorMessage = "No active subscription found. Please subscribe first.";
      } else if (error.message?.includes("Customer not found")) {
        errorMessage = "Subscription not found. Please contact support.";
      } else {
        errorMessage = error.message || "Failed to open subscription settings";
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // If disableDefaultStyle is true, use minimal styling for quick actions
  if (disableDefaultStyle) {
    return (
      <button
        onClick={handleOpenPortal}
        disabled={isLoading}
        className={`w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors ${className} ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : children ? (
          children
        ) : (
          <>
            <CreditCard className="w-4 h-4" />
            <span>Manage Subscription</span>
          </>
        )}
      </button>
    );
  }

  // Base styles
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 ease-in focus:outline-none focus:ring-2 focus:ring-offset-2";

  // Variant styles
  const variantStyles = {
    default:
      "bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:shadow-lg hover:scale-105",
    outline:
      "border border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-500",
    ghost: "text-primary-500 hover:bg-primary-50 focus:ring-primary-500",
    secondary:
      "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500",
  };

  // Size styles
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    default: "px-4 py-2 rounded-md",
    lg: "px-6 py-3 text-lg rounded-lg",
  };

  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button
      onClick={handleOpenPortal}
      disabled={isLoading}
      className={`${buttonStyles} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : showIcon && !children ? (
        <CreditCard className="w-4 h-4" />
      ) : null}
      {children || "Manage Subscription"}
    </button>
  );
};

export default CustomerPortalButton;
