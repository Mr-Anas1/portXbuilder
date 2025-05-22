"use client";
import { ProjectData } from "@/Helpers/ProjectData";
import { usePortfolio } from "@/context/PortfolioContext";

export default function ProjectSection2({ theme, isMobileLayout, sectionRef }) {
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
          Projects
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
      } min-h-screen flex justify-center items-center  ${
        isMobileLayout ? "md:px-2" : ""
      }`}
      id="project"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div
          className={`flex justify-center md:justify-start items-center mb-12 ${
            isMobileLayout ? "md:justify-center" : ""
          } `}
        >
          <h2
            className={`text-3xl md:text-5xl font-bold text-center md:text-start ${
              theme.accentText
            }  ${isMobileLayout ? "md:text-center" : ""}`}
          >
            Latest Projects
          </h2>
        </div>

        {/* Projects */}
        <div
          className={`flex ${
            isMobileLayout ? "flex-col items-center gap-8" : "flex-row gap-10"
          }`}
        >
          {projectsToRender.map((project, index) => (
            <a
              key={project.project_title || index}
              href={project.project_link}
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-2xl overflow-hidden shadow-md ${
                theme.bg
              } transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg w-full ${
                isMobileLayout ? "max-w-[90%]" : "max-w-xl"
              }`}
            >
              <img
                src={project.project_img?.data || "/default-project.png"}
                alt={project.project_img?.name || "Project image"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <p className={`text-sm ${theme.text} mt-2`}>
                  {project.project_description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
