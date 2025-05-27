"use client";
import Navbar from "@/components/common/Navbar/Page";
import { SignIn } from "@clerk/nextjs";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-primary-500 hover:bg-primary-600 text-sm normal-case",
              card: "shadow-xl",
              footerActionLink: "text-primary-500 hover:text-primary-600",
            },
          }}
          afterSignInUrl="/dashboard"
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  );
}
