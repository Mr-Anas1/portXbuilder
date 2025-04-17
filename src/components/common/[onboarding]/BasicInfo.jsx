import React from "react";
import FormInput from "../../ui/FormInput";
import TextInput from "../../ui/TextInput";

const BasicInfo = () => {
  return (
    <section className="w-full  max-w-[80%] sm:max-w-lg lg:max-w-xl bg-white/80 rounded-xl px-6 py-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
        Basic Information
      </h2>
      <div>
        <FormInput title="Name" placeholder="John Doe" type="text" />
        <FormInput title="Username" placeholder="johndoe" type="text" />
        <FormInput title="Name" placeholder="John Doe" type="text" />
        <TextInput title="Bio" placeholder="Tell us about yourself" rows={4} />
      </div>
    </section>
  );
};

export default BasicInfo;
