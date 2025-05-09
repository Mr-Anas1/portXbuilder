"use client";
import React from "react";
import { ProjectData } from "@/Helpers/ProjectData";

const ProjectSection3 = ({ theme, isMobileLayout }) => {
  return (
    <section className={`px-4 py-12 ${theme.bg} ${theme.text} min-h-screen`}>
      <h1
        className={`text-4xl md:text-5xl font-bold text-center mb-12 ${theme.accentText}`}
      >
        My Projects
      </h1>
      {ProjectData.map((project, index) => (
        <div
          key={index}
          className={`flex ${
            isMobileLayout ? "flex-col" : "flex-col md:flex-row"
          } items-center gap-10 mb-16 ${
            !isMobileLayout && index % 2 !== 0 ? "md:flex-row-reverse" : ""
          }`}
        >
          <img
            src={project.image}
            alt={project.title}
            className={`w-full md:w-1/2 rounded-xl shadow-md ${
              isMobileLayout ? "md:w-full" : ""
            }`}
          />
          <div
            className={`w-full md:w-1/2 text-center md:text-left ${
              isMobileLayout ? "md:w-full" : ""
            }`}
          >
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
