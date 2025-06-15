import Footer from "@/components/Home/Footer";
import React from "react";
import Navbar from "@/components/common/Navbar/Page";
import PricingSectionCards from "@/components/Home/PricingSection";

const page = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-16 w-64 h-64 bg-gradient-to-r from-primary-400/20 to-secondary-400/20 rounded-full blur-3xl" />
      <div className="absolute top-1/4 right-[10px] w-32 h-32 bg-secondary-400/20 rounded-full blur-2xl" />
      <div className="absolute bottom-[50px] left-1/4 w-32 h-32 bg-primary-400/20 rounded-full blur-2xl" />

      <Navbar className="relative z-10" />
      <main className="flex-1 relative z-10">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center mb-12">
            {/* <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Pricing Plans
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              Explore our pricing plans and choose the one that suits you best.
            </p> */}
          </div>
          <div className="w-full">
            <PricingSectionCards />
          </div>
        </div>
      </main>
      <Footer className="relative z-10" />
    </div>
  );
};

export default page;
