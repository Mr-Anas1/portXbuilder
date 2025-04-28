import React from "react";

const SidebarContent = ({
  sections,
  activeSection,
  setActiveSection,
  removeSection,
}) => {
  return (
    <div className="flex flex-col mx-4 h-full">
      <ul className="mt-4 space-y-2">
        {sections.map((section) => (
          <li
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`relative group text-md cursor-pointer flex items-center gap-2 text-gray-800 h-12 p-2 rounded-md transition-all duration-200 ease-in
            ${
              activeSection === section.id
                ? "bg-primary-500 text-white hover:bg-primary-600"
                : "hover:bg-primary-100"
            }`}
          >
            <div>{<section.icon />}</div>
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
        ))}
      </ul>
    </div>
  );
};

export default SidebarContent;
