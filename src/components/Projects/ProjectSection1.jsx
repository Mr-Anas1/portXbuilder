"use client";
import { usePortfolio } from "@/context/PortfolioContext";
import { ProjectData } from "../../Helpers/ProjectData";

export default function ProjectSection1({ theme, isMobileLayout, sectionRef }) {
  const { portfolio, loading } = usePortfolio();

  if (loading) return <p>Loading projects...</p>;

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
        id="project"
      >
        <h2
          className={`text-4xl md:text-5xl font-bold mb-6 text-center ${theme.accentText}`}
        >
          Recent projects
        </h2>

        <p className="text-xl md:text-2xl text-gray-500 text-center max-w-xl">
          Still working on my projects. Stay tuned for some awesome work!
        </p>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className={`w-full px-6 md:px-16 py-20 ${theme.bg} ${
        theme.text
      } min-h-screen ${isMobileLayout ? "md:px-2" : ""}`}
      id="project"
    >
      <div className="max-w-7xl mx-auto text-center">
        <h2
          className={`text-4xl md:text-5xl font-bold mb-12 ${theme.accentText}`}
        >
          Recent projects
        </h2>

        <div
          className={`${
            isMobileLayout
              ? "flex flex-col items-center gap-8"
              : "flex flex-wrap justify-center gap-10"
          }`}
        >
          {projectsToRender.map((project, index) => (
            <div
              key={project.project_title || index}
              className={`group ${theme.bg} ${
                theme.card1Text
              } rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 w-full ${
                isMobileLayout ? "max-w-[90%]" : "max-w-sm"
              }`}
            >
              <div className="relative overflow-hidden h-56">
                <img
                  src={project.project_img.data}
                  alt={project.project_img.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-5 text-left">
                <h4 className="text-xl font-bold mb-2">
                  {project.project_title}
                </h4>
                <p className={`text-sm ${theme.subtext} mb-4`}>
                  {project.project_description}
                </p>
                <a
                  href={project.project_link}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${theme.buttonBg} ${theme.buttonText} text-sm font-medium ${theme.buttonHover} transition-colors duration-300`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View project →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
