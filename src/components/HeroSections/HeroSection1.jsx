"use client";

import Image from "next/image";
import { usePortfolio } from "@/context/PortfolioContext";

export default function HeroSection1({
  theme,
  handleScrollToSection,
  isMobileLayout,
  sectionRef,
}) {
  const isMobile = isMobileLayout;
  const { portfolio } = usePortfolio();

  return (
    <section
      ref={sectionRef}
      className={`w-full max-w-7xl mx-auto px-6 ${
        isMobile ? "py-12" : "py-16 md:py-24"
      } ${theme.bg}`}
      id="hero"
    >
      <div
        className={`max-w-7xl mx-auto flex ${
          isMobile ? "flex-col-reverse" : "flex-col-reverse md:flex-row"
        } items-center justify-between gap-10`}
      >
        {/* Left Content */}
        <div
          className={`${
            isMobile
              ? "text-center w-full"
              : "text-center md:text-left md:w-1/2"
          }`}
        >
          <h1
            className={`${
              isMobile ? "text-2xl" : "text-4xl md:text-5xl"
            } font-bold leading-tight ${theme.text}`}
          >
            {portfolio?.home_title || ""}
          </h1>
          <p
            className={`mt-4 ${isMobile ? "text-base" : "text-lg"} ${
              theme.subtext
            }`}
          >
            {portfolio?.home_subtitle || ""}
          </p>
          <div
            className={`mt-6 flex items-center ${
              isMobile ? "justify-center" : "justify-start"
            } gap-4`}
          >
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
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain z-0 rounded-xl"
            priority
          />

          {/* User Image */}
          <Image
            src={
              portfolio?.profileImage?.includes("supabase.co")
                ? portfolio.profileImage
                : "/default-avatar.png"
            }
            alt="User"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain z-10 rounded-xl"
            priority
          />

          {/* Floating Labels */}
          {!isMobile && (
            <>
              <div className="absolute z-20 top-[10%] left-[-20px] hidden sm:block">
                <span
                  className={`${theme.label1Bg} ${theme.label1Text} px-4 py-2 rounded-full shadow-md text-sm`}
                >
                  {portfolio?.skills?.[0] || ""}
                </span>
              </div>
              <div className="absolute z-20 top-[15%] right-[-10px] hidden sm:block">
                <span
                  className={`${theme.label2Bg} ${theme.label2Text} px-4 py-2 rounded-full shadow-md text-sm`}
                >
                  {portfolio?.skills?.[1] || ""}
                </span>
              </div>
              <div className="absolute z-20 bottom-[10%] right-[10%] hidden sm:block">
                <span
                  className={`${theme.label3Bg} ${theme.label3Text} px-4 py-2 rounded-full shadow-md text-sm`}
                >
                  {portfolio?.skills?.[2] || ""}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
