"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import previewThemes from "@/components/ui/previewThemes";
import { Loader2 } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import Script from "next/script";
import Image from "next/image";

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
  const [showAd, setShowAd] = useState(true);
  const [adWidth, setAdWidth] = useState("90vw");

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 600) {
        setAdWidth("70vw");
      } else {
        setAdWidth("90vw");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

      {/* Google AdSense for free users */}
      {/* {portfolio.plan && portfolio.plan !== "pro" && showAd && (
        <>
          <Script
            id="adsense-script"
            strategy="afterInteractive"
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5542805617135767"
            crossOrigin="anonymous"
            async
          />
          <div
            style={{
              position: "fixed",
              bottom: 60,
              right: 16,
              zIndex: 60,
              background: "#fff",
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(60,60,60,0.13)",
              padding: "10px 14px 10px 10px",
              minWidth: 160,
              width: adWidth,
              maxWidth: 300,
              display: "flex",
              alignItems: "center",
              border: "1px solid #e5e7eb",
              fontFamily: "inherit",
            }}
          >
            <button
              onClick={() => setShowAd(false)}
              style={{
                position: "absolute",
                top: 4,
                right: 8,
                background: "transparent",
                border: "none",
                fontSize: 18,
                color: "#bbb",
                cursor: "pointer",
                lineHeight: 1,
                fontWeight: 700,
                padding: 0,
              }}
              aria-label="Close ad"
            >
              ×
            </button>
            <div
              style={{
                width: "100%",
                maxWidth: 280,
                height: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ins
                className="adsbygoogle"
                style={{
                  display: "block",
                  width: "100%",
                  maxWidth: 280,
                  height: 100,
                  borderRadius: 4,
                  overflow: "hidden",
                }}
                data-ad-client="ca-pub-5542805617135767"
                data-ad-slot="1234567890"
                data-ad-format="auto"
                data-full-width-responsive="true"
              ></ins>
            </div>
          </div>
          <Script id="adsbygoogle-init" strategy="afterInteractive">
            {`
              if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
                window.adsbygoogle.push({});
              }
            `}
          </Script>
        </>
      )} */}

      {/* Watermark for free users */}
      {portfolio.plan && portfolio.plan !== "pro" && (
        <div
          style={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 50,
            background: "rgba(255,255,255,0.85)",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            padding: "6px 14px 6px 8px",
            fontSize: 14,
            color: "#333",
            fontWeight: 500,
            gap: 8,
          }}
        >
          <Image
            src="/logo.png"
            alt="PortXBuilder Logo"
            width={20}
            height={20}
            style={{ marginRight: 0 }}
          />
          <span>
            Made with <b>PortXBuilder</b>
          </span>
        </div>
      )}
    </div>
  );
};

export default Page;
