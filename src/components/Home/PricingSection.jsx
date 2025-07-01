"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckIcon, MinusIcon, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import SubscribeButton from "../ui/SubscribeButton";

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

export default function PricingSectionCards() {
  const { user } = useUser();
  const router = useRouter();
  const [isUpgrading, setIsUpgrading] = useState(false);
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

  const handleUpgrade = async (plan) => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    setIsUpgrading(true);
    try {
      const response = await fetch("/api/update-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          plan,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to upgrade plan");
      }

      // Force a page reload to update the user's plan status
      window.location.reload();
    } catch (error) {
      console.error("Error upgrading plan:", error);
      alert("Failed to upgrade plan. Please try again.");
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <section id="pricing" className="relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-background" />

      {/* Pricing */}
      <div className="flex flex-col my-16 px-5 gap-10 lg:mx-20 relative">
        {/* Title */}
        <div className="max-w-2xl mx-auto text-center mb-4 lg:mb-8">
          <h2 className="scroll-m-20 text-neutral-900 pb-2 text-3xl lg:text-5xl font-bold tracking-tight transition-colors first:mt-0">
            Choose Your Plan
          </h2>
          <p className="text-lg text-gray-600 mt-4">
            Start building your portfolio today with our flexible plans
          </p>
        </div>

        {/* Billing Toggle */}
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

        {/* Grid */}
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
                onClick={() => (window.location.href = "/sign-up")}
              >
                Stay Free
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
                  <span className="text-gray-500">Watermark on Portfolio</span>
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
              <Button
                className="w-full bg-primary-500 text-white hover:bg-primary-600 transition duration-300 text-md font-semibold rounded-xl py-3 shadow-md"
                size="lg"
                variant={"outline"}
                onClick={() => (window.location.href = "/sign-up")}
              >
                Go Pro
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
