import React from "react";
import { ProjectData } from "@/Helpers/ProjectData";

const ProjectSection3 = ({ theme }) => {
  return (
    <section
      className={`max-w-6xl mx-auto px-4 py-12 ${theme.bg} ${theme.text}`}
    >
      <h1 className="text-4xl font-bold text-center mb-12">My Projects</h1>
      {ProjectData.map((project, index) => (
        <div
          key={index}
          className={`flex flex-col md:flex-row items-center gap-10 mb-16 ${
            index % 2 !== 0 ? "md:flex-row-reverse" : ""
          }`}
        >
          <img
            src={project.image}
            alt={project.title}
            className="w-full md:w-1/2 rounded-xl shadow-md"
          />
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl font-semibold mb-4">{project.title}</h2>
            <p className={`text-lg mb-4 ${theme.subtext}`}>
              {project.description}
            </p>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-block ${theme.buttonBg} ${theme.buttonText} px-6 py-2 rounded ${theme.buttonHover} transition-colors duration-300`}
            >
              Live Site
            </a>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ProjectSection3;
