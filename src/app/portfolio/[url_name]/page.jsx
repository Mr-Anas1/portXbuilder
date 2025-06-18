"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import previewThemes from "@/components/ui/previewThemes";
import { Loader2 } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

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
  const { portfolio, loading } = usePortfolio();
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
    const section = sectionRefs[sectionId]?.current;
    if (section) {
      const navbarHeight = sectionRefs.navbar?.current?.offsetHeight || 0;
      const yOffset = -navbarHeight;
      const y =
        section.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }
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
    if (portfolio?.theme) {
      const validTheme = getValidTheme(portfolio.theme);
      setUserTheme(validTheme);
    }
  }, [portfolio?.theme]);

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

  if (!portfolio) {
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
    <div className={`min-h-screen ${currentTheme.bg} relative`}>
      <div className={`absolute inset-0 ${currentTheme.bg} -z-10`}></div>
      {renderComponent(portfolio.components?.navbar, "navbar")}
      <main className="relative">
        <section ref={sectionRefs.home}>
          {renderComponent(portfolio.components?.home, "home")}
        </section>
        <section ref={sectionRefs.about}>
          {renderComponent(portfolio.components?.about, "about")}
        </section>
        <section ref={sectionRefs.projects}>
          {renderComponent(portfolio.components?.projects, "projects")}
        </section>
        <section ref={sectionRefs.contact}>
          {renderComponent(portfolio.components?.contact, "contact")}
        </section>
      </main>
      <section ref={sectionRefs.footer}>
        {renderComponent(portfolio.components?.footer, "footer")}
      </section>
    </div>
  );
};

export default Page;
