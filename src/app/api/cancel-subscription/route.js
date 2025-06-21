import { NextResponse } from "next/server";
import razorpay from "@/lib/razorpay";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  authenticateRequest,
  validateInput,
  checkRateLimit,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/auth-middleware";

// Input validation schema
const cancelSubscriptionSchema = {
  userId: { required: true, maxLength: 100 },
};

export async function POST(request) {
  try {
    // Rate limiting
    const clientIP = request.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(clientIP)) {
      return createErrorResponse("Rate limit exceeded", 429);
    }

    // Authentication
    const authResult = await authenticateRequest(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { user, userId } = authResult;

    // Get request body
    const body = await request.json();
    if (!body) {
      return createErrorResponse("No data provided");
    }

    // Input validation
    let validatedData;
    try {
      validatedData = validateInput(body, cancelSubscriptionSchema);
    } catch (validationError) {
      return createErrorResponse(validationError.message);
    }

    // Authorization: Ensure user can only cancel their own subscription
    if (validatedData.userId !== userId) {
      return createErrorResponse(
        "Unauthorized - You can only cancel your own subscription",
        403
      );
    }

    // Get user's subscription details from Supabase
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("clerk_id", validatedData.userId)
      .single();

    if (userError || !userData) {
      return createErrorResponse("User not found", 404);
    }

    if (!userData.subscription_id) {
      return createErrorResponse("No active subscription found", 400);
    }

    // Cancel the subscription in Razorpay
    try {
      const subscription = await razorpay.subscriptions.cancel(
        userData.subscription_id,
        {
          cancel_at_cycle_end: 1, // This will cancel at the end of the current billing cycle
        }
      );
    } catch (razorpayError) {
      console.error(
        "Error cancelling subscription in Razorpay:",
        razorpayError
      );
      // Continue with local cancellation even if Razorpay fails
    }

    // Update user's subscription status in Supabase
    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({
        subscription_status: "cancelled",
        subscription_cancelled_at: new Date().toISOString(),
        // Don't change the plan to free yet - it will be changed when the subscription actually ends
      })
      .eq("clerk_id", validatedData.userId);

    if (updateError) {
      console.error("Error updating user subscription status:", updateError);
      return createErrorResponse("Failed to update subscription status", 500);
    }

    return createSuccessResponse({
      success: true,
      message:
        "Subscription will be cancelled at the end of the current billing period. You'll continue to have access to Pro features until then.",
    });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return createErrorResponse(
      error.message || "Failed to cancel subscription",
      500
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
