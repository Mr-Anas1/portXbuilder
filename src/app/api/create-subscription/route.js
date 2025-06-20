import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request) {
  try {
    // Dynamically import Razorpay to ensure it's only loaded server-side
    const Razorpay = (await import("razorpay")).default;

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Missing Razorpay credentials");
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const body = await request.json();

    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Get user from Supabase
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", body.email)
      .single();

    if (userError) {
      console.error("Error finding user:", userError);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create or get Razorpay customer
    let customer;
    if (user.razorpay_customer_id) {
      customer = await razorpay.customers.fetch(user.razorpay_customer_id);
    } else {
      customer = await razorpay.customers.create({
        name: body.name,
        email: body.email,
        contact: body.contact,
      });

      // Store Razorpay customer ID in user's record
      const { error: updateError } = await supabaseAdmin
        .from("users")
        .update({ razorpay_customer_id: customer.id })
        .eq("id", user.id);

      if (updateError) {
        console.error("Error updating user with customer ID:", updateError);
      }
    }

    // Debug logs for environment variables and plan selection
    console.log("Monthly Plan ID:", process.env.RAZORPAY_MONTHLY_PLAN_ID);
    console.log("Yearly Plan ID:", process.env.RAZORPAY_YEARLY_PLAN_ID);
    console.log("Billing period from request:", body.billingPeriod);

    const planId =
      body.billingPeriod === "yearly"
        ? process.env.RAZORPAY_YEARLY_PLAN_ID
        : process.env.RAZORPAY_MONTHLY_PLAN_ID;

    console.log("Selected Plan ID:", planId);

    if (!planId) {
      throw new Error("Missing Razorpay plan ID");
    }

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 12, // how many billing cycles
      customer_id: customer.id,
    });

    return NextResponse.json({ subscriptionId: subscription.id });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create subscription" },
      { status: 500 }
    );
  }
}
