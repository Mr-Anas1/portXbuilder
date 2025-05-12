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
    const value =
      typeof eOrName === "string" ? valueOptional : eOrName.target.value;

    const validationRules = {
      name: /^[a-zA-Z\s]*$/,
      profession: /^[a-zA-Z\s]*$/,
      bio: /^[a-zA-Z0-9\s.,'"\-!?()]{0,160}$/,
      picture: /^.*$/,
      age: /^(?:1[01][0-9]|120|[1-9]?[0-9])$/,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      phone: /^\+?[0-9\s\-()]{7,20}$/,
      location: /^[A-Z]{2}$/, // Assuming ISO country code like "US", "IN"
    };

    const validInput = validationRules[name]?.test(value) ?? true;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsValid((prev) => ({ ...prev, [name]: validInput }));

    const allValid =
      formData.name.trim() &&
      formData.profession.trim() &&
      formData.bio.trim() &&
      formData.age.trim() &&
      formData.email.trim() &&
      formData.phone.trim() &&
      validInput &&
      validationRules["name"].test(formData.name) &&
      validationRules["profession"].test(formData.profession) &&
      validationRules["bio"].test(formData.bio) &&
      validationRules["age"].test(formData.age) &&
      validationRules["email"].test(formData.email) &&
      validationRules["phone"].test(formData.phone);

    setProceed(allValid);
    console.log(formData);
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
          name="profession"
          title="Profession"
          placeholder="Software Developer"
          type="text"
          value={formData.profession}
          onChange={handleInputChange}
          isValid={isValid.profession}
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
        {/* <FormInput
          name="location"
          title="Location"
          placeholder="India"
          type="text"
          value={formData.location}
          onChange={handleInputChange}
          isValid={isValid.location}
        /> */}

        <FormInput
          name="phone"
          title="Phone"
          placeholder="Phone number"
          type="text"
          value={formData.phone}
          onChange={handleInputChange}
          isValid={isValid.phone}
        />

        <div className="flex flex-col justify-start items-start mx-2 my-4 group">
          <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-primary-600 transition-colors">
            Country
          </label>
          <ReactFlagsSelect
            selected={Object.keys(countryLabels).find(
              (code) => countryLabels[code] === selectedCountry
            )}
            searchable
            className="flag-group custom-flags-select w-full rounded-xl text-gray-700 hover:border-primary-600 transition-all duration-300"
            customLabels={countryLabels}
            onSelect={(code) => {
              const countryName = countryLabels[code];
              handleInputChange("location", countryName);
            }}
          />
        </div>

        <TextInput
          name="bio"
          title="Bio"
          placeholder="Tell us about yourself"
          rows={4}
          value={formData.bio}
          onChange={handleInputChange}
          isValid={isValid.bio}
        />
      </div>
    </section>
  );
};

export default BasicInfo;
