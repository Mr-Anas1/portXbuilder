"use client";
import React from "react";
import { FaSlack, FaEnvelope } from "react-icons/fa6";
import { socialLinks } from "../../Helpers/SocialLinks";

const ContactSection1 = ({ theme }) => {
  const contactItems = [
    {
      icon: <FaSlack className={`${theme.accentText} text-2xl`} />,
      title: "Give a Call",
      content: "8939402040",
      isLink: false,
    },
    {
      icon: <FaEnvelope className={`${theme.accentText} text-2xl`} />,
      title: "Email",
      content: "email@example.com",
      isLink: true,
      href: "mailto:business@jongde.com",
    },
  ];

  return (
    <section
      className={`${theme.bg} ${theme.text} py-16 px-4 text-center`}
      id="contact"
    >
      <h2 className="text-4xl font-semibold mb-2">CONTACT</h2>
      <div className={`w-8 h-[2px] ${theme.accentText} mx-auto mb-8`}></div>

      <div
        className={`max-w-3xl mx-auto rounded-xl shadow-md px-6 py-10 space-y-6 ${theme.bg} ${theme.text} shadow-lg`}
      >
        {contactItems.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-4 flex-wrap sm:flex-nowrap sm:items-center"
          >
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

        {/* Social Icons */}
        <div className="pt-6 flex justify-center gap-6">
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
