import { NextRequest, NextResponse } from "next/server";
import DodoPayments from "dodopayments";

// Initialize DodoPayments client
const bearerToken =
  process.env.NODE_ENV === "development"
    ? process.env.DODO_API_KEY_TEST
    : process.env.DODO_API_KEY_LIVE;

const environment =
  process.env.NODE_ENV === "development" ? "test_mode" : "live_mode";

const client = new DodoPayments({
  bearerToken,
  environment,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      billing,
      customer,
      product_id,
      quantity = 1,
      return_url,
      formData,
      cartItems,
    } = body;

    let finalBilling = billing;
    let finalCustomer = customer;
    let finalProductId = product_id;
    let finalQuantity = quantity;
    let finalReturnUrl = return_url || process.env.NEXT_PUBLIC_RETURN_URL;

    // Handle formData if provided
    if (formData) {
      finalBilling = {
        city: formData.city,
        country: formData.country,
        state: formData.state,
        street: formData.addressLine,
        zipcode: parseInt(formData.zipCode),
      };
      finalCustomer = {
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`,
        phone_number: formData.phoneNumber || undefined,
      };
      finalProductId = formData.productId || (cartItems && cartItems[0]?.id);
      finalQuantity = 1;
      finalReturnUrl = process.env.NEXT_PUBLIC_RETURN_URL;
    }

    // Validate required fields
    if (!finalBilling || !finalCustomer || !finalProductId) {
      return NextResponse.json(
        { error: "Missing required fields: billing, customer, or product_id" },
        { status: 400 }
      );
    }

    console.log("[Creating subscription] Env:", environment);
    console.log("[Using bearer token?]", !!bearerToken);

    // Call the DodoPayments SDK
    const response = await client.subscriptions.create({
      billing: finalBilling,
      customer: finalCustomer,
      payment_link: true,
      product_id: finalProductId,
      quantity: finalQuantity,
      return_url: finalReturnUrl,
    });

    return NextResponse.json({
      paymentLink: response.payment_link,
      ...response,
    });
  } catch (err) {
    console.error("Subscription error:", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
