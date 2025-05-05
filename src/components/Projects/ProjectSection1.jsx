"use client";
import { ProjectData } from "../../Helpers/ProjectData";

export default function ProjectSection1({ theme }) {
  return (
    <section
      className={`w-full px-6 md:px-16 py-20 ${theme.bg} ${theme.text}`}
      id="project"
    >
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Recent projects</h2>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-12">
          Below you can see some examples of my recent work. Check out my
          complete{" "}
          <a href="#" className={`underline ${theme.accentText}`}>
            portfolio
          </a>
          . Have a project you would like to discuss?{" "}
          <a href="#" className={`underline ${theme.label2Text}`}>
            Let’s make something great together!
          </a>
        </p>

        <div className="flex flex-wrap justify-center gap-10">
          {ProjectData.map((project) => (
            <div
              key={project.id}
              className={`group ${theme.card1Bg} ${theme.card1Text} rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 w-full max-w-sm`}
            >
              <div className="relative overflow-hidden h-56">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-5 text-left">
                <h4 className="text-xl font-bold mb-2">{project.title}</h4>
                <p className={`text-sm ${theme.subtext} mb-4`}>
                  {project.description}
                </p>
                <a
                  href={project.link}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${theme.buttonBg} ${theme.buttonText} text-sm font-medium ${theme.buttonHover} transition-colors duration-300`}
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
