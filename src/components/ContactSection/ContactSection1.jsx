"use client";

import React from "react";
import { FaEnvelope, FaPhone } from "react-icons/fa6";
import { usePortfolio } from "@/context/PortfolioContext";
import { useSocialLinks } from "@/hooks/useSocialLinks";

const ContactSection1 = ({ theme, isMobileLayout }) => {
  const { portfolio, loading } = usePortfolio();
  const socialLinks = useSocialLinks();

  const contactItems = [
    {
      icon: <FaPhone className={`text-2xl ${theme.accentText}`} />,
      title: "Give a Call",
      content: portfolio?.phone || "Not provided",
      isLink: false,
    },
    {
      icon: <FaEnvelope className={`text-2xl ${theme.accentText}`} />,
      title: "Email",
      content: portfolio?.email || "Not provided",
      isLink: true,
      href: "mailto:portXbuilder@gmail.com",
    },
  ];

  return (
    <section
      id="contact"
      className={`${theme.bg} ${theme.text} py-16 px-4 flex flex-col items-center justify-center text-center min-h-screen`}
    >
      {/* Heading */}
      <h2 className={`text-4xl font-semibold mb-2 ${theme.accentText}`}>
        CONTACT
      </h2>
      <div className={`w-8 h-[2px] ${theme.accentText} mx-auto mb-10`} />

      {/* Contact Box */}
      <div
        className={`w-full max-w-xl mx-auto rounded-xl shadow-lg px-6 py-10 ${theme.bg} ${theme.text} transition-all duration-300`}
      >
        <div className="flex flex-col gap-8">
          {contactItems.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              {item.icon}
              <div className="text-left">
                <p className="font-semibold">{item.title}</p>
                {item.isLink ? (
                  <a
                    href={item.href}
                    className={`font-medium transition-all border-b border-transparent hover:${theme.accentText} hover:border-current`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.content}
                  </a>
                ) : (
                  <p className={`transition-all hover:${theme.accentText}`}>
                    {item.content}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Social Icons */}
        <div className="pt-10 flex justify-center gap-6 flex-wrap">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label || "Social link"}
              className={`hover:scale-110 transition-transform ${theme.accentText}`}
            >
              {React.cloneElement(link.icon, {
                className: `text-2xl ${theme.accentText} transition-all duration-300`,
              })}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactSection1;
