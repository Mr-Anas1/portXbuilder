"use client";

import { useEffect, useState } from "react";

export default function HeroSection2({ theme }) {
  const fullText = "Mohamed Anas";
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className={`w-full min-h-screen flex items-center px-6 md:px-28 ${theme.bg}`}
      id="hero"
    >
      <div className="flex-1">
        <h1
          className={`text-4xl text-center md:text-6xl lg:text-8xl font-bold leading-tight ${theme.text}`}
        >
          Hi, I’m{" "}
          <span
            className={`border-r-2 animate-pulse ${theme.accentText} border-current`}
          >
            {displayedText}
          </span>
        </h1>

        <div className="flex flex-col items-center">
          <p
            className={`mt-6 text-lg md:text-xl max-w-2xl text-center md:text-left ${theme.subtext}`}
          >
            With 5 years of experience as a product designer in Japan, I bring a
            unique blend of creativity and technical expertise to the table.
          </p>

          <a
            href="#contact"
            className={`mt-8 inline-flex items-center text-lg font-medium group ${theme.accentText}`}
          >
            Let’s Collaborate
            <span className="ml-2 transform group-hover:translate-x-1 transition-transform">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
