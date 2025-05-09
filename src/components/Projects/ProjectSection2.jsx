"use client";
import { ProjectData } from "@/Helpers/ProjectData";

export default function ProjectSection2({ theme, isMobileLayout }) {
  return (
    <section
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
          {ProjectData.map((project) => (
            <a
              key={project.id}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-2xl overflow-hidden shadow-md ${
                theme.bg
              } transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg w-full ${
                isMobileLayout ? "max-w-[90%]" : "max-w-xl"
              }`}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <p className={`text-sm ${theme.text} mt-2`}>
                  {project.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
