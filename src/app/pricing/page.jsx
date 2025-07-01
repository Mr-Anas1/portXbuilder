"use client";
import Footer from "@/components/Home/Footer";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/common/Navbar/Page";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import SubscribeButton from "@/components/ui/SubscribeButton";
import CancelSubscriptionButton from "@/components/ui/CancelSubscriptionButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckIcon, X, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import FullPageLoader from "@/components/ui/FullPageLoader";
import { toast } from "react-hot-toast";
import PaymentStatus from "@/components/ui/PaymentStatus";

const PRICING = {
  monthly: {
    free: { priceUSD: 0, priceINR: 0, labelUSD: "/month", labelINR: "/month" },
    pro: {
      priceUSD: 3.49,
      priceINR: 299,
      labelUSD: "/month",
      labelINR: "/month",
    },
  },
  yearly: {
    free: { priceUSD: 0, priceINR: 0, labelUSD: "/year", labelINR: "/year" },
    pro: {
      priceUSD: 33.49,
      priceINR: 2870,
      labelUSD: "/year",
      labelINR: "/year",
    },
  },
};

const PricingPage = () => {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [billingPeriod, setBillingPeriod] = useState("yearly");
  const [currency, setCurrency] = useState("USD");

  // Use IP geolocation to detect country
  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.country_code === "IN") {
          setCurrency("INR");
        } else {
          setCurrency("USD");
        }
      })
      .catch(() => setCurrency("USD"));
  }, []);

  const handleDowngrade = async () => {
    if (!user) {
      toast.error(
        <div className="flex flex-col gap-1">
          <p className="font-semibold">Authentication Required</p>
          <p className="text-sm text-gray-600">
            Please sign in to manage your subscription.
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
      return;
    }

    try {
      const response = await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to downgrade subscription");
      }

      toast.success(
        <div className="flex flex-col gap-1">
          <p className="font-semibold">Subscription Downgraded</p>
          <p className="text-sm text-gray-600">{data.message}</p>
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
      window.location.reload(); // Refresh the page to update the UI
    } catch (error) {
      console.error("Error downgrading subscription:", error);
      toast.error(
        <div className="flex flex-col gap-1">
          <p className="font-semibold">Downgrade Failed</p>
          <p className="text-sm text-gray-600">
            Failed to downgrade subscription. Please try again.
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
  };

  useEffect(() => {
    const fetchSubscriptionInfo = async () => {
      if (!isUserLoaded) return; // Wait for user to be loaded

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("users")
          .select(
            "plan, subscription_status, subscription_end_date, subscription_cancelled_at"
          )
          .eq("clerk_id", user.id)
          .single();

        if (error) {
          console.error("Error fetching subscription info:", error);
          return;
        }

        setSubscriptionInfo(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionInfo();
  }, [user, isUserLoaded]);

  if (!isUserLoaded || loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const renderSubscriptionStatus = () => {
    if (!user) {
      return (
        <div className="max-w-3xl mx-auto mb-12 bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Subscription Management
          </h2>
          <p className="text-gray-600">
            Please sign in to manage your subscription.
          </p>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="max-w-3xl mx-auto mb-12 bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading...</h2>
        </div>
      );
    }

    const isPro = subscriptionInfo?.plan === "pro";
    const isCancelled = subscriptionInfo?.subscription_status === "cancelled";
    const endDate = subscriptionInfo?.subscription_end_date
      ? new Date(subscriptionInfo.subscription_end_date)
      : null;
    const cancelledAt = subscriptionInfo?.subscription_cancelled_at
      ? new Date(subscriptionInfo.subscription_cancelled_at)
      : null;

    return (
      <div className="max-w-3xl mx-auto mb-12 bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Your Subscription Status
        </h2>

        <PaymentStatus subscriptionInfo={subscriptionInfo} />

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-gray-600">Current Plan</p>
              <p className="text-xl font-semibold text-gray-800">
                {isPro ? "Pro Plan" : "Free Plan"}
              </p>
              {isCancelled && (
                <p className="text-sm text-amber-600 mt-1">
                  Cancelled - Active until {endDate?.toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="px-3 py-1 rounded-full bg-primary-100 text-primary-500 text-sm font-medium">
              {subscriptionInfo?.subscription_status ||
                "No active subscription"}
            </div>
          </div>

          {endDate && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Subscription Period</p>
              <p className="text-lg font-semibold text-gray-800">
                {isCancelled ? "Access until" : "Next billing date"}:{" "}
                {endDate.toLocaleDateString()}
              </p>
              {isCancelled && cancelledAt && (
                <p className="text-sm text-gray-500 mt-1">
                  Cancelled on {cancelledAt.toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Available Actions
            </h3>
            <div className="space-y-4">
              {isPro ? (
                <div className="space-y-2">
                  <p className="text-gray-600 mb-2">
                    {isCancelled
                      ? "Your subscription has been cancelled but you'll continue to have access to Pro features until the end of your billing period."
                      : "You are currently on the Pro plan. You can cancel your subscription at any time."}
                  </p>
                  {!isCancelled && <CancelSubscriptionButton />}
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-gray-600 mb-4">
                    Upgrade to Pro to unlock all premium features and remove
                    limitations.
                  </p>
                  <Button
                    className="w-full bg-primary-500 text-white py-2 px-4 rounded-md hover:bg-primary-600 transition-colors"
                    onClick={() => {
                      const el = document.getElementById("pricing");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    See Plans
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPlans = () => {
    const isPro = subscriptionInfo?.plan === "pro";
    const isCancelled = subscriptionInfo?.subscription_status === "cancelled";
    const isPaymentFailed =
      subscriptionInfo?.subscription_status === "payment_failed";
    const isEnded = subscriptionInfo?.subscription_status === "ended";

    return (
      <>
        {/* Billing Toggle */}
        <div id="pricing" style={{ scrollMarginTop: "100px" }}>
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-full gap-2 bg-gray-100 p-1 shadow-sm">
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  billingPeriod === "monthly"
                    ? "bg-primary-500 text-white shadow"
                    : "text-gray-700 border border-gray-300"
                }`}
                onClick={() => setBillingPeriod("monthly")}
                type="button"
              >
                Monthly
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  billingPeriod === "yearly"
                    ? "bg-primary-500 text-white shadow"
                    : "text-gray-700 border border-gray-300"
                }`}
                onClick={() => setBillingPeriod("yearly")}
                type="button"
              >
                Yearly
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center w-full md:flex-row justify-center md:items-stretch gap-8 mb-16 max-w-5xl mx-auto">
            {/* Free Card */}
            <Card className="flex flex-col w-full max-w-md bg-white/90 backdrop-blur-lg rounded-3xl shadow-lg border border-gray-200 transition duration-300 hover:scale-[1.03] hover:shadow-2xl">
              <CardHeader className="text-center pb-2">
                {/* Invisible placeholder for alignment with Pro card's Most Popular tag */}
                <div
                  className="inline-block px-4 py-1 rounded-full mb-2"
                  style={{ visibility: "hidden" }}
                >
                  Most Popular
                </div>
                <span className="font-bold text-2xl text-neutral-800 lg:text-3xl">
                  Free
                </span>
              </CardHeader>
              <CardDescription className="text-center font-extrabold text-4xl text-primary-600 mb-2">
                {currency === "INR" ? (
                  <>
                    ₹{PRICING[billingPeriod].free.priceINR}
                    <span className="text-base font-normal text-gray-500">
                      {PRICING[billingPeriod].free.labelINR}
                    </span>
                  </>
                ) : (
                  <>
                    ${PRICING[billingPeriod].free.priceUSD}
                    <span className="text-base font-normal text-gray-500">
                      {PRICING[billingPeriod].free.labelUSD}
                    </span>
                  </>
                )}
              </CardDescription>
              <div className="w-2/3 mx-auto border-b border-gray-200 my-4" />
              <CardContent className="flex-1">
                <ul className="mt-4 space-y-4 text-base">
                  <li className="flex items-center gap-3">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                    <span>Basic Templates</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                    <span>Ads + Watermark</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                    <span>15 Credits</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <X className="h-5 w-5 text-gray-300" />
                    <span className="text-gray-500">Specific Subdomain</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <X className="h-5 w-5 text-gray-300" />
                    <span className="text-gray-500">Download Source Code</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="mt-4">
                {isPro && !isCancelled && !isPaymentFailed && !isEnded ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        className="w-full bg-primary-100 text-primary-500 hover:bg-primary-500 hover:text-white transition duration-300 text-md font-semibold rounded-xl py-3"
                        size="lg"
                        variant={"outline"}
                      >
                        Downgrade to Free
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Downgrade to Free Plan
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to downgrade to the Free plan?
                          You&apos;ll continue to have access to Pro features
                          until the end of your current billing period. After
                          that, your account will be downgraded to the Free plan
                          with the following limitations:
                          <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>Basic templates only</li>
                            <li>Ads and watermarks on your portfolio</li>
                            <li>Limited to 15 credits</li>
                            <li>No specific subdomain</li>
                            <li>No source code download</li>
                          </ul>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep Pro Plan</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDowngrade}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Yes, Downgrade to Free
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <Button
                    className="w-full bg-primary-100 text-primary-500 hover:bg-primary-500 hover:text-white transition duration-300 text-md font-semibold rounded-xl py-3"
                    size="lg"
                    variant={"outline"}
                    disabled
                  >
                    {isPro ? "Current Plan" : "Free Plan"}
                  </Button>
                )}
              </CardFooter>
            </Card>

            {/* Pro Card */}
            <Card className="border-2 border-primary-500 flex flex-col w-full max-w-md bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl transition duration-300 hover:scale-[1.04] hover:shadow-3xl relative">
              <CardHeader className="text-center pb-2">
                <div className="flex flex-col items-center justify-center gap-2 mb-3">
                  <div className="min-w-[110px] px-4 py-1 rounded-full bg-primary-100 text-primary-500 text-sm font-medium text-center">
                    Most Popular
                  </div>
                </div>
                <span className="font-bold text-2xl text-primary-700 lg:text-3xl mt-2 block">
                  Pro
                </span>
              </CardHeader>
              <CardDescription className="text-center font-extrabold text-4xl text-primary-700 mb-2">
                {currency === "INR" ? (
                  <>
                    ₹{PRICING[billingPeriod].pro.priceINR}
                    <span className="text-base font-normal text-gray-500">
                      {PRICING[billingPeriod].pro.labelINR}
                    </span>
                  </>
                ) : (
                  <>
                    ${PRICING[billingPeriod].pro.priceUSD}
                    <span className="text-base font-normal text-gray-500">
                      {PRICING[billingPeriod].pro.labelUSD}
                    </span>
                  </>
                )}
                {billingPeriod === "yearly" && (
                  <div className="text-green-600 text-sm font-medium mt-1">
                    Save 20% with yearly billing
                  </div>
                )}
              </CardDescription>
              <div className="w-2/3 mx-auto border-b border-primary-200 my-4" />
              <CardContent className="flex-1">
                <ul className="mt-4 space-y-4 text-base">
                  <li className="flex items-center gap-3">
                    <CheckIcon className="h-5 w-5 text-green-600" />
                    <span>Premium Templates</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckIcon className="h-5 w-5 text-green-600" />
                    <span>No Ads + Watermark</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckIcon className="h-5 w-5 text-green-600" />
                    <span>Specific Subdomain</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckIcon className="h-5 w-5 text-green-600" />
                    <span>Unlimited Credits</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <X className="h-5 w-5 text-gray-300" />
                    <span className="text-gray-500">Download Source Code</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="mt-4">
                {isPro ? (
                  <Button
                    className="w-full bg-primary-500 text-white hover:bg-primary-600 transition duration-300 text-md font-semibold rounded-xl py-3 shadow-md"
                    size="lg"
                    disabled
                  >
                    {isCancelled
                      ? "Cancelled"
                      : isPaymentFailed
                      ? "Payment Failed"
                      : "Current Plan"}
                  </Button>
                ) : (
                  <SubscribeButton billingPeriod={billingPeriod} />
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-16 w-64 h-64 bg-gradient-to-r from-primary-400/20 to-secondary-400/20 rounded-full blur-3xl" />
      <div className="absolute top-1/4 right-[10px] w-32 h-32 bg-secondary-400/20 rounded-full blur-2xl" />
      <div className="absolute bottom-[50px] left-1/4 w-32 h-32 bg-primary-400/20 rounded-full blur-2xl" />

      <Navbar className="relative z-10" />
      <main className="flex-1 relative z-10">
        <div className="container mx-auto px-4 py-16">
          {/* Title */}
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Subscription Management
            </h1>
            <p className="text-lg text-gray-600">
              Manage your subscription and choose the plan that best fits your
              needs
            </p>
          </div>

          {/* Subscription Status */}
          {renderSubscriptionStatus()}

          {/* Plans */}
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Available Plans
            </h2>
            <p className="text-lg text-gray-600">
              Compare our plans and choose the one that&apos;s right for you
            </p>
          </div>
          {renderPlans()}
        </div>
      </main>
      <Footer className="relative z-10" />
    </div>
  );
};

export default PricingPage;
