"use client";

import React, { useState } from "react";
import Welcome from "./Welcome";
import BasicInfo from "./BasicInfo";
import Projects from "./Projects";
import Social from "./Social";
import Review from "./Review";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Navbar from "../Navbar/Page";

function CreatePortfolio() {
  const [page, setPage] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    profession: "",
    profileImage: "",
    bio: "",
    email: "",
    location: "",
    phone: "",
    projects: [
      {
        project_title: "",
        project_description: "",
        project_link: "",
        project_img: "",
      },
    ],
    github: "",
    linkedin: "",
    x: "",
    instagram: "",
    facebook: "",
  });

  const [isValid, setIsValid] = useState({
    name: true,
    profession: true,
    bio: true,
  });

  const [proceed, setProceed] = useState(false);

  const FormTitles = [
    "Welcome",
    "Basic Information",
    "Projects",
    "Social",
    "Review",
  ];

  const PageDisplay = () => {
    switch (page) {
      case 0:
        return <Welcome />;
      case 1:
        return (
          <BasicInfo
            formData={formData}
            setFormData={setFormData}
            isValid={isValid}
            setIsValid={setIsValid}
            setProceed={setProceed}
          />
        );
      case 2:
        return <Projects formData={formData} setFormData={setFormData} />;
      case 3:
        return <Social formData={formData} setFormData={setFormData} />;
      case 4:
        return <Review />;
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-16 w-64 h-64 bg-gradient-to-r from-primary-400/20 to-secondary-400/20 rounded-full blur-3xl" />
      <div className="absolute top-1/4 right-[10px] w-32 h-32 bg-secondary-400/20 rounded-full blur-2xl" />
      <div className="absolute bottom-[50px] left-1/4 w-32 h-32 bg-primary-400/20 rounded-full blur-2xl" />
      <div className="h-screen overflow-x-hidden">
        <Navbar />
        {console.log(formData)}

        <div className="text-center my-12 min-h-[calc(100vh-86px)] relative w-screen flex flex-col justify-center items-center gap-6 ">
          {PageDisplay()}

          {page === 0 ? (
            <button
              className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-3 rounded-lg font-medium flex items-center mx-auto hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              onClick={() => setPage((currentPage) => currentPage + 1)}
            >
              Get Started
              <ArrowRight className="ml-2" size={20} />
            </button>
          ) : page === 3 ? (
            <div className="flex gap-6 justify-center items-center">
              <Button
                className="text-center relative flex flex-col justify-center items-center hover:bg-background hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                variant={"outline"}
                size="lg"
                onClick={() => setPage((currentPage) => currentPage - 1)}
                disabled={page === 0}
              >
                Back
              </Button>

              <Button
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                size="lg"
                onClick={() => setPage((currentPage) => currentPage + 1)}
                disabled={!proceed || page === FormTitles.length - 1}
              >
                Create Portfolio
              </Button>
            </div>
          ) : page === FormTitles.length - 1 ? null : (
            <div className="flex gap-6 justify-center items-center">
              <Button
                className="text-center relative flex flex-col justify-center items-center hover:bg-background hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                variant={"outline"}
                size="lg"
                onClick={() => setPage((currentPage) => currentPage - 1)}
                disabled={page === 0}
              >
                Back
              </Button>

              <Button
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                size="lg"
                onClick={() => setPage((currentPage) => currentPage + 1)}
                disabled={!proceed || page === FormTitles.length - 1}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreatePortfolio;
