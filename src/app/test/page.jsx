"use client";
import { useRef } from "react";
import HeroSection3 from "@/components/HeroSections/HeroSection3";
import previewThemes from "@/components/ui/previewThemes";
import NavbarSection2 from "@/components/Navbars/NavbarSection2";
import ProjectSection2 from "@/components/Projects/ProjectSection2";
import AboutSection3 from "@/components/AboutSection/AboutSection3";
import ProjectSection3 from "@/components/Projects/ProjectSection3";
import ContactSection3 from "@/components/ContactSection/ContactSection3";
import Footer from "@/components/FooterSection/FooterSection1";
import { usePortfolio } from "@/context/PortfolioContext";
import { Loader2 } from "lucide-react";

const Page = () => {
  const navbarRef = useRef(null);
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);
  const footerRef = useRef(null);
  const { loading } = usePortfolio();

  const handleScrollToSection = (sectionId) => {
    const sectionMap = {
      navbar: navbarRef,
      home: homeRef,
      about: aboutRef,
      projects: projectsRef,
      contact: contactRef,
      footer: footerRef,
    };

    const section = sectionMap[sectionId];
    if (section?.current) {
      section.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-500" />
        </div>
      </div>
    );
  }

  return (
    <>
      <NavbarSection2
        id="navbar"
        theme={previewThemes.default}
        handleScrollToSection={handleScrollToSection}
        sectionRef={navbarRef}
      />
      <HeroSection3
        id="home"
        theme={previewThemes.default}
        handleScrollToSection={handleScrollToSection}
        sectionRef={homeRef}
      />
      <AboutSection3
        id="about"
        theme={previewThemes.default}
        handleScrollToSection={handleScrollToSection}
        sectionRef={aboutRef}
      />
      <ProjectSection3
        id="projects"
        theme={previewThemes.default}
        handleScrollToSection={handleScrollToSection}
        sectionRef={projectsRef}
      />
      <ContactSection3
        id="contact"
        theme={previewThemes.default}
        handleScrollToSection={handleScrollToSection}
        sectionRef={contactRef}
      />
      <Footer
        id="footer"
        theme={previewThemes.default}
        handleScrollToSection={handleScrollToSection}
        sectionRef={footerRef}
      />
    </>
  );
};

export default Page;
