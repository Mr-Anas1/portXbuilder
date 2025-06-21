import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import {
  validateInput,
  checkRateLimit,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/auth-middleware";

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

// Input validation schema
const paymentSchema = {
  razorpay_payment_id: { required: true, maxLength: 100 },
  razorpay_subscription_id: { required: true, maxLength: 100 },
  razorpay_signature: { required: true, maxLength: 200 },
};

export async function POST(request) {
  try {
    // Rate limiting
    const clientIP = request.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(clientIP)) {
      return createErrorResponse("Rate limit exceeded", 429);
    }

    // Get request body
    const body = await request.json();
    if (!body) {
      return createErrorResponse("No payment data provided");
    }

    // Input validation
    let validatedData;
    try {
      validatedData = validateInput(body, paymentSchema);
    } catch (validationError) {
      return createErrorResponse(validationError.message);
    }

    // Verify the payment signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error("Missing Razorpay secret key");
      return createErrorResponse("Payment service configuration error", 500);
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
      return createErrorResponse("Invalid payment signature", 400);
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
        return createErrorResponse("User not found", 404);
      }

      user = userByPayment;
    } else {
      user = userBySub;
    }

    if (!user) {
      console.error("No user found");
      return createErrorResponse("User not found", 404);
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
      return createErrorResponse("Failed to update user plan", 500);
    }

    if (!updatedUser) {
      console.error("No user was updated");
      return createErrorResponse("Failed to update user plan", 500);
    }

    return createSuccessResponse({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Payment verification error:", error);
    return createErrorResponse(error.message || "Internal server error", 500);
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
