import { NextRequest, NextResponse } from "next/server";
import DodoPayments from "dodopayments";

console.log("DODO_PAYMENTS_API_KEY:", process.env.DODO_PAYMENTS_API_KEY);

const client = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY,
});

export async function POST(request) {
  try {
    const body = await request.json();
    // Accept both the old and new payload shapes for flexibility
    const {
      billing,
      customer,
      product_id,
      quantity = 1,
      return_url,
      formData,
      cartItems,
    } = body;

    // Support both direct and formData-based payloads
    let finalBilling = billing;
    let finalCustomer = customer;
    let finalProductId = product_id;
    let finalQuantity = quantity;
    let finalReturnUrl = return_url || process.env.NEXT_PUBLIC_RETURN_URL;

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

    // Log the payload for debugging
    console.log({
      billing: finalBilling,
      customer: finalCustomer,
      product_id: finalProductId,
      quantity: finalQuantity,
    });

    // Make the direct fetch call to Dodo Payments
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DODO_TEST_API}/subscriptions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DODO_API_KEY}`,
        },
        body: JSON.stringify({
          billing: finalBilling,
          customer: finalCustomer,
          payment_link: true,
          product_id: finalProductId,
          quantity: finalQuantity,
          return_url: finalReturnUrl,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return NextResponse.json(
        { error: "Payment link creation failed", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ paymentLink: data.payment_link, ...data });
  } catch (err) {
    console.error("Payment error:", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
