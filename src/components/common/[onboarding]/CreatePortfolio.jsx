"use client";

import React, { useState } from "react";
import Welcome from "./Welcome";
import { Button } from "@/components/ui/button";

function CreatePortfolio() {
  const [page, setPage] = useState(0);

  const FormTitles = [
    "Welcome",
    "Basic Information",
    "Hero Section",
    "Projects",
    "Social",
    "Review",
  ];
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-16 w-64 h-64 bg-gradient-to-r from-primary-400/20 to-secondary-400/20 rounded-full blur-3xl" />
      <div className="absolute top-1/4 right-[10px] w-32 h-32 bg-secondary-400/20 rounded-full blur-2xl" />
      <div className="absolute bottom-[50px] left-1/4 w-32 h-32 bg-primary-400/20 rounded-full blur-2xl" />
      <div className="text-center relative w-screen h-screen flex flex-col justify-center items-center gap-6">
        <Welcome />
        <div className="flex gap-6 justify-center items-center">
          <Button
            className="text-center relative flex flex-col justify-center items-center hover:bg-white hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            variant={"outline"}
            size="lg"
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CreatePortfolio;
