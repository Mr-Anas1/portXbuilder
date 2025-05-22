"use client";

import { usePortfolio } from "@/context/PortfolioContext";
import Image from "next/image";

export default function HeroSection3({
  theme,
  handleScrollToSection,
  isMobileLayout,
  sectionRef,
}) {
  const { portfolio } = usePortfolio();

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

      <section
        ref={sectionRef}
        className={`w-full ${
          isMobileLayout ? "py-12" : "h-[calc(100vh-64px)] py-8"
        } flex flex-col-reverse ${
          isMobileLayout ? "" : "md:flex-row"
        } items-center justify-between gap-6 sm:gap-10 ${theme.bg}`}
      >
        {/* Left Content */}
        <div
          className={`flex-1 w-full ${
            isMobileLayout ? "text-center" : "text-left animate-fadeInDown"
          }`}
          style={
            isMobileLayout ? {} : { animation: "fadeInDown 0.8s ease-out" }
          }
        >
          <div
            className={`flex flex-col gap-3 sm:gap-4 ${
              isMobileLayout ? "items-center" : "items-start"
            }`}
          >
            <h1
              className={`font-bold ${theme.text} ${
                isMobileLayout
                  ? "text-3xl"
                  : "text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
              }`}
            >
              Hello, I'm{" "}
              <span className={`font-bold ${theme.accentText}`}>
                {portfolio?.name}
              </span>
            </h1>

            <h2
              className={`font-semibold ${theme.subtext} ${
                isMobileLayout ? "text-lg" : "text-xl sm:text-2xl md:text-3xl"
              }`}
            >
              A Passionate {portfolio?.profession}
            </h2>

            <p
              className={`${theme.subtext} max-w-md ${
                isMobileLayout ? "text-sm text-center" : "text-base text-left"
              }`}
            >
              With a love for building visually engaging and responsive
              websites, I blend creativity with code to bring designs to life.
            </p>

            <a
              href="#projects"
              className={`mt-4 ${theme.buttonBg} ${theme.buttonHover} ${theme.buttonText} font-medium px-4 sm:px-6 py-2 sm:py-3 rounded-md shadow-lg transition text-sm sm:text-base`}
              onClick={(e) => {
                e.preventDefault();
                handleScrollToSection("projects");
              }}
            >
              Browse Projects
            </a>
          </div>
        </div>

        {/* Right Side Image */}
        <div
          className={`flex-1 w-full flex justify-center  ${
            isMobileLayout ? "" : "md:justify-start"
          }`}
          style={
            isMobileLayout ? {} : { animation: "scaleIn 0.8s ease-in-out" }
          }
        >
          <div
            className={`relative ${
              isMobileLayout
                ? "w-[250px] h-[250px]"
                : "w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]"
            } mx-auto mt-8 sm:mt-2 md:mt-2`}
          >
            <Image
              src="/images/bg-2.png"
              alt="Background Decoration"
              fill
              className="object-cover z-0 rounded-xl"
              priority
            />
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <Image
                src={portfolio?.profileImage || "/default-avatar.png"}
                alt="User"
                width={280}
                height={308}
                className="rounded-xl object-contain w-full h-full"
                priority
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
