import React from "react";
import { Box, LinkIcon, Palette } from "lucide-react";
import FormInput from "./FormInput";
import TextInput from "./TextInput";

const ProjectCard = ({ id }) => {
  return (
    <section>
      <div className="p-6 my-4 rounded-xl border border-gray-200 space-y-4 hover:border-primary-300 transition-all duration-300 hover:shadow-lg group">
        <h3 className="font-medium flex items-center">
          <Box className="mr-2 text-primary-500" size={20} /> Project {id + 1}
        </h3>
        <FormInput title="" placeholder="Project Title" type="text" />
        <TextInput title="" placeholder="Project Description" rows={4} />

        <div className="flex space-x-4">
          <div className="flex-1">
            <div className="relative flex justify-center items-center">
              <Palette className="text-gray-500 " size={20} />
              <FormInput title="" placeholder="Project Image URL" type="text" />
            </div>
          </div>
          <div className="flex-1">
            <div className="relative flex justify-center items-center">
              <LinkIcon className=" text-gray-500" size={20} />
              <FormInput title="" placeholder="Project Link" type="text" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectCard;
