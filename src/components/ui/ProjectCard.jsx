import React from "react";
import { Box, LinkIcon, Palette, MinusCircle, Image } from "lucide-react";
import FormInput from "./FormInput";
import TextInput from "./TextInput";

const noSpecialCharsRegex = /^[a-zA-Z0-9\s.,'-]*$/;

const ProjectCard = ({ id, formData, setFormData, removeCard }) => {
  const project = formData?.projects?.[id] || {
    project_title: "",
    project_description: "",
    project_link: "",
    project_img: "",
  };

  const handleChange = (field, value) => {
    if (
      (field === "project_title" || field === "project_description") &&
      !noSpecialCharsRegex.test(value)
    ) {
      return;
    }

    if (field === "project_link") {
      if (
        value &&
        !value.startsWith("http://") &&
        !value.startsWith("https://")
      ) {
        value = `https://${value}`;
      }
    }

    const updatedProjects = [...(formData.projects || [])];
    if (!updatedProjects[id]) {
      updatedProjects[id] = {
        project_title: "",
        project_description: "",
        project_link: "",
        project_img: "",
      };
    }
    updatedProjects[id][field] = value;
    setFormData({ ...formData, projects: updatedProjects });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const index = id;

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
      {formData?.projects?.length > 1 && (
        <button
          onClick={() => removeCard(id)}
          className="absolute -top-2 -right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-full p-1 shadow-md hover:bg-red-50"
        >
          <MinusCircle size={20} />
        </button>
      )}
      <div className="w-full p-4 rounded-lg border border-gray-200 space-y-4 hover:border-primary-300 transition-all duration-300 hover:shadow-md">
        <h3 className="font-medium flex items-center text-gray-700">
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

        <div className="flex flex-col md:flex-row gap-4 ">
          {/* Project Image Upload */}
          <div className="flex-1">
            <label className="text-sm text-start md:text-center font-medium text-gray-700 mb-2 block">
              Project Image
            </label>
            <div className="flex items-center gap-2 w-full">
              <Image
                className="text-gray-500 flex-shrink-0"
                size={20}
                aria-hidden="true"
                alt=""
              />
              <input
                id={`projectImage-${id}`}
                name="project_img"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <div className="relative flex-1">
                <label
                  htmlFor={`projectImage-${id}`}
                  className="block w-full cursor-pointer rounded-lg px-4 py-2 border
                  text-gray-500 border-gray-300
                  group-hover:border-primary-500 hover:text-primary-500
                  transition-all duration-300 h-[41px]"
                >
                  <span className="absolute inset-0 px-4 py-2 truncate">
                    {project.project_img?.name || "Upload Image"}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Project Link Input */}
          <div className="flex-1">
            <label className="text-sm text-start md:text-center font-medium text-gray-700 mb-2 block">
              Project Link
            </label>
            <div className="flex items-center gap-2">
              <LinkIcon className="text-gray-500 flex-shrink-0" size={20} />
              <input
                name="project_link"
                placeholder="https://..."
                type="text"
                value={project.project_link}
                onChange={(e) => handleChange("project_link", e.target.value)}
                className={`rounded-lg px-4 py-2 w-full outline-none border transition-all duration-300 group-hover:border-primary-500 border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectCard;
