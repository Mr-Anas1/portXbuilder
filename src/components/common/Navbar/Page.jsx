"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlignJustify, BriefcaseBusiness, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserButton, useClerk, SignedIn, SignedOut } from "@clerk/nextjs";
import { useProStatusClient } from "@/context/useProStatusClient";

const Navbar = ({ isDashboard }) => {
  const hasProPlan = useProStatusClient();
  const { signOut } = useClerk();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleMenuClick = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <section className="border-b border-gray-200 relative z-50">
      <div
        className={`${
          isDashboard ? "fixed w-screen z-50 bg-background" : " "
        } `}
      >
        <div className="h-16 flex justify-between items-center px-5 md:px-10 lg:px-20 py-10 relative border-b border-gray-200">
          <div
            className="flex justify-center items-center gap-2.5 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <div className="flex justify-center items-center">
              <BriefcaseBusiness size={28} className="text-primary-500" />
            </div>
            <div className="font-extrabold text-xl bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Port X Builder
            </div>
          </div>

          <SignedOut>
            <div className="hidden absolute left-1/2 transform -translate-x-1/2 md:flex gap-5 lg:gap-10">
              <Link
                href={"/#features"}
                className="cursor-pointer hover:text-secondary-500 transition-colors"
              >
                Features
              </Link>
              <Link
                href={"/#pricing"}
                className="cursor-pointer hover:text-secondary-500  transition-colors"
              >
                Pricing
              </Link>
              <Link
                href={"/#template"}
                className="cursor-pointer hover:text-secondary-500 transition-colors"
              >
                Templates
              </Link>
            </div>
          </SignedOut>

          <div className="hidden md:block">
            <SignedIn>
              <div className="flex justify-center items-center gap-4">
                {hasProPlan ? (
                  <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    PRO
                  </div>
                ) : (
                  <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Go Pro
                  </button>
                )}
                <Link
                  href="/dashboard"
                  className="cursor-pointer hover:text-secondary-500 transition-colors"
                >
                  Dashboard
                </Link>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                    },
                  }}
                />
              </div>
            </SignedIn>
            <SignedOut>
              <Button variant="outline" asChild>
                <Link
                  href="/sign-up"
                  className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white cursor-pointer text-md px-8 py-6 border-none rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Get Started
                </Link>
              </Button>
            </SignedOut>
          </div>

          <div className="md:hidden flex justify-center items-center">
            <SignedOut>
              <button className="cursor-pointer">
                {isOpen ? (
                  <X
                    size={28}
                    onClick={handleMenuClick}
                    className="text-red-500"
                  />
                ) : (
                  <AlignJustify
                    size={28}
                    onClick={handleMenuClick}
                    className="text-primary-500"
                  />
                )}
              </button>
            </SignedOut>
            <SignedIn>
              <div className="flex justify-center items-center gap-4">
                {hasProPlan ? (
                  <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    PRO
                  </div>
                ) : (
                  <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Go Pro
                  </button>
                )}

                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                    },
                  }}
                />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-[999] h-full overflow-hidden bg-background w-full text-black pt-12 space-y-4 flex justify-start items-center flex-col gap-10 top-20">
          <SignedOut>
            <div className="flex flex-col gap-8 justify-center items-center">
              <Link
                href={"#features"}
                className="cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Features
              </Link>

              <Link
                href="#pricing"
                onClick={() => setIsOpen(false)}
                className="cursor-pointer"
              >
                Pricing
              </Link>
              <Link
                href="#templates"
                onClick={() => setIsOpen(false)}
                className="cursor-pointer"
              >
                Templates
              </Link>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="flex flex-col gap-8 justify-center items-center">
              <div className="text-center">
                {hasProPlan ? (
                  <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-3 py-1 rounded-full text-sm font-semibold inline-block">
                    PRO
                  </div>
                ) : (
                  <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-3 py-1 rounded-full text-sm font-semibold inline-block">
                    Go Pro
                  </button>
                )}
              </div>
              <Link
                href="/dashboard"
                className="cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </SignedIn>
        </div>
      )}
    </section>
  );
};

export default Navbar;
