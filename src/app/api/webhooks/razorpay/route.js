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

    // Verify webhook signature
    const signature = request.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(body))
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle subscription payment success
    if (body.event === "subscription.charged") {
      const subscription = body.payload.subscription.entity;
      const customer = body.payload.subscription.entity.customer_id;

      // Get user from Supabase using customer ID
      const { data: user, error: userError } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("razorpay_customer_id", customer)
        .single();

      if (userError) {
        console.error("Error finding user:", userError);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Update user's plan to pro
      const { error: updateError } = await supabaseAdmin
        .from("users")
        .update({
          plan: "pro",
          subscription_id: subscription.id,
          subscription_status: subscription.status,
          subscription_start_date: new Date(
            subscription.start_at * 1000
          ).toISOString(),
          subscription_end_date: new Date(
            subscription.end_at * 1000
          ).toISOString(),
        })
        .eq("id", user.id);

      if (updateError) {
        console.error("Error updating user plan:", updateError);
        return NextResponse.json(
          { error: "Failed to update user plan" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
