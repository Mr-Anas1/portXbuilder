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
import { usePortfolio } from "@/context/PortfolioContext";
import { useEffect } from "react";
import { removeBackground } from "@imgly/background-removal";
import { toast } from "react-hot-toast";

// Browser-compatible UUID generation
const generateSecureId = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

function CreatePortfolio() {
  const { user, loading } = useAuthContext();
  const { refetchPortfolio } = usePortfolio();
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPortfolio, setHasPortfolio] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [creationProgress, setCreationProgress] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(8); // Total number of steps

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

  const handleCreatePortfolio = async () => {
    if (!user) {
      toast.error("No user logged in");
      return;
    }

    try {
      setIsCreating(true);
      setCurrentStep(1);

      // Adjust total steps based on whether profile image is provided
      const hasProfileImage = !!formData.profileImage;
      setTotalSteps(hasProfileImage ? 8 : 6);

      setCreationProgress("Preparing your portfolio...");

      if (
        !formData ||
        !formData.name ||
        !formData.profession ||
        !formData.age ||
        !formData.experience
      ) {
        toast.error("Missing required fields");
        return;
      }

      setCurrentStep(2);
      setCreationProgress("Generating AI content...");
      const aiFields = await generateFields({
        name: formData.name,
        profession: formData.profession,
        age: formData.age,
        experience: formData.experience,
      });

      if (!aiFields) {
        toast.error("Failed to generate AI content");
        return;
      }

      setCurrentStep(3);
      setCreationProgress(
        "AI content generated successfully! Processing your profile image..."
      );

      let profileImagePath = "";
      if (formData.profileImage) {
        setCurrentStep(4);
        setCreationProgress(
          "Processing your profile image... (This may take 1-2 minutes)"
        );
        const fileExt = formData.profileImage.name.split(".").pop();
        const fileName = `${generateSecureId()}-${Date.now()}.${fileExt}`;
        const filePath = `profile-images/${fileName}`;
        let processedBlob = null;

        try {
          setCreationProgress(
            "Removing background from your image... (This step takes the longest - please be patient)"
          );
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
          setCreationProgress(
            "Background removal completed! Uploading your image..."
          );
        } catch (e) {
          setCreationProgress(
            "Background removal failed, uploading original image..."
          );
        }

        try {
          setCurrentStep(5);
          setCreationProgress("Uploading your profile image to our servers...");
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
            toast.error("Error uploading image");
            return;
          }

          const { data: urlData } = supabase.storage
            .from("profile-images")
            .getPublicUrl(filePath);

          if (!urlData?.publicUrl) {
            toast.error("Failed to get image URL");
            return;
          }

          profileImagePath = urlData.publicUrl;
          setCreationProgress("Profile image uploaded successfully!");
        } catch (uploadError) {
          toast.error("Error uploading image");
          return;
        }
      } else {
        setCurrentStep(5);
        setCreationProgress(
          "No profile image provided, continuing with portfolio creation..."
        );
      }

      setCurrentStep(hasProfileImage ? 6 : 5);
      setCreationProgress("Setting up your user account...");

      // First get the user's Supabase ID from the users table using the API route
      const response = await fetch("/api/sync-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error("Failed to sync user data");
        throw new Error("Failed to sync user data");
      }

      const userData = await response.json();

      if (!userData || !userData.id) {
        toast.error("No user data found");
        throw new Error("No user data found");
      }

      setCurrentStep(hasProfileImage ? 7 : 6);
      setCreationProgress("Creating your portfolio in our database...");

      const fullData = {
        user_id: userData.id, // Use Supabase user ID instead of Clerk ID
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
        toast.error(error.error || "Failed to create portfolio");
        throw new Error(error.error || "Failed to create portfolio");
      }

      const createdPortfolio = await portfolioResponse.json();

      setFormData((prev) => ({
        ...prev,
        ...aiFields,
        profileImage: profileImagePath,
      }));

      setCurrentStep(hasProfileImage ? 8 : 7);
      setCreationProgress("Finalizing your portfolio setup...");

      // Wait for a moment to ensure data is synced
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Verify that the portfolio was created successfully
      let portfolioVerified = false;
      let retryCount = 0;
      const maxRetries = 5;

      while (!portfolioVerified && retryCount < maxRetries) {
        try {
          // Get user's Supabase ID
          const userResponse = await fetch("/api/sync-user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
          });

          if (!userResponse.ok) {
            throw new Error("Failed to sync user");
          }

          const userData = await userResponse.json();

          // Check if portfolio exists
          const { data: portfolioCheck, error: portfolioCheckError } =
            await supabase
              .from("portfolios")
              .select("id")
              .eq("user_id", userData.id)
              .single();

          if (portfolioCheckError) {
            if (portfolioCheckError.code === "PGRST116") {
              // Portfolio not found, retry after delay
              retryCount++;
              setCreationProgress(
                `Verifying portfolio creation... (attempt ${retryCount}/${maxRetries})`
              );
              await new Promise((resolve) => setTimeout(resolve, 1000));
              continue;
            } else {
              throw new Error("Error checking portfolio");
            }
          }

          // Portfolio found, verification successful
          portfolioVerified = true;
          setCreationProgress("Portfolio verified successfully!");
        } catch (error) {
          retryCount++;
          if (retryCount >= maxRetries) {
            throw new Error("Failed to verify portfolio creation");
          }
          setCreationProgress(
            `Verifying portfolio creation... (attempt ${retryCount}/${maxRetries})`
          );
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      if (!portfolioVerified) {
        throw new Error(
          "Portfolio verification failed after multiple attempts"
        );
      }

      setCreationProgress(
        "Portfolio created successfully! Redirecting to your dashboard..."
      );

      // Add a small delay before redirect to ensure everything is ready
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Navigate to dashboard
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.message || "Failed to create portfolio");
    } finally {
      setIsCreating(false);
      setCurrentStep(0);
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
              <p className="text-muted-foreground mb-4">{creationProgress}</p>

              {/* Progress indicator */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${(currentStep / totalSteps) * 100}%`,
                  }}
                ></div>
              </div>

              {/* Show additional info for background removal */}
              {currentStep === 4 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                  <p className="text-sm text-blue-800">
                    <strong>Background Removal Process:</strong>
                  </p>
                  <ul className="text-xs text-blue-700 mt-2 space-y-1 text-left">
                    <li>• Analyzing your image structure</li>
                    <li>• Identifying foreground and background</li>
                    <li>• Processing with AI model</li>
                    <li>• Generating clean background removal</li>
                  </ul>
                  <p className="text-xs text-blue-600 mt-2">
                    This process uses advanced AI and may take 1-2 minutes
                    depending on image complexity.
                  </p>
                </div>
              )}

              {/* Show general tips */}
              {currentStep !== 4 && currentStep > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-4">
                  <p className="text-sm text-gray-700">
                    <strong>What's happening:</strong> We're setting up your
                    professional portfolio with all your details, projects, and
                    customizations.
                  </p>
                </div>
              )}
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
