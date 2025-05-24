"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import previewThemes from "@/components/ui/previewThemes";
import { Loader2 } from "lucide-react";

import { navbarComponents } from "@/components/Navbars/index";
import { heroComponents } from "@/components/HeroSections/index";
import { projectsComponents } from "@/components/Projects/index";
import { contactComponents } from "@/components/ContactSection/index";
import { footerComponents } from "@/components/FooterSection/index";
import { aboutComponents } from "@/components/AboutSection/index";

// Map strings to actual components
const createComponentMap = (...componentArrays) => {
  const map = {};
  componentArrays.forEach((arr) => {
    arr.forEach((comp) => {
      map[comp.name] = comp.component;
    });
  });
  return map;
};

const componentMap = createComponentMap(
  navbarComponents,
  heroComponents,
  aboutComponents,
  projectsComponents,
  contactComponents,
  footerComponents
);

const Page = () => {
  const { url_name } = useParams();
  const [userComponents, setUserComponents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const [userTheme, setUserTheme] = useState("default");

  const sectionRefs = {
    navbar: useRef(null),
    home: useRef(null),
    about: useRef(null),
    projects: useRef(null),
    contact: useRef(null),
    footer: useRef(null),
  };

  const handleScrollToSection = (sectionId) => {
    sectionRefs[sectionId]?.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Validate if theme exists in previewThemes
  const getValidTheme = (theme) => {
    return previewThemes[theme] ? theme : "default";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("components, theme")
          .eq("url_name", url_name)
          .single();

        if (error) {
          console.error("Error fetching user data:", error);
          setUserComponents(null);
        } else if (!data?.components) {
          console.error("No components found for user");
          setUserComponents(null);
        } else {
          setUserComponents(data.components);
          // Validate theme before setting
          const validTheme = getValidTheme(data.theme);
          setUserTheme(validTheme);
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
        setUserComponents(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url_name]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!userComponents) {
    return (
      <div className="text-center mt-20 text-xl">
        No portfolio found for <strong>{url_name}</strong>
      </div>
    );
  }

  const renderComponent = (componentKey, sectionId) => {
    if (!componentKey) return null;

    const Component = componentMap[componentKey];
    if (!Component) {
      console.error(`Component not found for key: ${componentKey}`);
      return null;
    }

    // Get the current theme object
    const currentTheme = previewThemes[userTheme] || previewThemes.default;

    // Add common props for all components
    const commonProps = {
      id: sectionId,
      theme: currentTheme,
      handleScrollToSection: handleScrollToSection,
      sectionRef: sectionRefs[sectionId],
      isMobileLayout: isMobileLayout,
      setIsMobileLayout: setIsMobileLayout,
    };

    return <Component key={sectionId} {...commonProps} />;
  };

  // Get the current theme object
  const currentTheme = previewThemes[userTheme] || previewThemes.default;

  return (
    <div className={`fixed inset-0 ${currentTheme.bg}`}>
      <div className="h-full overflow-y-auto">
        {renderComponent(userComponents.navbar, "navbar")}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderComponent(userComponents.home, "home")}
          {renderComponent(userComponents.about, "about")}
          {renderComponent(userComponents.projects, "projects")}
          {renderComponent(userComponents.contact, "contact")}
        </div>
        {renderComponent(userComponents.footer, "footer")}
      </div>
    </div>
  );
};

export default Page;
