import { Webhook } from "standardwebhooks";
import { headers } from "next/headers";
import { dodopayments } from "@/lib/dodopayments";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendSubscriptionEmail } from "@/lib/sendSubscriptionEmail";

const webhook = new Webhook(process.env.DODO_PAYMENTS_WEBHOOK_KEY);

// Test endpoint to verify webhook is accessible
export async function GET() {
  return Response.json({
    message: "Webhook endpoint is accessible",
    timestamp: new Date().toISOString(),
  });
}

// Helper to get user email by clerkId
async function getUserEmail(clerkId) {
  const { data } = await supabaseAdmin
    .from("users")
    .select("email, name")
    .eq("clerk_id", clerkId)
    .single();
  return data;
}

export async function POST(request) {
  const headersList = await headers();

  try {
    const rawBody = await request.text();
    console.log("=== WEBHOOK RECEIVED ===");
    console.log("Headers:", {
      "webhook-id": headersList.get("webhook-id"),
      "webhook-signature": headersList.get("webhook-signature"),
      "webhook-timestamp": headersList.get("webhook-timestamp"),
    });
    console.log("Raw body:", rawBody);

    const webhookHeaders = {
      "webhook-id": headersList.get("webhook-id") || "",
      "webhook-signature": headersList.get("webhook-signature") || "",
      "webhook-timestamp": headersList.get("webhook-timestamp") || "",
    };

    try {
      await webhook.verify(rawBody, webhookHeaders);
      console.log("Webhook verification successful");
    } catch (verificationError) {
      console.error("Webhook verification failed:", verificationError);
      // Still process the webhook for debugging
    }

    const payload = JSON.parse(rawBody);
    console.log("Parsed payload:", JSON.stringify(payload, null, 2));

    if (payload.data.payload_type === "Subscription") {
      switch (payload.type) {
        case "subscription.created": {
          // Subscription created but payment not yet completed
          const clerkId = payload.data.metadata?.clerk_id;
          if (clerkId) {
            const { error } = await supabaseAdmin
              .from("users")
              .update({
                subscription_status: "PENDING",
                subscription_id: payload.data.subscription_id,
              })
              .eq("clerk_id", clerkId);
            if (error) {
              console.error("Failed to update subscription status:", error);
            } else {
              console.log(
                `Subscription created for user ${clerkId}, waiting for payment.`
              );
            }
          }
          break;
        }
        case "subscription.active": {
          const subscription = await dodopayments.subscriptions.retrieve(
            payload.data.subscription_id
          );
          console.log("-------SUBSCRIPTION DATA START ---------");
          console.log(subscription);
          console.log("-------SUBSCRIPTION DATA END ---------");
          // Update user plan to 'pro' using clerk_id from metadata
          const clerkId = payload.data.metadata?.clerk_id;
          if (clerkId) {
            const { error } = await supabaseAdmin
              .from("users")
              .update({
                plan: "pro",
                subscription_status: "ACTIVE",
                subscription_start_date: new Date().toISOString(),
                subscription_end_date: subscription.next_billing_date
                  ? new Date(subscription.next_billing_date).toISOString()
                  : null,
              })
              .eq("clerk_id", clerkId);
            if (error) {
              console.error("Failed to update user plan:", error);
            } else {
              console.log(`User with clerk_id ${clerkId} upgraded to pro.`);
            }
            // Send Pro activated email
            const user = await getUserEmail(clerkId);
            if (user?.email) {
              await sendSubscriptionEmail({
                to: user.email,
                subject: "Your Pro Subscription is Active!",
                html: `<h1>Hi ${user.name || "there"},</h1><p>Your Pro subscription is now active. Enjoy all the features of PortXBuilder!</p>`,
              });
            }
          } else {
            console.error("No clerk_id found in subscription metadata");
          }
          break;
        }
        case "subscription.cancelled": {
          // Mark as cancelled, but keep pro access until end of billing period
          const clerkId = payload.data.metadata?.clerk_id;
          const endDate =
            payload.data.subscription_end_date ||
            payload.data.current_period_end;
          if (clerkId) {
            const { error } = await supabaseAdmin
              .from("users")
              .update({
                subscription_status: "CANCELLED",
                subscription_cancelled_at: new Date().toISOString(),
                subscription_end_date: endDate
                  ? new Date(endDate).toISOString()
                  : null,
              })
              .eq("clerk_id", clerkId);
            if (error) {
              console.error("Failed to mark user as cancelled:", error);
            } else {
              console.log(`User with clerk_id ${clerkId} marked as cancelled.`);
            }
            // Send cancelled email
            const user = await getUserEmail(clerkId);
            if (user?.email) {
              await sendSubscriptionEmail({
                to: user.email,
                subject: "Your Subscription Has Been Cancelled",
                html: `<h1>Hi ${user.name || "there"},</h1><p>Your PortXBuilder Pro subscription has been cancelled. You will retain Pro access until the end of your billing period.</p>`,
              });
            }
          } else {
            console.error("No clerk_id found in subscription metadata");
          }
          break;
        }
        case "subscription.expired": // or the actual event name for end of billing period
        case "subscription.ended": // add all possible end-of-period events
          // Now actually downgrade to free
          const clerkId = payload.data.metadata?.clerk_id;
          if (clerkId) {
            const { error } = await supabaseAdmin
              .from("users")
              .update({ plan: "free" })
              .eq("clerk_id", clerkId);
            if (error) {
              console.error("Failed to downgrade user plan:", error);
            } else {
              console.log(`User with clerk_id ${clerkId} downgraded to free.`);
            }
          } else {
            console.error("No clerk_id found in subscription metadata");
          }
          break;
        case "subscription.failed": {
          // Payment failed, revert user back to free plan
          const clerkId = payload.data.metadata?.clerk_id;
          if (clerkId) {
            const { error } = await supabaseAdmin
              .from("users")
              .update({
                plan: "free",
                subscription_status: "FAILED",
                subscription_cancelled_at: new Date().toISOString(),
              })
              .eq("clerk_id", clerkId);
            if (error) {
              console.error(
                "Failed to update user plan on payment failure:",
                error
              );
            } else {
              console.log(
                `User with clerk_id ${clerkId} reverted to free due to payment failure.`
              );
            }
            // Send payment failed email
            const user = await getUserEmail(clerkId);
            if (user?.email) {
              await sendSubscriptionEmail({
                to: user.email,
                subject: "Payment Failed for Your Subscription",
                html: `<h1>Hi ${user.name || "there"},</h1><p>We were unable to process your payment for PortXBuilder Pro. Please update your payment information to continue enjoying Pro features.</p>`,
              });
            }
          }
          break;
        }
        case "subscription.renewed":
          break;
        case "subscription.on_hold":
          break;
        default:
          break;
      }
    } else if (payload.data.payload_type === "Payment") {
      switch (payload.type) {
        case "payment.succeeded":
          const paymentDataResp = await dodopayments.payments.retrieve(
            payload.data.payment_id
          );
          console.log("-------PAYMENT DATA START ---------");
          console.log(paymentDataResp);
          console.log("-------PAYMENT DATA END ---------");
          break;
        default:
          break;
      }
    }
    return Response.json(
      { message: "Webhook processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(" ----- webhoook verification failed -----");
    console.log(error);
    return Response.json(
      { message: "Webhook processed successfully" },
      { status: 200 }
    );
  }
}
