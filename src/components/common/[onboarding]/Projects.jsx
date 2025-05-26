"use client";

import React, { useState, useEffect } from "react";
import ProjectCard from "../../ui/ProjectCard";
import { Plus } from "lucide-react";

const Projects = ({ formData, setFormData }) => {
  const [cards, setCards] = useState([]);

  // Initialize cards based on existing projects
  useEffect(() => {
    if (formData?.projects && Array.isArray(formData.projects)) {
      setCards(formData.projects.map((_, index) => index));
    } else {
      setCards([0]);
      setFormData({
        ...formData,
        projects: [
          {
            project_title: "",
            project_description: "",
            project_link: "",
            project_img: "",
          },
        ],
      });
    }
  }, [formData]);

  const addCard = () => {
    if (cards.length >= 3) return;
    const newIndex = cards.length;
    setCards((prev) => [...prev, newIndex]);
    setFormData((prevFormData) => ({
      ...prevFormData,
      projects: [
        ...(prevFormData.projects || []),
        {
          project_title: "",
          project_description: "",
          project_link: "",
          project_img: "",
        },
      ],
    }));
  };

  const removeCard = (indexToRemove) => {
    setCards((prev) => prev.filter((_, index) => index !== indexToRemove));
    setFormData((prevFormData) => ({
      ...prevFormData,
      projects: prevFormData.projects.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };
  return (
    <section className="w-full  max-w-[80%] sm:max-w-lg lg:max-w-xl bg-white/80 rounded-xl px-6 py-8 shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Projects</h2>
      <div className="space-y-4">
        {cards.map((id) => (
          <div key={id} className="animate-fade-in">
            <ProjectCard
              id={id}
              formData={formData}
              setFormData={setFormData}
              removeCard={removeCard}
            />
          </div>
        ))}
      </div>
      <button
        onClick={addCard}
        disabled={cards.length >= 3}
        className={`mt-4 flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg
          ${
            cards.length >= 3
              ? "bg-gray-300 cursor-not-allowed hover:scale-100 hover:none"
              : "bg-primary-500 hover:bg-primary-600 text-white"
          }
        `}
      >
        <Plus size={26} />
      </button>
    </section>
  );
};

export default Projects;
