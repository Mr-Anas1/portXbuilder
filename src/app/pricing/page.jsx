import Footer from "@/components/Home/Footer";
import React from "react";
import Navbar from "@/components/common/Navbar/Page";
import PricingSectionCards from "@/components/Home/PricingSection";

const page = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-16 w-64 h-64 bg-gradient-to-r from-primary-400/20 to-secondary-400/20 rounded-full blur-3xl" />
      <div className="absolute top-1/4 right-[10px] w-32 h-32 bg-secondary-400/20 rounded-full blur-2xl" />
      <div className="absolute bottom-[50px] left-1/4 w-32 h-32 bg-primary-400/20 rounded-full blur-2xl" />

      <Navbar className="relative z-0" />
      <div className="flex flex-col items-center justify-start min-h-[calc(100vh-4rem)] mt-16 px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Pricing Plans</h1>
        <p className="text-lg text-gray-700 mb-4 text-center mx-4">
          Explore our pricing plans and choose the one that suits you best.
        </p>
        <div className="w-full max-w-7xl mx-auto">
          <PricingSectionCards />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default page;
