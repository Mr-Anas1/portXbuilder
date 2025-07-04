import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireAuth } from "@/lib/requireAuth";
import { Resend } from "resend";
import { dodopayments } from "@/lib/dodopayments";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { userId } = await request.json(); // clerk_id
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Fetch the user from Supabase to get dodo_customer_id
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("dodo_customer_id")
      .eq("clerk_id", userId)
      .single();
    if (userError || !user || !user.dodo_customer_id) {
      return NextResponse.json(
        { error: "Dodo customer_id not found for user" },
        { status: 404 }
      );
    }
    const customer_id = user.dodo_customer_id;

    // List active subscriptions for this customer
    const subscriptions = await dodopayments.subscriptions.list({
      customer_id,
      status: "active",
    });
    const subscription = subscriptions.items && subscriptions.items[0];
    if (!subscription) {
      return NextResponse.json(
        { error: "Active subscription not found" },
        { status: 404 }
      );
    }

    // Use the correct Dodo Payments API base URL for test/live mode
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? "https://test.dodopayments.com"
        : "https://live.dodopayments.com";
    const apiKey =
      process.env.DODO_PAYMENTS_API_KEY ||
      process.env.DODO_API_KEY_TEST ||
      process.env.DODO_API_KEY_LIVE;
    const cancelUrl = `${baseUrl}/v1/subscriptions/${subscription.subscription_id}/cancel`;

    // Debug log
    console.log(
      "NODE_ENV:",
      process.env.NODE_ENV,
      "baseUrl:",
      baseUrl,
      "cancelUrl:",
      cancelUrl
    );

    const cancelResp = await fetch(cancelUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    if (!cancelResp.ok) {
      const errText = await cancelResp.text();
      console.error("Dodo Payments cancel error:", errText);
      return NextResponse.json(
        {
          error: "Failed to cancel subscription in Dodo Payments",
          details: errText,
        },
        { status: 500 }
      );
    }

    // Downgrade the user's plan in Supabase
    const { error } = await supabaseAdmin
      .from("users")
      .update({
        plan: "free",
        subscription_status: "cancelled",
        subscription_cancelled_at: new Date().toISOString(),
        grace_period_end: null,
      })
      .eq("clerk_id", userId);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Subscription cancelled and plan downgraded.",
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
