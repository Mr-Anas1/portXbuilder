import React from "react";

const FormInput = ({
  title,
  placeholder,
  type,
  onChange,
  name,
  isValid = true,
  value,
}) => {
  return (
    <div className="flex flex-col justify-start items-start mx-2 my-4 group">
      <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-primary-500 transition-all duration-500">
        {title}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        className={`rounded-lg px-4 py-2 w-full outline-none border transition-all duration-300 group-hover:border-primary-500 ${
          isValid
            ? "border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            : "border-red-500 focus:ring-2 focus:ring-red-400"
        }`}
        onChange={onChange}
      />
    </div>
  );
};

export default FormInput;
