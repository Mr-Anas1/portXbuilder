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
import { supabase } from "@/lib/supabaseClient";
import { generateFields } from "@/lib/generateFields";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

function CreatePortfolio() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPortfolio, setHasPortfolio] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    profession: "",
    profileImage: "",
    experience: "",
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

    home_title: "",
    home_subtitle: "",
    about_me: "",
    skills: [],
  });

  const [isValid, setIsValid] = useState({
    name: true,
    profession: true,
    bio: true,
  });

  const [proceed, setProceed] = useState(false);

  useEffect(() => {
    const checkPortfolio = async () => {
      if (loading || !user) return;

      const { data, error } = await supabase
        .from("portfolios")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle(); // safer than .single() for optional results

      if (error) {
        console.error("Error checking portfolio:", error.message);
        return;
      }

      if (data) {
        router.push("/dashboard"); // Redirect if portfolio exists
      }
    };

    checkPortfolio();
  }, [user, loading, router, supabase]);

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

  const handleCreatePortfolio = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("No user logged in");
      return;
    }

    try {
      if (
        !formData ||
        !formData.name ||
        !formData.profession ||
        !formData.age ||
        !formData.experience
      ) {
        console.error("Missing required fields");
        return;
      }

      const aiFields = await generateFields({
        name: formData.name,
        profession: formData.profession,
        age: formData.age,
        experience: formData.experience,
      });

      if (!aiFields) {
        console.error("Failed to generate AI fields");
        return;
      }

      let profileImagePath = "";
      if (formData.profileImage) {
        const file = formData.profileImage;
        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `profile-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("profile-images")
          .upload(filePath, file);

        if (uploadError) {
          console.error("Error uploading image:", uploadError.message);
          return;
        }

        const { data: urlData } = supabase.storage
          .from("profile-images")
          .getPublicUrl(filePath);

        profileImagePath = urlData?.publicUrl || filePath;
      }

      const fullData = {
        user_id: user.id,
        name: formData.name,
        age: formData.age,
        profession: formData.profession,
        experience: formData.experience,
        bio: formData.bio,
        email: formData.email,
        location: formData.location,
        phone: formData.phone,
        github: formData.github,
        linkedin: formData.linkedin,
        x: formData.x,
        instagram: formData.instagram,
        facebook: formData.facebook,
        projects: formData.projects,
        profileImage: profileImagePath,
        ...aiFields,
      };

      const { error: insertError } = await supabase
        .from("portfolios")
        .upsert(fullData, {
          onConflict: "user_id",
        });

      if (insertError) {
        console.error(
          "Error inserting/updating portfolio:",
          insertError.message
        );
        return;
      }

      setFormData((prev) => ({
        ...prev,
        ...aiFields,
        profileImage: profileImagePath,
      }));

      console.log("Portfolio created successfully with AI fields!");
      router.push("/dashboard");
    } catch (err) {
      console.error("Unexpected error:", err.message || err);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-16 w-64 h-64 bg-gradient-to-r from-primary-400/20 to-secondary-400/20 rounded-full blur-3xl" />
      <div className="absolute top-1/4 right-[10px] w-32 h-32 bg-secondary-400/20 rounded-full blur-2xl" />
      <div className="absolute bottom-[50px] left-1/4 w-32 h-32 bg-primary-400/20 rounded-full blur-2xl" />
      <div className="h-screen overflow-x-hidden">
        <Navbar />

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
                onClick={handleCreatePortfolio}
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
