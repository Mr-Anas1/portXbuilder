import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const CtaSection = () => {
  return (
    <section className="py-32 bg-primary-600 relative overflow-hidden">
      <div className="flex flex-col gap-10 items-center">
        <h1 className="text-3xl text-center font-bold lg:text-5xl text-white">
          Ready to Showcase Your Work?
        </h1>

        <p className="text-white text-center text-lg lg:text-xl max-w-2xl mx-auto ">
          Join thousands of professionals who trust PortXBuilder to showcase
          their work and attract clients.
        </p>

        <Button size="xl">
          <Link
            href="/create"
            className="bg-gradient-to-r bg-white text-primary-500 cursor-pointer text-md px-8 py-4 border-none hover:bg-primary-50 hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl rounded-full lg:text-lg"
          >
            Create Your Portfolio Now
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default CtaSection;
