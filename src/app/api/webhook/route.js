import { Webhook } from "standardwebhooks";
import { headers } from "next/headers";
import { dodopayments } from "@/lib/dodopayments";
import { supabaseAdmin } from "@/lib/supabase-admin";

const webhook = new Webhook(process.env.DODO_PAYMENTS_WEBHOOK_KEY);

export async function POST(request) {
  const headersList = await headers();

  try {
    const rawBody = await request.text();
    const webhookHeaders = {
      "webhook-id": headersList.get("webhook-id") || "",
      "webhook-signature": headersList.get("webhook-signature") || "",
      "webhook-timestamp": headersList.get("webhook-timestamp") || "",
    };
    await webhook.verify(rawBody, webhookHeaders);
    const payload = JSON.parse(rawBody);

    if (payload.data.payload_type === "Subscription") {
      switch (payload.type) {
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
              .update({ plan: "pro" })
              .eq("clerk_id", clerkId);
            if (error) {
              console.error("Failed to update user plan:", error);
            } else {
              console.log(`User with clerk_id ${clerkId} upgraded to pro.`);
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
        case "subscription.failed":
          break;
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
