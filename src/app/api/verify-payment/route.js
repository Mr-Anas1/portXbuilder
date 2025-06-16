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
    console.log("Verifying payment:", body);

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

    if (generated_signature !== razorpay_signature) {
      console.error("Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Get user from Supabase using subscription ID
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("subscription_id", razorpay_subscription_id)
      .single();

    if (userError) {
      console.error("Error finding user:", userError);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user's plan to pro
    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from("users")
      .update({
        plan: "pro",
        subscription_status: "active",
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
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
