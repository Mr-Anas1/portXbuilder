"use client";
import React from "react";

export default function HomeSection5({ theme, handleScrollToSection }) {
  return (
    <section
      className={`min-h-screen flex flex-col gap-4 md:flex-row items-center justify-center md:justify-between px-6 md:px-16 py-12 ${theme.bg} ${theme.text}`}
    >
      {/* Left Side: Image + Heading */}
      <div className="flex items-center flex-col justify-center space-x-4 w-full md:w-1/2 mb-10 md:mb-0">
        <div className="flex flex-col gap-2 items-center md:items-start">
          <img
            src="/images/no-bg.png"
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <h1 className="text-3xl text-center md:text-start md:text-5xl font-semibold leading-snug">
            Hello! I’m <br /> Mohamed Anas
          </h1>
        </div>
      </div>

      {/* Right Side: Description + Buttons */}
      <div className="w-full md:w-1/2 text-center md:text-left">
        <p className="text-xl font-medium">
          A Website designer based in <br /> India.
        </p>
        <p className={`text-sm mt-2 ${theme.subtext}`}>
          Passionate creating great experiences for Web Development.
        </p>

        <div className="flex justify-center md:justify-start space-x-4 mt-6">
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
            className={`border px-5 py-2 rounded-xl transition ${theme.text} border-current hover:${theme.accentText} hover:border-current`}
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
