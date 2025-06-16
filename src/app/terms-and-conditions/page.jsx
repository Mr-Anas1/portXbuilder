"use client";
import React from "react";
import Navbar from "@/components/common/Navbar/Page";
import Footer from "@/components/Home/Footer";

const TermsAndConditions = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-16 w-64 h-64 bg-gradient-to-r from-primary-400/20 to-secondary-400/20 rounded-full blur-3xl" />
      <div className="absolute top-1/4 right-[10px] w-32 h-32 bg-secondary-400/20 rounded-full blur-2xl" />
      <div className="absolute bottom-[50px] left-1/4 w-32 h-32 bg-primary-400/20 rounded-full blur-2xl" />

      <Navbar className="relative z-10" />

      <main className="flex-1 relative z-10">
        <div className="min-h-screen ">
          <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Terms and Conditions
            </h1>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-gray-600 mb-4">
                  By accessing and using our services, you agree to be bound by
                  these Terms and Conditions. If you do not agree to these
                  terms, please do not use our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  2. Use of Services
                </h2>
                <p className="text-gray-600 mb-4">
                  You agree to use our services only for lawful purposes and in
                  accordance with these Terms. You are responsible for
                  maintaining the confidentiality of your account information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  3. Intellectual Property
                </h2>
                <p className="text-gray-600 mb-4">
                  All content, features, and functionality of our services are
                  owned by us and are protected by international copyright,
                  trademark, and other intellectual property laws.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  4. Limitation of Liability
                </h2>
                <p className="text-gray-600 mb-4">
                  We shall not be liable for any indirect, incidental, special,
                  consequential, or punitive damages resulting from your use of
                  or inability to use our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  5. Changes to Terms
                </h2>
                <p className="text-gray-600 mb-4">
                  We reserve the right to modify these terms at any time. We
                  will notify users of any changes by posting the new Terms and
                  Conditions on this page.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  6. Contact Us
                </h2>
                <p className="text-gray-600 mb-4">
                  If you have any questions about these Terms and Conditions,
                  please contact us at:
                </p>
                <p className="text-gray-600">support@example.com</p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer className="relative z-10" />
    </div>
  );
};

export default TermsAndConditions;
