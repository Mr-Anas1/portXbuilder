// Sidebar.jsx
import React from "react";
import AddSectionOverlay from "@/components/ui/AddSectionOverlay";
import SidebarContent from "@/components/ui/SidebarContent";

const Sidebar = ({
  sections,
  activeSection,
  setActiveSection,
  showOverlay,
  setShowOverlay,
  newSectionName,
  setNewSectionName,
  removeSection,
  availableIcons,
}) => {
  return (
    <section className="md:block w-[20%] h-[calc(100vh-80px)] fixed top-20 bg-background border-r border-t border-gray-200 hidden">
      <div className="flex flex-col h-full">
        <SidebarContent
          sections={sections}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          removeSection={removeSection}
        />
        <div className="flex items-center justify-center mb-16">
          <button
            className={`px-4 py-2 rounded-md text-white text-md cursor-pointer font-semibold transition-all duration-200 ease-in ${
              sections.length >= 3
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg hover:scale-105"
            }`}
            onClick={() => setShowOverlay(true)}
            disabled={sections.length >= 3}
          >
            Add Section
          </button>
        </div>
      </div>

      {showOverlay && (
        <AddSectionOverlay
          showOverlay={showOverlay}
          setShowOverlay={setShowOverlay}
          newSectionName={newSectionName}
          setNewSectionName={setNewSectionName}
          sections={sections}
          availableIcons={availableIcons}
          setSections={setSections}
        />
      )}
    </section>
  );
};

export default Sidebar;
