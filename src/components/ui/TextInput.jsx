import React from "react";

const TextInput = ({
  title,
  placeholder,
  rows,
  onChange,
  name,
  isValid = true,
  value,
}) => {
  return (
    <div className="flex flex-col justify-start items-start mx-2 my-4 group">
      <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-primary-600 transition-colors">
        {title}
      </label>
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        className={`rounded-lg px-4 py-2 w-full outline-none border transition-all duration-300 group-hover:border-primary-400 ${
          isValid
            ? "border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            : "border-red-500 focus:ring-2 focus:ring-red-400"
        }`}
        rows={rows}
        onChange={onChange}
      />
      {/* Character counter for bio or any field with value */}
      {typeof value === "string" && name && (
        <div className="text-xs text-gray-500 mt-1 ml-auto w-full text-right">
          {value.length}
          {name === "bio" ? "/160" : null}
        </div>
      )}
    </div>
  );
};

export default TextInput;
