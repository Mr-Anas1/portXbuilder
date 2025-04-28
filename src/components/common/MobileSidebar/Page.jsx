import React, { useState } from "react";
import {
  Contact,
  FolderKanban,
  LayoutGrid,
  LayoutPanelTopIcon,
  Sparkles,
  GitBranch,
  User,
  Settings,
  Calendar,
  FileText,
  MapPin,
} from "lucide-react";
import { useEffect } from "react";

import { MinusCircle } from "lucide-react";

const MobileSidebar = ({
  setMobileSidebarOpen,
  activeSection,
  setActiveSection,
  showOverlay,
  setShowOverlay,
  newSectionName,
  setNewSectionName,
  removeSection,
  customSectionsCount,
  sections,
  setSections,
}) => {
  const availableIcons = [
    GitBranch,
    User,
    Settings,
    Calendar,
    FileText,
    MapPin,
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="w-[60%] bg-white h-full shadow-lg p-4">
        <div className="flex flex-col h-full">
          <div className="flex flex-col mx-4 h-full">
            <ul className="mt-4 space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;

                return (
                  <li
                    key={section.id}
                    id={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`relative group text-md cursor-pointer flex items-center gap-2 text-gray-800 h-12 p-2 rounded-md transition-all duration-200 ease-in
                  ${
                    activeSection === section.id
                      ? "bg-primary-500 text-white hover:bg-primary-600"
                      : "hover:bg-primary-100"
                  }`}
                  >
                    <div>
                      <Icon />
                    </div>
                    <div className="font-semibold">{section.label}</div>

                    {section.isCustom && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSection(section.id);
                        }}
                        className="absolute top-1/5 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <MinusCircle size={20} />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="flex items-center justify-center mb-16">
            <button
              className={`px-4 py-2 rounded-md text-white text-md cursor-pointer font-semibold transition-all duration-200 ease-in
    ${
      customSectionsCount >= 3
        ? "bg-gray-300 cursor-not-allowed"
        : "bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg hover:scale-105"
    }`}
              onClick={() => setShowOverlay(true)}
              disabled={customSectionsCount >= 3}
            >
              Add Section
            </button>

            <button
              className={`px-4 py-2 rounded-md text-white text-md cursor-pointer font-semibold transition-all duration-200 ease-in
    ${
      customSectionsCount >= 3
        ? "bg-gray-300 cursor-not-allowed"
        : "bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg hover:scale-105"
    }`}
              onClick={() => setMobileSidebarOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>

        {showOverlay && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4 sm:w-[450px] w-[250px]">
              <h2 className="text-lg font-semibold text-gray-800">
                Add New Section
              </h2>
              <input
                type="text"
                placeholder="Enter section name"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                className="border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-primary-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowOverlay(false)}
                  className="px-3 py-1 bg-gray-300 rounded-md text-gray-700 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (newSectionName.trim() !== "") {
                      const sanitizedSectionName = newSectionName
                        .trim()
                        .replace(/[^a-zA-Z0-9\s-]/g, "")
                        .replace(/\s+/g, "-");

                      const randomIcon =
                        availableIcons[
                          Math.floor(Math.random() * availableIcons.length)
                        ];

                      const newSection = {
                        id: sanitizedSectionName.toLowerCase(),
                        label: sanitizedSectionName,
                        icon: randomIcon,
                        isCustom: true,
                      };
                      setSections([...sections, newSection]);
                      setNewSectionName("");
                      setShowOverlay(false);
                    }
                  }}
                  className="px-3 py-1 bg-primary-500 text-white rounded-md hover:bg-primary-600"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setMobileSidebarOpen(false)}
          className="mt-4 p-2 bg-red-500 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MobileSidebar;
