"use client"; // Ensuring this page runs in client-side only

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [isMounted, setIsMounted] = useState(false); // Ensures the component renders after mounting

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Reset Password
        </h2>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        {successMessage && (
          <div className="text-green-500 text-sm mb-4">{successMessage}</div>
        )}

        <div className="mb-4">
          <label htmlFor="new-password" className="block text-sm font-semibold">
            New Password
          </label>
          <input
            type="password"
            id="new-password"
            value={newPassword}
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
  );
};

export default ResetPassword;
