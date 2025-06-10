"use client";
import React from "react";
import { FaEnvelope } from "react-icons/fa6";
import { cloneElement } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { useSocialLinks } from "@/hooks/useSocialLinks";

const ContactSection3 = ({ theme, isMobileLayout, sectionRef }) => {
  const { portfolio, loading } = usePortfolio();
  const socialLinks = useSocialLinks();

  return (
    <section
      ref={sectionRef}
      className={`flex max-w-7xl mx-auto flex-col items-center justify-center text-center py-20 px-4 ${theme.text} ${theme.bg} min-h-screen`}
      id="contact"
    >
      <p className={`text-sm font-semibold ${theme.subtext}`}>
        Get in <span className={theme.accentText}>Touch</span>
      </p>
      <h2 className="text-4xl font-bold mt-1 mb-6">Contact Me</h2>

      {/* Email Box */}
      <a
        href="mailto:mohamed.anas.l7a@gmail.com"
        className={`flex items-center justify-center border px-4 py-2 rounded-md shadow-sm hover:shadow-md transition text-sm sm:text-base ${theme.subtext}`}
      >
        <FaEnvelope className="mr-2" size={20} />
        <span>{portfolio?.email || "email"}</span>
      </a>

      {/* Social Icons */}
      <div
        className={`flex flex-wrap justify-center gap-6 mt-6 ${
          isMobileLayout ? "justify-start gap-4" : "justify-center gap-6"
        }`}
      >
        {socialLinks.map((item, idx) => (
          <a
            key={idx}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            className={`hover:scale-110 transition-transform ${theme.accentText}`}
          >
            {cloneElement(item.icon, {
              className: "text-2xl",
            })}
          </a>
        ))}
      </div>
    </section>
  );
};

export default ContactSection3;
