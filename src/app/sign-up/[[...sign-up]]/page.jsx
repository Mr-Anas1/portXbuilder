"use client";
import Navbar from "@/components/common/Navbar/Page";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSignUpClick = async (e) => {
    e.preventDefault();

    const { name, email, password } = formData;
    const newErrors = {};

    // Form validation logic (same as before)
    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.length < 3) {
      newErrors.name = "Name must be at least 3 characters long";
    } else if (name.length > 50) {
      newErrors.name = "Name must be less than 50 characters long";
    } else if (!/^[a-zA-Z\s]+$/.test(name)) {
      newErrors.name = "Name must contain only letters and spaces";
    }

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
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    try {
      // Check if a user is already logged in
      const { data: userData } = await supabase.auth.getUser();
      if (userData) {
        // If already logged in, redirect to dashboard
        router.push("/sign-in");
        return;
      }

      // Attempt to sign up
      const { user, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        if (error.message === "Email already registered") {
          // If email already exists, redirect to login page
          router.push("/sign-in");
          return;
        }
        console.error("Signup failed:", error.message);
        return;
      }

      // Save email in localStorage for later use (confirmation)
      localStorage.setItem("signup_email", email);

      console.log(
        "Signup successful! Please check your email to verify your account before continuing."
      );
      router.push("/dashboard");
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
              Create your account
            </h1>
            <p className="text-center text-sm text-gray-600 my-1 ">
              Sign up to get started with our service.
            </p>

            <form className="space-y-4 my-6">
              <div className="flex flex-col space-y-2">
                <label htmlFor="name" className="text-sm text-gray-600">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="email" className="text-sm text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="password" className="text-sm text-gray-600">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-primary-500 text-white font-semibold py-2 rounded-md hover:bg-primary-600 transition duration-200 flex items-center justify-center"
                onClick={handleSignUpClick}
                disabled={loading}
              >
                {loading ? (
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            <div className="w-full h-[1px] bg-gray-300"></div>

            <div className="flex justify-center gap-2 items-center border my-6 border-gray-300 rounded-md px-3 py-2 cursor-pointer hover:bg-gray-100 transition duration-200">
              <img src="/google.svg" alt="Google Logo" className="w-5 h-5" />
              <p>Continue with Google</p>
            </div>

            <div className="flex items-center justify-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <a href="/sign-in" className="text-primary-500 font-semibold">
                  Sign In
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
