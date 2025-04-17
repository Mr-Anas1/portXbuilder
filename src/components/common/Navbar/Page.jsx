"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlignJustify, BriefcaseBusiness, X } from "lucide-react";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useClerk } from "@clerk/nextjs";
import CustomUserSettings from "../../ui/CustomUserSettings";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { openUserProfile } = useClerk();
  const router = useRouter();

  const handleMenuClick = () => {
    setIsOpen(!isOpen);
  };
  return (
    <section className="border-b border-gray-200">
      <div className="h-16 flex justify-between items-center px-5 md:px-10 lg:px-20 py-10 ">
        <div
          className="flex justify-center items-center gap-2.5"
          onClick={() => router.push("/")}
        >
          <div className="flex justify-center items-center">
            <BriefcaseBusiness size={28} className="text-primary-500" />
          </div>
          <div className="font-extrabold text-xl bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Port X Builder
          </div>
        </div>

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

        <div className="hidden md:block">
          <SignedOut>
            <Button variant="outline" asChild>
              <Link
                href="/sign-up"
                className="bg-gradient-to-r from-primary-600 to-secondary-600 pointer text-white cursor-pointer text-md px-8 py-6 border-none rounded-xl hover:bg-primary-50 hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl "
              >
                Get Started
              </Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <div className="flex justify-center items-center gap-4">
              <Link
                href="/dashboard"
                className="cursor-pointer hover:text-yellow-300 transition-colors"
              >
                {" "}
                Dashboard
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-10 h-10",
                  },
                }}
              />
            </div>
          </SignedIn>
        </div>

        <div className="md:hidden">
          <button className="cursor-pointer">
            {isOpen ? (
              <X size={28} onClick={handleMenuClick} />
            ) : (
              <AlignJustify size={28} onClick={handleMenuClick} />
            )}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden absolute bg-white w-full h-full text-black mt-2 pt-12 space-y-4 flex justify-start items-center flex-col gap-10">
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
          <div>
            <SignedOut>
              <Button variant="outline" asChild>
                <Link
                  href="/sign-up"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white cursor-pointer text-md px-8 py-6 border-none rounded-xl"
                >
                  Get Started
                </Link>
              </Button>
            </SignedOut>
            <SignedIn>
              <div className="flex justify-center items-center gap-12 flex-col">
                <Link href="/dashboard" className="cursor-pointer">
                  {" "}
                  Dashboard
                </Link>
                <CustomUserSettings />
              </div>
            </SignedIn>
          </div>
        </div>
      )}
    </section>
  );
};

export default Navbar;
