import React from "react";

function FeatureBox({ Icon, title, description }) {
  return (
    <div className="px-8 py-8 rounded-xl bg-white shadow-md w-full h-full flex flex-col gap-4">
      <div className="flex items-center justify-center w-fit h-fit bg-primary-100 rounded-lg px-2 py-2">
        {" "}
        <Icon size={34} color="#8b5cf6" />
      </div>

      <h3 className="text-lg font-bold text-neutral-800">{title}</h3>
      <p className="text-base text-gray-600">{description}</p>
    </div>
  );
}

export default FeatureBox;
