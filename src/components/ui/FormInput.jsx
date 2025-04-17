import React from "react";

const FormInput = ({ title, placeholder, type }) => {
  return (
    <div className="flex flex-col justify-start items-start mx-2 my-4 group">
      <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-primary-600 transition-colors">
        {title}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="rounded-lg px-4 py-2 w-full outline-none border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 group-hover:border-primary-400"
      />
    </div>
  );
};

export default FormInput;
