"use client";
import React from "react";
import { usePortfolio } from "@/context/PortfolioContext";

const ShippingAndDelivery = () => {
  const { portfolio } = usePortfolio();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Shipping and Delivery Policy
        </h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              1. Processing Time
            </h2>
            <p className="text-gray-600 mb-4">
              Orders are typically processed within:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>1-2 business days for standard orders</li>
              <li>24 hours for express orders</li>
              <li>Immediate for digital products</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              2. Shipping Methods
            </h2>
            <p className="text-gray-600 mb-4">
              We offer the following shipping options:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Standard Shipping (3-5 business days)</li>
              <li>Express Shipping (1-2 business days)</li>
              <li>Digital Delivery (Instant)</li>
              <li>Local Pickup (Available in select locations)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              3. Shipping Costs
            </h2>
            <p className="text-gray-600 mb-4">
              Shipping costs are calculated based on:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Order weight and dimensions</li>
              <li>Shipping destination</li>
              <li>Selected shipping method</li>
              <li>Free shipping on orders over $50</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              4. International Shipping
            </h2>
            <p className="text-gray-600 mb-4">For international orders:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Delivery times vary by country (5-15 business days)</li>
              <li>Customs duties and taxes may apply</li>
              <li>International shipping available to most countries</li>
              <li>
                Tracking information provided for all international shipments
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              5. Order Tracking
            </h2>
            <p className="text-gray-600 mb-4">Track your order through:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Order confirmation email</li>
              <li>Account dashboard</li>
              <li>Shipping carrier's website</li>
              <li>Tracking number provided upon shipment</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              6. Contact Us
            </h2>
            <p className="text-gray-600 mb-4">
              For any questions regarding shipping and delivery, please contact
              us at:
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

export default ShippingAndDelivery;
