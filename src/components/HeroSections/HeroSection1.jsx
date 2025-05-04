"use client";

import Image from "next/image";

export default function HeroSection1({ theme, handleScrollToSection }) {
  return (
    <section className={`w-full px-12 py-16 md:py-24 ${theme.bg}`} id="hero">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-10">
        {/* Left Content */}
        <div className="text-center md:text-left md:w-1/2">
          <h1
            className={`text-4xl md:text-5xl font-bold leading-tight ${theme.text}`}
          >
            Designing for <br />
            <span className={theme.accentText}>Amazing People</span>
          </h1>
          <p className={`mt-4 text-lg ${theme.subtext}`}>
            Designing user interfaces for over 10 years as visual designer
          </p>
          <div className="mt-6 flex items-center justify-center md:justify-start gap-4">
            <button
              className={`px-6 py-3 rounded-full shadow-md transition ${theme.buttonBg} ${theme.buttonText} ${theme.buttonHover}`}
              onClick={(e) => {
                e.preventDefault();
                handleScrollToSection("contact");
              }}
            >
              Hire Me!
            </button>
          </div>
        </div>

        {/* Right Image Area */}
        <div className="relative w-full max-w-[500px] aspect-[5/5.5] mx-auto md:mx-0">
          {/* Background Decoration */}
          <Image
            src="/images/bg-1.png"
            alt="Background Decoration"
            layout="fill"
            className="object-contain z-0 rounded-xl"
            priority
          />

          {/* User Image */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Image
              src="/images/no-bg.png"
              alt="User"
              width={500}
              height={550}
              className="rounded-xl object-contain"
              priority
            />
          </div>

          {/* Floating Labels */}
          <div className="absolute z-20 top-[10%] left-[-20px] hidden sm:block">
            <span
              className={`${theme.label1Bg} ${theme.label1Text} px-4 py-2 rounded-full shadow-md text-sm`}
            >
              Webflow Developer
            </span>
          </div>

          <div className="absolute z-20 top-[15%] right-[-10px] hidden sm:block">
            <span
              className={`${theme.label2Bg} ${theme.label2Text} px-4 py-2 rounded-full shadow-md text-sm`}
            >
              UI/UX Designer
            </span>
          </div>

          <div className="absolute z-20 bottom-[10%] right-[10%] hidden sm:block">
            <span
              className={`${theme.label3Bg} ${theme.label3Text} px-4 py-2 rounded-full shadow-md text-sm`}
            >
              Product Designer
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
