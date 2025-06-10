"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { useEffect } from "react";
import { usePortfolio } from "@/context/PortfolioContext";

const NavbarSection1 = ({
  theme,
  handleScrollToSection,
  isMobileLayout,
  setIsMobileLayout,
  sectionRef,
}) => {
  const { portfolio, loading } = usePortfolio();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    setIsMobileLayout(mediaQuery.matches);

    const handleResize = (e) => {
      setIsMobileLayout(e.matches);
    };

    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, [setIsMobileLayout]);

  const [isOpen, setIsOpen] = useState(false);
  const navLinks = ["Projects", "Contact"];
  const { bg, shadow, text } = theme;

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav
      className={`w-full max-w-7xl mx-auto ${bg} ${shadow}`}
      id="navbar"
      ref={sectionRef}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-6 h-20">
        {/* Logo */}
        <div className={`text-xl font-bold ${text}`}>
          {portfolio?.name || ""}
        </div>

        {/* Desktop Navigation */}
        {!isMobileLayout && (
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link, i) => (
              <a
                key={i}
                href={`#${link.toLowerCase()}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollToSection(link.toLowerCase());
                }}
                className={`transition transform hover:scale-105 duration-200 ${text}`}
              >
                {link}
              </a>
            ))}
          </div>
        )}

        {/* Mobile Toggle */}
        {isMobileLayout && (
          <button
            onClick={toggleMenu}
            className={` block ${text} transition hover:scale-110 `}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
      </div>

      {/* Mobile Dropdown */}
      {isMobileLayout && (
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${bg} ${shadow} ${
            isOpen ? "max-h-40 py-4 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col items-center space-y-3">
            {navLinks.map((link, i) => (
              <a
                key={i}
                href={`#${link.toLowerCase()}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollToSection(link.toLowerCase());
                  toggleMenu();
                }}
                className={`transition transform hover:scale-105 duration-200 ${text}`}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarSection1;
