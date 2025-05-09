"use client";
import React from "react";
import { socialLinks } from "@/Helpers/SocialLinks";
import { cloneElement } from "react";

const ContactSection2 = ({ theme, isMobileLayout }) => {
  return (
    <section
      className={`${theme.bg} ${theme.text} min-h-screen px-4 flex flex-col justify-center items-center`}
      id="contact"
    >
      <div className="flex flex-col justify-center items-center text-center h-full py-16">
        <h2 className={`text-4xl font-bold mb-4 ${theme.accentText}`}>
          Contact Us
        </h2>
        <p className={`${theme.subtext} mb-12`}>
          Get in touch with us or follow our social profiles
        </p>

        <div
          className={`grid ${
            isMobileLayout
              ? "grid-cols-2 gap-6"
              : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-16"
          } max-w-6xl mx-auto`}
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
                className={`w-16 h-16 flex items-center justify-center rounded-full bg-gray-200
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
