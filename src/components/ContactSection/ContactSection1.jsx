"use client";
import React from "react";
import { FaSlack, FaEnvelope } from "react-icons/fa6";
import { socialLinks } from "../../Helpers/SocialLinks";
import { FaPhone } from "react-icons/fa";

const ContactSection1 = ({ theme }) => {
  const contactItems = [
    {
      icon: <FaPhone className={`text-2xl ${theme.accentText}`} />,
      title: "Give a Call",
      content: "8939402040",
      isLink: false,
    },
    {
      icon: <FaEnvelope className={`text-2xl ${theme.accentText}`} />,
      title: "Email",
      content: "email@example.com",
      isLink: true,
      href: "mailto:business@jongde.com",
    },
  ];

  return (
    <section
      className={`${theme.bg} ${theme.text} py-16 px-4 text-center min-h-screen flex flex-col items-center justify-center`}
      id="contact"
    >
      <h2 className={`text-4xl font-semibold mb-2 ${theme.accentText}`}>
        CONTACT
      </h2>
      <div className={`w-8 h-[2px] ${theme.accentText} mx-auto mb-8`} />

      <div
        className={`w-full max-w-xl mx-auto rounded-xl shadow-lg px-6 py-10 ${theme.bg} ${theme.text}`}
      >
        <div className="flex flex-col gap-y-6">
          {contactItems.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              {item.icon}
              <div className="text-left">
                <p className="font-semibold">{item.title}</p>
                {item.isLink ? (
                  <a
                    href={item.href}
                    className={`font-medium transition border-b border-transparent hover:${theme.accentText} hover:border-current`}
                  >
                    {item.content}
                  </a>
                ) : (
                  <p className={`transition hover:${theme.accentText}`}>
                    {item.content}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Social Icons */}
        <div className="pt-8 flex justify-center gap-6 flex-wrap">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {React.cloneElement(link.icon, {
                className: `text-2xl ${theme.text} hover:${theme.accentText} transition-all duration-300`,
              })}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactSection1;
