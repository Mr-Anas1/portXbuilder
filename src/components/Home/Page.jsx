"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../common/Navbar/Page";
import Hero from "./Hero";
import Features from "./Features";
import PricingSectionCards from "./PricingSection";
import CtaSection from "./CtaSection";
import Footer from "./Footer";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Preview from "./Preview";

function Page({ hasProPlan }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const checkSessionAndRedirect = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.push("/dashboard");
      } else if (isMounted) {
        setLoading(false);
      }
    };

    checkSessionAndRedirect();

    // Listen for auth state changes (e.g., if user logs in while on this page)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          router.push("/dashboard");
        }
      }
    );

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, [router]);

  // Show loading spinner until the session check is complete
  if (loading) {
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
