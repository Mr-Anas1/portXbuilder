import { dodopayments } from "@/lib/dodopayments";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const clerkId = searchParams.get("clerk_id");

    // Fetch user from Supabase
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("email, name")
      .eq("clerk_id", clerkId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 1. Create or update the customer with real user data
    const customerResp = await dodopayments.customers.create({
      email: user.email,
      name: user.name,
      metadata: { clerk_id: clerkId },
    });
    const customer_id = customerResp.customer_id;

    // Store the Dodo customer_id in the users table (using dodo_customer_id column)
    await supabaseAdmin
      .from("users")
      .update({ dodo_customer_id: customer_id })
      .eq("clerk_id", clerkId);

    // 2. Create the subscription using the customer_id and real user data
    const response = await dodopayments.subscriptions.create({
      billing: {
        city: "Sydney",
        country: "AU",
        state: "New South Wales",
        street: "1, Random address",
        zipcode: "2000",
      },
      customer_id,
      customer: {
        email: user.email,
        name: user.name,
      },
      metadata: {
        clerk_id: clerkId,
      },
      payment_link: true,
      product_id: productId,
      quantity: 1,
      return_url: process.env.NEXT_PUBLIC_BASE_URL,
    });

    // Update user record in Supabase
    if (response && response.subscription_id) {
      const { error } = await supabaseAdmin
        .from("users")
        .update({
          plan: "pro",
          subscription_id: response.subscription_id,
          subscription_status: "ACTIVE",
          subscription_start_date: response.created_at
            ? new Date(response.created_at).toISOString()
            : null,
          subscription_end_date: response.next_billing_date
            ? new Date(response.next_billing_date).toISOString()
            : null,
          subscription_cancelled_at: null,
          payment_failure_count: 0,
          grace_period_end: null,
        })
        .eq("clerk_id", clerkId);
      if (error) {
        console.error("Failed to update user on subscribe:", error);
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
