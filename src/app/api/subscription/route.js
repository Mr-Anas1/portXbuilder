import { dodopayments } from "@/lib/dodopayments";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import countryNameToCode from "@/lib/countryCodes";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const clerkId = searchParams.get("clerk_id");

    console.log("Creating subscription with:", { productId, clerkId });
    console.log("Environment:", process.env.NODE_ENV);
    console.log("Base URL:", process.env.NEXT_PUBLIC_BASE_URL);

    if (!productId || !clerkId) {
      return NextResponse.json(
        { error: "Missing productId or clerk_id" },
        { status: 400 }
      );
    }

    // Fetch user from Supabase
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select(
        "email, name, billing_city, billing_country, billing_state, billing_street, billing_zipcode"
      )
      .eq("clerk_id", clerkId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("User found:", {
      email: user.email,
      name: user.name,
      billing: {
        city: user.billing_city,
        country: user.billing_country,
        state: user.billing_state,
        street: user.billing_street,
        zipcode: user.billing_zipcode,
      },
    });

    // 1. Create or update the customer with real user data
    const customerResp = await dodopayments.customers.create({
      email: user.email,
      name: user.name,
      metadata: { clerk_id: clerkId },
    });
    const customer_id = customerResp.customer_id;

    console.log("Customer created:", customer_id);

    // Store the Dodo customer_id in the users table (using dodo_customer_id column)
    await supabaseAdmin
      .from("users")
      .update({ dodo_customer_id: customer_id })
      .eq("clerk_id", clerkId);

    // 2. Create the subscription using the customer_id and real user data
    const countryInput = user.billing_country;
    const countryCode = countryNameToCode[countryInput] || countryInput; // fallback if already code
    const subscriptionData = {
      billing: {
        city: user.billing_city || "Default City",
        country: countryCode || "US", // Use the code here
        state: user.billing_state || "Default State",
        street: user.billing_street || "Default Street",
        zipcode: user.billing_zipcode || "12345",
      },
      customer_id,
      customer: {
        email: user.email,
        name: user.name,
      },
      metadata: {
        clerk_id: clerkId,
      },
      payment_link: true,
      product_id: productId,
      quantity: 1,
      return_url:
        process.env.NEXT_PUBLIC_BASE_URL || "https://your-ngrok-url.app",
      webhook_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://your-ngrok-url.app"}/api/webhook`,
    };

    console.log("Creating subscription with data:", subscriptionData);

    const response = await dodopayments.subscriptions.create(subscriptionData);

    console.log("Dodo Payments Response:", response);

    // Update user record in Supabase
    if (response && response.subscription_id) {
      const { error } = await supabaseAdmin
        .from("users")
        .update({
          // Don't upgrade to pro yet - wait for webhook confirmation
          plan: "free", // Keep as free until payment is confirmed
          subscription_id: response.subscription_id,
          // Don't set subscription_status here - webhook will handle it
          subscription_start_date: response.created_at
            ? new Date(response.created_at).toISOString()
            : null,
          subscription_end_date: response.next_billing_date
            ? new Date(response.next_billing_date).toISOString()
            : null,
          subscription_cancelled_at: null,
          payment_failure_count: 0,
          grace_period_end: null,
        })
        .eq("clerk_id", clerkId);
      if (error) {
        console.error("Failed to update user on subscribe:", error);
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// Manual upgrade endpoint for testing (remove in production)
export async function PUT(request) {
  try {
    const { clerkId } = await request.json();

    if (!clerkId) {
      return NextResponse.json({ error: "Missing clerkId" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("users")
      .update({
        plan: "pro",
        subscription_status: "ACTIVE",
        subscription_start_date: new Date().toISOString(),
      })
      .eq("clerk_id", clerkId);

    if (error) {
      console.error("Failed to manually upgrade user:", error);
      return NextResponse.json(
        { error: "Failed to upgrade user" },
        { status: 500 }
      );
    }

    console.log(`Manually upgraded user ${clerkId} to pro`);
    return NextResponse.json({ message: "User upgraded to pro" });
  } catch (error) {
    console.error("Manual upgrade error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
