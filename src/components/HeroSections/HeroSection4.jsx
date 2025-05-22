"use client";

import { usePortfolio } from "@/context/PortfolioContext";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function HeroSection4({
  theme,
  handleScrollToSection,
  isMobileLayout,
  sectionRef,
}) {
  const { portfolio } = usePortfolio();
  const [text, setText] = useState("");
  const name = portfolio?.name;
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= name.length) {
        setText(name.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 150);

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`w-full h-[calc(100vh-64px)] ${
        theme.bg
      } flex flex-col-reverse ${
        isMobileLayout
          ? "items-center flex-col-reverse text-center justify-center py-12 gap-8 h-[calc(100vh-64px)]"
          : "md:flex-row items-center justify-center py-16 gap-8 h-[calc(100vh-64px)]"
      }`}
    >
      {/* Left Text Section */}
      <div
        className={`flex-1 w-full ${
          isMobileLayout ? "text-center" : "text-left"
        }`}
      >
        <div
          className={`flex flex-col ${
            isMobileLayout ? "gap-4 items-center" : "gap-6 items-start"
          }`}
        >
          <h1
            className={`${
              isMobileLayout
                ? "text-3xl leading-snug"
                : "text-4xl md:text-6xl leading-tight"
            } font-bold ${theme.text}`}
          >
            Hi, I'm <br />
            <span className={`${theme.accentText} relative inline-block`}>
              {text}
              <span
                className={`inline-block w-[2px] h-6 ${
                  theme.cursorColor
                } ml-1 ${isTyping ? "animate-blink" : "hidden"}`}
              ></span>
            </span>{" "}
            <br />
            {portfolio?.profession}
          </h1>

          <a
            href="#contact"
            className={`${theme.buttonBg} ${theme.buttonHover} ${
              theme.buttonText
            } transition font-medium ${
              isMobileLayout ? "px-5 py-2 text-sm" : "px-6 py-3 text-base"
            } rounded-md shadow-lg hover:scale-105 transform duration-300`}
            onClick={(e) => {
              e.preventDefault();
              handleScrollToSection("contact");
            }}
          >
            Contact
          </a>
        </div>
      </div>

      {/* Right Image Section */}
      <div
        className={`relative ${
          isMobileLayout
            ? "w-[250px] h-[250px] mt-10"
            : "w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] mt-20"
        } mx-auto`}
      >
        <div
          className={`absolute inset-0 ${theme.buttonBg} rounded-[42%_58%_70%_30%_/_40%_45%_55%_60%]`}
        ></div>
        <div className="relative w-full h-full">
          <Image
            src={portfolio?.profileImage || "/default-avatar.png"}
            alt="Profile picture"
            width={550}
            height={550}
            className="w-full h-full object-cover rounded-[42%_58%_70%_30%_/_40%_45%_55%_60%]"
            priority
          />
        </div>
      </div>
    </section>
  );
}
