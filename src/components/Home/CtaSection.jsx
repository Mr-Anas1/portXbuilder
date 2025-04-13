import React from "react";
import { Button } from "../ui/button";

const CtaSection = () => {
  return (
    <section className="px-20 lg:px-40 py-10 lg:py-20 bg-primary-500 text-white">
      <div className="flex flex-col gap-6 items-center">
        <h1 className="text-2xl text-center font-bold lg:text-4xl text-white">
          Ready to Showcase Your Work?
        </h1>

        <p className="text-white text-center text-lg">
          Join thousands of professionals who trust PortXBuilder to showcase
          their work and attract clients.
        </p>

        <Button
          className="bg-white text-primary-500 rounded-full px-6 py-4 font-semibold text-base lg:text-lg hover:bg-primary-100 transition-all duration-300"
          size="xl"
        >
          Create Your Portfolio Now
        </Button>
      </div>
    </section>
  );
};

export default CtaSection;
