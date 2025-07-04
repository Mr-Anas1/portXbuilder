import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request) {
  try {
    const { clerk_id } = await request.json();

    // Fetch the user's Dodo customer ID from Supabase
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("dodo_customer_id")
      .eq("clerk_id", clerk_id)
      .single();

    if (error || !user || !user.dodo_customer_id) {
      console.error("Supabase error or missing dodo_customer_id:", error, user);
      return NextResponse.json(
        { error: "Dodo customer_id not found" },
        { status: 404 }
      );
    }

    // Create the portal session
    const resp = await fetch(
      "https://test.dodopayments.com/v1/customer-portal-sessions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DODO_PAYMENTS_API_KEY || process.env.DODO_API_KEY_TEST}`,
        },
        body: JSON.stringify({
          customer: user.dodo_customer_id,
          return_url: process.env.NEXT_PUBLIC_BASE_URL + "/account",
        }),
      }
    );

    const data = await resp.json();
    if (!resp.ok) {
      console.error("Dodo Payments portal error:", data);
      return NextResponse.json(
        {
          error: data.error || "Failed to create portal session",
          details: data,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: data.url });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
