"use client";

import { usePortfolio } from "@/context/PortfolioContext";
import { useEffect, useState } from "react";

export default function HeroSection2({
  theme,
  handleScrollToSection,
  isMobileLayout,
  sectionRef,
}) {
  const isMobile = isMobileLayout;
  const { portfolio } = usePortfolio();
  const fullText = portfolio?.name || "";
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!fullText) return; // Don't start animation if no text

    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 150);

    return () => clearInterval(interval);
  }, [fullText]); // Add fullText as dependency

  return (
    <section
      ref={sectionRef}
      className={`w-full max-w-7xl mx-auto px-6 ${
        isMobile
          ? "h-[calc(100vh-64px)] py-16 px-6"
          : "h-[calc(100vh-64px)] px-6 md:px-28"
      } flex items-center ${theme.bg}`}
      id="hero"
    >
      <div className="flex-1">
        <h1
          className={`${
            isMobile
              ? "text-3xl text-center "
              : "text-4xl md:text-6xl lg:text-8xl text-center md:text-left"
          } font-bold leading-tight ${theme.text}`}
        >
          Hi, I&apos;m{" "}
          <span
            className={`border-r-2 animate-pulse ${theme.accentText} border-current`}
          >
            {displayedText}
          </span>
        </h1>

        <div
          className={`flex flex-col ${
            isMobile ? "items-center" : "items-start"
          } mt-6`}
        >
          <p
            className={`${
              isMobile
                ? "text-base text-center"
                : "text-lg md:text-xl text-left"
            } max-w-2xl ${theme.subtext}`}
          >
            {portfolio?.bio}
          </p>

          <a
            href="#contact"
            className={`mt-8 inline-flex items-center text-lg font-medium group ${theme.accentText}`}
            onClick={(e) => {
              e.preventDefault();
              handleScrollToSection("contact");
            }}
          >
            Let&apos;s Collaborate
            <span className="ml-2 transform group-hover:translate-x-1 transition-transform">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
