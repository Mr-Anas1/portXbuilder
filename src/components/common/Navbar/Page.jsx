"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  AlignJustify,
  BriefcaseBusiness,
  LogOut,
  Settings,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

const Navbar = ({ isDashboard }) => {
  const { user, userData } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const handleAccountMenuClick = () => {
    setAccountMenuOpen(!accountMenuOpen);
    console.log(accountMenuOpen);
  };

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
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <section className="border-b border-gray-200 relative">
      <div className={`${isDashboard ? "fixed w-screen" : " "}`}>
        <div className="h-16 flex justify-between items-center px-5 md:px-10 lg:px-20 py-10 relative ">
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

          {!user ? (
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
          ) : (
            ""
          )}

          <div className="hidden md:block">
            {user ? (
              <div className="flex justify-center items-center gap-4">
                <Link
                  href="/dashboard"
                  className="cursor-pointer hover:text-secondary-500 transition-colors"
                >
                  Dashboard
                </Link>

                <div
                  className="relative cursor-pointer hover:shadow-lg transition-all duration-300 transform  rounded-full"
                  onClick={handleAccountMenuClick}
                >
                  <img
                    src={userData?.image_url || "/default-avatar.png"}
                    alt={userData?.name || "User"}
                    className="w-10 h-10 rounded-full"
                  />

                  {accountMenuOpen && (
                    <div className="absolute flex flex-col gap-2 top-14 right-0 bg-background shadow-lg rounded-lg p-4 z-50 min-w-[150px]">
                      <Link
                        href="/settings"
                        className="flex border-b group border-gray-300 pb-4 items-center gap-2 text-sm hover:text-primary-600 transition"
                      >
                        <Settings
                          size={18}
                          className="text-gray-500 group-hover:text-primary-600 transition"
                        />
                        <span>Settings</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center group gap-2 mt-3 text-sm hover:text-red-500 transition"
                      >
                        <LogOut
                          size={18}
                          className="text-gray-500 group-hover:text-red-500 transition"
                        />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Button variant="outline" asChild>
                <Link
                  href="/sign-up"
                  className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white cursor-pointer text-md px-8 py-6 border-none rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Get Started
                </Link>
              </Button>
            )}
          </div>

          <div className="md:hidden">
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
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-[999] h-full  overflow-hidden  bg-background w-full text-black mt-2 pt-12 space-y-4 flex justify-start items-center flex-col gap-10 top-20">
          {!user ? (
            <div>
              <Link
                href={"#features"}
                className="cursor-pointer "
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
          ) : (
            ""
          )}
          <div>
            {user ? (
              <div className="flex justify-center items-center gap-12 flex-col">
                <Link href="/dashboard" className="cursor-pointer">
                  {" "}
                  Dashboard
                </Link>
                <Link
                  href="/dashboard"
                  className="cursor-pointer text-red-500"
                  onClick={handleLogout}
                >
                  {" "}
                  Logout
                </Link>
              </div>
            ) : (
              <Button variant="outline" asChild>
                <Link
                  href="/sign-up"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white cursor-pointer text-md px-8 py-6 border-none rounded-xl"
                >
                  Get Started
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Navbar;
