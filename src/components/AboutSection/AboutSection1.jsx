"use client";
import React from "react";

const AboutUsSection1 = ({ theme, isMobileLayout }) => {
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
        <p className="text-sm uppercase font-medium mb-2">Hello, I'm George!</p>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
          Here to take your <br /> Social Media to <br /> another level
        </h1>
        <p className={`text-sm md:text-base leading-relaxed text-white`}>
          I help brands grow with creative strategies and effective design.
        </p>
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
        <p className="text-base leading-relaxed mb-4">
          With years of experience in content creation and digital design, I
          work with clients to craft compelling brand stories and engaging user
          experiences. Whether it's building a brand identity, creating social
          campaigns, or designing websites, I bring energy and clarity to every
          project.
        </p>
        <p className="text-base leading-relaxed">
          My mission is simple — help you connect with your audience in a way
          that feels natural, modern, and unforgettable.
        </p>
      </div>
    </section>
  );
};

export default AboutUsSection1;
