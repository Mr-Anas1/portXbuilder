"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { data, error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Password reset successful!");
      setTimeout(() => router.push("/sign-in"), 2000);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Reset Your Password</h1>
      <form onSubmit={handleReset} className="space-y-4">
        <input
          type="password"
          placeholder="New password"
          className="w-full px-4 py-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="w-full bg-primary-600 text-white py-2 rounded hover:opacity-90">
          Update Password
        </button>
        {success && <p className="text-green-600">{success}</p>}
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </div>
  );
}
