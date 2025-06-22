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
    console.log("Verifying payment - Request body:", body);

    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
    } = body;

    // Validate required fields
    if (
      !razorpay_payment_id ||
      !razorpay_subscription_id ||
      !razorpay_signature
    ) {
      console.error("Missing required fields:", {
        razorpay_payment_id,
        razorpay_subscription_id,
        razorpay_signature,
      });
      return NextResponse.json(
        { error: "Missing required payment fields" },
        { status: 400 }
      );
    }

    // Verify the payment signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error("RAZORPAY_KEY_SECRET is not configured");
      return NextResponse.json(
        { error: "Payment verification not configured" },
        { status: 500 }
      );
    }

    const text = razorpay_payment_id + "|" + razorpay_subscription_id;
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(text)
      .digest("hex");

    console.log("Text for signature:", text);
    console.log("Generated signature:", generated_signature);
    console.log("Received signature:", razorpay_signature);

    if (generated_signature !== razorpay_signature) {
      console.error("Invalid signature");
      console.error("Expected:", generated_signature);
      console.error("Received:", razorpay_signature);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    console.log("Signature verification successful");

    // First try to find user by subscription ID
    console.log(
      "Looking for user with subscription ID:",
      razorpay_subscription_id
    );
    const { data: userBySub, error: userBySubError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("subscription_id", razorpay_subscription_id)
      .single();

    if (userBySubError) {
      console.log(
        "User not found by subscription ID, trying to find by email from Razorpay"
      );

      // If not found by subscription ID, we need to get the subscription details from Razorpay
      // to find the customer and then find the user by email
      try {
        const Razorpay = (await import("razorpay")).default;
        const razorpay = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        console.log(
          "Fetching subscription details from Razorpay:",
          razorpay_subscription_id
        );

        // Get subscription details from Razorpay
        const subscription = await razorpay.subscriptions.fetch(
          razorpay_subscription_id
        );
        console.log("Subscription details:", subscription);

        const customerId = subscription.customer_id;
        console.log("Customer ID from subscription:", customerId);

        // Get customer details from Razorpay
        const customer = await razorpay.customers.fetch(customerId);
        console.log("Customer details:", customer);

        const customerEmail = customer.email;
        console.log("Found customer email from Razorpay:", customerEmail);

        // Find user by email
        const { data: userByEmail, error: userByEmailError } =
          await supabaseAdmin
            .from("users")
            .select("*")
            .eq("email", customerEmail)
            .single();

        if (userByEmailError) {
          console.error("Error finding user by email:", userByEmailError);
          console.error("Customer email:", customerEmail);
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          );
        }

        console.log("Found user by email:", userByEmail);
        var user = userByEmail;
      } catch (razorpayError) {
        console.error(
          "Error fetching subscription details from Razorpay:",
          razorpayError
        );
        console.error("Error details:", {
          message: razorpayError.message,
          statusCode: razorpayError.statusCode,
          error: razorpayError.error,
        });
        return NextResponse.json(
          { error: "Failed to verify subscription" },
          { status: 500 }
        );
      }
    } else {
      console.log("Found user by subscription ID:", userBySub);
      var user = userBySub;
    }

    if (!user) {
      console.error("No user found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user's plan to pro
    console.log("Updating user plan for user:", user.clerk_id);
    console.log("User details before update:", {
      id: user.id,
      clerk_id: user.clerk_id,
      email: user.email,
      current_plan: user.plan,
    });

    const updateData = {
      plan: "pro",
      subscription_status: "active",
      subscription_id: razorpay_subscription_id,
      subscription_start_date: new Date().toISOString(),
      subscription_end_date: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(), // 30 days from now
      razorpay_customer_id: user.razorpay_customer_id || null, // Preserve existing customer ID if any
    };

    console.log("Update data:", updateData);

    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from("users")
      .update(updateData)
      .eq("clerk_id", user.clerk_id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating user plan:", updateError);
      console.error("Update error details:", {
        message: updateError.message,
        details: updateError.details,
        hint: updateError.hint,
      });
      return NextResponse.json(
        { error: "Failed to update user plan: " + updateError.message },
        { status: 500 }
      );
    }

    if (!updatedUser) {
      console.error("No user was updated");
      console.error("User clerk_id:", user.clerk_id);
      return NextResponse.json(
        { error: "Failed to update user plan: No user was updated" },
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
