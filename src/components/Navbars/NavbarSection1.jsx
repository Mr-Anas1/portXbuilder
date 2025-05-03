import React, { useState } from "react";
import { Menu, X } from "lucide-react";

const NavbarSection1 = ({ theme, handleScrollToSection }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { bg, shadow, text } = theme;
  const navLinks = ["Projects", "Contact"]; // Define navigation links

  return (
    <section className={`${bg} ${shadow} h-20`} id="navbar">
      <div className="max-w-full mx-6 px-4 sm:px-6 lg:px-8 py-6 h-full flex items-center justify-between">
        {/* Logo */}
        <div className={`text-xl font-bold ${text}`}>John Wick</div>

        {/* Desktop links */}
        <div className="hidden md:flex space-x-6">
          {navLinks.map((link, i) => (
            <a
              key={i}
              href={`#${link.toLowerCase()}`} // Linking to the section
              className={`${text} transition transform hover:scale-105 duration-200`}
              onClick={(e) => {
                e.preventDefault();
                handleScrollToSection(link.toLowerCase()); // Scroll to section
              }}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`md:hidden ${text} transition hover:scale-110`}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${bg} ${shadow} ${
          isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col items-center space-y-3 py-4">
          {navLinks.map((link, i) => (
            <a
              key={i}
              href={`#${link.toLowerCase()}`} // Linking to the section
              className={`${text} transition transform hover:scale-105 duration-200`}
              onClick={(e) => {
                e.preventDefault();
                handleScrollToSection(link.toLowerCase()); // Scroll to section
              }}
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NavbarSection1;
