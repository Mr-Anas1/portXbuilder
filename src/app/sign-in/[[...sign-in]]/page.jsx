"use client";

import Navbar from "@/components/common/Navbar/Page";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSignInClick = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (password.length > 20) {
      newErrors.password = "Password must be less than 20 characters long";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Sign In successful", formData);
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Error signing in:", error.message);
        setErrors({ signIn: "Invalid email or password" });
        return;
      }
      console.log("Login successful!", data);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error signing in:", error.message);
      setErrors({ signIn: "An error occurred during sign in" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col min-h-screen bg-background">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-16 w-64 h-64 bg-gradient-to-r from-primary-400/20 to-secondary-400/20 rounded-full blur-3xl" />
      <div className="absolute top-1/4 right-[10px] w-32 h-32 bg-secondary-400/20 rounded-full blur-2xl" />
      <div className="absolute bottom-[50px] left-1/4 w-32 h-32 bg-primary-400/20 rounded-full blur-2xl" />
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="mt-12 mb-12 mx-auto border border-gray-300 px-6 py-4 rounded-lg shadow-lg bg-white w-[80%] sm:w-full max-w-md">
          <div className="my-8">
            <h1 className="text-center text-lg md:text-xl font-bold text text-gray-800">
              Sign In to your account
            </h1>
            <p className="text-center text-sm text-gray-600 my-1 ">
              Sign in to get started with our service.
            </p>

            <form className="space-y-4 my-6">
              <div className="flex flex-col space-y-2">
                <label htmlFor="email" className="text-sm text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="password" className="text-sm text-gray-600">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-primary-500 text-white font-semibold py-2 rounded-md hover:bg-primary-600 transition duration-200"
                onClick={handleSignInClick}
              >
                Sign In
              </button>
            </form>

            <div className="w-full h-[1px] bg-gray-300"></div>

            <div className="flex justify-center gap-2 items-center border my-6 border-gray-300 rounded-md px-3 py-2 cursor-pointer hover:bg-gray-100 transition duration-200">
              <img src="/google.svg" alt="Google Logo" className="w-5 h-5" />
              <p>Continue with Google</p>
            </div>

            <div className="flex items-center justify-center mt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <a href="/sign-up" className="text-primary-500 font-semibold">
                  Sign Up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
