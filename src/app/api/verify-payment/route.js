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

// Input validation function
function validateInput(data, schema) {
  const errors = [];
  const sanitized = {};

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];

    // Required field check
    if (rules.required) {
      if (value === undefined || value === null || value === "") {
        errors.push(`${field} is required`);
        continue;
      }
      // For strings, also check if they're empty after trimming
      if (typeof value === "string" && value.trim() === "") {
        errors.push(`${field} is required`);
        continue;
      }
    }

    // Length check (only for strings)
    if (
      value &&
      typeof value === "string" &&
      rules.maxLength &&
      value.length > rules.maxLength
    ) {
      errors.push(`${field} must be less than ${rules.maxLength} characters`);
      continue;
    }

    // Sanitize string inputs
    if (value && typeof value === "string") {
      sanitized[field] = value.trim().replace(/[<>]/g, "");
    } else {
      sanitized[field] = value;
    }
  }

  if (errors.length > 0) {
    throw new Error(`Validation failed: ${errors.join(", ")}`);
  }

  return sanitized;
}

// Input validation schema
const paymentSchema = {
  razorpay_payment_id: { required: true, maxLength: 100 },
  razorpay_subscription_id: { required: true, maxLength: 100 },
  razorpay_signature: { required: true, maxLength: 200 },
};

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Verifying payment - Request body:", body);

    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
    } = body;

    // Verify the payment signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_payment_id + "|" + razorpay_subscription_id)
      .digest("hex");

    console.log("Generated signature:", generated_signature);
    console.log("Received signature:", razorpay_signature);

    if (generated_signature !== razorpay_signature) {
      console.error("Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // First try to find user by subscription ID
    console.log(
      "Looking for user with subscription ID:",
      razorpay_subscription_id
    );
    const { data: userBySub, error: userBySubError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("subscription_id", razorpay_subscription_id)
      .single();

    if (userBySubError) {
      console.log(
        "User not found by subscription ID, trying to find by payment ID"
      );

      // If not found by subscription ID, try to find by payment ID
      const { data: userByPayment, error: userByPaymentError } =
        await supabaseAdmin
          .from("users")
          .select("*")
          .eq("subscription_id", razorpay_subscription_id)
          .single();

      if (userByPaymentError) {
        console.error("Error finding user by payment ID:", userByPaymentError);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      console.log("Found user by payment ID:", userByPayment);
      var user = userByPayment;
    } else {
      console.log("Found user by subscription ID:", userBySub);
      var user = userBySub;
    }

    if (!user) {
      console.error("No user found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user's plan to pro
    console.log("Updating user plan for user:", user.clerk_id);
    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from("users")
      .update({
        plan: "pro",
        subscription_status: "active",
        subscription_id: razorpay_subscription_id,
        subscription_start_date: new Date().toISOString(),
        subscription_end_date: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(), // 30 days from now
      })
      .eq("clerk_id", user.clerk_id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating user plan:", updateError);
      return NextResponse.json(
        { error: "Failed to update user plan: " + updateError.message },
        { status: 500 }
      );
    }

    if (!updatedUser) {
      console.error("No user was updated");
      return NextResponse.json(
        { error: "Failed to update user plan: No user was updated" },
        { status: 500 }
      );
    }

    console.log("Successfully updated user:", updatedUser);
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Payment verification error:", error);
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
