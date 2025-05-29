"use client";
import React, { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

const NavbarSection4 = ({
  theme,
  handleScrollToSection,
  isMobileLayout,
  sectionRef,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = ["Home", "About", "Works"];
  const toggleMenu = () => setIsOpen(!isOpen);

  const { portfolio, loading } = usePortfolio();

  return (
    <nav
      className={`w-full ${theme.bg} ${theme.shadow}`}
      id="navbar"
      ref={sectionRef}
    >
      <div className="flex items-center justify-between px-6 py-4 md:px-12 max-w-7xl mx-auto">
        {/* Logo */}
        <div className={`text-xl font-bold ${theme.text}`}>
          {portfolio?.name}
        </div>

        {/* Navigation for Desktop */}
        {!isMobileLayout && (
          <ul
            className={`flex gap-8 items-center text-sm font-medium ${theme.text}`}
          >
            {navLinks.map((link, index) => (
              <li
                key={index}
                className="inline-block min-w-[40px] text-center transition-all duration-300 cursor-pointer hover:font-semibold"
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollToSection(link.toLowerCase());
                }}
              >
                {link}
              </li>
            ))}
            <li>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollToSection("contact");
                }}
                className={`px-5 py-2 rounded-full flex items-center gap-2 ${theme.buttonBg} ${theme.buttonText} transition duration-200 hover:scale-105`}
              >
                Contact <ArrowRight size={16} />
              </button>
            </li>
          </ul>
        )}

        {/* Menu Icon for Mobile */}
        {isMobileLayout && (
          <button onClick={toggleMenu}>
            {isOpen ? (
              <X size={26} className={theme.text} />
            ) : (
              <Menu size={26} className={theme.text} />
            )}
          </button>
        )}
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileLayout && (
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? "max-h-96 py-8" : "max-h-0"
          } w-full flex flex-col items-center justify-center gap-8 text-xl font-medium ${
            theme.bg
          } ${theme.text}`}
        >
          {navLinks.map((link, index) => (
            <div
              key={index}
              onClick={(e) => {
                e.preventDefault();
                handleScrollToSection(link.toLowerCase());
                toggleMenu();
              }}
              className="transition duration-200 cursor-pointer hover:font-semibold"
            >
              {link}
            </div>
          ))}
          <button
            onClick={(e) => {
              e.preventDefault();
              handleScrollToSection("contact");
              toggleMenu();
            }}
            className={`px-6 py-2 rounded-full flex items-center gap-2 ${theme.buttonBg} ${theme.buttonText} transition duration-200 hover:scale-105`}
          >
            Contact <ArrowRight size={16} />
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavbarSection4;
