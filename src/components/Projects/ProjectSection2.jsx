"use client";
import { ProjectData } from "@/Helpers/ProjectData";
import { usePortfolio } from "@/context/PortfolioContext";
import Image from "next/image";

export default function ProjectSection2({ theme, isMobileLayout, sectionRef }) {
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
        className={`w-full px-6 md:px-16 py-20 ${theme.bg} ${theme.text} min-h-screen flex flex-col justify-center items-center`}
        id="projects"
      >
        <h2
          className={`text-4xl md:text-5xl font-bold mb-6 text-center ${theme.accentText}`}
        >
          Projects
        </h2>

        <p className="text-xl px-4 md:text-2xl text-gray-500 text-center max-w-xl">
          Still working on my projects. Stay tuned for some awesome work!
        </p>
      </section>
    );
  }
  return (
    <section
      ref={sectionRef}
      className={`py-20 max-w-7xl mx-auto ${theme.bg} ${theme.text} min-h-screen flex justify-center items-center`}
      id="projects"
    >
      <div className="w-full">
        {/* Header */}
        <div
          className={`flex justify-center md:justify-start items-center mb-12 ${
            isMobileLayout ? "md:justify-center" : ""
          } `}
        >
          <h2
            className={`text-3xl md:text-5xl mx-auto font-bold text-center  ${
              theme.accentText
            }  ${isMobileLayout ? "md:text-center" : ""}`}
          >
            Latest Projects
          </h2>
        </div>

        {/* Projects */}
        <div
          className={`flex px-4 ${
            isMobileLayout
              ? "flex-col items-center gap-8"
              : "flex-row items-center justify-center gap-10"
          }`}
        >
          {projectsToRender.map((project, index) =>
            project.project_link ? (
              <a
                key={project.project_title || index}
                href={project.project_link}
                target="_blank"
                rel="noopener noreferrer"
                className={`rounded-2xl overflow-hidden shadow-md ${
                  theme.bg
                } transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg w-full ${
                  isMobileLayout ? "max-w-[90%]" : "max-w-md"
                }`}
              >
                <div className="relative overflow-hidden w-full h-[400px]">
                  <Image
                    src={project.project_img?.data || "/default-project.png"}
                    alt={project.project_img?.name || "Project image"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h4 className={`text-xl font-bold mb-2 ${theme.subtext}`}>
                    {project.project_title}
                  </h4>
                  <p className={`text-sm ${theme.text} mt-2`}>
                    {project.project_description}
                  </p>
                </div>
              </a>
            ) : (
              <div
                key={project.project_title || index}
                className={`rounded-2xl overflow-hidden shadow-md ${
                  theme.bg
                } w-full ${isMobileLayout ? "max-w-[90%]" : "max-w-md"}`}
              >
                <div className="relative overflow-hidden w-full h-[400px]">
                  <Image
                    src={
                      project.project_img?.data || "/images/default-project.png"
                    }
                    alt={project.project_img?.name || "Project image"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className={`text-xl font-semibold ${theme.subtext}`}>
                    {project.project_title}
                  </h3>
                  <p className={`text-sm ${theme.text} mt-2`}>
                    {project.project_description}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
