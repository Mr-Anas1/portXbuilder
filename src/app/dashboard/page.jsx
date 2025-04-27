"use client";
import Navbar from "@/components/common/Navbar/Page";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const Dashboard = () => {
  const [loading, setLoading] = useState(true); // Set to true initially
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        console.error("No active user session:", error?.message);
        router.push("/sign-in");
      } else {
        setUser(data.user);
      }
      setLoading(false); // Ensure setLoading is called after user is fetched
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
    <section className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div>Welcome, {user?.email}</div> {/* Display user info */}
    </section>
  );
};

export default Dashboard;
