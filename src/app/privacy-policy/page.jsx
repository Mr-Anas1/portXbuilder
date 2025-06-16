"use client";
import React from "react";
import Navbar from "@/components/common/Navbar/Page";
import Footer from "@/components/Home/Footer";

const PrivacyPolicy = () => {
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
              Privacy Policy
            </h1>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  1. Information We Collect
                </h2>
                <p className="text-gray-600 mb-4">
                  We collect information that you provide directly to us,
                  including when you create an account, make a purchase, or
                  contact us for support. This may include:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Name and contact information</li>
                  <li>Account credentials</li>
                  <li>Payment information</li>
                  <li>Communication preferences</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  2. How We Use Your Information
                </h2>
                <p className="text-gray-600 mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Provide and maintain our services</li>
                  <li>Process your transactions</li>
                  <li>Send you technical notices and support messages</li>
                  <li>
                    Communicate with you about products, services, and events
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  3. Information Sharing
                </h2>
                <p className="text-gray-600 mb-4">
                  We do not sell or rent your personal information to third
                  parties. We may share your information with:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Service providers who assist in our operations</li>
                  <li>Legal authorities when required by law</li>
                  <li>Business partners with your consent</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  4. Your Rights
                </h2>
                <p className="text-gray-600 mb-4">You have the right to:</p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Opt-out of marketing communications</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  5. Contact Us
                </h2>
                <p className="text-gray-600 mb-4">
                  If you have any questions about this Privacy Policy, please
                  contact us at:
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

export default PrivacyPolicy;
