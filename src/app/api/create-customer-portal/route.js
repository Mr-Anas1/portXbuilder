import { NextResponse } from "next/server";
import { dodopayments, isDodoPaymentsConfigured } from "@/lib/dodopayments";

export async function POST(request) {
  try {
    // Check if Dodo Payments is properly configured
    if (!isDodoPaymentsConfigured()) {
      console.error("Dodo Payments is not configured. Missing API keys.");
      return NextResponse.json(
        { error: "Payment service is not configured. Please contact support." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { clerk_id } = body;

    if (!clerk_id) {
      return NextResponse.json(
        { error: "clerk_id is required" },
        { status: 400 }
      );
    }

    // Import supabaseAdmin dynamically to avoid issues
    let supabaseAdmin;
    try {
      const { supabaseAdmin: admin } = await import("@/lib/supabase-admin");
      supabaseAdmin = admin;
    } catch (importError) {
      console.error("Error importing supabase-admin:", importError);
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    // Fetch the user's data from Supabase
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("dodo_customer_id, plan, email, name")
      .eq("clerk_id", clerk_id)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Database error occurred" },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the appropriate API key from the SDK config
    const apiKey =
      process.env.NODE_ENV === "development"
        ? process.env.DODO_API_KEY_TEST
        : process.env.DODO_API_KEY_LIVE;

    if (!apiKey) {
      console.error("Dodo Payments API key not configured");
      return NextResponse.json(
        { error: "Payment service not configured" },
        { status: 500 }
      );
    }

    // Determine the correct API endpoint based on environment
    const isProduction = process.env.NODE_ENV === "production";
    const baseUrl = isProduction
      ? "https://api.dodopayments.com"
      : "https://test.dodopayments.com";

    // Find the customer by searching through all customers and matching clerk_id in metadata
    const customersUrl = `${baseUrl}/customers`;
    const customersResponse = await fetch(customersUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    const customersText = await customersResponse.text();
    let customersData;
    try {
      customersData = customersText ? JSON.parse(customersText) : {};
    } catch (parseError) {
      console.error("Failed to parse customers response:", parseError);
      customersData = { raw: customersText };
    }

    if (!customersResponse.ok) {
      console.error("Failed to fetch customers list");
      return NextResponse.json(
        { error: "Failed to fetch customer data" },
        { status: 500 }
      );
    }

    if (!customersData.items || !Array.isArray(customersData.items)) {
      console.error("No customers found or invalid response format");
      return NextResponse.json(
        { error: "No customers found in payment system" },
        { status: 404 }
      );
    }

    // Find customer by email since metadata is not available
    const matchingCustomer = customersData.items.find(
      (customer) => customer.email === user.email
    );

    if (!matchingCustomer) {
      return NextResponse.json(
        { error: "No subscription found. Please subscribe first." },
        { status: 404 }
      );
    }

    const actualCustomerId = matchingCustomer.customer_id;

    // Update the stored customer ID if it's different
    if (user.dodo_customer_id !== actualCustomerId) {
      await supabaseAdmin
        .from("users")
        .update({ dodo_customer_id: actualCustomerId })
        .eq("clerk_id", clerk_id);
    }

    const returnUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/account`;

    // Try to create portal session using Dodo SDK first
    try {
      // Check if the SDK has a customer portal method
      if (
        dodopayments.customers &&
        dodopayments.customers.customerPortal &&
        typeof dodopayments.customers.customerPortal.create === "function"
      ) {
        const portalSession =
          await dodopayments.customers.customerPortal.create(actualCustomerId);

        return NextResponse.json({ url: portalSession.link });
      }
    } catch (sdkError) {
      // Fallback to REST API if SDK method doesn't exist
    }

    // Fallback to REST API if SDK method doesn't exist
    const portalUrl = `${baseUrl}/customers/${actualCustomerId}/customer-portal/session`;

    // Create the portal session using REST API
    const resp = await fetch(portalUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        send_email: false, // Don't send email, we'll redirect directly
      }),
    });

    // Handle empty response body
    let data;
    const responseText = await resp.text();

    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      console.error("Failed to parse Dodo API response:", parseError);
      data = { error: "Invalid response from payment service" };
    }

    if (!resp.ok) {
      console.error("Dodo Payments portal error:", {
        status: resp.status,
        data,
        customerId: actualCustomerId,
        plan: user.plan,
      });

      // Handle specific error cases
      if (resp.status === 404) {
        return NextResponse.json(
          {
            error:
              "Customer not found in payment system. Please contact support.",
            details:
              "The customer ID exists in our database but not in the payment system.",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          error: data.error?.message || "Failed to create portal session",
          details: data,
        },
        { status: resp.status || 500 }
      );
    }

    if (!data.link) {
      console.error("No portal link in response:", data);
      return NextResponse.json(
        { error: "No portal link received from payment service" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: data.link });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
