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
import React from "react";

const planFeatures = [
  {
    type: "Financial data",
    features: [
      {
        name: "Open/High/Low/Close",
        free: true,
        startup: true,
        team: true,
        enterprise: true,
      },
      {
        name: "Price-volume difference indicator",
        free: true,
        startup: true,
        team: true,
        enterprise: true,
      },
    ],
  },
  {
    type: "On-chain data",
    features: [
      {
        name: "Network growth",
        free: true,
        startup: false,
        team: true,
        enterprise: true,
      },
      {
        name: "Average token age consumed",
        free: true,
        startup: false,
        team: true,
        enterprise: true,
      },
      {
        name: "Exchange flow",
        free: false,
        startup: false,
        team: true,
        enterprise: true,
      },
      {
        name: "Total ERC20 exchange funds flow",
        free: false,
        startup: false,
        team: true,
        enterprise: true,
      },
    ],
  },
  {
    type: "Social data",
    features: [
      {
        name: "Dev activity",
        free: false,
        startup: true,
        team: false,
        enterprise: true,
      },
      {
        name: "Topic search",
        free: true,
        startup: true,
        team: true,
        enterprise: true,
      },
      {
        name: "Relative social dominance",
        free: true,
        startup: true,
        team: false,
        enterprise: true,
      },
    ],
  },
];

export default function PricingSectionCards() {
  return (
    <section id="pricing">
      {/* Pricing */}
      <div className="flex flex-col my-16 px-5 gap-10 lg:mx-20">
        {/* Title */}
        <div className="max-w-2xl mx-auto text-center mb-4 lg:mb-4">
          <h2 className="scroll-m-20 text-neutral-900 pb-2 text-2xl lg:text-4xl font-bold tracking-tight transition-colors first:mt-0">
            Choose Your Plan
          </h2>
        </div>
        {/* End Title */}
        {/* Grid */}
        <div className=" flex flex-col w-full md:flex-row justify-center items-center gap-6 lg:items-center mb-16">
          {/* Card */}
          <Card className="flex flex-col w-full transition duration-300 hover:scale-105">
            <CardHeader className="text-center pb-2">
              <span className="font-bold text-2xl text-neutral-800 lgt:text-4xl">
                Free
              </span>
            </CardHeader>
            <CardDescription className="text-center font-bold text-4xl text-neutral-800">
              $0
              <span className="text-base font-normal text-gray-500">/year</span>
            </CardDescription>
            <CardContent className="flex-1">
              <ul className="mt-7 space-y-2.5 text-sm">
                <li className="flex items-center space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-6 w-6 text-green-500" />
                  <span className="text-muted-foreground text-lg">
                    Basic Templates
                  </span>
                </li>
                <li className="flex items-center space-x-2 ">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-6 w-6 text-green-500" />

                  <span className="text-muted-foreground text-lg">
                    Ads + Watermark
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-6 w-6 text-green-500" />

                  <span className="text-muted-foreground text-lg">
                    15 Credits
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <X className="flex-shrink-0 mt-0.5 h-6 w-6 text-red-500" />
                  <span className="text-muted-foreground text-lg">
                    Specific Subdomain
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <X className="flex-shrink-0 mt-0.5 h-6 w-6 text-red-500" />
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
          {/* End Card */}
          {/* Card */}
          <Card className="border-primary-500 border-2 flex flex-col  w-full transition duration-300 hover:scale-105">
            <CardHeader className="text-center pb-2">
              <span className="font-bold text-2xl text-neutral-800 lgt:text-4xl">
                Pro
              </span>
            </CardHeader>
            <CardDescription className="text-center font-bold text-4xl text-neutral-800">
              $14.99
              <span className="text-base font-normal text-gray-500">/year</span>
            </CardDescription>
            <CardContent className="flex-1">
              <ul className="mt-7 space-y-2.5 text-sm">
                <li className="flex items-center space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-6 w-6 text-green-500" />

                  <span className="text-muted-foreground text-lg">
                    Premium Templates
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-6 w-6 text-green-500" />

                  <span className="text-muted-foreground text-lg">
                    No Ads + Watermark
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-6 w-6 text-green-500" />

                  <span className="text-muted-foreground text-lg">
                    Specific Subdomain
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-6 w-6 text-green-500" />

                  <span className="text-muted-foreground text-lg">
                    Unlimited Credits
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <X className="flex-shrink-0 mt-0.5 h-6 w-6 text-red-500" />

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
                Go Pro
              </Button>
            </CardFooter>
          </Card>
          {/* End Card */}
          {/* Card */}
          <Card className="flex flex-col  w-full transition duration-300 hover:scale-105">
            <CardHeader className="text-center pb-2">
              <span className="font-bold text-2xl text-neutral-800 lgt:text-4xl">
                Ultimate
              </span>
            </CardHeader>
            <CardDescription className="text-center font-bold text-4xl text-neutral-800">
              $28.99
              <span className="text-base font-normal text-gray-500">
                /Lifetime
              </span>
            </CardDescription>
            <CardContent className="flex-1">
              <ul className="mt-7 space-y-2.5 text-sm">
                <li className="flex items-center space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-6 w-6 text-green-500" />

                  <span className="text-muted-foreground text-lg">
                    Premium Templates
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-6 w-6 text-green-500" />

                  <span className="text-muted-foreground text-lg">
                    No Ads + Watermark
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-6 w-6 text-green-500" />

                  <span className="text-muted-foreground text-lg">
                    15 Credits
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-6 w-6 text-green-500" />

                  <span className="text-muted-foreground text-lg">
                    Unlimited Credits
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-6 w-6 text-green-500" />

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
                Go Ultimate
              </Button>
            </CardFooter>
          </Card>
          {/* End Card */}
        </div>
        {/* End Grid */}
      </div>
      {/* End Pricing */}
    </section>
  );
}
