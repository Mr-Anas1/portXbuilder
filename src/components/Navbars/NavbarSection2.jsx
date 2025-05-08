"use client";

import React, { useState } from "react";
import { Menu, X, Github, Linkedin } from "lucide-react";
import { previewThemes } from "@/components/ui/previewThemes";

const NavbarSection2 = ({ theme, handleScrollToSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = ["Home", "About", "Projects", "Contact"];

  return (
    <div
      className={`h-20 w-full ${theme.bg} ${theme.shadow}  px-6 py-4`}
      id="navbar"
    >
      <div className="max-w-7xl h-full mx-auto flex items-center justify-between">
        {/* Left: Name */}
        <div className={`text-xl font-bold ${theme.text}`}>John Wick</div>

        {/* Center: Nav Links (Desktop) */}
        <ul
          className={`hidden md:flex gap-8 font-medium text-sm ${theme.text}`}
        >
          {navLinks.map((link, i) => (
            <li
              key={i}
              className={`cursor-pointer transition-all duration-300 ${theme.hoverText} hover:scale-105`}
              onClick={() => handleScrollToSection(link.toLowerCase())}
            >
              {link}
            </li>
          ))}
        </ul>

        {/* Right: Social Icons (Desktop) */}
        <div className={`hidden md:flex gap-4 ${theme.text}`}>
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

        {/* Hamburger Icon (Mobile) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`md:hidden ${theme.text}`}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center gap-4 mt-4 animate-fadeIn">
          {navLinks.map((link, i) => (
            <span
              key={i}
              className={`transition duration-300 text-sm ${theme.text} ${theme.hoverText}`}
            >
              {link}
            </span>
          ))}
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
        </div>
      )}
    </div>
  );
};

export default NavbarSection2;
