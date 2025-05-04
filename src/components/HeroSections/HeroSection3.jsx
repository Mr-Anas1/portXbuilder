"use client";

import Image from "next/image";
import { previewThemes } from "../ui/previewThemes";

export default function HeroSection3({ theme }) {
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
        className={`w-full h-[calc(100vh-64px)] flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 md:px-12 lg:px-24 py-8 sm:py-12 gap-6 sm:gap-10 ${theme.bg}`}
      >
        {/* Left Content */}
        <div
          className="flex-1 w-full text-center md:text-left animate-fadeInDown"
          style={{ animation: "fadeInDown 0.8s ease-out" }}
        >
          <div className="flex flex-col gap-3 sm:gap-4 items-center md:items-start">
            <h1
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold ${theme.text}`}
            >
              Hello, I'm{" "}
              <span className={`font-bold ${theme.accentText}`}>
                Mohamed Anas
              </span>
            </h1>

            <h2
              className={`text-xl sm:text-2xl md:text-3xl font-semibold ${theme.subtext}`}
            >
              A Passionate Frontend Developer
            </h2>

            <p
              className={`${theme.subtext} max-w-md text-sm sm:text-base`}
              style={{
                animation: "fadeInUp 1s ease-out",
                animationDelay: "0.3s",
                animationFillMode: "both",
              }}
            >
              With a love for building visually engaging and responsive
              websites, I blend creativity with code to bring designs to life.
            </p>

            <a
              href="#projects"
              className={`mt-4 ${theme.buttonBg} ${theme.buttonHover} ${theme.buttonText} font-medium px-4 sm:px-6 py-2 sm:py-3 rounded-md shadow-lg transition text-sm sm:text-base`}
              style={{
                animation: "fadeInUp 1s ease-out",
                animationDelay: "0.5s",
                animationFillMode: "both",
              }}
            >
              Browse Projects
            </a>
          </div>
        </div>

        {/* Right Side Image */}
        <div
          className="flex-1 w-full flex justify-center md:justify-end relative"
          style={{ animation: "scaleIn 0.8s ease-in-out" }}
        >
          <div className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] mx-auto mt-8 sm:mt-12 md:mt-20">
            <Image
              src="/images/bg-2.png"
              alt="Background Decoration"
              fill
              className="object-cover z-0 rounded-xl"
              priority
            />

            <div className="absolute inset-0 flex items-center justify-center z-10">
              <Image
                src="/images/no-bg.png"
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
