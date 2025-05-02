"use client";
import React, { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";

const NavbarSection4 = ({ theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = ["Home", "About", "Works"];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className={`w-full z-50 ${theme.bg} ${theme.shadow}`} id="navbar">
      <div className="flex items-center justify-between px-6 py-4 md:px-12">
        {/* Logo */}
        <div className={`text-xl font-bold z-50 ${theme.text}`}>John Wick</div>

        {/* Desktop Nav */}
        <ul
          className={`hidden md:flex gap-8 items-center text-sm font-medium ${theme.text}`}
        >
          {navLinks.map((link) => (
            <li
              key={link}
              className="inline-block min-w-[40px] text-center transition-all duration-300 cursor-pointer hover:font-semibold"
            >
              {link}
            </li>
          ))}

          <li>
            <button
              className={`px-5 py-2 rounded-full flex items-center gap-2 ${theme.buttonBg} ${theme.buttonText} transition duration-200 hover:scale-105`}
            >
              Contact <ArrowRight size={16} />
            </button>
          </li>
        </ul>

        {/* Mobile Menu Icon */}
        <div className="md:hidden z-50">
          <button onClick={toggleMenu}>
            {isOpen ? (
              <X size={26} className={theme.text} />
            ) : (
              <Menu size={26} className={theme.text} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 ${
          theme.bg
        } flex flex-col items-center justify-center gap-10 text-xl font-medium ${
          theme.text
        } transform transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {navLinks.map((link) => (
          <div
            key={link}
            onClick={toggleMenu}
            className="transition duration-200 cursor-pointer"
          >
            {link}
          </div>
        ))}
        <button
          onClick={toggleMenu}
          className={`px-6 py-2 rounded-full flex items-center gap-2 ${theme.buttonBg} ${theme.buttonText} transition`}
        >
          Contact <ArrowRight size={16} />
        </button>
      </div>
    </nav>
  );
};

export default NavbarSection4;
