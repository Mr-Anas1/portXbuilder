import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import crypto from "crypto";

// Constants for payment handling
const MAX_PAYMENT_FAILURES = 3;
const GRACE_PERIOD_DAYS = 7;

export async function POST(request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    // Handle subscription.charged event
    if (event.event === "subscription.charged") {
      const customerId = event.payload.subscription.entity.customer_id;

      // Find user by Razorpay customer ID
      const { data: user, error: userError } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("razorpay_customer_id", customerId)
        .single();

      if (userError) {
        console.error("Error finding user:", userError);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Update user plan to pro
      const { data: updatedUser, error: updateError } = await supabaseAdmin
        .from("users")
        .update({
          plan: "pro",
          subscription_status: "active",
          subscription_start_date: new Date().toISOString(),
          subscription_end_date: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(), // 30 days from now
        })
        .eq("id", user.id)
        .select()
        .single();

      if (updateError) {
        console.error("Error updating user plan:", updateError);
        return NextResponse.json(
          { error: "Failed to update user" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    }

    // Handle payment.failed event
    if (event.event === "payment.failed") {
      const customerId = event.payload.payment.entity.customer_id;

      // Find user by Razorpay customer ID
      const { data: user, error: userError } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("razorpay_customer_id", customerId)
        .single();

      if (userError) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Update user subscription status to payment_failed
      const { data: updatedUser, error: updateError } = await supabaseAdmin
        .from("users")
        .update({
          subscription_status: "payment_failed",
        })
        .eq("id", user.id)
        .select()
        .single();

      if (updateError) {
        return NextResponse.json(
          { error: "Failed to update user" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    }

    // Handle subscription.ended event
    if (event.event === "subscription.ended") {
      const customerId = event.payload.subscription.entity.customer_id;

      // Find user by Razorpay customer ID
      const { data: user, error: userError } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("razorpay_customer_id", customerId)
        .single();

      if (userError) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Downgrade user to free plan
      const { data: updatedUser, error: updateError } = await supabaseAdmin
        .from("users")
        .update({
          plan: "free",
          subscription_status: "ended",
          subscription_end_date: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select()
        .single();

      if (updateError) {
        return NextResponse.json(
          { error: "Failed to update user" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
