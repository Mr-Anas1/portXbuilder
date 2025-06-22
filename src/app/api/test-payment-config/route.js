import { NextResponse } from "next/server";

export async function GET() {
  try {
    const config = {
      razorpay_key_id: process.env.RAZORPAY_KEY_ID ? "✅ Set" : "❌ Missing",
      razorpay_key_secret: process.env.RAZORPAY_KEY_SECRET
        ? "✅ Set"
        : "❌ Missing",
      razorpay_webhook_secret: process.env.RAZORPAY_WEBHOOK_SECRET
        ? "✅ Set"
        : "❌ Missing",
      next_public_razorpay_key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
        ? "✅ Set"
        : "❌ Missing",
      monthly_plan_id: process.env.RAZORPAY_MONTHLY_PLAN_ID
        ? "✅ Set"
        : "❌ Missing",
      yearly_plan_id: process.env.RAZORPAY_YEARLY_PLAN_ID
        ? "✅ Set"
        : "❌ Missing",
      supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL
        ? "✅ Set"
        : "❌ Missing",
      supabase_service_role_key: process.env.SUPABASE_SERVICE_ROLE_KEY
        ? "✅ Set"
        : "❌ Missing",
    };

    const allConfigured = Object.values(config).every(
      (status) => status === "✅ Set"
    );

    return NextResponse.json({
      status: allConfigured
        ? "✅ All configurations are set"
        : "❌ Some configurations are missing",
      config,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to check configuration",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
