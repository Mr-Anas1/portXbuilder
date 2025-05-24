"use client";
import Navbar from "@/components/common/Navbar/Page";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "@/components/common/Sidebar/Page";
import MobileSidebar from "@/components/common/MobileSidebar/Page";
import { useAuth } from "@/context/AuthContext";
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

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navbarRef = useRef(null);
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);
  const footerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPortfolio, setHasPortfolio] = useState(false);
  const [activeSection, setActiveSection] = useState("navbar");
  const [showOverlay, setShowOverlay] = useState(false);
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

  const { portfolio, refetchPortfolio } = usePortfolio();
  const { userData } = useAuth();

  usePortfolioRedirect();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    }
  }, [loading, user, router]);

  useEffect(() => {
    const checkPortfolio = async () => {
      if (loading || !user) {
        return;
      }

      setIsLoading(true);

      const { data, error } = await supabase
        .from("portfolios")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error(error.message);
      } else {
        setHasPortfolio(!!data);
      }

      setIsLoading(false);
    };

    checkPortfolio();
  }, [user, loading]);

  useEffect(() => {
    if (!isLoading) {
      if (!hasPortfolio) {
        router.push("/create");
      }
    }
  }, [isLoading, hasPortfolio, router]);

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

  const handleThemeChange = async (key) => {
    if (previewThemes[key]) {
      setThemeKey(key);

      // Update in Supabase
      try {
        const { error } = await supabase
          .from("users")
          .update({ theme: key })
          .eq("id", userData.id);

        if (error) {
          console.error("Failed to update theme:", error.message);
        } else {
          console.log("Theme updated successfully");
        }
      } catch (err) {
        console.error("Error updating theme:", err);
      }
    }

    setThemeOverlay(false);
  };

  // For changing into mobile component

  const handleMobileLayoutClick = () => {
    setIsMobileLayout((prev) => !prev);
  };

  // For handle launch button

  const handlePublishClick = async () => {
    if (!userData?.url_name) {
      setShowUrlModal(true);
      return;
    }

    // Extract only the component names
    const componentsToSave = {
      navbar: selectedComponent.navbar.name,
      home: selectedComponent.home.name,
      about: selectedComponent.about.name,
      projects: selectedComponent.projects.name,
      contact: selectedComponent.contact.name,
      footer: selectedComponent.footer.name,
    };

    const { error } = await supabase
      .from("users")
      .update({ components: componentsToSave })
      .eq("id", userData.id);

    if (error) {
      console.error("Failed to save components:", error.message);
      alert("Error publishing portfolio.");
    } else {
      alert("Portfolio published successfully!");
    }
  };

  const checkNameAvailability = async (name) => {
    if (!name || !isValid) return false;

    setIsChecking(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("url_name")
        .eq("url_name", name)
        .maybeSingle();

      if (error) {
        console.error("Error checking name:", error);
        return false;
      }

      const isTaken = !!data;
      setIsNameTaken(isTaken);
      return !isTaken;
    } catch (error) {
      console.error("Error checking name:", error);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const handleUrlNameChange = async (e) => {
    const value = e.target.value.toLowerCase();
    setEnteredName(value);

    // Check format validity
    const validFormat = /^[a-z0-9-]+$/.test(value);
    setIsValid(validFormat);

    // Reset taken status when user types
    if (isNameTaken) setIsNameTaken(false);

    // Only check availability if format is valid and not empty
    if (validFormat && value.trim()) {
      await checkNameAvailability(value);
    }
  };

  const handleUrlNameSubmit = async () => {
    if (!isValid || isNameTaken || isChecking) {
      return;
    }

    // Check availability one final time before saving
    const isAvailable = await checkNameAvailability(enteredName);
    if (!isAvailable) {
      setIsNameTaken(true);
      return;
    }

    try {
      const { error: updateError } = await supabase
        .from("users")
        .update({ url_name: enteredName })
        .eq("id", userData.id)
        .select();

      if (updateError) {
        if (updateError.code === "23505") {
          // Unique violation error code
          setIsNameTaken(true);
          return;
        }
        console.error("Error updating URL name:", updateError);
        alert("Something went wrong while saving your URL name.");
      } else {
        alert("Success! Your portfolio URL is: localhost/" + enteredName);
        setShowUrlModal(false);
      }
    } catch (error) {
      console.error("Error saving URL name:", error);
      alert("Something went wrong while saving your URL name.");
    }
  };

  // Check for pro component selected

  const isUsingProComponent = Object.values(selectedComponent).some(
    (comp) => comp.type === "pro"
  );

  // For pro users allowing to launch

  const userPlan = userData?.plan || "free";

  const isProUser = userPlan === "pro";

  const disableLaunchButton = isUsingProComponent && !isProUser;

  // For randomly change component

  const getRandomComponent = (components) => {
    const randomIndex = Math.floor(Math.random() * components.length);
    return components[randomIndex];
  };

  const handleComponentChange = () => {
    setSelectedComponent({
      navbar: getRandomComponent(navbarComponents),
      home: getRandomComponent(heroComponents),
      about: getRandomComponent(aboutComponents),
      projects: getRandomComponent(projectsComponents),
      contact: getRandomComponent(contactComponents),
      footer: getRandomComponent(footerComponents),
    });
  };

  const changeSingleComponent = (key, componentsArray) => {
    setSelectedComponent((prev) => ({
      ...prev,
      [key]: getRandomComponent(componentsArray),
    }));
  };

  const removeSection = (id) => {
    setSections((prevSection) =>
      prevSection.filter((section) => section.id !== id)
    );
  };

  const customSectionsCount = sections.filter(
    (section) => section.isCustom
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
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

  const theme = previewThemes[themeKey];

  const handleSave = async (section, updatedData) => {
    try {
      // First check if user is trying to use pro components
      const sections = [
        "navbar",
        "hero",
        "about",
        "projects",
        "contact",
        "footer",
      ];
      const hasProComponents = sections.some((section) => {
        const component = selectedComponent[section];
        return component?.type === "pro";
      });

      if (hasProComponents && !isProUser) {
        alert("You need to upgrade to Pro to use these components.");
        return;
      }

      // If validation passes, proceed with the API call
      const response = await fetch("/api/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...updatedData,
          components: selectedComponent, // Include the selected components in the update
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          alert("You need to upgrade to Pro to use these components.");
        } else {
          alert("Error saving changes. Please try again.");
        }
        return;
      }

      await refetchPortfolio();
      setEditingSection(null);
    } catch (error) {
      console.error("Error saving portfolio:", error);
      alert("Error saving changes. Please try again.");
    }
  };

  // For URL name submission

  if (hasPortfolio) {
    return (
      <section className="relative min-h-screen flex flex-col bg-background">
        {editingSection && (
          <PortfolioEditor
            section={editingSection}
            data={portfolio}
            onClose={() => setEditingSection(null)}
            onSave={handleSave}
            style={{ "z-index": "99" }}
          />
        )}

        {showUrlModal && (
          <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-[99999]">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Choose your URL name</h2>
              <div className="relative">
                <input
                  className={`w-full px-4 py-2 rounded-lg border transition-all duration-100 ${
                    !isValid || isNameTaken
                      ? "border-red-500 focus:ring-2 focus:ring-red-400"
                      : "border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  }`}
                  placeholder="e.g. john"
                  value={enteredName}
                  onChange={handleUrlNameChange}
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
                    Only lowercase letters, numbers, and hyphens (-) are
                    allowed.
                  </p>
                )}
                {isNameTaken && (
                  <p className="text-red-500 text-sm">
                    This name is already taken. Please choose a different one.
                  </p>
                )}
              </div>

              <button
                onClick={handleUrlNameSubmit}
                disabled={!isValid || isNameTaken || isChecking}
                className={`mt-4 w-full px-4 py-2 rounded-md text-white font-semibold transition-all duration-200 ${
                  !isValid || isNameTaken || isChecking
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary-500 hover:bg-primary-600"
                }`}
              >
                Save & Continue
              </button>
            </div>
          </div>
        )}

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

              {themeOverlay ? (
                <div className="absolute left-1/2 transform -translate-x-1/2 -top-28 md:-top-16 flex items-center gap-2 bg-white px-2 py-2 rounded-lg border border-primary-500 w-[270px] md:w-[520px] flex-wrap md:flex-nowrap justify-center">
                  <button
                    className="px-4 py-2  rounded-md border border-gray-300 bg-[#1e1e1e] text-white text-md cursor-pointer font-semibold transition-all duration-200 ease-in hover:shadow-lg hover:scale-105"
                    onClick={() => handleThemeChange("dark")}
                  >
                    Dark
                  </button>
                  <button
                    className="px-4 py-2  rounded-md border border-gray-300 bg-orange-500 text-white text-md cursor-pointer font-semibold transition-all duration-200 ease-in hover:shadow-lg hover:scale-105"
                    onClick={() => handleThemeChange("sunset")}
                  >
                    Sunset
                  </button>
                  <button
                    className="px-4 py-2  rounded-md border border-gray-300 bg-white-500 text-gray-800  text-md cursor-pointer font-semibold transition-all duration-200 ease-in hover:shadow-lg hover:scale-105"
                    onClick={() => handleThemeChange("default")}
                  >
                    Light
                  </button>
                  <button
                    className="px-4 py-2  rounded-md border border-gray-300 bg-blue-500 text-white text-md cursor-pointer font-semibold transition-all duration-200 ease-in hover:shadow-lg hover:scale-105"
                    onClick={() => handleThemeChange("ocean")}
                  >
                    Ocean
                  </button>
                  <button
                    className="px-4 py-2  rounded-md border border-gray-300 bg-green-600 text-white text-md cursor-pointer font-semibold transition-all duration-200 ease-in hover:shadow-lg hover:scale-105"
                    onClick={() => handleThemeChange("forest")}
                  >
                    Forest
                  </button>
                  <button
                    className="px-4 py-2  rounded-md border border-gray-300 bg-[#00ffff] text-gray-800 text-md cursor-pointer font-semibold transition-all duration-200 ease-in hover:shadow-lg hover:scale-105"
                    onClick={() => handleThemeChange("neon")}
                  >
                    Neon
                  </button>
                </div>
              ) : (
                ""
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
              onClick={handlePublishClick}
              disabled={disableLaunchButton}
            >
              Launch <Rocket className="ml-2" size={16} />
            </button>
          </div>
        </div>
      </section>
    );
  }
};

export default Dashboard;
