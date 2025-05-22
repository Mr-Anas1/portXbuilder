"use client";

import React from "react";
import { FaClock } from "react-icons/fa";
import { socialLinks } from "@/Helpers/SocialLinks";
import { usePortfolio } from "@/context/PortfolioContext";
import { useSocialLinks } from "@/hooks/useSocialLinks";

const ContactSection5 = ({ theme, isMobileLayout, sectionRef }) => {
  const { portfolio, loading } = usePortfolio();
  const socialLinks = useSocialLinks();

  return (
    <section
      ref={sectionRef}
      className={`w-full min-h-screen flex flex-col justify-between ${theme.text} ${theme.bg}`}
      id="contact"
    >
      {/* Centered Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 text-center">
        <p className={`text-sm mb-2 ${theme.subtext}`}>Want To Collaborate?</p>
        <h2
          className={`text-4xl md:text-5xl font-extrabold mb-12 ${theme.accentText}`}
        >
          Contact
        </h2>

        {/* Contact Row */}
        <div
          className={`grid ${
            isMobileLayout ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
          } gap-8 items-center max-w-4xl w-full`}
        >
          {/* Email */}
          <div
            className={`text-center ${isMobileLayout ? "" : "md:text-left"}`}
          >
            <p className="text-lg text-center font-semibold">
              {portfolio.email}
            </p>
          </div>

          {/* Phone */}
          <div
            className={`text-center ${isMobileLayout ? "" : "md:text-right"}`}
          >
            <div className="flex justify-center md:justify-center items-center gap-3">
              <FaClock className="text-xl" />
              <div>
                <p className="font-semibold">{portfolio.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Icons */}
      <div
        className={`py-6 flex justify-center gap-5 text-xl ${theme.accentText}`}
      >
        {socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className="hover:scale-110 transition-transform"
          >
            {link.icon}
          </a>
        ))}
      </div>
    </section>
  );
};

export default ContactSection5;
