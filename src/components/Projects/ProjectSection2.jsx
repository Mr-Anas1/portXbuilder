"use client";
import { ProjectData } from "@/Helpers/ProjectData";

export default function ProjectSection2({ theme }) {
  return (
    <section
      className={`w-full px-6 md:px-16 py-20 ${theme.bg} ${theme.text}`}
      id="project"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Latest Projects</h2>
        </div>

        {/* Projects - Stepped layout */}
        <div className="flex gap-10 flex-col items-center md:flex-row">
          {ProjectData.map((project) => (
            <a
              key={project.id}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full max-w-md md:max-w-xl rounded-2xl overflow-hidden shadow-md ${theme.bg} transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg`}
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
