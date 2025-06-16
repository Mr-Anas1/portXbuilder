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
    console.log("Webhook received:", body);

    const razorpaySignature = request.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Verify webhook signature
    const generatedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(body))
      .digest("hex");

    console.log("Received signature:", razorpaySignature);
    console.log("Generated signature:", generatedSignature);

    if (generatedSignature !== razorpaySignature) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const { event, payload } = body;

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

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
