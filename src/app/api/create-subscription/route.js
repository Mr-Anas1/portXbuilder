import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import razorpay from "@/lib/razorpay";

export async function POST(request) {
  try {
    // Add debugging logs
    console.log("API called from:", request.headers.get("user-agent"));
    console.log("Request origin:", request.headers.get("origin"));

    // Check authentication
    const { userId, user } = await auth();
    if (!userId || !user) {
      console.error("Authentication failed");
      return NextResponse.json(
        { error: "Unauthorized - Authentication required" },
        { status: 401 }
      );
    }

    console.log("User authenticated:", userId);

    // Check environment variables first
    console.log("Environment check:");
    console.log("RAZORPAY_KEY_ID exists:", !!process.env.RAZORPAY_KEY_ID);
    console.log(
      "RAZORPAY_KEY_SECRET exists:",
      !!process.env.RAZORPAY_KEY_SECRET
    );
    console.log(
      "RAZORPAY_MONTHLY_PLAN_ID exists:",
      !!process.env.RAZORPAY_MONTHLY_PLAN_ID
    );
    console.log(
      "RAZORPAY_YEARLY_PLAN_ID exists:",
      !!process.env.RAZORPAY_YEARLY_PLAN_ID
    );

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("Missing Razorpay credentials");
      return NextResponse.json(
        {
          error:
            "Payment service configuration error - Missing Razorpay credentials",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    console.log("Request body:", body);

    // Verify the email matches the authenticated user
    const userEmail = user.emailAddresses?.[0]?.emailAddress;
    if (body.email !== userEmail) {
      console.error("Email mismatch:", body.email, "vs", userEmail);
      return NextResponse.json(
        {
          error:
            "Unauthorized - You can only create subscriptions for your own email",
        },
        { status: 403 }
      );
    }

    const customer = await razorpay.customers.create({
      name: body.name,
      email: body.email,
      contact: body.contact, // optional
    });

    console.log("Customer created:", customer.id);

    const planId =
      body.billingPeriod === "yearly"
        ? process.env.RAZORPAY_YEARLY_PLAN_ID
        : process.env.RAZORPAY_MONTHLY_PLAN_ID;

    console.log("Selected Plan ID:", planId);

    if (!planId) {
      console.error("Missing Razorpay plan ID");
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

    console.log("Subscription created:", subscription.id);
    return NextResponse.json({ subscriptionId: subscription.id });
  } catch (error) {
    console.error("Subscription error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
