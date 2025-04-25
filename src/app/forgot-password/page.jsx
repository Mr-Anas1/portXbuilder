"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/common/Navbar/Page";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/reset-password",
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setMessage("Reset link sent! Check your email.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-grow items-center justify-center p-4">
        <form
          onSubmit={handleSubmit}
          className="max-w-md w-full bg-white p-8 rounded-lg shadow-md space-y-4"
        >
          <h2 className="text-2xl font-semibold text-center">
            Forgot Password?
          </h2>

          <input
            type="email"
            className="w-full p-3 border rounded-md outline-none transition-all duration-300 hover:border-primary-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-md transition"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          {message && <p className="text-green-600 text-center">{message}</p>}
          {error && <p className="text-red-600 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}
