"use client";

import React, { useState } from "react";
import Welcome from "./Welcome";
import BasicInfo from "./BasicInfo";
import Projects from "./Projects";
import Social from "./Social";
import Review from "./Review";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import Navbar from "../Navbar/Page";
import { supabase } from "@/lib/supabaseClient";
import { generateFields } from "@/lib/generateFields";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect } from "react";
import { removeBackground } from "@imgly/background-removal";
import { toast } from "react-hot-toast";

function CreatePortfolio() {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPortfolio, setHasPortfolio] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [creationProgress, setCreationProgress] = useState("");

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
        project_img: {
          name: "",
          data: "",
        },
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
      if (loading || !user) {
        return;
      }

      setIsLoading(true);

      try {
        // First get the user's Supabase ID from the users table
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id")
          .eq("clerk_id", user.id)
          .single();

        if (userError) {
          console.error("Error fetching user data:", userError);
          return;
        }

        if (!userData) {
          console.error("No user data found");
          return;
        }

        // Then check for portfolio using the Supabase user ID
        const { data, error } = await supabase
          .from("portfolios")
          .select("id")
          .eq("user_id", userData.id)
          .single();

        if (error) {
          console.error("Error checking portfolio:", error);
        } else {
          setHasPortfolio(!!data);
        }
      } catch (error) {
        console.error("Error in checkPortfolio:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkPortfolio();
  }, [user, loading, supabase]);

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

  {
    console.log(formData);
  }

  const handleCreatePortfolio = async () => {
    if (!user) {
      console.error("No user logged in");
      return;
    }

    try {
      setIsCreating(true);
      setCreationProgress("Preparing your portfolio...");

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

      setCreationProgress("Generating AI content...");
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
        setCreationProgress("Processing your profile image...");
        const fileExt = formData.profileImage.name.split(".").pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `profile-images/${fileName}`;
        let processedBlob = null;

        try {
          processedBlob = await removeBackground(formData.profileImage, {
            debug: true,
            device: "cpu",
            model: "isnet_fp16",
            output: {
              format: "image/webp",
              quality: 0.8,
              type: "foreground",
            },
          });
        } catch (e) {
          console.error("Background removal failed:", e);
        }

        try {
          setCreationProgress("Uploading your profile image...");
          const uploadBlob = processedBlob || formData.profileImage;
          const contentType = processedBlob
            ? "image/webp"
            : formData.profileImage.type;

          const { error: uploadError } = await supabase.storage
            .from("profile-images")
            .upload(filePath, uploadBlob, {
              contentType,
              cacheControl: "3600",
            });

          if (uploadError) {
            console.error("Error uploading image:", uploadError.message);
            return;
          }

          const { data: urlData } = supabase.storage
            .from("profile-images")
            .getPublicUrl(filePath);

          if (!urlData?.publicUrl) {
            console.error("Failed to get public URL for uploaded image");
            return;
          }

          profileImagePath = urlData.publicUrl;
        } catch (uploadError) {
          console.error("Error during upload process:", uploadError);
          return;
        }
      }

      setCreationProgress("Finalizing your portfolio...");

      // First get the user's Supabase ID from the users table using the API route
      console.log("Fetching user data for Clerk ID:", user.id);
      const response = await fetch("/api/sync-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error syncing user:", error);
        throw new Error("Failed to sync user data");
      }

      const userData = await response.json();
      console.log("Found user data:", userData);

      if (!userData || !userData.id) {
        console.error("No user data found for Clerk ID:", user.id);
        throw new Error("No user data found");
      }

      const fullData = {
        user_id: user.id, // Use clerk_id directly since we're using it in the API
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

      // Create portfolio using the API route
      const portfolioResponse = await fetch("/api/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fullData),
      });

      if (!portfolioResponse.ok) {
        const error = await portfolioResponse.json();
        console.error("Error creating portfolio:", error);
        throw new Error(error.error || "Failed to create portfolio");
      }

      setFormData((prev) => ({
        ...prev,
        ...aiFields,
        profileImage: profileImagePath,
      }));

      setCreationProgress("Syncing your portfolio data...");

      // Wait for a moment to ensure data is synced
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Force a refetch of the portfolio data
      const syncResponse = await fetch("/api/portfolio", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!syncResponse.ok) {
        console.error("Error syncing portfolio data");
      }

      setCreationProgress("Redirecting to your dashboard...");
      router.push("/dashboard");
    } catch (err) {
      console.error("Unexpected error:", err.message || err);
      toast.error(err.message || "Failed to create portfolio");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-16 w-64 h-64 bg-gradient-to-r from-primary-400/20 to-secondary-400/20 rounded-full blur-3xl" />
      <div className="absolute top-1/4 right-[10px] w-32 h-32 bg-secondary-400/20 rounded-full blur-2xl" />
      <div className="absolute bottom-[50px] left-1/4 w-32 h-32 bg-primary-400/20 rounded-full blur-2xl" />
      <div className="h-screen overflow-x-hidden">
        <Navbar />

        {isCreating && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-card p-8 rounded-lg shadow-lg max-w-md w-full mx-4 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <h2 className="text-xl font-semibold mb-2">
                Creating Your Portfolio
              </h2>
              <p className="text-muted-foreground">{creationProgress}</p>
            </div>
          </div>
        )}

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
                disabled={page === 0 || isCreating}
              >
                Back
              </Button>

              <Button
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                size="lg"
                onClick={handleCreatePortfolio}
                disabled={
                  !proceed || page === FormTitles.length - 1 || isCreating
                }
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Portfolio"
                )}
              </Button>
            </div>
          ) : page === FormTitles.length - 1 ? null : (
            <div className="flex gap-6 justify-center items-center">
              <Button
                className="text-center relative flex flex-col justify-center items-center hover:bg-background hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                variant={"outline"}
                size="lg"
                onClick={() => setPage((currentPage) => currentPage - 1)}
                disabled={page === 0 || isCreating}
              >
                Back
              </Button>

              <Button
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                size="lg"
                onClick={() => setPage((currentPage) => currentPage + 1)}
                disabled={
                  !proceed || page === FormTitles.length - 1 || isCreating
                }
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
