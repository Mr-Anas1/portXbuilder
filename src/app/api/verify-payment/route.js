import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

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
    const body = await request.json();

    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
    } = body;

    // Validate required fields
    if (
      !razorpay_payment_id ||
      !razorpay_subscription_id ||
      !razorpay_signature
    ) {
      return NextResponse.json(
        { error: "Missing required payment fields" },
        { status: 400 }
      );
    }

    // Verify the payment signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "Payment verification not configured" },
        { status: 500 }
      );
    }

    const text = razorpay_payment_id + "|" + razorpay_subscription_id;
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(text)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // First try to find user by subscription ID
    const { data: userBySub, error: userBySubError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("subscription_id", razorpay_subscription_id)
      .single();

    if (userBySubError) {
      // If not found by subscription ID, we need to get the subscription details from Razorpay
      // to find the customer and then find the user by email
      try {
        const Razorpay = (await import("razorpay")).default;
        const razorpay = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        // Get subscription details from Razorpay
        const subscription = await razorpay.subscriptions.fetch(
          razorpay_subscription_id
        );

        const customerId = subscription.customer_id;

        // Get customer details from Razorpay
        const customer = await razorpay.customers.fetch(customerId);

        const customerEmail = customer.email;

        // Find user by email
        const { data: userByEmail, error: userByEmailError } =
          await supabaseAdmin
            .from("users")
            .select("*")
            .eq("email", customerEmail)
            .single();

        if (userByEmailError) {
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          );
        }

        var user = userByEmail;
      } catch (razorpayError) {
        return NextResponse.json(
          { error: "Failed to verify subscription" },
          { status: 500 }
        );
      }
    } else {
      var user = userBySub;
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user's plan to pro
    const updateData = {
      plan: "pro",
      subscription_status: "active",
      subscription_id: razorpay_subscription_id,
      subscription_start_date: new Date().toISOString(),
      subscription_end_date: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(), // 30 days from now
      razorpay_customer_id: user.razorpay_customer_id || null, // Preserve existing customer ID if any
    };

    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from("users")
      .update(updateData)
      .eq("clerk_id", user.clerk_id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update user plan: " + updateError.message },
        { status: 500 }
      );
    }

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Failed to update user plan: No user was updated" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_APP_URL || "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}
