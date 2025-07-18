"use client";
import Navbar from "@/components/common/Navbar/Page";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "@/components/common/Sidebar/Page";
import MobileSidebar from "@/components/common/MobileSidebar/Page";
import { useAuthContext } from "@/context/AuthContext";
import {
  ChevronDown,
  ChevronUp,
  Contact,
  Drama,
  FolderKanban,
  LayoutGrid,
  LayoutPanelTopIcon,
  Pen,
  Rocket,
  Smartphone,
  Sparkles,
  X,
} from "lucide-react";
import { useRef } from "react";
import { navbarComponents } from "@/components/Navbars/index";
import { heroComponents } from "@/components/HeroSections/index";
import { projectsComponents } from "@/components/Projects/index";
import { contactComponents } from "@/components/ContactSection/index";
import { footerComponents } from "@/components/FooterSection/index";
import { aboutComponents } from "@/components/AboutSection/index";
import previewThemes from "@/components/ui/previewThemes";
import SectionWrapper from "@/components/ui/SectionWrapper";
import { usePortfolioRedirect } from "@/context/usePortfolioRedirect";
import { usePortfolio } from "@/context/PortfolioContext";
import PortfolioEditor from "@/components/PortfolioEditor/PortfolioEditor";
import LaunchSuccessModal from "@/components/ui/LaunchSuccessModal";
import { toast } from "react-hot-toast";
import { useProStatusClient } from "@/context/useProStatusClient";
import PricingSectionCards from "@/components/Home/PricingSection";

export default function Dashboard() {
  const { user, loading, isOffline, retrySync } = useAuthContext();
  const hasProPlan = useProStatusClient();
  const navbarRef = useRef(null);
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);
  const footerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("navbar");
  const [showOverlay, setShowOverlay] = useState(false);
  const [pricingOverlay, setPricingOverlay] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState({
    navbar: navbarComponents[0],
    home: heroComponents[0],
    about: aboutComponents[0],
    projects: projectsComponents[0],
    contact: contactComponents[0],
    footer: footerComponents[0],
  });
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const [themeOverlay, setThemeOverlay] = useState(false);
  const [themeKey, setThemeKey] = useState("default");
  const [editingSection, setEditingSection] = useState(null);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [enteredName, setEnteredName] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isNameTaken, setIsNameTaken] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [portfolioData, setPortfolioData] = useState({});
  const [formData, setFormData] = useState({});
  const [isLaunching, setIsLaunching] = useState(false);

  // Add section to field mapping
  const sectionToField = {
    navbar: ["name"],
    home: ["home_title", "home_subtitle", "profileImage"],
    about: ["about_me"],
    projects: ["projects"],
    contact: [
      "email",
      "phone",
      "github",
      "linkedin",
      "x",
      "instagram",
      "facebook",
    ],
    footer: ["name"],
  };

  const [sections, setSections] = useState([
    { id: "navbar", label: "Navbar", icon: LayoutGrid, isCustom: false },
    { id: "home", label: "Home", icon: Sparkles, isCustom: false },
    { id: "about", label: "About", icon: Drama, isCustom: false },
    { id: "projects", label: "Projects", icon: FolderKanban, isCustom: false },
    { id: "contact", label: "Contact", icon: Contact, isCustom: false },
    {
      id: "footer",
      label: "Footer",
      icon: LayoutPanelTopIcon,
      isCustom: false,
    },
  ]);

  const { portfolio, refetchPortfolio, portfolioLoading, updatePortfolioData } =
    usePortfolio();

  usePortfolioRedirect();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    }
  }, [loading, user, router]);

  // Helper to map saved component names to actual component objects
  function getComponentByName(name, componentsArray) {
    if (!name) return componentsArray[0];
    return componentsArray.find((c) => c.name === name) || componentsArray[0];
  }

  useEffect(() => {
    const loadUserComponents = async () => {
      if (loading || !user) return;

      try {
        // First get the user's Supabase ID
        const response = await fetch("/api/sync-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });

        if (!response.ok) {
          // Don't show error toast for first-time users who will be redirected
          return;
        }

        const userData = await response.json();

        if (!userData) {
          // Don't show error toast for first-time users who will be redirected
          return;
        }

        // Check if user has a portfolio before trying to load components
        const { data: portfolioData, error: portfolioError } = await supabase
          .from("portfolios")
          .select("id")
          .eq("user_id", userData.id)
          .single();

        // If no portfolio exists, don't try to load components
        // The usePortfolioRedirect hook will handle the redirect
        if (portfolioError && portfolioError.code === "PGRST116") {
          // No portfolio found, user will be redirected to /create
          setIsLoading(false);
          return;
        }

        if (portfolioError) {
          setIsLoading(false);
          return;
        }

        // Get user's saved components
        const { data, error } = await supabase
          .from("users")
          .select("components, theme")
          .eq("id", userData.id)
          .single();

        if (error) {
          toast.error("Error fetching user components");
          return;
        }

        if (data) {
          // Set selected components based on saved data
          if (data.components) {
            setSelectedComponent((prev) => ({
              navbar: getComponentByName(
                data.components.navbar,
                navbarComponents
              ),
              home: getComponentByName(data.components.home, heroComponents),
              about: getComponentByName(data.components.about, aboutComponents),
              projects: getComponentByName(
                data.components.projects,
                projectsComponents
              ),
              contact: getComponentByName(
                data.components.contact,
                contactComponents
              ),
              footer: getComponentByName(
                data.components.footer,
                footerComponents
              ),
            }));
          }

          // Set theme
          if (data.theme) {
            setThemeKey(data.theme);
          }
        }

        // Set loading to false once everything is loaded
        setIsLoading(false);
      } catch (error) {
        // Don't show error toast for first-time users who will be redirected
        setIsLoading(false);
      }
    };

    loadUserComponents();
  }, [user, loading]);

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex justify-center items-center">
  //       <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
  //     </div>
  //   );
  // }

  // For Theme change

  const handleThemeButtonClick = () => {
    setThemeOverlay((prev) => !prev);
  };

  const handleThemeChange = async (newTheme) => {
    if (!user) return;

    try {
      // Get user's Supabase ID
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
        return;
      }

      const userData = await response.json();

      if (!userData || !userData.id) {
        toast.error("No user data found");
        return;
      }

      // Update user theme
      const { data, error } = await supabase
        .from("users")
        .update({ theme: newTheme })
        .eq("clerk_id", user.id)
        .select()
        .single();

      if (error) {
        toast.error("Failed to update theme");
        return;
      }

      // Update local state
      setThemeKey(newTheme);
      setSelectedComponent((prev) => ({
        ...prev,
        theme: newTheme,
      }));

      toast.success("Theme updated successfully!");
    } catch (err) {
      toast.error("Failed to update theme");
    }
  };

  // For changing into mobile component

  const handleMobileLayoutClick = () => {
    setIsMobileLayout((prev) => !prev);
  };

  // For handle launch button

  // Check for pro component selected

  const isUsingProComponent = Object.values(selectedComponent).some(
    (comp) => comp.type === "pro"
  );

  // For pro users allowing to launch
  const disableLaunchButton = isUsingProComponent && !hasProPlan;

  // For randomly change component

  const getRandomComponent = (components, currentComponent = null) => {
    // If there's only one component, return it
    if (components.length === 1) {
      return components[0];
    }

    // Filter out the current component if provided
    const availableComponents = currentComponent
      ? components.filter((comp) => comp.name !== currentComponent.name)
      : components;

    // If no components available after filtering, return the original current component
    if (availableComponents.length === 0) {
      return currentComponent;
    }

    const randomIndex = Math.floor(Math.random() * availableComponents.length);
    return availableComponents[randomIndex];
  };

  const handleComponentChange = () => {
    const newComponents = {
      navbar: getRandomComponent(navbarComponents, selectedComponent.navbar),
      home: getRandomComponent(heroComponents, selectedComponent.home),
      about: getRandomComponent(aboutComponents, selectedComponent.about),
      projects: getRandomComponent(
        projectsComponents,
        selectedComponent.projects
      ),
      contact: getRandomComponent(contactComponents, selectedComponent.contact),
      footer: getRandomComponent(footerComponents, selectedComponent.footer),
    };

    setSelectedComponent(newComponents);
  };

  const changeSingleComponent = (key, componentsArray) => {
    const currentComponent = selectedComponent[key];
    const newComponent = getRandomComponent(componentsArray, currentComponent);

    setSelectedComponent((prev) => ({
      ...prev,
      [key]: newComponent,
    }));
  };

  const handleLaunchClick = async () => {
    if (disableLaunchButton) return;

    setIsLaunching(true);
    try {
      // Get the user's Supabase ID
      const response = await fetch("/api/sync-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const error = await response.json();
        return;
      }

      const userData = await response.json();

      if (!userData) {
        return;
      }

      // Create components object with just the names
      const components = {
        home: selectedComponent.home.name,
        about: selectedComponent.about.name,
        footer: selectedComponent.footer.name,
        navbar: selectedComponent.navbar.name,
        contact: selectedComponent.contact.name,
        projects: selectedComponent.projects.name,
      };

      // Update components in the database
      const { error } = await supabase
        .from("users")
        .update({
          components: components,
          theme: themeKey,
        })
        .eq("id", userData.id);

      if (error) {
        toast.error("Failed to save changes");
        return;
      }

      // Check if url_name exists
      const { data: userData2, error: urlError } = await supabase
        .from("users")
        .select("url_name")
        .eq("id", userData.id)
        .single();

      if (urlError) {
        return;
      }

      // If url_name exists and is not empty, show success modal
      if (userData2?.url_name && userData2.url_name.trim() !== "") {
        setPortfolioUrl(
          `${window.location.origin}/portfolio/${userData2.url_name}`
        );
        setShowSuccessModal(true);
      } else {
        // If no url_name exists or it's empty, show the URL modal
        setShowUrlModal(true);
      }
    } catch (error) {
      toast.error("Failed to save changes");
    } finally {
      setIsLaunching(false);
    }
  };

  const removeSection = (id) => {
    setSections((prevSection) =>
      prevSection.filter((section) => section.id !== id)
    );
  };

  const customSectionsCount = sections.filter(
    (section) => section.isCustom
  ).length;

  // Show loading spinner while loading user data
  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isOffline) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">You&apos;re Offline</h2>
          <p className="text-gray-600 mb-6">
            Please check your internet connection and try again.
          </p>
          <button
            onClick={retrySync}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleScrollToSection = (sectionId) => {
    if (sectionId === "navbar" && navbarRef.current) {
      navbarRef.current.scrollIntoView({ behavior: "smooth" });
    }

    if (sectionId === "home" && homeRef.current) {
      homeRef.current.scrollIntoView({ behavior: "smooth" });
    }

    if (sectionId === "about" && aboutRef.current) {
      aboutRef.current.scrollIntoView({ behavior: "smooth" });
    }

    if (sectionId === "projects" && projectsRef.current) {
      projectsRef.current.scrollIntoView({ behavior: "smooth" });
    }

    if (sectionId === "contact" && contactRef.current) {
      contactRef.current.scrollIntoView({ behavior: "smooth" });
    }

    if (sectionId === "footer" && footerRef.current) {
      footerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Get the current theme object
  const theme = previewThemes[themeKey] || previewThemes.default;

  // Add loading state for portfolio data
  if (portfolioLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 mb-4">Loading your portfolio...</p>
          <button
            onClick={() => refetchPortfolio()}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors text-sm"
          >
            Refresh Portfolio
          </button>
        </div>
      </div>
    );
  }

  // If portfolio is not available and we're not loading, there might be an issue
  // Let the usePortfolioRedirect hook handle the redirect if needed
  if (!portfolio) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 mb-4">Setting up your portfolio...</p>
          <button
            onClick={() => refetchPortfolio()}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors text-sm"
          >
            Refresh Portfolio
          </button>
        </div>
      </div>
    );
  }

  const saveSection = async (section, data) => {
    if (!user) {
      toast.error("No user or user ID available");
      return;
    }

    try {
      // Get field names for this section
      const fieldNames = sectionToField[section];
      if (!fieldNames) {
        toast.error("Invalid section");
        return;
      }

      // Get user's Supabase ID
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", user.id)
        .single();

      if (userError) {
        toast.error("Error fetching user data");
        return;
      }

      if (!userData) {
        toast.error("No user data found");
        return;
      }

      // Update user components and theme
      const { error: userUpdateError } = await supabase
        .from("users")
        .update({
          components: formData.components || [],
          theme: formData.theme || "default",
        })
        .eq("clerk_id", user.id);

      if (userUpdateError) {
        toast.error("Error updating user settings");
        return;
      }

      // Prepare portfolio data with all fields for this section
      const portfolioData = {
        user_id: userData.id,
      };

      // Add all fields for this section to the portfolio data
      fieldNames.forEach((fieldName) => {
        if (data[fieldName] !== undefined) {
          portfolioData[fieldName] = data[fieldName];
        }
      });

      // Update portfolio using API route
      const response = await fetch("/api/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(portfolioData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to update portfolio");
        throw new Error(errorData.error || "Failed to update portfolio");
      }

      const result = await response.json();

      // Update local state
      setFormData((prev) => ({
        ...prev,
        ...portfolioData,
      }));

      // Update portfolio context to reflect changes immediately
      updatePortfolioData(portfolioData);

      // Close the edit box
      setEditingSection(null);

      toast.success("Section saved successfully!");
    } catch (error) {
      toast.error("Error saving portfolio");
    }
  };

  // For URL name submission

  const handleUrlNameSubmit = async () => {
    if (!enteredName || !isValid || isNameTaken) return;

    try {
      setIsChecking(true);

      // First get the user's Supabase ID from the API route
      const response = await fetch("/api/sync-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        return;
      }

      const userData = await response.json();

      if (!userData) {
        return;
      }

      // Create components object
      const components = {
        home: selectedComponent.home.name,
        about: selectedComponent.about.name,
        footer: selectedComponent.footer.name,
        navbar: selectedComponent.navbar.name,
        contact: selectedComponent.contact.name,
        projects: selectedComponent.projects.name,
      };

      // Simple update instead of upsert
      console.log("Updating user with data:", {
        id: userData.id,
        url_name: enteredName,
        components: components,
        theme: themeKey,
      });

      const { data, error } = await supabase
        .from("users")
        .update({
          url_name: enteredName,
          components: components,
          theme: themeKey,
        })
        .eq("id", userData.id)
        .select();

      if (error) {
        // Try to get the current user data to debug
        const { data: currentUser, error: fetchError } = await supabase
          .from("users")
          .select("*")
          .eq("id", userData.id)
          .single();

        if (fetchError) {
          console.error("Error fetching current user:", fetchError);
        } else {
          console.log("Current user data:", currentUser);
        }
        return;
      }

      console.log("Update successful:", data);
      setShowUrlModal(false);
      setPortfolioUrl(`${window.location.origin}/portfolio/${enteredName}`);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error in handleUrlNameSubmit:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleUrlNameChange = (e) => {
    const value = e.target.value;
    setEnteredName(value);

    // Validate URL name: starts with a letter, only lowercase letters, numbers, hyphens, 3-20 chars
    const isValidName = /^[a-z][a-z0-9-]{2,19}$/.test(value);
    setIsValid(isValidName);

    if (isValidName) {
      checkUrlNameAvailability(value);
    }
  };

  const checkUrlNameAvailability = async (name) => {
    if (!name) return;

    try {
      setIsChecking(true);
      const { data, error } = await supabase
        .from("users")
        .select("url_name")
        .eq("url_name", name)
        .maybeSingle();

      if (error) {
        return;
      }

      setIsNameTaken(!!data);
    } catch (error) {
      console.error("Error in checkUrlNameAvailability:", error);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col bg-background">
      {pricingOverlay && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-[99999]">
          <PricingSectionCards />
        </div>
      )}

      {editingSection && (
        <PortfolioEditor
          section={editingSection}
          data={portfolio}
          onClose={() => setEditingSection(null)}
          onSave={saveSection}
          style={{ "z-index": "99" }}
        />
      )}

      {showUrlModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-[99999] px-2">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setShowUrlModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold mb-4">Choose your URL name</h2>
            {/* Info box */}
            <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-sm flex flex-col gap-1">
              <span className="font-semibold">Important:</span>
              <span>
                <strong>You can only set your URL name once.</strong> This will
                be your unique public portfolio link.
              </span>
              <span>
                Share your portfolio using:{" "}
                <span className="font-mono bg-blue-100 px-1 rounded">
                  www.portxbuilder.com/portfolio/&lt;your-url-name&gt;
                </span>
              </span>
            </div>
            <div className="relative">
              <input
                className={`w-full px-4 py-2 rounded-lg border transition-all duration-100 outline-none shadow-sm focus:ring-2 focus:ring-primary-200 focus:border-primary-400 bg-gray-50 text-gray-800 placeholder-gray-400 ${
                  !isValid || isNameTaken
                    ? "border-red-500 focus:ring-2 focus:ring-red-400"
                    : "border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                }`}
                placeholder="e.g. johnsmith"
                value={enteredName}
                onChange={handleUrlNameChange}
                maxLength={20}
                autoFocus
              />
              {isChecking && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            <div className="mt-2 space-y-2">
              {!isValid && (
                <p className="text-red-500 text-sm">
                  URL must start with a lowercase letter, be 3-20 characters,
                  and only contain lowercase letters, numbers, and hyphens (-).
                </p>
              )}
              {isNameTaken && (
                <p className="text-red-500 text-sm">
                  This name is already taken. Please choose a different one.
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowUrlModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUrlNameSubmit}
                disabled={!isValid || isNameTaken || isChecking || !enteredName}
                className={`px-4 py-2 rounded-md text-white font-semibold transition-all duration-200 ${
                  !isValid || isNameTaken || isChecking || !enteredName
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary-500 hover:bg-primary-600"
                }`}
              >
                Save & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <LaunchSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        portfolioUrl={portfolioUrl}
      />

      <Navbar isDashboard={true} />
      <div className="flex">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          showOverlay={showOverlay}
          setShowOverlay={setShowOverlay}
          newSectionName={newSectionName}
          setNewSectionName={setNewSectionName}
          removeSection={removeSection}
          customSectionCount={customSectionsCount}
          sections={sections}
          setSections={setSections}
          handleScrollToSection={handleScrollToSection}
        />
        {mobileSidebarOpen && (
          <MobileSidebar
            setMobileSidebarOpen={setMobileSidebarOpen}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            showOverlay={showOverlay}
            setShowOverlay={setShowOverlay}
            newSectionName={newSectionName}
            setNewSectionName={setNewSectionName}
            removeSection={removeSection}
            customSectionCount={customSectionsCount}
            sections={sections}
            setSections={setSections}
            handleScrollToSection={handleScrollToSection}
          />
        )}

        <div className="flex-1 mt-16 ">
          <div
            className={`flex-1 ml-[0] md:ml-[20%] py-4 px-4 transition-all duration-300 ${
              isMobileLayout
                ? " mx-auto md:ml-[45%] md:max-w-[420px] mb-16"
                : ""
            }`}
          >
            {/* Fixed outline container */}
            <div className="h-[85vh] overflow-y-auto border-[2px] border-dashed border-primary-500 rounded-xl  bg-white shadow-sm">
              <SectionWrapper
                id="navbar"
                innerRef={navbarRef}
                Component={selectedComponent.navbar.component}
                componentMeta={selectedComponent.navbar}
                theme={theme}
                handleScrollToSection={handleScrollToSection}
                changeFunction={changeSingleComponent}
                componentList={navbarComponents}
                isMobileLayout={isMobileLayout}
                setIsMobileLayout={setIsMobileLayout}
                setEditingSection={setEditingSection}
              />

              <SectionWrapper
                id="home"
                innerRef={homeRef}
                Component={selectedComponent.home.component}
                componentMeta={selectedComponent.home}
                theme={theme}
                handleScrollToSection={handleScrollToSection}
                changeFunction={changeSingleComponent}
                componentList={heroComponents}
                isMobileLayout={isMobileLayout}
                setIsMobileLayout={setIsMobileLayout}
                setEditingSection={setEditingSection}
              />

              <SectionWrapper
                id="about"
                innerRef={aboutRef}
                Component={selectedComponent.about.component}
                componentMeta={selectedComponent.about}
                theme={theme}
                changeFunction={changeSingleComponent}
                componentList={aboutComponents}
                isMobileLayout={isMobileLayout}
                setIsMobileLayout={setIsMobileLayout}
                setEditingSection={setEditingSection}
              />

              <SectionWrapper
                id="projects"
                innerRef={projectsRef}
                Component={selectedComponent.projects.component}
                componentMeta={selectedComponent.projects}
                theme={theme}
                changeFunction={changeSingleComponent}
                componentList={projectsComponents}
                isMobileLayout={isMobileLayout}
                setIsMobileLayout={setIsMobileLayout}
                setEditingSection={setEditingSection}
              />

              <SectionWrapper
                id="contact"
                innerRef={contactRef}
                Component={selectedComponent.contact.component}
                componentMeta={selectedComponent.contact}
                theme={theme}
                changeFunction={changeSingleComponent}
                componentList={contactComponents}
                isMobileLayout={isMobileLayout}
                setIsMobileLayout={setIsMobileLayout}
                setEditingSection={setEditingSection}
              />

              <SectionWrapper
                id="footer"
                innerRef={footerRef}
                Component={selectedComponent.footer.component}
                componentMeta={selectedComponent.footer}
                theme={theme}
                changeFunction={changeSingleComponent}
                componentList={footerComponents}
                isMobileLayout={isMobileLayout}
                setIsMobileLayout={setIsMobileLayout}
                setEditingSection={setEditingSection}
              />

              {/* Custom sections */}
              {sections
                .filter((section) => section.isCustom)
                .map((section) => (
                  <SectionWrapper
                    key={section.id}
                    id={section.id}
                    Component={section.component}
                    componentMeta={section}
                    theme={theme}
                    changeFunction={changeSingleComponent}
                    componentList={[]}
                    isMobileLayout={isMobileLayout}
                    setIsMobileLayout={setIsMobileLayout}
                    setEditingSection={setEditingSection}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="z-50 fixed left-1/2 bottom-4 transform -translate-x-1/2 flex items-center gap-4 bg-white px-2 py-2 shadow-lg rounded-lg border border-primary-500 ">
        <button
          className="md:hidden px-2 py-1 rounded-md text-primary-500 border border-primary-500 text-md cursor-pointer font-semibold transition-all duration-200 ease-in hover:shadow-lg hover:scale-105"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        >
          Edit
        </button>

        <button
          className="px-2 py-1 md:px-4 md:py-2 rounded-md text-primary-500 border border-primary-500 text-md cursor-pointer font-semibold transition-all duration-200 ease-in hover:shadow-lg hover:scale-105"
          onClick={handleComponentChange}
        >
          Change
        </button>

        <div>
          <button
            className="px-2 py-1 md:px-4 md:py-2 relative rounded-md text-primary-500 border border-primary-500 text-md cursor-pointer font-semibold transition-all duration-200 ease-in hover:shadow-lg  hover:scale-105 flex justify-center items-center gap-1"
            onClick={handleThemeButtonClick}
          >
            Theme {themeOverlay ? <ChevronDown /> : <ChevronUp />}
          </button>

          {themeOverlay && (
            <div className="absolute left-1/2 bottom-16 transform -translate-x-1/2 z-50 bg-white rounded-2xl shadow-2xl p-6 min-w-[320px] max-w-[95vw] border border-primary-200 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-primary-700">
                  Choose a Theme
                </h3>
                <button
                  onClick={handleThemeButtonClick}
                  className="text-gray-400 hover:text-primary-500 transition-colors text-xl font-bold"
                >
                  ×
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Object.entries(previewThemes).map(([key, t]) => (
                  <button
                    key={key}
                    onClick={() => handleThemeChange(key)}
                    className={`group relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 shadow-sm focus:outline-none
                      ${
                        themeKey === key
                          ? "border-primary-500 ring-2 ring-primary-200"
                          : "border-gray-200 hover:border-primary-400"
                      }
                      bg-gradient-to-br from-white to-gray-50 hover:shadow-lg`}
                  >
                    {/* Mini preview swatch */}
                    <div className="w-14 h-8 rounded-lg mb-2 flex overflow-hidden border border-gray-200">
                      <div className={`flex-1 ${t.bg}`}></div>
                      <div className={`flex-1 ${t.buttonBg}`}></div>
                      <div className={`flex-1 ${t.accentBg}`}></div>
                    </div>
                    <span className="text-xs font-medium capitalize text-gray-700 group-hover:text-primary-600">
                      {key}
                    </span>
                    {themeKey === key && (
                      <span className="absolute top-2 right-2 text-primary-500 text-lg">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          className="hidden md:block px-4 py-2 rounded-md text-primary-500 cursor-pointer font-semibold transition-all duration-200 ease-in border border-primary-500 hover:shadow-lg hover:scale-105"
          onClick={handleMobileLayoutClick}
        >
          <Smartphone />
        </button>

        <button
          className={`px-2 py-1 md:px-4 md:py-2 rounded-md text-md font-semibold transition-all duration-200 ease-in flex justify-center items-center 
          ${
            disableLaunchButton
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "text-white cursor-pointer hover:shadow-lg hover:scale-105 bg-gradient-to-r from-primary-500 to-secondary-500"
          }`}
          disabled={disableLaunchButton || isLaunching}
          onClick={handleLaunchClick}
        >
          {isLaunching ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Launching...
            </>
          ) : (
            <>
              Launch <Rocket className="ml-2" size={16} />
            </>
          )}
        </button>
      </div>
    </section>
  );
}
