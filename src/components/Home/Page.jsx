import React from "react";
import Navbar from "../common/Navbar/Page";
import Hero from "./Hero";
import Features from "./Features";
import PricingSectionCards from "./PricingSection";
import CtaSection from "./CtaSection";
import Footer from "./Footer";

function Page() {
  return (
    <section className="flex flex-col min-h-screen bg-background">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-16 w-64 h-64 bg-gradient-to-r from-primary-400/20 to-secondary-400/20 rounded-full blur-3xl" />
      <div className="absolute top-1/4 right-[10px] w-32 h-32 bg-secondary-400/20 rounded-full blur-2xl" />
      <div className="absolute bottom-[50px] left-1/4 w-32 h-32 bg-primary-400/20 rounded-full blur-2xl" />
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <Hero />
      </div>
      <Features />
      <PricingSectionCards />
      <CtaSection />
      <Footer />
    </section>
  );
}

export default Page;
