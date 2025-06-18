import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import crypto from "crypto";

export async function POST(request) {
  try {
    const body = await request.json();
    const signature = request.headers.get("x-razorpay-signature");

    // Verify webhook signature
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(body))
      .digest("hex");

    if (generated_signature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const { event, payload } = body;
    console.log("Received webhook event:", event);

    if (event === "subscription.charged") {
      const { subscription } = payload;
      const customerId = subscription.customer_id;

      console.log("Processing subscription.charged event");
      console.log("Customer ID:", customerId);

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

      console.log("Found user:", user);

      // Update user's plan to pro
      const { data: updatedUser, error: updateError } = await supabaseAdmin
        .from("users")
        .update({
          plan: "pro",
          subscription_status: "active",
          subscription_id: subscription.id,
          subscription_start_date: new Date(
            subscription.start_at * 1000
          ).toISOString(),
          subscription_end_date: new Date(
            subscription.end_at * 1000
          ).toISOString(),
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

      console.log("Successfully updated user:", updatedUser);
      return NextResponse.json({ success: true, user: updatedUser });
    }

    // Handle subscription end event
    if (
      event === "subscription.cancelled" ||
      event === "subscription.completed"
    ) {
      const { subscription } = payload;
      const customerId = subscription.customer_id;

      console.log("Processing subscription end event:", event);
      console.log("Customer ID:", customerId);

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

      // Only downgrade if the subscription was actually cancelled or completed
      if (
        user.subscription_status === "cancelled" ||
        event === "subscription.completed"
      ) {
        const { data: updatedUser, error: updateError } = await supabaseAdmin
          .from("users")
          .update({
            plan: "free",
            subscription_status: "ended",
            subscription_ended_at: new Date().toISOString(),
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

        console.log("Successfully downgraded user:", updatedUser);
        return NextResponse.json({ success: true, user: updatedUser });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
