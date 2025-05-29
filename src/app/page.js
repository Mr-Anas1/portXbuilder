"use client";
import Home from "@/components/Home/Page.jsx";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/dashboard");
      } else {
        setIsChecking(false);
      }
    }
  }, [loading, user, router]);

  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="">
      <Home />
    </div>
  );
}
