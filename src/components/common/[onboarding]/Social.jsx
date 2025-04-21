import React from "react";
import { Github, Instagram, Linkedin, Twitter } from "lucide-react";

const Social = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <section className="w-full  max-w-[80%] sm:max-w-lg lg:max-w-xl bg-white/80 rounded-xl px-6 py-8 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
        Social Links
      </h2>
      <div className="flex flex-col gap-4">
        <div className="group">
          <div className="relative">
            <Github
              className="absolute left-3  top-2.5 text-gray-500 group-hover:text-primary-600 transition-colors "
              size={20}
            />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 outline-none rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 group-hover:border-primary-400"
              placeholder="GitHub profile URL or username"
              name="github"
              value={formData.github}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="group">
          <div className="relative">
            <Twitter
              className="absolute left-3 top-2.5 text-gray-500 group-hover:text-primary-600 transition-colors"
              size={20}
            />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 outline-none rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 group-hover:border-primary-400"
              placeholder="X profile URL or username"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="group">
          <div className="relative">
            <Linkedin
              className="absolute left-3 top-2.5 text-gray-500 group-hover:text-primary-600 transition-colors"
              size={20}
            />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 outline-none rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 group-hover:border-primary-400"
              placeholder="Linkedin profile URL or username"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="group">
          <div className="relative">
            <Instagram
              className="absolute left-3 top-2.5 text-gray-500 group-hover:text-primary-600 transition-colors"
              size={20}
            />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 outline-none rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 group-hover:border-primary-400"
              placeholder="Instagram profile URL or username"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Social;
