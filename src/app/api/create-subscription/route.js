import { NextResponse } from "next/server";
import DodoPayments from "dodopayments";

console.log("DODO_PAYMENTS_API_KEY:", process.env.DODO_PAYMENTS_API_KEY);

const client = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { billing, customer, product_id, quantity = 1, return_url } = body;

    // Validate required fields
    if (!billing || !customer || !product_id) {
      return NextResponse.json(
        { error: "Missing required fields: billing, customer, or product_id" },
        { status: 400 }
      );
    }

    // If customer_id is not present, use CreateNewCustomer schema
    let dodoCustomer = customer;
    if (!customer.customer_id) {
      dodoCustomer = {
        name: customer.name,
        email: customer.email,
        phone_number: customer.phone_number || undefined,
      };
    }

    // Create the subscription using the SDK
    const subscription = await client.subscriptions.create({
      billing,
      customer: dodoCustomer,
      product_id,
      quantity,
      payment_link: true,
      return_url: return_url || process.env.NEXT_PUBLIC_RETURN_URL,
    });

    // Return the payment link and subscription ID
    return NextResponse.json({
      paymentLink: subscription.payment_link,
      subscriptionId: subscription.subscription_id,
      ...subscription,
    });
  } catch (err) {
    console.error("Dodo Payments error:", err, JSON.stringify(err));
    return NextResponse.json(
      {
        error:
          err?.message || JSON.stringify(err) || "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
