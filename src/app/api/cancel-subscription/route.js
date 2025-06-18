import { NextResponse } from "next/server";
import razorpay from "@/lib/razorpay";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get user's subscription details from Supabase
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("clerk_id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.subscription_id) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 400 }
      );
    }

    // Cancel the subscription in Razorpay
    const subscription = await razorpay.subscriptions.cancel(
      user.subscription_id,
      {
        cancel_at_cycle_end: 1, // This will cancel at the end of the current billing cycle
      }
    );

    // Update user's subscription status in Supabase
    // Keep the plan as "pro" but mark the subscription as cancelled
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
