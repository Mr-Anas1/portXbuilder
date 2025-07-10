"use client";
import Footer from "@/components/Home/Footer";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/common/Navbar/Page";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import SubscribeButton from "@/components/ui/SubscribeButton";

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
import BillingForm from "@/components/ui/BillingForm";

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
  const [showBilling, setShowBilling] = useState(false);
  const [billingLoading, setBillingLoading] = useState(false);
  const [billingInfo, setBillingInfo] = useState(null);

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

  // Add handler for Dodo customer portal
  const handleManageSubscription = async () => {
    if (!user) {
      toast.error("Please sign in to manage your subscription");
      return;
    }
    try {
      const res = await fetch("/api/create-customer-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerk_id: user.id }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Failed to open portal");
      }
    } catch (error) {
      toast.error("Failed to open portal");
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

  // Fetch billing info from user profile if available
  useEffect(() => {
    if (user) {
      // Fetch from Supabase or your user context
      supabase
        .from("users")
        .select(
          "billing_city, billing_country, billing_state, billing_street, billing_zipcode"
        )
        .eq("clerk_id", user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setBillingInfo({
              city: data.billing_city || "",
              country: data.billing_country || "",
              state: data.billing_state || "",
              street: data.billing_street || "",
              zipcode: data.billing_zipcode || "",
            });
          }
        });
    }
  }, [user]);

  const handleBillingSubmit = async (form) => {
    setBillingLoading(true);
    // Update billing info in DB
    await fetch("/api/update-billing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, clerk_id: user.id }),
    });
    setBillingLoading(false);
    setShowBilling(false);
    // Now trigger the SubscribeButton logic (can refactor into a function)
    document.getElementById("real-subscribe-btn").click();
  };

  if (!isUserLoaded || loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
                    <X className="h-5 w-5 text-gray-300" />
                    <span className="text-gray-500">Premium Templates</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                    <span>Watermark on Portfolio</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                    <span>Ads</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                    <span>Portfolio URL</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <X className="h-5 w-5 text-gray-300" />
                    <span className="text-gray-500">Priority Support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="mt-4">
                <Button
                  className="w-full bg-primary-100 text-primary-500 hover:bg-primary-500 hover:text-white transition duration-300 text-md font-semibold rounded-xl py-3"
                  size="lg"
                  variant={"outline"}
                  disabled
                >
                  {isPro ? "Free Plan" : "Current Plan"}
                </Button>
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
                    <span>Basic Templates</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckIcon className="h-5 w-5 text-green-600" />
                    <span>Premium Templates</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <X className="h-5 w-5 text-gray-300" />
                    <span className="text-gray-500">
                      Watermark on Portfolio
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <X className="h-5 w-5 text-gray-300" />
                    <span className="text-gray-500">Ads</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckIcon className="h-5 w-5 text-green-600" />
                    <span>Portfolio URL</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckIcon className="h-5 w-5 text-green-600" />
                    <span>Priority Support</span>
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
                  <>
                    <AlertDialog
                      open={showBilling}
                      onOpenChange={setShowBilling}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          className="w-full bg-primary-500 text-white py-2 px-4 rounded-md hover:bg-primary-600 transition-colors text-md font-semibold rounded-xl py-3 shadow-md"
                          onClick={() => setShowBilling(true)}
                        >
                          Subscribe Now
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Billing Information
                          </AlertDialogTitle>
                        </AlertDialogHeader>
                        <BillingForm
                          initialValues={billingInfo || {}}
                          onSubmit={handleBillingSubmit}
                          loading={billingLoading}
                        />
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={() => setShowBilling(false)}
                          >
                            Cancel
                          </AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    {/* Hidden real subscribe button, triggered after billing info is saved */}
                    <SubscribeButton
                      id="real-subscribe-btn"
                      billingPeriod={billingPeriod}
                      style={{ display: "none" }}
                    />
                  </>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto mt-16 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {/* FAQ Item 1 */}
            <details
              className="group border border-gray-200 rounded-lg p-4 bg-white/80"
              open
            >
              <summary className="font-semibold text-lg text-gray-800 cursor-pointer flex items-center justify-between">
                What is PortXBuilder?
                <span className="ml-2 transition-transform group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <p className="mt-2 text-gray-600">
                PortXBuilder is an easy-to-use platform for creating and
                managing your professional portfolio website. No coding
                required—just pick a template, add your content, and launch your
                site in minutes.
              </p>
            </details>
            {/* FAQ Item 2 */}
            <details className="group border border-gray-200 rounded-lg p-4 bg-white/80">
              <summary className="font-semibold text-lg text-gray-800 cursor-pointer flex items-center justify-between">
                What do I get with the Free plan?
                <span className="ml-2 transition-transform group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <p className="mt-2 text-gray-600">
                The Free plan gives you access to basic templates, a hosted
                portfolio with a watermark, and limited features. It&apos;s
                perfect for getting started and exploring the platform.
              </p>
            </details>
            {/* FAQ Item 3 */}
            <details className="group border border-gray-200 rounded-lg p-4 bg-white/80">
              <summary className="font-semibold text-lg text-gray-800 cursor-pointer flex items-center justify-between">
                What are the benefits of the Pro plan?
                <span className="ml-2 transition-transform group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <p className="mt-2 text-gray-600">
                The Pro plan unlocks premium templates, removes watermarks and
                ads priority support, and more advanced features to help you
                stand out.
              </p>
            </details>
            {/* FAQ Item 4 */}
            <details className="group border border-gray-200 rounded-lg p-4 bg-white/80">
              <summary className="font-semibold text-lg text-gray-800 cursor-pointer flex items-center justify-between">
                Can I cancel or change my subscription anytime?
                <span className="ml-2 transition-transform group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <p className="mt-2 text-gray-600">
                Yes! You can upgrade, downgrade, or cancel your subscription at
                any time from your dashboard. Your changes will take effect at
                the end of your current billing period.
              </p>
            </details>
            {/* FAQ Item 5 */}
            <details className="group border border-gray-200 rounded-lg p-4 bg-white/80">
              <summary className="font-semibold text-lg text-gray-800 cursor-pointer flex items-center justify-between">
                Is my data and portfolio secure?
                <span className="ml-2 transition-transform group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <p className="mt-2 text-gray-600">
                Absolutely. We use industry-standard security practices to keep
                your data and portfolio safe. You have full control over your
                content and privacy settings.
              </p>
            </details>
            {/* FAQ Item 6 */}
            <details className="group border border-gray-200 rounded-lg p-4 bg-white/80">
              <summary className="font-semibold text-lg text-gray-800 cursor-pointer flex items-center justify-between">
                Do I need to know how to code?
                <span className="ml-2 transition-transform group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <p className="mt-2 text-gray-600">
                Not at all! PortXBuilder is designed for everyone. You can build
                and customize your portfolio with our intuitive editor—no coding
                skills required.
              </p>
            </details>
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
