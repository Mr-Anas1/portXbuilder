"use client";
import React from "react";
import Navbar from "@/components/common/Navbar/Page";
import Footer from "@/components/Home/Footer";

const SubscriptionPolicy = () => {
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
              Subscription & Billing Policy
            </h1>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  1. Subscription Plans
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
                    ads/watermark, unlimited credits, specific subdomain
                  </li>
                </ul>
                <p className="text-gray-600 mb-4">
                  Pro plans are available in monthly ($1.99/month) and yearly
                  ($14.99/year) billing cycles.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  2. Billing & Payment
                </h2>
                <p className="text-gray-600 mb-4">
                  Our billing policies include:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Automatic renewal at the end of each billing period</li>
                  <li>Payment processing through Dodo Payments</li>
                  <li>
                    Secure payment handling with industry-standard encryption
                  </li>
                  <li>
                    Immediate access to Pro features upon successful payment
                  </li>
                  <li>Email notifications for all billing activities</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  3. Subscription Cancellation
                </h2>
                <p className="text-gray-600 mb-4">
                  You can cancel your Pro subscription at any time:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Through your account dashboard</li>
                  <li>By contacting our support team</li>
                  <li>
                    Access to Pro features continues until the end of your
                    current billing period
                  </li>
                  <li>No additional charges after cancellation</li>
                  <li>
                    Your portfolio remains accessible but reverts to Free plan
                    limitations
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  4. Refund Policy
                </h2>
                <p className="text-gray-600 mb-4">
                  We offer refunds in the following circumstances:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>
                    <strong>7-Day Money-Back Guarantee:</strong> Full refund
                    within 7 days of initial subscription
                  </li>
                  <li>
                    <strong>Technical Issues:</strong> If our service is
                    unavailable for more than 24 hours
                  </li>
                  <li>
                    <strong>Duplicate Charges:</strong> Accidental double
                    billing
                  </li>
                  <li>
                    <strong>Service Failure:</strong> If we cannot provide the
                    promised Pro features
                  </li>
                </ul>
                <p className="text-gray-600 mb-4">
                  <strong>Non-refundable:</strong> Partial month usage,
                  subscription periods already used, processing fees.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  5. Refund Process
                </h2>
                <p className="text-gray-600 mb-4">To request a refund:</p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Contact support at support@portxbuilder.com</li>
                  <li>Include your account email and reason for refund</li>
                  <li>Provide transaction details if available</li>
                  <li>Allow 5-7 business days for processing</li>
                  <li>Refunds are processed to the original payment method</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  6. Plan Changes & Upgrades
                </h2>
                <p className="text-gray-600 mb-4">
                  Plan modifications are handled as follows:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>
                    <strong>Upgrades:</strong> Immediate access to Pro features,
                    prorated billing
                  </li>
                  <li>
                    <strong>Downgrades:</strong> Effective at next billing
                    cycle, no refunds for current period
                  </li>
                  <li>
                    <strong>Billing Cycle Changes:</strong> Monthly to yearly or
                    vice versa at next renewal
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  7. Account Suspension & Termination
                </h2>
                <p className="text-gray-600 mb-4">
                  We may suspend or terminate accounts for:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Violation of our Terms of Service</li>
                  <li>Non-payment after multiple failed attempts</li>
                  <li>Fraudulent activity or abuse</li>
                  <li>Extended periods of inactivity (6+ months)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  8. Contact Information
                </h2>
                <p className="text-gray-600 mb-4">
                  For questions about subscriptions, billing, or refunds:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Email: support@portxbuilder.com</li>
                  <li>Response time: Within 24 hours during business days</li>
                  <li>Include your account email for faster assistance</li>
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

export default SubscriptionPolicy;
