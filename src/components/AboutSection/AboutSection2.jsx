"use client";

import { usePortfolio } from "@/context/PortfolioContext";
import { useEffect, useState } from "react";

export default function AboutSection1({ theme, isMobileLayout, sectionRef }) {
  const { portfolio, loading } = usePortfolio();

  return (
    <section
      ref={sectionRef}
      id="about"
      className={`flex max-w-7xl mx-auto flex-col ${
        isMobileLayout ? "md:px-4" : "md:flex-row"
      } items-center justify-center gap-5 px-6 md:px-16 py-20 transition-opacity duration-1000 ${
        theme.bg
      } min-h-screen`}
    >
      {/* Left Section */}
      <div
        className={`w-full text-center md:text-left mb-12 md:mb-0 md:w-1/2 ${
          isMobileLayout ? "md:w-full" : ""
        }`}
      >
        <h2
          className={`text-5xl font-bold ${
            theme.accentText
          } transition duration-300 text-center ${
            isMobileLayout ? "mb-8" : ""
          } `}
        >
          Who am I?
        </h2>
      </div>

      {/* Right Section */}
      <div className={`w-full space-y-4  ${isMobileLayout ? " " : "md:w-1/2"}`}>
        <p
          className={`text-lg ${theme.subtext} hover:translate-x-2 transition duration-300`}
        >
          👋 Hi! I&apos;m {portfolio?.name}
        </p>
        <p
          className={`text-lg ${theme.subtext} hover:translate-x-2 transition duration-300`}
        >
          🎨 {portfolio?.bio}
        </p>
        <p
          className={`text-lg ${theme.subtext} hover:translate-x-2 transition duration-300`}
        >
          🧠 I specialize in {portfolio?.skills?.join(", ")}.
        </p>
        <p
          className={`text-lg ${theme.subtext} hover:translate-x-2 transition duration-300`}
        >
          🚀{" "}
          {portfolio?.home_subtitle?.includes(portfolio?.name)
            ? "Passionate about creating amazing digital experiences"
            : portfolio?.home_subtitle ||
              "Passionate about creating amazing digital experiences"}
        </p>
        <p
          className={`text-lg ${theme.subtext} hover:translate-x-2 transition duration-300`}
        >
          💬 Let&apos;s work together to bring your ideas to life!
        </p>
      </div>
    </section>
  );
}
