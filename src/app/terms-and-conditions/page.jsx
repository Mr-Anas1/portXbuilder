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
        <div className="min-h-screen">
          <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Terms and Conditions
            </h1>
            <p className="text-gray-600 mb-8">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-gray-600 mb-4">
                  By accessing and using PortXBuilder (&ldquo;the
                  Service&rdquo;), you agree to be bound by these Terms and
                  Conditions. If you do not agree to these terms, please do not
                  use our service. These terms apply to all users of the
                  Service, including those who access the Service without
                  creating an account.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  2. Description of Service
                </h2>
                <p className="text-gray-600 mb-4">
                  PortXBuilder is an online portfolio building platform that
                  allows users to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Create and customize professional portfolios</li>
                  <li>Choose from various templates and themes</li>
                  <li>Add projects, skills, and personal information</li>
                  <li>Publish portfolios with custom subdomains (Pro plan)</li>
                  <li>Download source code (Pro plan)</li>
                  <li>Access portfolio analytics and insights</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  3. User Accounts and Registration
                </h2>
                <p className="text-gray-600 mb-4">
                  To access certain features of the Service, you must create an
                  account:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>You must provide accurate and complete information</li>
                  <li>You are responsible for maintaining account security</li>
                  <li>
                    You must be at least 13 years old to create an account
                  </li>
                  <li>One account per person is allowed</li>
                  <li>
                    You are responsible for all activities under your account
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  4. Subscription Plans and Billing
                </h2>
                <p className="text-gray-600 mb-4">
                  PortXBuilder offers the following subscription plans:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>
                    <strong>Free Plan:</strong> Basic templates, ads +
                    watermark, 15 credits
                  </li>
                  <li>
                    <strong>Pro Plan:</strong> Premium templates, no
                    ads/watermark, unlimited credits, custom subdomain
                  </li>
                </ul>
                <p className="text-gray-600 mb-4">
                  <strong>Billing Terms:</strong>
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Subscriptions automatically renew unless cancelled</li>
                  <li>Payments are processed through Razorpay</li>
                  <li>Prices may change with 30 days notice</li>
                  <li>No refunds for partial months or used periods</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  5. Acceptable Use Policy
                </h2>
                <p className="text-gray-600 mb-4">
                  You agree not to use the Service to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>
                    Create portfolios with illegal, harmful, or offensive
                    content
                  </li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Harass, abuse, or harm others</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>
                    Use the Service for commercial purposes without
                    authorization
                  </li>
                  <li>Upload malware, viruses, or harmful code</li>
                  <li>Violate any applicable laws or regulations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  6. Content Ownership and Licensing
                </h2>
                <p className="text-gray-600 mb-4">
                  <strong>Your Content:</strong> You retain ownership of content
                  you upload to your portfolio. You grant us a license to host
                  and display your content as part of the Service.
                </p>
                <p className="text-gray-600 mb-4">
                  <strong>Our Content:</strong> Templates, themes, and platform
                  features are owned by PortXBuilder and licensed for your use
                  under these terms.
                </p>
                <p className="text-gray-600 mb-4">
                  <strong>Third-Party Content:</strong> You are responsible for
                  ensuring you have rights to use any third-party content in
                  your portfolio.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  7. Service Availability and Maintenance
                </h2>
                <p className="text-gray-600 mb-4">
                  We strive to maintain high service availability but cannot
                  guarantee:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>100% uptime or uninterrupted access</li>
                  <li>Immediate resolution of technical issues</li>
                  <li>Compatibility with all devices or browsers</li>
                  <li>Preservation of all data in case of system failures</li>
                </ul>
                <p className="text-gray-600 mb-4">
                  We may perform maintenance that temporarily affects service
                  availability.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  8. Limitation of Liability
                </h2>
                <p className="text-gray-600 mb-4">
                  To the maximum extent permitted by law, PortXBuilder shall not
                  be liable for:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Indirect, incidental, or consequential damages</li>
                  <li>Loss of data, profits, or business opportunities</li>
                  <li>Damages resulting from third-party actions</li>
                  <li>Issues beyond our reasonable control</li>
                </ul>
                <p className="text-gray-600 mb-4">
                  Our total liability shall not exceed the amount paid for the
                  Service in the 12 months preceding the claim.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  9. Termination
                </h2>
                <p className="text-gray-600 mb-4">
                  <strong>By You:</strong> You may cancel your account at any
                  time through your dashboard or by contacting support.
                </p>
                <p className="text-gray-600 mb-4">
                  <strong>By Us:</strong> We may terminate or suspend your
                  account for:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Violation of these terms</li>
                  <li>Non-payment of fees</li>
                  <li>Fraudulent or abusive behavior</li>
                  <li>Extended periods of inactivity</li>
                </ul>
                <p className="text-gray-600 mb-4">
                  Upon termination, your access to the Service will cease, and
                  your data may be deleted after 30 days.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  10. Privacy and Data Protection
                </h2>
                <p className="text-gray-600 mb-4">
                  Your privacy is important to us. Our collection and use of
                  your data is governed by our Privacy Policy, which is
                  incorporated into these terms by reference.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  11. Dispute Resolution
                </h2>
                <p className="text-gray-600 mb-4">
                  Any disputes arising from these terms or your use of the
                  Service shall be resolved through:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Good faith negotiations between parties</li>
                  <li>Mediation if negotiations fail</li>
                  <li>Binding arbitration as a last resort</li>
                </ul>
                <p className="text-gray-600 mb-4">
                  These terms are governed by the laws of [Your Jurisdiction].
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  12. Changes to Terms
                </h2>
                <p className="text-gray-600 mb-4">
                  We reserve the right to modify these terms at any time. We
                  will notify users of significant changes by:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Posting updated terms on this page</li>
                  <li>Sending email notifications to active users</li>
                  <li>Updating the &quot;Last updated&quot; date</li>
                </ul>
                <p className="text-gray-600 mb-4">
                  Continued use of the Service after changes constitutes
                  acceptance of the new terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  13. Contact Information
                </h2>
                <p className="text-gray-600 mb-4">
                  If you have questions about these Terms and Conditions:
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

export default TermsAndConditions;
