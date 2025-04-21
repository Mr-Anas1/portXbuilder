"use client";
import React from "react";
import FormInput from "../../ui/FormInput";
import TextInput from "../../ui/TextInput";
import { useState } from "react";

const BasicInfo = ({
  formData,
  setFormData,
  isValid,
  setIsValid,
  setProceed,
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const validationRules = {
      name: /^[a-zA-Z\s]*$/,
      profession: /^[a-zA-Z\s]*$/,
      bio: /^.{0,160}$/,
      picture: /^.*$/,
    };

    const validInput = validationRules[name]?.test(value) ?? true;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsValid((prev) => ({ ...prev, [name]: validInput }));

    const allValid =
      formData.name.trim() &&
      formData.profession.trim() &&
      formData.bio.trim() &&
      validInput &&
      validationRules["name"].test(formData.name) &&
      validationRules["profession"].test(formData.profession) &&
      validationRules["bio"].test(formData.bio);

    setProceed(allValid);
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
        <FormInput title="Name" placeholder="John Doe" type="text" />
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
