"use client";
import { usePortfolio } from "@/context/PortfolioContext";
import Image from "next/image";
import React from "react";

export default function HomeSection5({
  theme,
  handleScrollToSection,
  isMobileLayout,
  sectionRef,
}) {
  const { portfolio, loading } = usePortfolio();

  return (
    <section
      ref={sectionRef}
      className={`min-h-screen max-w-7xl mx-auto px-6 flex flex-col ${
        isMobileLayout
          ? "gap-8 items-center justify-center text-center py-10"
          : "md:flex-row items-center justify-between gap-4 py-12 text-left"
      } ${theme.bg} ${theme.text}`}
    >
      {/* Left Side: Image + Heading */}
      <div
        className={`flex flex-col items-center ${
          isMobileLayout ? "w-full mb-8" : "md:w-1/2 items-start mb-0"
        }`}
      >
        <div>
          <Image
            src={portfolio?.profileImage || "/default-avatar.png"}
            alt="Profile"
            width={48}
            height={48}
            className={`w-12 h-12 rounded-full object-cover ${
              isMobileLayout ? "mx-auto" : "mx-0"
            }`}
          />
          <h1
            className={`${
              isMobileLayout ? "text-3xl" : "text-5xl"
            } font-semibold leading-snug mt-2`}
          >
            Hello! I&apos;m <br /> {portfolio?.name}
          </h1>
        </div>
      </div>

      {/* Right Side: Description + Buttons */}
      <div
        className={`${
          isMobileLayout ? "w-full text-center" : "md:w-1/2 text-left"
        }`}
      >
        <p className="text-xl font-medium">
          A {portfolio?.profession} based in <br /> {portfolio?.location}.
        </p>
        <p className={`text-sm mt-2 ${theme.subtext}`}>
          {portfolio?.home_subtitle}
        </p>

        <div
          className={`flex mt-6 ${
            isMobileLayout
              ? "justify-center flex-col gap-3"
              : "justify-start space-x-4"
          }`}
        >
          <button
            className={`px-5 py-2 rounded-xl transition ${theme.buttonBg} ${theme.buttonText} ${theme.buttonHover}`}
            onClick={(e) => {
              e.preventDefault();
              handleScrollToSection("contact");
            }}
          >
            Talk with me
          </button>
          <button
            className={`border px-5 py-2 rounded-xl transition ${
              theme.text
            } border-current hover:${theme.accentText} hover:border-current ${
              isMobileLayout ? "" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              handleScrollToSection("projects");
            }}
          >
            See my work
          </button>
        </div>
      </div>
    </section>
  );
}
