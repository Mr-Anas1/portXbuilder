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

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("navbar");
  const [showOverlay, setShowOverlay] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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

  return (
    <section className="relative min-h-screen flex flex-col bg-background">
      <Navbar />
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
          />
        )}
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
      </div>
    </section>
  );
};

export default Dashboard;
