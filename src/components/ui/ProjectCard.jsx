import React from "react";
import { Box, LinkIcon, Palette, MinusCircle, Image } from "lucide-react";
import FormInput from "./FormInput";
import TextInput from "./TextInput";

const noSpecialCharsRegex = /^[a-zA-Z0-9\s.,'-]*$/;

const ProjectCard = ({ id, formData, setFormData, removeCard }) => {
  const project = formData.projects[id];

  const handleChange = (field, value) => {
    if (
      (field === "project_title" || field === "project_description") &&
      !noSpecialCharsRegex.test(value)
    ) {
      return;
    }

    const updatedProjects = [...formData.projects];
    updatedProjects[id][field] = value;
    setFormData({ ...formData, projects: updatedProjects });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const index = id; // Use correct index logic if needed

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedProjects = [...formData.projects];
        updatedProjects[index] = {
          ...updatedProjects[index],
          project_img: {
            name: file.name,
            data: reader.result, // base64 encoded string
          },
        };
        setFormData((prev) => ({ ...prev, projects: updatedProjects }));
      };
      reader.readAsDataURL(file); // Convert to base64
    }
  };

  return (
    <section className="relative group">
      {formData.projects.length > 1 && (
        <button
          onClick={() => removeCard(id)}
          className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <MinusCircle size={20} />
        </button>
      )}
      <div className="w-[250px] md:w-[450px] p-6 my-4 rounded-xl border border-gray-200 space-y-4 hover:border-primary-300 transition-all duration-300 hover:shadow-lg group">
        <h3 className="font-medium flex items-center">
          <Box className="mr-2 text-primary-500" size={20} /> Project {id + 1}
        </h3>

        <FormInput
          name="project_title"
          placeholder="Project Title"
          type="text"
          value={project.project_title}
          onChange={(e) => handleChange("project_title", e.target.value)}
        />

        <TextInput
          name="project_description"
          placeholder="Project Description"
          rows={4}
          value={project.project_description}
          onChange={(e) => handleChange("project_description", e.target.value)}
        />

        <div className="flex items-center justify-center gap-4 mt-4">
          {/* Project Image Upload */}
          <div className="flex flex-1 items-center gap-2 mt-1">
            <LinkIcon className="text-gray-500" size={20} />

            <input
              id={`projectImage-${id}`}
              name="project_img"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            <label
              htmlFor={`projectImage-${id}`}
              className="cursor-pointer rounded-lg px-4 py-2 w-full border placeholder:text-gray-400 text-gray-700 border-gray-300 hover:border-primary-500 hover:text-primary-500 transition-all duration-300 text-start"
            >
              {project.project_img?.name || "Upload"}
            </label>
          </div>

          {/* Project Link Input */}
          <div className="flex flex-1 items-center gap-2">
            <LinkIcon className="text-gray-500" size={20} />
            <FormInput
              name="project_link"
              placeholder="Project Link"
              type="text"
              value={project.project_link}
              onChange={(e) => handleChange("project_link", e.target.value)}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectCard;
