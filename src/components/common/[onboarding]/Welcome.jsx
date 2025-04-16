import { ArrowRight, Sparkles } from "lucide-react";
import React from "react";

const Welcome = () => {
  return (
    <section className="text-center relative flex flex-col justify-center items-center">
      <div>
        <Sparkles className="w-12 h-12 mx-auto mb-6 text-primary-500 animate-pulse" />
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          Create Your Portfolio
        </h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg leading-relaxed">
          Build a stunning portfolio in minutes. Showcase your work, share your
          story, and connect with opportunities worldwide.
        </p>
        <button className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-3 rounded-lg font-medium flex items-center mx-auto hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
          Get Started
          <ArrowRight className="ml-2" size={20} />
        </button>
      </div>
    </section>
  );
};

export default Welcome;
