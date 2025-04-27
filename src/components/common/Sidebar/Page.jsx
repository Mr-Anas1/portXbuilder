"use client";
import {
  Contact,
  FolderKanban,
  LayoutGrid,
  LayoutPanelTopIcon,
  Sparkles,
} from "lucide-react";
import React from "react";
import { useState } from "react";

const Page = () => {
  const [activeSection, setActiveSection] = useState("navbar");
  return (
    <section className="w-[20%] h-screen fixed top-20  bg-background border-r border-t border-gray-200 ">
      <div>
        <div className="flex flex-col mx-4 justify-center h-full">
          <ul className="mt-4 space-y-2">
            <li
              id="navbar"
              onClick={() => setActiveSection("navbar")}
              className={`text-md cursor-pointer flex items-center gap-2 text-gray-800 h-12 p-2 rounded-md transition-all duration-200 ease-in
            ${
              activeSection === "navbar"
                ? "bg-primary-500 text-white hover:bg-primary-600"
                : "hover:bg-primary-100"
            }`}
            >
              <div>
                <LayoutGrid />
              </div>
              <div className="font-semibold ">Navbar</div>
            </li>

            <li
              id="hero"
              onClick={() => setActiveSection("hero")}
              className={`text-md cursor-pointer flex items-center gap-2 text-gray-800 h-12 p-2 rounded-md transition-all duration-200 ease-in
            ${
              activeSection === "hero"
                ? "bg-primary-500 text-white hover:bg-primary-600"
                : "hover:bg-primary-100"
            }`}
            >
              <div>
                <Sparkles />
              </div>
              <div className="font-semibold ">Hero</div>
            </li>

            <li
              id="projects"
              onClick={() => setActiveSection("projects")}
              className={`text-md cursor-pointer flex items-center gap-2 text-gray-800 h-12 p-2 rounded-md transition-all duration-200 ease-in
            ${
              activeSection === "projects"
                ? "bg-primary-500 text-white hover:bg-primary-600"
                : "hover:bg-primary-100"
            }`}
            >
              <div>
                <FolderKanban />
              </div>
              <div className="font-semibold ">projects</div>
            </li>

            <li
              id="contact"
              onClick={() => setActiveSection("contact")}
              className={`text-md cursor-pointer flex items-center gap-2 text-gray-800 h-12 p-2 rounded-md transition-all duration-200 ease-in
            ${
              activeSection === "contact"
                ? "bg-primary-500 text-white hover:bg-primary-600"
                : "hover:bg-primary-100"
            }`}
            >
              <div>
                <Contact />
              </div>
              <div className="font-semibold ">contact</div>
            </li>

            <li
              id="footer"
              onClick={() => setActiveSection("footer")}
              className={`text-md cursor-pointer flex items-center gap-2 text-gray-800 h-12 p-2 rounded-md transition-all duration-200 ease-in
            ${
              activeSection === "footer"
                ? "bg-primary-500 text-white hover:bg-primary-600"
                : "hover:bg-primary-100"
            }`}
            >
              <div>
                <LayoutPanelTopIcon />
              </div>
              <div className="font-semibold ">footer</div>
            </li>
          </ul>
        </div>
        <div>
          <button className="px-4 py-2 rounded-md bg-red-500 text-white text-md">
            Add Section
          </button>
        </div>
      </div>
    </section>
  );
};

export default Page;
