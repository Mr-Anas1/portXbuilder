"use client";

import { useEffect, useState } from "react";

export default function AboutSection1({ theme }) {
  return (
    <section
      id="about"
      className={`min-h-[60vh] md:min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-20 transition-opacity duration-1000 ${theme.bg}`}
    >
      {/* Left Section */}
      <div className="w-full md:w-1/2 text-center md:text-left mb-12 md:mb-0">
        <h2
          className={`text-5xl font-bold ${theme.accentText} transition duration-300 text-center`}
        >
          Who am I?
        </h2>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 space-y-4">
        <p
          className={`text-lg ${theme.subtext} hover:translate-x-2 transition duration-300`}
        >
          👋 Hi! I'm Sebastian Brooks
        </p>
        <p
          className={`text-lg ${theme.subtext} hover:translate-x-2 transition duration-300`}
        >
          🎨 A passionate Website Designer from Jakarta, Indonesia.
        </p>
        <p
          className={`text-lg ${theme.subtext} hover:translate-x-2 transition duration-300`}
        >
          🧠 I specialize in crafting clean UI/UX for digital products.
        </p>
        <p
          className={`text-lg ${theme.subtext} hover:translate-x-2 transition duration-300`}
        >
          🚀 I love turning complex problems into simple, beautiful interfaces.
        </p>
        <p
          className={`text-lg ${theme.subtext} hover:translate-x-2 transition duration-300`}
        >
          💬 Let’s work together to bring your ideas to life!
        </p>
      </div>
    </section>
  );
}
