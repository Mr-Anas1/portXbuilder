"use client";
import React from "react";

const CancellationAndRefund = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Cancellation and Refund Policy
        </h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              1. Cancellation Policy
            </h2>
            <p className="text-gray-600 mb-4">
              You may cancel your order or subscription under the following
              conditions:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Before the service has been delivered</li>
              <li>Within 24 hours of purchase for digital products</li>
              <li>Before the start of a subscription period</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              2. Refund Policy
            </h2>
            <p className="text-gray-600 mb-4">
              We offer refunds in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Service not delivered as promised</li>
              <li>Technical issues preventing service delivery</li>
              <li>Duplicate charges</li>
              <li>Quality issues with the delivered service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              3. Refund Process
            </h2>
            <p className="text-gray-600 mb-4">To request a refund:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Contact our support team within 7 days of purchase</li>
              <li>Provide your order details and reason for refund</li>
              <li>Allow 5-7 business days for processing</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              4. Non-Refundable Items
            </h2>
            <p className="text-gray-600 mb-4">
              The following items are not eligible for refunds:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Services already delivered</li>
              <li>Custom services tailored to your needs</li>
              <li>Subscription fees for used periods</li>
              <li>Processing fees</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              5. Contact Us
            </h2>
            <p className="text-gray-600 mb-4">
              For questions about cancellations or refunds, please contact us
              at:
            </p>
            <p className="text-gray-600">support@example.com</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CancellationAndRefund;
