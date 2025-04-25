"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // Make sure this path matches yours

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/reset-password", // your actual domain here in prod
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Check your inbox for the reset link.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="w-full bg-primary-600 text-white py-2 rounded hover:opacity-90">
          Send Reset Link
        </button>
        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </div>
  );
}
