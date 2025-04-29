"use client";
import Navbar from "@/components/common/Navbar/Page";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "@/components/common/Sidebar/Page";
import MobileSidebar from "@/components/common/MobileSidebar/Page";
import {
  Contact,
  FolderKanban,
  LayoutGrid,
  LayoutPanelTopIcon,
  Sparkles,
} from "lucide-react";
import NavbarSection1 from "@/components/Navbars/NavbarSection1";
import HeroSection1 from "@/components/HeroSections/HeroSection1";
import ProjectsSection1 from "@/components/Projects/ProjectSection1";
import ContactSection1 from "@/components/ContactSection/ContactSection1";
import FooterSection1 from "@/components/FooterSection/FooterSection1";
import { useRef } from "react";
import { navbarComponents } from "@/components/Navbars/index";
import { heroComponents } from "@/components/HeroSections/index";
import { projectsComponents } from "@/components/Projects/index";
import { contactComponents } from "@/components/ContactSection/index";
import { footerComponents } from "@/components/FooterSection/index";

const Dashboard = () => {
  const navbarRef = useRef(null);
  const heroRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);
  const footerRef = useRef(null);

  const [activeSection, setActiveSection] = useState("navbar");
  const [showOverlay, setShowOverlay] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState({
    navbar: navbarComponents[0],
    hero: heroComponents[0],
    projects: projectsComponents[0],
    contact: contactComponents[0],
    footer: footerComponents[0],
  });

  const [sections, setSections] = useState([
    { id: "navbar", label: "Navbar", icon: LayoutGrid, isCustom: false },
    { id: "hero", label: "Hero", icon: Sparkles, isCustom: false },
    { id: "projects", label: "Projects", icon: FolderKanban, isCustom: false },
    { id: "contact", label: "Contact", icon: Contact, isCustom: false },
    {
      id: "footer",
      label: "Footer",
      icon: LayoutPanelTopIcon,
      isCustom: false,
    },
  ]);

  // For randomly change component

  const getRandomComponent = (components) => {
    const randomIndex = Math.floor(Math.random() * components.length);
    return components[randomIndex];
  };

  const handleComponentChange = () => {
    setSelectedComponent({
      navbar: getRandomComponent(navbarComponents),
      hero: getRandomComponent(heroComponents),
      projects: getRandomComponent(projectsComponents),
      contact: getRandomComponent(contactComponents),
      footer: getRandomComponent(footerComponents),
    });
  };

  const removeSection = (id) => {
    setSections((prevSection) =>
      prevSection.filter((section) => section.id !== id)
    );
  };

  const customSectionsCount = sections.filter(
    (section) => section.isCustom
  ).length;

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        console.error("No active user session:", error?.message);
        router.push("/sign-in");
      } else {
        setUser(data.user);
      }
      setLoading(false);
    };
    fetchUser();
  }, [router]);

  if (loading) {
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
    if (sectionId === "hero" && heroRef.current) {
      heroRef.current.scrollIntoView({ behavior: "smooth" });
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

  return (
    <section className="relative min-h-screen flex flex-col bg-background">
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

        <div className="flex-1 ml-[20%] p-4 overflow-y-auto">
          <section ref={navbarRef} id="navbar" className="min-h-screen py-12">
            <selectedComponent.navbar />
          </section>

          <section ref={heroRef} id="hero" className="min-h-screen py-12">
            <selectedComponent.hero />
          </section>

          <section
            ref={projectsRef}
            id="projects"
            className="min-h-screen py-12"
          >
            <selectedComponent.projects />
          </section>

          <section ref={contactRef} id="contact" className="min-h-screen py-12">
            <selectedComponent.contact />
          </section>

          <section ref={footerRef} id="footer" className="min-h-screen py-12">
            <selectedComponent.footer />
          </section>
        </div>

        <div className="fixed left-1/2 bottom-4 transform -translate-x-1/2 md:hidden">
          <button
            className={
              "px-4 py-2 rounded-md text-white text-md cursor-pointer font-semibold transition-all duration-200 ease-in bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg hover:scale-105"
            }
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          >
            Edit
          </button>
        </div>

        <div className="fixed left-1/2 bottom-4 transform -translate-x-1/2">
          <button
            className={
              "px-4 py-2 rounded-md text-white text-md cursor-pointer font-semibold transition-all duration-200 ease-in bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg hover:scale-105"
            }
            onClick={handleComponentChange}
          >
            Change
          </button>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
