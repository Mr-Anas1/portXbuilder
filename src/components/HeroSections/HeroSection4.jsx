"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function HeroSection4({ theme, handleScrollToSection }) {
  const [text, setText] = useState("");
  const name = "Mohamed Anas";
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
      className={`w-full h-[calc(100vh-64px)] ${theme.bg} flex flex-col md:flex-row items-center justify-between px-6 md:px-24 py-16 gap-12`}
    >
      {/* Left Text Section */}
      <div className="flex-1 w-full text-center md:text-left">
        <div className="flex flex-col gap-6 items-center md:items-start">
          <h1
            className={`text-4xl md:text-6xl font-bold ${theme.text} leading-tight`}
          >
            Hi, I'm <br />{" "}
            <span className={`${theme.accentText} relative inline-block`}>
              {text}
              <span
                className={`inline-block w-[2px] h-8 ${
                  theme.cursorColor
                } ml-1 ${isTyping ? "animate-blink" : "hidden"}`}
              ></span>
            </span>{" "}
            <br />
            Frontend Developer
          </h1>

          <a
            href="#contact"
            className={`${theme.buttonBg} ${theme.buttonHover} ${theme.buttonText} transition font-medium px-6 py-3 rounded-md shadow-lg hover:scale-105 transform duration-300`}
            onClick={(e) => {
              e.preventDefault();
              handleScrollToSection("contact");
            }}
          >
            Contact
          </a>
        </div>
      </div>

      {/* Right Image in a blob shape */}
      <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] mx-auto mt-10 md:mt-20">
        <div
          className={`absolute inset-0 ${theme.buttonBg} rounded-[42%_58%_70%_30%_/_40%_45%_55%_60%]`}
        ></div>
        <div className="relative w-full h-full">
          <Image
            src="/images/no-bg.png"
            alt="User"
            width={550}
            height={550}
            className="w-full h-full object-cover rounded-[42%_58%_70%_30%_/_40%_45%_55%_60%] transform duration-500"
            priority
          />
        </div>
      </div>
    </section>
  );
}
