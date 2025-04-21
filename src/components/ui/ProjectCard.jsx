import React from "react";
import { Box, LinkIcon, Palette, MinusCircle } from "lucide-react";
import FormInput from "./FormInput";
import TextInput from "./TextInput";

const ProjectCard = ({ id, formData, setFormData, removeCard }) => {
  const project = formData.projects[id];

  const handleChange = (field, value) => {
    const updatedProjects = [...formData.projects];
    updatedProjects[id][field] = [value];
    setFormData({ ...formData, projects: updatedProjects });
  };
  return (
    <section className="relative group">
      {formData.projects.length > 1 && (
        <button
          onClick={() => removeCard(id)}
          className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <MinusCircle size={20} />{" "}
        </button>
      )}
      <div className="p-6 my-4 rounded-xl border border-gray-200 space-y-4 hover:border-primary-300 transition-all duration-300 hover:shadow-lg group">
        <h3 className="font-medium flex items-center">
          <Box className="mr-2 text-primary-500" size={20} /> Project {id + 1}
        </h3>
        <FormInput
          title=""
          placeholder="Project Title"
          type="text"
          value={project.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
        <TextInput
          title=""
          placeholder="Project Description"
          rows={4}
          value={project.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />

        <div className="flex space-x-4">
          <div className="flex-1">
            <div className="relative flex justify-center items-center">
              <Palette className="text-gray-500 " size={20} />
              <FormInput
                title=""
                placeholder="Project Image URL"
                type="text"
                value={project.project_img}
                onChange={(e) => handleChange("project_img", e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="relative flex justify-center items-center">
              <LinkIcon className=" text-gray-500" size={20} />
              <FormInput
                title=""
                placeholder="Project Link"
                type="text"
                value={project.project_link}
                onChange={(e) => handleChange("project_link", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectCard;
