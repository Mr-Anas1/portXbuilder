"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../common/Navbar/Page";
import Hero from "./Hero";
import Features from "./Features";
import PricingSectionCards from "./PricingSection";
import CtaSection from "./CtaSection";
import Footer from "./Footer";
import { useRouter } from "next/navigation";
import Preview from "./Preview";
import { useAuthContext } from "@/context/AuthContext";

function Page({ hasProPlan }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, loading: authLoading } = useAuthContext();

  useEffect(() => {
    // If auth is still loading, wait
    if (authLoading) {
      return;
    }

    // If user is logged in, redirect to dashboard
    if (user) {
      router.push("/dashboard");
      return;
    }

    // If no user and auth is not loading, show the home page
    if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading, router]);

  // Show loading spinner until the auth check is complete
  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-16 w-64 h-64 bg-gradient-to-r from-primary-400/20 to-secondary-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-[10px] w-32 h-32 bg-secondary-400/20 rounded-full blur-2xl" />
        <div className="absolute bottom-[50px] left-1/4 w-32 h-32 bg-primary-400/20 rounded-full blur-2xl" />
        <div className="flex justify-center items-center min-h-screen">
          <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <section className="flex flex-col bg-background">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-16 w-64 h-64 bg-gradient-to-r from-primary-400/20 to-secondary-400/20 rounded-full blur-3xl" />
      <div className="absolute top-1/4 right-[10px] w-32 h-32 bg-secondary-400/20 rounded-full blur-2xl" />
      <div className="absolute bottom-[50px] left-1/4 w-32 h-32 bg-primary-400/20 rounded-full blur-2xl" />

      <Navbar hasProPlan={hasProPlan} />
      <Hero />
      <Preview />
      <Features />
      <PricingSectionCards />
      <CtaSection />
      <Footer />
    </section>
  );
}

export default Page;
