"use client";
import React from "react";
import { cloneElement } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { useSocialLinks } from "@/hooks/useSocialLinks";

const ContactSection2 = ({ theme, isMobileLayout, sectionRef }) => {
  const { portfolio, loading } = usePortfolio();
  const socialLinks = useSocialLinks();
  return (
    <section
      ref={sectionRef}
      className={`${theme.bg} ${theme.text} max-w-7xl mx-auto min-h-screen px-4 flex flex-col justify-center items-center`}
      id="contact"
    >
      <div className="flex flex-col justify-center items-center text-center h-full py-16">
        <h2 className={`text-4xl font-bold mb-4 ${theme.accentText}`}>
          Contact Me
        </h2>
        <p className={`${theme.subtext} mb-12`}>
          Get in touch with us or follow our social profiles
        </p>

        <div
          className={`flex flex-wrap justify-center items-center gap-6 md:gap-10 lg:gap-16 max-w-6xl mx-auto`}
        >
          {socialLinks.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center space-y-2 group transition-all duration-300 hover:scale-[1.05]"
            >
              <div
                className={`w-16 h-16 flex items-center justify-center rounded-full bg-gray-500
                group-hover:${theme.buttonBg} group-hover:${theme.buttonText} transition`}
              >
                {cloneElement(item.icon, {
                  className: "text-2xl",
                })}
              </div>
              <p
                className={`text-xs font-bold tracking-widest ${theme.subtext}`}
              >
                {item.title}
              </p>
              <span className={`text-sm ${theme.accentText}`}>
                {item.subtitle}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactSection2;
