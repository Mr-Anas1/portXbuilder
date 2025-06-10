"use client";
import React from "react";
import { ProjectData } from "@/Helpers/ProjectData";
import { usePortfolio } from "@/context/PortfolioContext";

const ProjectSection3 = ({ theme, isMobileLayout, sectionRef }) => {
  const { portfolio, loading } = usePortfolio();

  // Normalize fallback project data
  const formattedProjectData = ProjectData.map((project) => ({
    project_img: project.image,
    project_title: project.title,
    project_description: project.description,
    project_link: project.link,
  }));

  // Use DB data if available, else fallback
  const rawProjects = portfolio?.projects?.length
    ? portfolio.projects
    : formattedProjectData;

  // Filter out invalid entries
  const projectsToRender = rawProjects.filter(
    (p) => p.project_title && p.project_img
  );

  if (!projectsToRender || projectsToRender.length === 0) {
    return (
      <section
        className={`w-full max-w-7xl mx-auto px-6 md:px-16 py-20 ${theme.bg} ${theme.text} min-h-screen flex flex-col justify-center items-center`}
        id="projects"
      >
        <h2
          className={`text-4xl md:text-5xl font-bold mb-6 text-center ${theme.accentText}`}
        >
          My Projects
        </h2>

        <p className="text-xl md:text-2xl text-gray-500 text-center max-w-xl">
          Still working on my projects. Stay tuned for some awesome work!
        </p>
      </section>
    );
  }
  return (
    <section
      className={`py-12 ${theme.bg} ${theme.text} min-h-screen`}
      ref={sectionRef}
      id="projects"
    >
      <h1
        className={`text-4xl md:text-5xl font-bold text-center mb-12 ${theme.accentText}`}
      >
        My Projects
      </h1>
      {projectsToRender.map((project, index) => (
        <div
          key={project.project_title || index}
          className={`flex px-8 ${
            isMobileLayout ? "flex-col" : "flex-col md:flex-row"
          } items-center gap-10 mb-16 ${
            !isMobileLayout && index % 2 !== 0 ? "md:flex-row-reverse" : ""
          }`}
        >
          <div className="relative flex-1 rounded-xl overflow-hidden w-full h-[400px]">
            <img
              src={project.project_img?.data || "/default-project.png"}
              alt={project.project_img?.name || "Project image"}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div
            className={`w-full flex-1 md:w-1/2 text-center md:text-left ${
              isMobileLayout ? "md:w-full" : ""
            }`}
          >
            <h2 className="text-3xl font-semibold mb-4">
              {project.project_title}
            </h2>
            <p className={`text-lg mb-4 ${theme.subtext}`}>
              {project.project_description}
            </p>
            <a
              href={project.project_link}
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
