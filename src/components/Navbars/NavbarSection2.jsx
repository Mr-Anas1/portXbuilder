"use client";

import React, { useState } from "react";
import { Menu, X, Github, Linkedin } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

const NavbarSection2 = ({
  theme,
  handleScrollToSection,
  isMobileLayout,
  sectionRef,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = ["Home", "About", "Projects", "Contact"];
  const toggleMenu = () => setIsOpen(!isOpen);

  const { portfolio, loading } = usePortfolio();

  return (
    <nav
      ref={sectionRef}
      className={`w-full max-w-7xl mx-auto ${theme.bg} ${theme.shadow}`}
      id="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className={`text-xl font-bold ${theme.text}`}>
            {portfolio?.name || "Portfolio"}
          </div>

          {/* Desktop Nav Links */}
          {!isMobileLayout && (
            <ul className={`flex gap-8 font-medium text-sm ${theme.text}`}>
              {navLinks.map((link, i) => (
                <li
                  key={i}
                  className={`cursor-pointer transition duration-300 ${theme.hoverText} hover:scale-105`}
                  onClick={() => handleScrollToSection(link.toLowerCase())}
                >
                  {link}
                </li>
              ))}
            </ul>
          )}

          {/* Desktop Socials */}
          {!isMobileLayout && (
            <div className={`flex gap-4 ${theme.text} hidden`}>
              {portfolio?.github && (
                <a
                  href={portfolio.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transition ${theme.hoverText}`}
                >
                  <Github />
                </a>
              )}
              {portfolio?.linkedin && (
                <a
                  href={portfolio.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transition ${theme.hoverText}`}
                >
                  <Linkedin />
                </a>
              )}
            </div>
          )}

          {/* Mobile Toggle Button */}
          {isMobileLayout && (
            <button onClick={toggleMenu} className={`${theme.text}`}>
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isMobileLayout && (
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? "max-h-96 py-6" : "max-h-0"
          } flex flex-col items-center gap-6 text-sm font-medium ${theme.bg} ${
            theme.text
          }`}
        >
          {navLinks.map((link, i) => (
            <span
              key={i}
              onClick={() => {
                handleScrollToSection(link.toLowerCase());
                toggleMenu();
              }}
              className={`cursor-pointer transition duration-200 ${theme.hoverText}`}
            >
              {link}
            </span>
          ))}
          <div className="flex gap-6">
            {portfolio?.github && (
              <a
                href={portfolio.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`transition ${theme.hoverText}`}
              >
                <Github />
              </a>
            )}
            {portfolio?.linkedin && (
              <a
                href={portfolio.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`transition ${theme.hoverText}`}
              >
                <Linkedin />
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarSection2;
