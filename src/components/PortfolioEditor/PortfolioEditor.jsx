"use client";

import { useEffect, useState } from "react";

const PortfolioEditor = ({ section, data, onClose, onSave }) => {
  const [formState, setFormState] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    setFormState(data);
    setFieldErrors({});
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const maxLength = 240;

    let isValidInput = true;

    if (name === "phone") {
      isValidInput = /^[0-9]*$/.test(value); // allow only numbers
    } else {
      isValidInput = /^[a-zA-Z0-9/@. ]*$/.test(value); // original rule
    }

    const isTooLong = value.length > maxLength;

    setFieldErrors((prev) => ({
      ...prev,
      [name]: !isValidInput || isTooLong,
    }));

    if (isValidInput && !isTooLong) {
      setFormState((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const isFormValid = Object.values(fieldErrors).every((v) => v === false);

  const inputClass = (fieldName) =>
    `rounded-lg px-4 py-2 w-full outline-none border transition-all duration-300 mb-4 ${
      fieldErrors[fieldName]
        ? "border-red-500 focus:ring-2 focus:ring-red-400"
        : "border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
    }`;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      style={{ "z-index": "999" }}
    >
      <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
        <h2 className="text-lg font-semibold mb-4 capitalize">
          {section} Editor
        </h2>

        {section === "navbar" && (
          <>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              name="name"
              value={formState.name || ""}
              onChange={handleChange}
              className={inputClass("name")}
            />
          </>
        )}

        {section === "home" && (
          <>
            <label className="block text-sm font-medium mb-1">Heading</label>
            <input
              name="home_title"
              value={formState.home_title || ""}
              onChange={handleChange}
              className={inputClass("home_title")}
            />

            <label className="block text-sm font-medium mb-1">Subtitle</label>
            <input
              name="home_subtitle"
              value={formState.home_subtitle || ""}
              onChange={handleChange}
              className={inputClass("home_subtitle")}
            />
          </>
        )}

        {section === "about" && (
          <>
            <label className="block text-sm font-medium mb-1">About Me</label>
            <textarea
              name="about_me"
              value={formState.about_me || ""}
              onChange={handleChange}
              className={`rounded-lg h-36 px-4 py-2 w-full outline-none border transition-all duration-300 mb-4 ${
                fieldErrors["about_me"]
                  ? "border-red-500 focus:ring-2 focus:ring-red-400"
                  : "border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              }`}
            />
          </>
        )}

        {section === "contact" && (
          <>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              name="phone"
              value={formState.phone || ""}
              onChange={handleChange}
              className={`rounded-lg  px-4 py-2 w-full outline-none border transition-all duration-300 mb-4 ${
                fieldErrors["about_me"]
                  ? "border-red-500 focus:ring-2 focus:ring-red-400"
                  : "border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              }`}
            />

            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              value={formState.email || ""}
              onChange={handleChange}
              className={inputClass("email")}
            />

            <label className="block text-sm font-medium mb-1">Github</label>
            <input
              name="github"
              value={formState.github || ""}
              onChange={handleChange}
              className={inputClass("github")}
            />
            <label className="block text-sm font-medium mb-1">LinkedIn</label>
            <input
              name="linkedin"
              value={formState.linkedin || ""}
              onChange={handleChange}
              className={inputClass("linkedin")}
            />
            <label className="block text-sm font-medium mb-1">X</label>
            <input
              name="x"
              value={formState.x || ""}
              onChange={handleChange}
              className={inputClass("x")}
            />
            <label className="block text-sm font-medium mb-1">Instagram</label>
            <input
              name="instagram"
              value={formState.instagram || ""}
              onChange={handleChange}
              className={inputClass("instagram")}
            />
            <label className="block text-sm font-medium mb-1">Facebook</label>
            <input
              name="facebook"
              value={formState.facebook || ""}
              onChange={handleChange}
              className={inputClass("facebook")}
            />
          </>
        )}

        {section === "footer" && (
          <>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              name="name"
              value={formState.name || ""}
              onChange={handleChange}
              className={inputClass("name")}
            />
          </>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(section, formState)}
            className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
            disabled={!isFormValid}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioEditor;
