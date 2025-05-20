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

  const handleThemeChange = (key) => {
    if (previewThemes[key]) {
      setThemeKey(key);
    }

    setThemeOverlay(false);
  };

  // For changing into mobile component

  const handleMobileLayoutClick = () => {
    setIsMobileLayout((prev) => !prev);
  };

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
    const { id } = portfolio;

    const { error } = await supabase
      .from("portfolios")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating:", error);
      return;
    }

    await refetchPortfolio();

    setEditingSection(null);
  };

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
                isMobileLayout ? " mx-auto md:ml-[45%] md:max-w-[420px]" : ""
              }`}
            >
              {/* Fixed outline container */}
              <div className="h-[85vh] overflow-y-auto border-[2px] border-dashed border-primary-500 rounded-xl  bg-white shadow-sm">
                <SectionWrapper
                  id="navbar"
                  innerRef={navbarRef}
                  Component={selectedComponent.navbar}
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
                  Component={selectedComponent.home}
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
                  Component={selectedComponent.about}
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
                  Component={selectedComponent.projects}
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
                  Component={selectedComponent.contact}
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
                  Component={selectedComponent.footer}
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
              className="md:hidden px-4 py-2 rounded-md text-white text-md cursor-pointer font-semibold transition-all duration-200 ease-in bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg hover:scale-105"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            >
              Edit
            </button>

            <button
              className="px-4 py-2 rounded-md text-white text-md cursor-pointer font-semibold transition-all duration-200 ease-in bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg hover:scale-105"
              onClick={handleComponentChange}
            >
              Change
            </button>

            <div>
              <button
                className="px-4 py-2 relative rounded-md text-white text-md cursor-pointer font-semibold transition-all duration-200 ease-in bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg hover:scale-105 flex justify-center items-center gap-1"
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
                    onClick={() => handleThemeChange("light")}
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
          </div>
        </div>
      </section>
    );
  }
};

export default Dashboard;
