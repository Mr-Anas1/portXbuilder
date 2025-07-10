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
        <div className="min-h-screen">
          <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Privacy Policy
            </h1>
            <p className="text-gray-600 mb-8">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  1. Information We Collect
                </h2>
                <p className="text-gray-600 mb-4">
                  PortXBuilder collects information to provide and improve our
                  portfolio building services:
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Account Information
                </h3>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Name, email address, and profile information</li>
                  <li>Authentication data through Clerk</li>
                  <li>Account preferences and settings</li>
                  <li>Subscription and billing information</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Portfolio Content
                </h3>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Portfolio projects, descriptions, and media files</li>
                  <li>Custom domain preferences and settings</li>
                  <li>Template selections and customizations</li>
                  <li>Portfolio analytics and usage data</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Technical Data
                </h3>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>IP address and device information</li>
                  <li>Browser type and version</li>
                  <li>Usage patterns and feature interactions</li>
                  <li>Error logs and performance data</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  2. How We Use Your Information
                </h2>
                <p className="text-gray-600 mb-4">
                  We use your information to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Provide and maintain our portfolio building services</li>
                  <li>Process payments and manage subscriptions</li>
                  <li>Send important service updates and notifications</li>
                  <li>Improve our platform and user experience</li>
                  <li>Provide customer support and resolve issues</li>
                  <li>Ensure security and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  3. Information Sharing
                </h2>
                <p className="text-gray-600 mb-4">
                  We do not sell, trade, or rent your personal information. We
                  may share your information with:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>
                    <strong>Service Providers:</strong> Clerk (authentication),
                    Dodo Payments (payments), Supabase (database)
                  </li>
                  <li>
                    <strong>Legal Authorities:</strong> When required by law or
                    to protect our rights
                  </li>
                  <li>
                    <strong>Business Partners:</strong> Only with your explicit
                    consent
                  </li>
                  <li>
                    <strong>Public Portfolios:</strong> Your portfolio content
                    may be publicly accessible based on your settings
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  4. Data Security
                </h2>
                <p className="text-gray-600 mb-4">
                  We implement industry-standard security measures:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Secure authentication through Clerk</li>
                  <li>Regular security audits and updates</li>
                  <li>Access controls and monitoring</li>
                  <li>Secure payment processing through Dodo Payments</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  5. Your Rights
                </h2>
                <p className="text-gray-600 mb-4">You have the right to:</p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Access and download your personal data</li>
                  <li>Update or correct your information</li>
                  <li>Delete your account and associated data</li>
                  <li>Export your portfolio content</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Request data portability</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  6. Data Retention
                </h2>
                <p className="text-gray-600 mb-4">
                  We retain your data for as long as your account is active or
                  as needed to provide services:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Account data: Until account deletion</li>
                  <li>
                    Portfolio content: Until account deletion or 30 days after
                    cancellation
                  </li>
                  <li>
                    Payment records: As required by law (typically 7 years)
                  </li>
                  <li>
                    Analytics data: Aggregated and anonymized after 2 years
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  7. Cookies and Tracking
                </h2>
                <p className="text-gray-600 mb-4">
                  We use cookies and similar technologies to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Maintain your login session</li>
                  <li>Remember your preferences</li>
                  <li>Analyze site usage and performance</li>
                  <li>Provide personalized content</li>
                </ul>
                <p className="text-gray-600 mb-4">
                  You can control cookie settings through your browser
                  preferences.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  8. Third-Party Services
                </h2>
                <p className="text-gray-600 mb-4">
                  Our service integrates with third-party providers:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>
                    <strong>Clerk:</strong> User authentication and management
                  </li>
                  <li>
                    <strong>Dodo Payments:</strong> Payment processing
                  </li>
                  <li>
                    <strong>Supabase:</strong> Database and backend services
                  </li>
                  <li>
                    <strong>Vercel:</strong> Hosting and deployment
                  </li>
                </ul>
                <p className="text-gray-600 mb-4">
                  Each provider has their own privacy policy governing their
                  data practices.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  9. Children&apos;s Privacy
                </h2>
                <p className="text-gray-600 mb-4">
                  PortXBuilder is not intended for children under 13. We do not
                  knowingly collect personal information from children under 13.
                  If you believe we have collected such information, please
                  contact us immediately.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  10. Changes to This Policy
                </h2>
                <p className="text-gray-600 mb-4">
                  We may update this Privacy Policy from time to time. We will
                  notify you of any changes by:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Posting the new policy on this page</li>
                  <li>Sending email notifications for significant changes</li>
                  <li>Updating the &quot;Last updated&quot; date</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  11. Contact Us
                </h2>
                <p className="text-gray-600 mb-4">
                  If you have questions about this Privacy Policy or our data
                  practices:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Email: support@portxbuilder.com</li>
                  <li>Support: support@portxbuilder.com</li>
                  <li>Response time: Within 48 hours</li>
                </ul>
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
