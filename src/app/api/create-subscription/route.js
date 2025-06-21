import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  authenticateRequest,
  validateInput,
  checkRateLimit,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/auth-middleware";

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

// Input validation schema
const subscriptionSchema = {
  name: { required: true, maxLength: 100 },
  email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  contact: { required: false, maxLength: 20 },
  billingPeriod: { required: true, pattern: /^(monthly|yearly)$/ },
};

export async function POST(request) {
  try {
    // Rate limiting
    const clientIP = request.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(clientIP)) {
      return createErrorResponse("Rate limit exceeded", 429);
    }

    // Authentication
    const authResult = await authenticateRequest(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { user, userId } = authResult;

    // Get request body
    const body = await request.json();
    if (!body) {
      return createErrorResponse("No data provided");
    }

    // Input validation
    let validatedData;
    try {
      validatedData = validateInput(body, subscriptionSchema);
    } catch (validationError) {
      return createErrorResponse(validationError.message);
    }

    // Authorization: Ensure user can only create subscription for their own email
    const userEmail = user.emailAddresses?.[0]?.emailAddress;
    if (validatedData.email !== userEmail) {
      return createErrorResponse(
        "Unauthorized - You can only create subscriptions for your own email",
        403
      );
    }

    // Check environment variables
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("Missing Razorpay credentials");
      return createErrorResponse("Payment service configuration error", 500);
    }

    // Dynamically import Razorpay to ensure it's only loaded server-side
    const Razorpay = (await import("razorpay")).default;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Get user from Supabase
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", validatedData.email)
      .single();

    if (userError) {
      console.error("Error finding user:", userError);
      return createErrorResponse("User not found", 404);
    }

    // Create or get Razorpay customer
    let customer;
    if (userData.razorpay_customer_id) {
      try {
        customer = await razorpay.customers.fetch(
          userData.razorpay_customer_id
        );
      } catch (error) {
        console.error("Error fetching existing customer:", error);
        // If customer fetch fails, create a new one
        customer = await razorpay.customers.create({
          name: validatedData.name,
          email: validatedData.email,
          contact: validatedData.contact,
        });
      }
    } else {
      customer = await razorpay.customers.create({
        name: validatedData.name,
        email: validatedData.email,
        contact: validatedData.contact,
      });

      // Store Razorpay customer ID in user's record
      const { error: updateError } = await supabaseAdmin
        .from("users")
        .update({ razorpay_customer_id: customer.id })
        .eq("id", userData.id);

      if (updateError) {
        console.error("Error updating user with customer ID:", updateError);
      }
    }

    // Get plan ID based on billing period
    const planId =
      validatedData.billingPeriod === "yearly"
        ? process.env.RAZORPAY_YEARLY_PLAN_ID
        : process.env.RAZORPAY_MONTHLY_PLAN_ID;

    if (!planId) {
      console.error("Missing Razorpay plan ID");
      return createErrorResponse("Payment plan configuration error", 500);
    }

    // Create subscription
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 12, // how many billing cycles
      customer_id: customer.id,
    });

    return createSuccessResponse({ subscriptionId: subscription.id });
  } catch (error) {
    console.error("Subscription error:", error);
    return createErrorResponse(
      error.message || "Failed to create subscription",
      500
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
