"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/common/Navbar/Page";
import { useRouter, useSearchParams } from "next/navigation";

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const access_token = searchParams.get("access_token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkUserSession = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        console.error("No active user session:", error?.message);
        router.replace("/sign-in"); // Not logged in, redirect to login
      }
    };

    checkUserSession();
  }, [router]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setSuccessMessage("Password has been reset successfully!");
      setTimeout(() => router.push("/sign-in"), 2000);
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex flex-grow items-center justify-center p-4">
        <form
          onSubmit={handleResetPassword}
          className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Reset Password
          </h2>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          {successMessage && (
            <div className="text-green-500 text-sm mb-4">{successMessage}</div>
          )}

          <div className="mb-4">
            <label
              htmlFor="new-password"
              className="block text-sm font-semibold"
            >
              New Password
            </label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength="8"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="confirm-password"
              className="block text-sm font-semibold"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-500 focus:outline-none"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
