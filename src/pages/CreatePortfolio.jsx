import React, { useState, useCallback } from "react";
import ProjectCard from "../components/ui/ProjectCard";

const CreatePortfolio = () => {
  const [formData, setFormData] = useState({
    projects: [],
  });
  const [projectErrors, setProjectErrors] = useState({});

  const updateProjectError = useCallback((index, hasError) => {
    setProjectErrors((prev) => ({
      ...prev,
      [index]: hasError,
    }));
  }, []);

  const hasErrors = () => {
    return Object.values(projectErrors).some((error) => error === true);
  };

  return (
    <div>
      {/* Your existing form content */}
      {formData.projects.map((project, index) => (
        <ProjectCard
          key={index}
          index={index}
          formData={formData}
          setFormData={setFormData}
          updateProjectError={updateProjectError}
        />
      ))}

      <button
        disabled={hasErrors()}
        onClick={handleNext}
        className={`${hasErrors() ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        Next
      </button>
    </div>
  );
};

export default CreatePortfolio;
