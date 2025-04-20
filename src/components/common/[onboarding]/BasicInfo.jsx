"use client";
import React, { useState } from "react";
import { Plus, Box, LinkIcon, Palette } from "lucide-react";

const BasicInfo = ({
  formData,
  setFormData,
  isValid,
  setIsValid,
  setProceed,
}) => {
  const [cards, setCards] = useState([0]);
  const [touchedFields, setTouchedFields] = useState({});

  const validateInput = (value, type) => {
    if (!value) return false; // Return false for empty values

    const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]+/;
    const urlRegex =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

    if (type === "url") {
      return !urlRegex.test(value);
    }
    return specialCharsRegex.test(value);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;

    // Mark field as touched
    setTouchedFields((prev) => ({
      ...prev,
      [index ? `project_${index}_${name}` : name]: true,
    }));

    // For basic info fields
    if (["name", "profession", "bio"].includes(name)) {
      const hasSpecialChars = validateInput(value, "text");
      setFormData((prev) => ({ ...prev, [name]: value }));
      setIsValid((prev) => ({ ...prev, [name]: !hasSpecialChars }));
    }
    // For project fields
    else {
      const updatedProjects = [...formData.projects];
      if (!updatedProjects[index]) {
        updatedProjects[index] = {};
      }
      updatedProjects[index][name] = value;

      const hasError =
        name.includes("link") || name.includes("img")
          ? validateInput(value, "url")
          : validateInput(value, "text");

      setFormData((prev) => ({ ...prev, projects: updatedProjects }));
      setIsValid((prev) => ({
        ...prev,
        [`project_${index}_${name}`]: !hasError,
      }));
    }

    // Check all validations
    setTimeout(() => {
      // Basic info validation
      const basicInfoValid =
        formData.name?.trim() &&
        formData.profession?.trim() &&
        formData.bio?.trim() &&
        isValid.name &&
        isValid.profession &&
        isValid.bio;

      // Project fields validation
      const projectsValid = formData.projects.every((project, idx) => {
        if (
          !project.title &&
          !project.description &&
          !project.project_link &&
          !project.project_img
        ) {
          return true; // Skip empty projects
        }

        const titleValid = !project.title || isValid[`project_${idx}_title`];
        const descValid =
          !project.description || isValid[`project_${idx}_description`];
        const linkValid =
          !project.project_link || isValid[`project_${idx}_project_link`];
        const imgValid =
          !project.project_img || isValid[`project_${idx}_project_img`];

        return titleValid && descValid && linkValid && imgValid;
      });

      setProceed(basicInfoValid && projectsValid);
    }, 0);
  };

  const getInputClassName = (fieldName, index) => {
    const fieldKey = index ? `project_${index}_${fieldName}` : fieldName;
    const isTouched = touchedFields[fieldKey];
    const isValidField = isValid[fieldKey];
    const value = index
      ? formData.projects[index]?.[fieldName]
      : formData[fieldName];

    // Only show red border if field is touched AND has invalid input
    const hasError = isTouched && value && !isValidField;

    return `w-full px-4 py-2 rounded-lg border ${
      hasError ? "border-red-500" : "border-gray-200"
    } focus:outline-none focus:ring-2 ${
      hasError ? "focus:ring-red-500" : "focus:ring-primary-500"
    }`;
  };

  const addCard = () => {
    if (cards.length >= 3) return;
    setCards((prev) => [...prev, prev.length]);
    setFormData((prev) => ({
      ...prev,
      projects: [...prev.projects, {}],
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="w-full max-w-[80%] sm:max-w-lg lg:max-w-xl bg-white/80 rounded-xl px-6 py-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          Basic Information
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={(e) => handleInputChange(e)}
              placeholder="John Doe"
              className={`w-full px-4 py-2 rounded-lg border ${
                !isValid.name ? "border-red-500" : "border-gray-200"
              } focus:outline-none focus:ring-2 ${
                !isValid.name ? "focus:ring-red-500" : "focus:ring-primary-500"
              }`}
            />
            {!isValid.name && (
              <p className="mt-1 text-sm text-red-500">
                No special characters allowed
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profession
            </label>
            <input
              type="text"
              name="profession"
              value={formData.profession || ""}
              onChange={(e) => handleInputChange(e)}
              placeholder="Software Developer"
              className={`w-full px-4 py-2 rounded-lg border ${
                !isValid.profession ? "border-red-500" : "border-gray-200"
              } focus:outline-none focus:ring-2 ${
                !isValid.profession
                  ? "focus:ring-red-500"
                  : "focus:ring-primary-500"
              }`}
            />
            {!isValid.profession && (
              <p className="mt-1 text-sm text-red-500">
                No special characters allowed
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio || ""}
              onChange={(e) => handleInputChange(e)}
              placeholder="Tell us about yourself"
              rows={4}
              className={`w-full px-4 py-2 rounded-lg border ${
                !isValid.bio ? "border-red-500" : "border-gray-200"
              } focus:outline-none focus:ring-2 ${
                !isValid.bio ? "focus:ring-red-500" : "focus:ring-primary-500"
              }`}
            />
            {!isValid.bio && (
              <p className="mt-1 text-sm text-red-500">
                No special characters allowed
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="w-full max-w-[80%] sm:max-w-lg lg:max-w-xl bg-white/80 rounded-xl px-6 py-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          Projects
        </h2>
        <div>
          {formData.projects.map((project, index) => (
            <div key={index} className="animate-fade-in flex flex-col gap-1">
              <div className="p-6 my-4 rounded-xl border border-gray-200 space-y-4 hover:border-primary-300 transition-all duration-300 hover:shadow-lg group">
                <h3 className="font-medium flex items-center">
                  <Box className="mr-2 text-primary-500" size={20} /> Project{" "}
                  {index + 1}
                </h3>

                <input
                  type="text"
                  name="title"
                  placeholder="Project Title"
                  value={project.title || ""}
                  onChange={(e) => handleInputChange(e, index)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    touchedFields[`project_${index}_title`] &&
                    !isValid[`project_${index}_title`]
                      ? "border-red-500"
                      : "border-gray-200"
                  } focus:outline-none focus:ring-2 ${
                    touchedFields[`project_${index}_title`] &&
                    !isValid[`project_${index}_title`]
                      ? "focus:ring-red-500"
                      : "focus:ring-primary-500"
                  }`}
                />
                {touchedFields[`project_${index}_title`] &&
                  !isValid[`project_${index}_title`] && (
                    <p className="mt-1 text-sm text-red-500">
                      No special characters allowed
                    </p>
                  )}

                <textarea
                  name="description"
                  placeholder="Project Description"
                  rows={4}
                  value={project.description || ""}
                  onChange={(e) => handleInputChange(e, index)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    touchedFields[`project_${index}_description`] &&
                    !isValid[`project_${index}_description`]
                      ? "border-red-500"
                      : "border-gray-200"
                  } focus:outline-none focus:ring-2 ${
                    touchedFields[`project_${index}_description`] &&
                    !isValid[`project_${index}_description`]
                      ? "focus:ring-red-500"
                      : "focus:ring-primary-500"
                  }`}
                />
                {touchedFields[`project_${index}_description`] &&
                  !isValid[`project_${index}_description`] && (
                    <p className="mt-1 text-sm text-red-500">
                      No special characters allowed
                    </p>
                  )}

                <div className="flex space-x-4">
                  <div className="flex-1">
                    <div className="relative flex justify-center items-center">
                      <Palette className="text-gray-500" size={20} />
                      <input
                        type="text"
                        name="project_img"
                        placeholder="Project Image URL"
                        value={project.project_img || ""}
                        onChange={(e) => handleInputChange(e, index)}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          touchedFields[`project_${index}_project_img`] &&
                          !isValid[`project_${index}_project_img`]
                            ? "border-red-500"
                            : "border-gray-200"
                        } focus:outline-none focus:ring-2 ${
                          touchedFields[`project_${index}_project_img`] &&
                          !isValid[`project_${index}_project_img`]
                            ? "focus:ring-red-500"
                            : "focus:ring-primary-500"
                        }`}
                      />
                    </div>
                    {touchedFields[`project_${index}_project_img`] &&
                      !isValid[`project_${index}_project_img`] && (
                        <p className="mt-1 text-sm text-red-500">
                          Please enter a valid URL
                        </p>
                      )}
                  </div>

                  <div className="flex-1">
                    <div className="relative flex justify-center items-center">
                      <LinkIcon className="text-gray-500" size={20} />
                      <input
                        type="text"
                        name="project_link"
                        placeholder="Project Link"
                        value={project.project_link || ""}
                        onChange={(e) => handleInputChange(e, index)}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          touchedFields[`project_${index}_project_link`] &&
                          !isValid[`project_${index}_project_link`]
                            ? "border-red-500"
                            : "border-gray-200"
                        } focus:outline-none focus:ring-2 ${
                          touchedFields[`project_${index}_project_link`] &&
                          !isValid[`project_${index}_project_link`]
                            ? "focus:ring-red-500"
                            : "focus:ring-primary-500"
                        }`}
                      />
                    </div>
                    {touchedFields[`project_${index}_project_link`] &&
                      !isValid[`project_${index}_project_link`] && (
                        <p className="mt-1 text-sm text-red-500">
                          Please enter a valid URL
                        </p>
                      )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addCard}
          disabled={cards.length >= 3}
          className={`mt-4 flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg
            ${
              cards.length >= 3
                ? "bg-gray-300 cursor-not-allowed hover:scale-100 hover:none"
                : "bg-primary-500 hover:bg-primary-600 text-white"
            }`}
        >
          <Plus size={26} />
        </button>
      </section>
    </div>
  );
};

export default BasicInfo;
