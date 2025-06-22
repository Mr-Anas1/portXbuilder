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
    // Get request body
    const body = await request.json();
    if (!body) {
      return NextResponse.json(
        { error: "No payment data provided" },
        { status: 400 }
      );
    }

    // Input validation
    let validatedData;
    try {
      validatedData = validateInput(body, paymentSchema);
    } catch (validationError) {
      return NextResponse.json(
        { error: validationError.message },
        { status: 400 }
      );
    }

    // Verify the payment signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error("Missing Razorpay secret key");
      return NextResponse.json(
        { error: "Payment service configuration error" },
        { status: 500 }
      );
    }

    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(
        validatedData.razorpay_payment_id +
          "|" +
          validatedData.razorpay_subscription_id
      )
      .digest("hex");

    if (generated_signature !== validatedData.razorpay_signature) {
      console.error("Invalid payment signature");
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // First try to find user by subscription ID
    const { data: userBySub, error: userBySubError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("subscription_id", validatedData.razorpay_subscription_id)
      .single();

    let user;
    if (userBySubError) {
      // If not found by subscription ID, try to find by payment ID
      const { data: userByPayment, error: userByPaymentError } =
        await supabaseAdmin
          .from("users")
          .select("*")
          .eq("subscription_id", validatedData.razorpay_subscription_id)
          .single();

      if (userByPaymentError) {
        console.error("Error finding user by payment ID:", userByPaymentError);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      user = userByPayment;
    } else {
      user = userBySub;
    }

    if (!user) {
      console.error("No user found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user's plan to pro
    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from("users")
      .update({
        plan: "pro",
        subscription_status: "active",
        subscription_id: validatedData.razorpay_subscription_id,
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
        { error: "Failed to update user plan" },
        { status: 500 }
      );
    }

    if (!updatedUser) {
      console.error("No user was updated");
      return NextResponse.json(
        { error: "Failed to update user plan" },
        { status: 500 }
      );
    }

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
