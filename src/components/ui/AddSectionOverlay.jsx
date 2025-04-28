// AddSectionOverlay.jsx
import React from "react";
import { MinusCircle } from "lucide-react";

const AddSectionOverlay = ({
  showOverlay,
  setShowOverlay,
  newSectionName,
  setNewSectionName,
  sections,
  availableIcons,
  setSections,
}) => {
  const handleAddSection = () => {
    if (newSectionName.trim() !== "") {
      const sanitizedSectionName = newSectionName
        .trim()
        .replace(/[^a-zA-Z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

      const randomIcon =
        availableIcons[Math.floor(Math.random() * availableIcons.length)];

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
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4 sm:w-[450px] w-[250px]">
        <h2 className="text-lg font-semibold text-gray-800">Add New Section</h2>
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
            onClick={handleAddSection}
            className="px-3 py-1 bg-primary-500 text-white rounded-md hover:bg-primary-600"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSectionOverlay;
