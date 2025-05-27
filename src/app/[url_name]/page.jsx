"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
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
      // Map the component name as is (e.g., "Navbar 1")
      map[comp.name] = comp.component;
      // Map the component name with "Section" (e.g., "NavbarSection1")
      const sectionName = comp.name.replace(" ", "Section");
      map[sectionName] = comp.component;
      // Map the short version (e.g., "Navbar1")
      const shortName = comp.name.replace(" ", "");
      map[shortName] = comp.component;
      // Special case for Projects/Project
      if (comp.name.startsWith("Project")) {
        const projectsName = comp.name.replace("Project", "Projects");
        map[projectsName] = comp.component;
        const projectsShortName = projectsName.replace(" ", "");
        map[projectsShortName] = comp.component;
      }
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
  const [error, setError] = useState(null);
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
    if (!theme || !previewThemes[theme]) {
      console.warn(`Invalid theme "${theme}", falling back to default`);
      return "default";
    }
    return theme;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching portfolio for URL name:", url_name);

        const response = await fetch(`/api/portfolio/${url_name}`);
        const data = await response.json();

        console.log("Portfolio API response:", data);

        if (!response.ok) {
          const errorMessage = data.error || "Failed to fetch portfolio data";
          console.error("Error fetching portfolio:", errorMessage);
          setError(errorMessage);
          setUserComponents(null);
          return;
        }

        if (!data.components) {
          const errorMessage = "No components found in response";
          console.error(errorMessage);
          setError(errorMessage);
          setUserComponents(null);
          return;
        }

        // Validate components
        const validComponents = {
          navbar: data.components.navbar || "Navbar 1",
          home: data.components.home || "Hero 1",
          about: data.components.about || "About 1",
          projects: data.components.projects || "Project 1",
          contact: data.components.contact || "Contact 1",
          footer: data.components.footer || "Footer 1",
        };

        // Log the component mapping for debugging
        console.log("Component mapping:", {
          received: data.components,
          mapped: validComponents,
          available: Object.keys(componentMap),
        });

        setUserComponents(validComponents);

        // Validate theme before setting
        const validTheme = getValidTheme(data.theme);
        console.log("Theme validation:", {
          received: data.theme,
          valid: validTheme,
          available: Object.keys(previewThemes),
        });
        setUserTheme(validTheme);
      } catch (error) {
        console.error("Unexpected error in fetchData:", error);
        setError("An unexpected error occurred");
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
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-500" />
          <p className="text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Error Loading Portfolio
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Please try again later or contact support if the issue persists.
          </p>
        </div>
      </div>
    );
  }

  if (!userComponents) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Portfolio Not Found
          </h2>
          <p className="text-gray-600">
            No portfolio found for <strong>{url_name}</strong>
          </p>
        </div>
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
