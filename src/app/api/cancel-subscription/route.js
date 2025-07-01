import { NextResponse } from "next/server";
import razorpay from "@/lib/razorpay";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireAuth } from "@/lib/requireAuth";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const userId = requireAuth(request);
    // Get request body
    const body = await request.json();
    if (!body) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    // Get user's subscription details from Supabase using userId from Clerk
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("clerk_id", userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!userData.subscription_id) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 400 }
      );
    }

    // Cancel the subscription in Razorpay
    try {
      const subscription = await razorpay.subscriptions.cancel(
        userData.subscription_id,
        {
          cancel_at_cycle_end: 1, // This will cancel at the end of the current billing cycle
        }
      );
    } catch (razorpayError) {
      console.error(
        "Error cancelling subscription in Razorpay:",
        razorpayError
      );
      // Continue with local cancellation even if Razorpay fails
    }

    // Update user's subscription status in Supabase
    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({
        subscription_status: "cancelled",
        subscription_cancelled_at: new Date().toISOString(),
        // Don't change the plan to free yet - it will be changed when the subscription actually ends
      })
      .eq("clerk_id", userId);

    if (updateError) {
      console.error("Error updating user subscription status:", updateError);
      return NextResponse.json(
        { error: "Failed to update subscription status" },
        { status: 500 }
      );
    }

    // Send cancellation email
    if (userData.email) {
      try {
        await resend.emails.send({
          from: "support@portxbuilder.com",
          to: userData.email,
          subject: "Your Pro Subscription Was Cancelled",
          html: `
    <div style="font-family: Arial, sans-serif; background: #f4f6fb; padding: 40px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
        <tr>
          <td style="padding: 32px 32px 0 32px; text-align: center;">
            <img src="https://www.portxbuilder.com/logo.png" alt="PortXBuilder Logo" style="height: 48px; margin-bottom: 16px;" />
            <h1 style="color: #e53e3e; margin-bottom: 8px;">Subscription Cancelled</h1>
            <p style="font-size: 18px; color: #333; margin-bottom: 0;">Hi${userData.name ? ` ${userData.name}` : ""},</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 24px 32px 0 32px;">
            <p style="font-size: 16px; color: #444; line-height: 1.6;">
              Your <strong>Pro</strong> subscription has been cancelled.<br>
              You will retain access to all Pro features until the end of your current billing period.
            </p>
            <div style="margin: 32px 0; text-align: center;">
              <a href="https://www.portxbuilder.com/pricing" style="background: linear-gradient(90deg, #e53e3e, #fbbf24); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: bold; display: inline-block;">
                Renew Pro Anytime
              </a>
            </div>
            <p style="font-size: 15px; color: #666; margin-bottom: 0;">
              If you have any questions or changed your mind, just reply to this email or contact us at
              <a href="mailto:support@portxbuilder.com" style="color: #4f46e5;">support@portxbuilder.com</a>.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding: 32px; text-align: center; color: #aaa; font-size: 13px;">
            &copy; ${new Date().getFullYear()} PortXBuilder. All rights reserved.
          </td>
        </tr>
      </table>
    </div>
  `,
        });
      } catch (emailError) {
        console.error("Error sending cancellation email:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message:
        "Subscription will be cancelled at the end of the current billing period. You'll continue to have access to Pro features until then.",
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
