import { NextResponse } from "next/server";
import razorpay from "@/lib/razorpay";

export async function POST(request) {
  try {
    const body = await request.json();

    const customer = await razorpay.customers.create({
      name: body.name,
      email: body.email,
      contact: body.contact, // optional
    });

    const planId =
      body.billingPeriod === "yearly"
        ? process.env.RAZORPAY_YEARLY_PLAN_ID
        : process.env.RAZORPAY_MONTHLY_PLAN_ID;

    console.log("Selected Plan ID:", planId);

    if (!planId) {
      return NextResponse.json(
        { error: "Missing Razorpay plan ID" },
        { status: 500 }
      );
    }

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 12, // how many billing cycles
      customer_id: customer.id,
    });

    return NextResponse.json({ subscriptionId: subscription.id });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
