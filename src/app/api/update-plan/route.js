import { createClient } from "@supabase/supabase-js";
import { requireAuth } from "@/lib/requireAuth";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const userId = requireAuth(req);
    const { plan } = await req.json();

    if (!plan) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Get user's Supabase ID and email using userId from Clerk
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, email")
      .eq("clerk_id", userId)
      .single();

    if (userError) {
      console.error("Error fetching user data:", userError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch user data" }),
        { status: 500 }
      );
    }

    if (!userData) {
      return new Response(
        JSON.stringify({ error: "User not found in database" }),
        { status: 404 }
      );
    }

    // Update user's plan in Supabase
    const { error: updateError } = await supabase
      .from("users")
      .update({ plan })
      .eq("id", userData.id);

    if (updateError) {
      console.error("Error updating user plan:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update user plan" }),
        { status: 500 }
      );
    }

    // Send transactional email
    if (userData.email) {
      try {
        if (plan === "pro") {
          await resend.emails.send({
            from: "support@portxbuilder.com",
            to: userData.email,
            subject: "Welcome to Pro! 🎉",
            html: `
    <div style="font-family: Arial, sans-serif; background: #f4f6fb; padding: 40px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
        <tr>
          <td style="padding: 32px 32px 0 32px; text-align: center;">
            <img src="https://www.portxbuilder.com/logo.png" alt="PortXBuilder Logo" style="height: 48px; margin-bottom: 16px;" />
            <h1 style="color: #4f46e5; margin-bottom: 8px;">Welcome to <span style="color: #06b6d4;">Pro</span>!</h1>
            <p style="font-size: 18px; color: #333; margin-bottom: 0;">Hi${userData.name ? ` ${userData.name}` : ""},</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 24px 32px 0 32px;">
            <p style="font-size: 16px; color: #444; line-height: 1.6;">
              Thank you for upgrading to <strong>Pro</strong> on PortXBuilder.<br>
              You now have access to all premium features and priority support.
            </p>
            <div style="margin: 32px 0; text-align: center;">
              <a href="https://www.portxbuilder.com/dashboard" style="background: linear-gradient(90deg, #4f46e5, #06b6d4); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: bold; display: inline-block;">
                Go to your Dashboard
              </a>
            </div>
            <p style="font-size: 15px; color: #666; margin-bottom: 0;">
              If you have any questions, just reply to this email or contact us at
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
        } else {
          await resend.emails.send({
            from: "support@portxbuilder.com",
            to: userData.email,
            subject: "Your Plan Has Changed",
            html: `<h2>Your Plan Has Changed</h2><p>Your subscription plan has been updated to: <strong>${plan}</strong>.</p>`,
          });
        }
      } catch (emailError) {
        console.error("Error sending transactional email:", emailError);
      }
    }

    return new Response(
      JSON.stringify({ message: "Plan updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating plan:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
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
