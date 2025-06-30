import { NextResponse } from "next/server";
import razorpay from "@/lib/razorpay";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireAuth } from "@/lib/requireAuth";

export async function POST(request) {
  try {
    const userId = requireAuth(request);
    // Get request body
    const body = await request.json();
    if (!body) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    // Get user's subscription details from Supabase using userId from Clerk
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("clerk_id", userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!userData.subscription_id) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 400 }
      );
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
      .eq("clerk_id", userId);

    if (updateError) {
      console.error("Error updating user subscription status:", updateError);
      return NextResponse.json(
        { error: "Failed to update subscription status" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Subscription will be cancelled at the end of the current billing period. You'll continue to have access to Pro features until then.",
    });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return NextResponse.json(
      { error: error.message || "Failed to cancel subscription" },
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
