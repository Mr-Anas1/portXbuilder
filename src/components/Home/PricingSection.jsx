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
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import PaypalButton from "../ui/PaypalButton";

export default function PricingSectionCards() {
  const { user } = useUser();
  const router = useRouter();
  const [isUpgrading, setIsUpgrading] = useState(false);

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
      <div className="absolute inset-0  bg-background" />

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

        {/* Grid */}
        <div className="flex flex-col w-full md:flex-row justify-center items-center gap-8 lg:items-stretch mb-16 max-w-5xl mx-auto">
          {/* Free Card */}
          <Card className="flex flex-col w-full max-w-md transition duration-300 hover:scale-105 hover:shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <span className="font-bold text-2xl text-neutral-800 lg:text-3xl">
                Free
              </span>
            </CardHeader>
            <CardDescription className="text-center font-bold text-4xl text-neutral-800">
              $0
              <span className="text-base font-normal text-gray-500">/year</span>
            </CardDescription>
            <CardContent className="flex-1">
              <ul className="mt-7 space-y-3 text-sm">
                <li className="flex items-center space-x-3">
                  <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                  <span className="text-muted-foreground text-lg">
                    Basic Templates
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                  <span className="text-muted-foreground text-lg">
                    Ads + Watermark
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                  <span className="text-muted-foreground text-lg">
                    15 Credits
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <X className="flex-shrink-0 h-5 w-5 text-red-500" />
                  <span className="text-muted-foreground text-lg">
                    Specific Subdomain
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <X className="flex-shrink-0 h-5 w-5 text-red-500" />
                  <span className="text-muted-foreground text-lg">
                    Download Source Code
                  </span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-primary-100 text-primary-500 hover:bg-primary-500 hover:text-white transition duration-300 text-md"
                size="lg"
                variant={"outline"}
              >
                Stay Free
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Card */}
          <Card className="border-primary-500 border-2 flex flex-col w-full max-w-md transition duration-300 hover:scale-105 hover:shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <div className="inline-block px-4 py-1 rounded-full bg-primary-100 text-primary-500 text-sm font-medium mb-2">
                Most Popular
              </div>
              <span className="font-bold text-2xl text-neutral-800 lg:text-3xl">
                Pro
              </span>
            </CardHeader>
            <CardDescription className="text-center font-bold text-4xl text-neutral-800">
              $14.99
              <span className="text-base font-normal text-gray-500">/year</span>
            </CardDescription>
            <CardContent className="flex-1">
              <ul className="mt-7 space-y-3 text-sm">
                <li className="flex items-center space-x-3">
                  <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                  <span className="text-muted-foreground text-lg">
                    Premium Templates
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                  <span className="text-muted-foreground text-lg">
                    No Ads + Watermark
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                  <span className="text-muted-foreground text-lg">
                    Specific Subdomain
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                  <span className="text-muted-foreground text-lg">
                    Unlimited Credits
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <X className="flex-shrink-0 h-5 w-5 text-red-500" />
                  <span className="text-muted-foreground text-lg">
                    Download Source Code
                  </span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              {/* <Button
                className="w-full bg-primary-500 text-white hover:bg-primary-600 transition duration-300 text-md"
                size="lg"
                onClick={() => handleUpgrade("pro")}
                disabled={isUpgrading}
              >
                {isUpgrading ? "Upgrading..." : "Upgrade to Pro"}
              </Button> */}

              <PaypalButton />
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
