"use client";
import React from "react";
import { usePortfolio } from "@/context/PortfolioContext";

const TermsAndConditions = () => {
  const { portfolio } = usePortfolio();

  return (
    <div className="min-h-screen bg-gray-50">
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
              these Terms and Conditions. If you do not agree to these terms,
              please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              2. Use of Services
            </h2>
            <p className="text-gray-600 mb-4">
              You agree to use our services only for lawful purposes and in
              accordance with these terms. You are responsible for:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Maintaining the confidentiality of your account</li>
              <li>All activities that occur under your account</li>
              <li>
                Ensuring your account information is accurate and up-to-date
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              3. Intellectual Property
            </h2>
            <p className="text-gray-600 mb-4">
              All content, features, and functionality of our services are owned
              by us and are protected by international copyright, trademark, and
              other intellectual property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              4. Limitation of Liability
            </h2>
            <p className="text-gray-600 mb-4">
              We shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages resulting from your use or
              inability to use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              5. Changes to Terms
            </h2>
            <p className="text-gray-600 mb-4">
              We reserve the right to modify these terms at any time. We will
              notify users of any material changes by posting the new terms on
              this page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              6. Contact Information
            </h2>
            <p className="text-gray-600 mb-4">
              For any questions regarding these Terms and Conditions, please
              contact us at:
            </p>
            <p className="text-gray-600">
              {portfolio?.email || "support@example.com"}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
