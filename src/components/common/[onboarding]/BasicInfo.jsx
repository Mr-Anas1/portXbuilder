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
      validationRules["location"].test(newFormData.location);
    validationRules["experience"].test(newFormData.experience);

    setProceed(!!allValid);
  };

  return (
    <section className="w-full  max-w-[80%] sm:max-w-lg lg:max-w-xl bg-white/80 rounded-xl px-6 py-8 shadow-lg">
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
        </div>
      </div>
    </section>
  );
};

export default BasicInfo;
