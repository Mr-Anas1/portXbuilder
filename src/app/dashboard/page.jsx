"use client";
import Navbar from "@/components/common/Navbar/Page";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "@/components/common/Sidebar/Page";
import MobileSidebar from "@/components/common/MobileSidebar/Page";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
        <Sidebar />
        {mobileSidebarOpen && (
          <MobileSidebar setMobileSidebarOpen={setMobileSidebarOpen} />
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
