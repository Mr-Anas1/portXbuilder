"use client";
import React from "react";
import { usePortfolio } from "@/context/PortfolioContext";

const AboutUsSection1 = ({ theme, isMobileLayout }) => {
  const { portfolio, loading } = usePortfolio();

  if (loading) return <p>Loading...</p>;
  if (!portfolio) return <p>No portfolio data found.</p>;
  return (
    <section
      className={`min-h-screen flex flex-col ${
        isMobileLayout ? "" : "md:flex-row"
      } ${theme.bg} ${theme.text}`}
      id="about"
    >
      {/* Left Section with Highlighted Intro */}
      <div
        className={`w-full ${
          isMobileLayout ? "md:px-6" : "md:w-1/2"
        } flex flex-col justify-center px-8 py-16 md:px-16 ${
          theme.buttonBg
        } text-white`}
      >
        <p className="text-sm uppercase font-medium mb-2">
          Hello, I'm {portfolio.name}!
        </p>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
          {portfolio.bio}
        </h1>
      </div>

      {/* Right Section with More Info */}
      <div
        className={`w-full ${
          isMobileLayout ? "md:px-6" : "md:w-1/2"
        } flex flex-col justify-center px-8 py-16 md:px-16`}
      >
        <h2 className={`text-2xl font-semibold mb-4 ${theme.accentText || ""}`}>
          What I Do
        </h2>
        <p className="text-base leading-relaxed mb-4">{portfolio.about_me}</p>
      </div>
    </section>
  );
};

export default AboutUsSection1;
