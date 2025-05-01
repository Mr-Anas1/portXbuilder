"use client";

import React, { useState } from "react";
import { Menu, X, Github, Linkedin } from "lucide-react";

const NavbarSection2 = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = ["Home", "About", "Projects", "Contact"];

  return (
    <div className="h-20 w-full bg-white shadow-md z-50 px-6 py-4" id="navbar">
      <div className="max-w-7xl h-full mx-auto flex items-center justify-between">
        {/* Left: Name */}
        <div className="text-xl font-bold text-gray-800">John Wick</div>

        {/* Center: Nav Links (Desktop) */}
        <ul className="hidden md:flex gap-8 text-gray-700 font-medium text-sm">
          {navLinks.map((link, i) => (
            <li
              key={i}
              className="cursor-pointer transition-all duration-300 hover:text-blue-600 hover:scale-105"
            >
              {link}
            </li>
          ))}
        </ul>

        {/* Right: Social Icons (Desktop) */}
        <div className="hidden md:flex gap-4 text-gray-600">
          <a
            href="https://github.com"
            target="_blank"
            className="hover:text-blue-600 transition"
          >
            <Github />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            className="hover:text-blue-600 transition"
          >
            <Linkedin />
          </a>
        </div>

        {/* Hamburger Icon (Mobile) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700"
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
              className="text-gray-700 hover:text-blue-600 transition duration-300 text-sm"
            >
              {link}
            </span>
          ))}
          <div className="flex gap-4 text-gray-600">
            <a
              href="https://github.com"
              target="_blank"
              className="hover:text-blue-600 transition"
            >
              <Github />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              className="hover:text-blue-600 transition"
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
