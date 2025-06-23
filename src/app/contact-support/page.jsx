"use client";
import React, { useState, useEffect } from "react";
import previewThemes from "@/components/ui/previewThemes";
import Navbar from "@/components/common/Navbar/Page";
import Footer from "@/components/Home/Footer";

export default function ContactSupportPage() {
  const theme = previewThemes.default;

  return (
    <div className={`min-h-screen flex flex-col bg-background ${theme.text}`}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-16 w-64 h-64 bg-gradient-to-r from-primary-400/20 to-secondary-400/20 rounded-full blur-3xl" />
      <div className="absolute top-1/4 right-[10px] w-32 h-32 bg-secondary-400/20 rounded-full blur-2xl" />
      <div className="absolute bottom-[50px] left-1/4 w-32 h-32 bg-primary-400/20 rounded-full blur-2xl" />
      <Navbar />
      <main
        className="flex-1 flex flex-col items-center justify-center py-16 px-4"
        style={{ minHeight: "calc(100vh - 80px)" }}
      >
        <div className="w-full max-w-xl mx-auto">
          <h1
            className={`text-3xl font-bold mb-6 text-center ${theme.accentText}`}
          >
            Contact Support
          </h1>
          <p className={`mb-8 text-center px-2 ${theme.subtext}`}>
            For bug reports, support, or feedback, please email us at:
          </p>
          <div
            className={`rounded-lg shadow p-6 flex flex-col items-center ${theme.card1Bg} ${theme.card1Text}`}
          >
            <a
              href="mailto:support@portxbuilder.com"
              className={`text-lg font-semibold underline mb-4 ${theme.accentText}`}
            >
              support@portxbuilder.com
            </a>
            <p className="text-center">
              Please include as much detail as possible, such as:
              <ul className="list-disc pl-6 mt-2 text-left">
                <li>Your account email (if applicable)</li>
                <li>A description of the issue or feedback</li>
                <li>Screenshots or steps to reproduce (for bugs)</li>
              </ul>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
