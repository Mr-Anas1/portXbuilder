"use client";
import React from "react";
import FormInput from "../../ui/FormInput";
import TextInput from "../../ui/TextInput";
import { useState } from "react";
import ReactFlagsSelect from "react-flags-select";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);

// Get all country names in English
const countryLabels = countries.getNames("en");

const BasicInfo = ({
  formData,
  setFormData,
  isValid,
  setIsValid,
  setProceed,
}) => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [showImageGuidance, setShowImageGuidance] = useState(false);

  const handleInputChange = (eOrName, valueOptional) => {
    const name = typeof eOrName === "string" ? eOrName : eOrName.target.name;
    const isFileInput = eOrName?.target?.type === "file";

    const value = isFileInput
      ? eOrName.target.files[0]
      : typeof eOrName === "string"
      ? valueOptional
      : eOrName.target.value;

    const validationRules = {
      name: /^[a-zA-Z\s]*$/,
      profession: /^[a-zA-Z0-9\s\-\/()&]{2,50}$/,
      bio: /^[a-zA-Z0-9\s.,'"\-!?()]{0,160}$/,
      picture: /^.*$/,
      age: /^(?:1[01][0-9]|120|[1-9]?[0-9])$/,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      phone: /^\+?[0-9\s\-()]{7,20}$/,
      location: /^[a-zA-Z\s]{2,}$/,
      experience: /^(?:1[01][0-9]|120|[1-9]?[0-9])$/,
    };

    const validInput = isFileInput
      ? true
      : validationRules[name]?.test(value) ?? true;

    // Create new formData for validation
    const newFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(newFormData);
    setIsValid((prev) => ({ ...prev, [name]: validInput }));

    const allValid =
      newFormData.name?.trim() &&
      newFormData.profession?.trim() &&
      newFormData.bio?.trim() &&
      newFormData.age?.trim() &&
      newFormData.email?.trim() &&
      newFormData.phone?.trim() &&
      newFormData.location?.trim() &&
      newFormData.experience?.trim() &&
      newFormData.profileImage &&
      validationRules["name"].test(newFormData.name) &&
      validationRules["profession"].test(newFormData.profession) &&
      validationRules["bio"].test(newFormData.bio) &&
      validationRules["age"].test(newFormData.age) &&
      validationRules["email"].test(newFormData.email) &&
      validationRules["phone"].test(newFormData.phone) &&
      validationRules["location"].test(newFormData.location) &&
      validationRules["experience"].test(newFormData.experience);

    setProceed(!!allValid);
  };

  return (
    <section className="w-full max-w-[90%] md:max-w-[80%] sm:max-w-lg lg:max-w-xl bg-white/80 rounded-xl px-6 py-8 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
        Basic Information
      </h2>
      <div>
        <FormInput
          name="name"
          title="Name"
          placeholder="John Doe"
          type="text"
          value={formData.name}
          onChange={handleInputChange}
          isValid={isValid.name}
        />
        <FormInput
          name="age"
          title="Age"
          placeholder="21"
          type="text"
          value={formData.age}
          onChange={handleInputChange}
          isValid={isValid.age}
        />

        <FormInput
          name="email"
          title="Email"
          placeholder="john@example.com"
          type="text"
          value={formData.email}
          onChange={handleInputChange}
          isValid={isValid.email}
        />

        <FormInput
          name="phone"
          title="Phone"
          placeholder="Phone number"
          type="text"
          value={formData.phone}
          onChange={handleInputChange}
          isValid={isValid.phone}
        />
        <div className="flex flex-col justify-start items-start mx-2 my-4 group flag-group ">
          <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-primary-500 group-hover:border-primary-500 transition-colors">
            Country
          </label>
          <ReactFlagsSelect
            selected={selectedCountry}
            searchable
            className="flag-group custom-flags-select w-full rounded-xl text-gray-700 group-hover:border-primary-500 transition-all duration-300"
            customLabels={countryLabels}
            onSelect={(code) => {
              const countryName = countryLabels[code];
              setSelectedCountry(code);
              handleInputChange("location", countryName);
            }}
          />
        </div>

        <FormInput
          name="profession"
          title="Profession"
          placeholder="Software Developer"
          type="text"
          value={formData.profession}
          onChange={handleInputChange}
          isValid={isValid.profession}
        />

        <FormInput
          name="experience"
          title="Experience"
          placeholder="Years of experience"
          type="text"
          value={formData.experience}
          onChange={handleInputChange}
          isValid={isValid.experience}
        />

        <TextInput
          name="bio"
          title="Bio"
          placeholder="Tell us about yourself"
          rows={4}
          value={formData.bio}
          onChange={handleInputChange}
          isValid={isValid.bio}
        />

        <div className="flex flex-col justify-start items-start mx-2 my-4 group">
          <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-primary-600 transition-colors">
            Profile Image
          </label>

          <input
            id="profileImage"
            name="profileImage"
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />

          <label
            htmlFor="profileImage"
            className="cursor-pointer rounded-lg px-4 py-2 w-full border text-gray-500 border-gray-300 group-hover:border-primary-500 group-hover:text-primary-500 transition-all duration-300 text-center"
          >
            {formData.profileImage
              ? formData.profileImage.name
              : "Upload Profile Image"}
          </label>

          {/* Toggle button for image guidance */}
          <button
            type="button"
            onClick={() => setShowImageGuidance(!showImageGuidance)}
            className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1 transition-colors duration-200"
          >
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                showImageGuidance ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
            <span>{showImageGuidance ? "Hide" : "Show"} image tips</span>
          </button>

          {/* Image guidance message - conditionally rendered */}
          {showImageGuidance && (
            <div className="mt-3 p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 w-full animate-in slide-in-from-top-2 duration-300">
              <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-3">
                <div className="flex-shrink-0 flex justify-center sm:justify-start">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-sm">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-sm text-blue-900 flex-1 text-center sm:text-left">
                  <p className="font-semibold mb-2 sm:mb-3 text-blue-800 flex items-center justify-center sm:justify-start">
                    <span className="mr-2">💡</span>
                    <span className="text-xs sm:text-sm">
                      Image Tip for Best Results
                    </span>
                  </p>
                  <p className="mb-3 sm:mb-4 text-blue-700 leading-relaxed text-xs sm:text-sm">
                    For the best display on your portfolio, we recommend using a{" "}
                    <strong>square image</strong> (1:1 ratio).
                  </p>

                  {/* Visual examples */}
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-2 sm:p-3 bg-white/60 rounded-lg border border-green-200 shadow-sm">
                      <div className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-green-700">
                          Recommended
                        </span>
                      </div>
                      <div className="flex justify-center sm:justify-start space-x-1 sm:space-x-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg border-2 border-white shadow-sm transform hover:scale-110 transition-transform duration-200"></div>
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg border-2 border-white shadow-sm transform hover:scale-110 transition-transform duration-200"></div>
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg border-2 border-white shadow-sm transform hover:scale-110 transition-transform duration-200"></div>
                      </div>
                      <span className="text-xs font-medium text-gray-600 bg-white/80 px-2 py-1 rounded-full text-center sm:text-left">
                        Square (1:1)
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-2 sm:p-3 bg-white/60 rounded-lg border border-red-200 shadow-sm">
                      <div className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center shadow-sm">
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-red-700">
                          Avoid
                        </span>
                      </div>
                      <div className="flex justify-center sm:justify-start space-x-1 sm:space-x-2">
                        <div className="w-8 h-6 sm:w-10 sm:h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg border-2 border-white shadow-sm transform hover:scale-110 transition-transform duration-200"></div>
                        <div className="w-6 h-8 sm:w-8 sm:h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg border-2 border-white shadow-sm transform hover:scale-110 transition-transform duration-200"></div>
                      </div>
                      <span className="text-xs font-medium text-gray-600 bg-white/80 px-2 py-1 rounded-full text-center sm:text-left">
                        Rectangle
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg border border-blue-300">
                    <p className="text-xs text-blue-800 font-medium flex flex-col sm:flex-row sm:items-center text-center sm:text-left">
                      <svg
                        className="w-4 h-4 mx-auto sm:mr-2 sm:ml-0 mb-1 sm:mb-0 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-xs">
                        Square images ensure your profile picture looks great
                        across all devices and themes!
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BasicInfo;
