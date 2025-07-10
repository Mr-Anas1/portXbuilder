"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { useProStatusClient } from "@/context/useProStatusClient";
import Navbar from "@/components/common/Navbar/Page";
import CustomerPortalButton from "@/components/ui/CustomerPortalButton";
import BillingForm from "@/components/ui/BillingForm";
import { supabase } from "@/lib/supabaseClient";

import {
  CreditCard,
  User,
  Calendar,
  Shield,
  Settings,
  CheckCircle,
  XCircle,
  Info,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function AccountPage() {
  const { user, loading } = useAuthContext();
  const hasProPlan = useProStatusClient();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingBilling, setEditingBilling] = useState(false);
  const [billingLoading, setBillingLoading] = useState(false);
  const [billingInfo, setBillingInfo] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    }
  }, [loading, user, router]);

  const fetchUserData = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("clerk_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user data:", error);
        return;
      }

      setUserData(data);
      setHasProPlan(data?.plan === "pro");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserData();
  }, [user, fetchUserData]);

  useEffect(() => {
    if (user) {
      supabase
        .from("users")
        .select(
          "billing_city, billing_country, billing_state, billing_street, billing_zipcode"
        )
        .eq("clerk_id", user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setBillingInfo({
              city: data.billing_city || "",
              country: data.billing_country || "",
              state: data.billing_state || "",
              street: data.billing_street || "",
              zipcode: data.billing_zipcode || "",
            });
          }
        });
    }
  }, [user, isLoading]);

  const handleBillingSave = async (form) => {
    setBillingLoading(true);
    await fetch("/api/update-billing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, clerk_id: user.id }),
    });
    setBillingLoading(false);
    setEditingBilling(false);
    setBillingInfo(form);
    toast.success("Billing details updated!");
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8 mt-16">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Account Settings
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your subscription and account details
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Subscription Status */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Subscription Status
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchUserData}
                    disabled={isLoading}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Refresh subscription data"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                    />
                  </button>
                  {hasProPlan ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span
                    className={`font-medium ${hasProPlan ? "text-green-600" : "text-red-600"}`}
                  >
                    {hasProPlan ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {/* Current Plan */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <CreditCard className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {hasProPlan ? "Pro Plan" : "Free Plan"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {hasProPlan
                          ? "Unlimited portfolios and advanced features"
                          : "Basic features with limited portfolios"}
                      </p>
                    </div>
                  </div>
                  {hasProPlan && (
                    <CustomerPortalButton variant="outline" size="sm">
                      Manage
                    </CustomerPortalButton>
                  )}
                </div>

                {/* Subscription Details */}
                {userData && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">
                      Subscription Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Status</p>
                        <p className="font-medium text-gray-900 capitalize">
                          {userData.subscription_status || "No subscription"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Plan</p>
                        <p className="font-medium text-gray-900 capitalize">
                          {userData.plan || "Free"}
                        </p>
                      </div>
                      {userData.subscription_cancelled_at && (
                        <div>
                          <p className="text-gray-600">Cancelled On</p>
                          <p className="font-medium text-gray-900">
                            {new Date(
                              userData.subscription_cancelled_at
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      {userData.grace_period_end && (
                        <div>
                          <p className="text-gray-600">Grace Period Ends</p>
                          <p className="font-medium text-gray-900">
                            {new Date(
                              userData.grace_period_end
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Cancellation Notice */}
                {userData?.subscription_status === "cancelling" &&
                  userData?.grace_period_end && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-amber-900 mb-1">
                            Subscription Cancelled
                          </p>
                          <p className="text-sm text-amber-700 mb-2">
                            Your subscription has been cancelled. You&apos;ll
                            have Pro access until{" "}
                            <span className="font-medium">
                              {new Date(
                                userData.grace_period_end
                              ).toLocaleDateString()}
                            </span>
                            .
                          </p>
                          <p className="text-xs text-amber-600">
                            After this date, you&apos;ll be downgraded to the
                            Free plan and lose access to Pro features.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                {/* Upgrade CTA for Free Users */}
                {!hasProPlan && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-blue-900 mb-1">
                          Upgrade to Pro
                        </p>
                        <p className="text-sm text-blue-700 mb-3">
                          Get unlimited portfolios, custom domains, and advanced
                          features.
                        </p>
                        <button
                          onClick={() => router.push("/pricing")}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          View Plans
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Account Information
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">
                      {user.emailAddresses?.[0]?.emailAddress || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Member Since</p>
                    <p className="text-sm text-gray-600">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary-500" /> Billing
                Details
              </h2>
              {editingBilling ? (
                <BillingForm
                  initialValues={billingInfo || {}}
                  onSubmit={handleBillingSave}
                  loading={billingLoading}
                  submitLabel="Update"
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-gray-700 text-sm mb-4">
                  <div>
                    <span className="font-semibold text-gray-900">City:</span>{" "}
                    {billingInfo?.city || (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">
                      Country:
                    </span>{" "}
                    {billingInfo?.country || (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">State:</span>{" "}
                    {billingInfo?.state || (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Street:</span>{" "}
                    {billingInfo?.street || (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">
                      Zipcode:
                    </span>{" "}
                    {billingInfo?.zipcode || (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                </div>
              )}
              {editingBilling ? (
                <button
                  className="mt-2 text-sm text-gray-500 underline"
                  onClick={() => setEditingBilling(false)}
                  disabled={billingLoading}
                >
                  Cancel
                </button>
              ) : (
                <button
                  className="mt-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-lg font-semibold shadow transition-colors"
                  onClick={() => setEditingBilling(true)}
                >
                  Edit Billing Details
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>

              <div className="space-y-3">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Settings className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Dashboard</p>
                    <p className="text-sm text-gray-600">
                      Manage your portfolios
                    </p>
                  </div>
                </button>

                {hasProPlan && (
                  <CustomerPortalButton
                    disableDefaultStyle={true}
                    className="w-full"
                  >
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <CreditCard className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Billing Portal
                      </p>
                      <p className="text-sm text-gray-600">
                        Manage subscription
                      </p>
                    </div>
                  </CustomerPortalButton>
                )}

                <button
                  onClick={() => router.push("/pricing")}
                  className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="p-2 bg-secondary-100 rounded-lg">
                    <Shield className="w-4 h-4 text-secondary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Pricing</p>
                    <p className="text-sm text-gray-600">View all plans</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Support */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Need Help?
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Have questions about your account or subscription? We&apos;re
                here to help.
              </p>
              <button
                onClick={() => router.push("/contact-support")}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
