import React from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Features from "./Features";
import PricingSectionCards from "./PricingSection";
import CtaSection from "./CtaSection";

function Page() {
  return (
    <section className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-col min-h-screen bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <Navbar />
        <Hero />
      </div>
      <Features />
      <PricingSectionCards />
      <CtaSection />
    </section>
  );
}

export default Page;
