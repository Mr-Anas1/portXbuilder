"use client";

import React, { useState } from "react";
import { Menu, X, Github, Linkedin } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

const NavbarSection2 = ({ theme, handleScrollToSection, isMobileLayout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = ["Home", "About", "Projects", "Contact"];
  const toggleMenu = () => setIsOpen(!isOpen);

  const { portfolio, loading } = usePortfolio();

  if (loading) return <p>Loading...</p>;
  if (!portfolio) return <p>No portfolio data found.</p>;
  return (
    <nav className={`w-full ${theme.bg} ${theme.shadow}`} id="navbar">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-6">
        {/* Logo */}
        <div className={`text-xl font-bold ${theme.text}`}>
          {portfolio.name}
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
          <div className={`flex gap-4 ${theme.text}`}>
            <a
              href="https://github.com"
              target="_blank"
              className={`transition ${theme.hoverText}`}
            >
              <Github />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              className={`transition ${theme.hoverText}`}
            >
              <Linkedin />
            </a>
          </div>
        )}

        {/* Mobile Toggle Button */}
        {isMobileLayout && (
          <button onClick={toggleMenu} className={`${theme.text}`}>
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        )}
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
            <a
              href={portfolio.github}
              target="_blank"
              className={`transition ${theme.hoverText}`}
            >
              <Github />
            </a>
            <a
              href={portfolio.linkedin}
              target="_blank"
              className={`transition ${theme.hoverText}`}
            >
              <Linkedin />
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarSection2;
