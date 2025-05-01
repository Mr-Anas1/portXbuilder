import React, { useState } from "react";
import { Menu, X } from "lucide-react";

const NavbarSection3 = ({ theme }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = ["Home", "Projects", "About"];

  return (
    <div className={`z-50 ${theme.bg} ${theme.shadow}`} id="navbar">
      {/* Header Bar */}
      <div className="flex justify-between items-center px-6 py-4 relative z-50">
        <div
          className={`text-2xl font-serif italic font-semibold ${theme.text}`}
        >
          John Wick
        </div>

        {/* Desktop Nav */}
        <ul
          className={`hidden md:flex gap-8 text-sm font-medium ${theme.text}`}
        >
          {navLinks.map((link) => (
            <li
              key={link}
              className="hover:underline underline-offset-4 transition-all duration-200 cursor-pointer hover:scale-105"
            >
              {link}
            </li>
          ))}
        </ul>

        {/* Desktop Contact Button */}
        <button
          className={`hidden md:block cursor-pointer bg-black text-white px-6 py-2 rounded-full text-sm transition-all duration-200 hover:scale-105 hover:shadow-md`}
        >
          Contact
        </button>

        {/* Mobile Menu Icon */}
        <div className="md:hidden z-50">
          <button onClick={toggleMenu} className="focus:outline-none">
            {isOpen ? (
              <X size={28} className={theme.text} />
            ) : (
              <Menu size={28} className={theme.text} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 ${
          theme.bg
        } transition-transform duration-300 ease-in-out z-40 flex flex-col items-center ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Top bar with logo and close icon */}
        <div className="w-full flex justify-between items-center px-6 py-4 border-b">
          <div
            className={`text-2xl font-serif italic font-semibold ${theme.text}`}
          >
            Madison.
          </div>
          <button onClick={toggleMenu} className="focus:outline-none">
            <X size={28} className={theme.text} />
          </button>
        </div>

        {/* Mobile Nav Links */}
        <div
          className={`flex flex-col justify-center items-center flex-grow gap-8 text-xl font-medium ${theme.text}`}
        >
          {navLinks.map((link) => (
            <div
              key={link}
              onClick={toggleMenu}
              className="underline-offset-4 transition-all duration-200 cursor-pointer"
            >
              {link}
            </div>
          ))}
          <button
            onClick={toggleMenu}
            className="mt-4 bg-black text-white px-8 py-2 rounded-full transition-all duration-200"
          >
            Contact
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavbarSection3;
