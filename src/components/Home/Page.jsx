import React from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";

function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-purple-600 to-blue-600 text-white">
      <Navbar />
      <Hero />
    </div>
  );
}

export default Page;
