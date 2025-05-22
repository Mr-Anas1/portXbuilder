"use client";

import React from "react";
import { socialLinks } from "@/Helpers/SocialLinks";
import { usePortfolio } from "@/context/PortfolioContext";
import { useSocialLinks } from "@/hooks/useSocialLinks";

const ContactSection4 = ({ theme, isMobileLayout, sectionRef }) => {
  const { portfolio, loading } = usePortfolio();
  const socialLinks = useSocialLinks();

  return (
    <section
      ref={sectionRef}
      className={`w-full min-h-screen flex flex-col ${theme.bg} ${theme.text}`}
      id="contact"
    >
      {/* Top Half */}
      <div
        className={`${theme.accentBg} flex-1 flex flex-col justify-center items-center text-white text-center px-4`}
      >
        <p className="uppercase tracking-wide text-sm">Don't Be A Stranger</p>
        <h2 className="text-4xl md:text-5xl font-extrabold mt-2">
          Contact Me.
        </h2>
      </div>

      {/* Bottom Half */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div
          className={`w-full max-w-6xl grid ${
            isMobileLayout ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3"
          } gap-10 text-center`}
        >
          {/* Email */}
          <div>
            <p className="font-semibold text-lg mb-1">Email Address</p>
            <p className={`${theme.subtext} text-sm`}>{portfolio.email}</p>
          </div>

          {/* Phone */}
          <div>
            <p className="font-semibold text-lg mb-1">Phone Number</p>
            <p className={`${theme.subtext} text-sm`}>{portfolio.phone}</p>
          </div>

          {/* Social Icons */}
          <div>
            <p className="font-semibold text-lg mb-3">Connect With Me</p>
            <div
              className={`flex justify-center gap-5 flex-wrap ${
                isMobileLayout ? "justify-start gap-4" : "justify-center gap-5"
              }`}
            >
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className={`hover:scale-110 transition-transform ${theme.accentText}`}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection4;
