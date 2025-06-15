import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs";

export async function POST(req) {
  try {
    const event = await req.json();

    // Verify this is a subscription event
    if (event.event_type !== "BILLING.SUBSCRIPTION.CREATED") {
      return NextResponse.json({ received: true });
    }

    const subscription = event.resource;

    // Handle the subscription creation
    if (subscription.status === "APPROVAL_PENDING") {
      // The subscription is waiting for user approval
      console.log("Subscription pending approval:", subscription.id);
      return NextResponse.json({ received: true });
    }

    if (subscription.status === "ACTIVE") {
      // The subscription is active, update the user's plan
      try {
        // You'll need to implement a way to associate the subscription with a user
        // This could be through a database lookup or by storing the user ID when creating the subscription
        const userId = ""; // TODO: Get the user ID associated with this subscription

        if (userId) {
          await clerkClient.users.updateUser(userId, {
            publicMetadata: {
              plan: "pro",
              subscriptionId: subscription.id,
              subscriptionStatus: "active",
            },
          });
        }
      } catch (error) {
        console.error("Error updating user plan:", error);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
