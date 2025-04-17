import React from "react";

const TextInput = ({ title, placeholder, rows }) => {
  return (
    <div className="flex flex-col justify-start items-start mx-2 my-4 group">
      <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-primary-600 transition-colors">
        {title}
      </label>
      <textarea
        placeholder={placeholder}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 group-hover:border-primary-400 outline-none"
        rows={rows}
      />
    </div>
  );
};

export default TextInput;
