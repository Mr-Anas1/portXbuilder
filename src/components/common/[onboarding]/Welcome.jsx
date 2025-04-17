import { ArrowRight, Sparkles } from "lucide-react";
import React from "react";
import Navbar from "../Navbar/Page";

const Welcome = () => {
  return (
    <section>
      <div className="text-center relative flex flex-col justify-center items-center">
        <div>
          <Sparkles className="w-12 h-12 mx-auto mb-6 text-primary-500 animate-pulse" />
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Create Your Portfolio
          </h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg leading-relaxed">
            Build a stunning portfolio in minutes. Showcase your work, share
            your story, and connect with opportunities worldwide.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Welcome;
