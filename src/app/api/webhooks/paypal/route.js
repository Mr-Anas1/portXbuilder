import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs";

export async function POST(req) {
  try {
    const event = await req.json();
    console.log("Received PayPal webhook:", event.event_type);

    // Verify this is a subscription event
    if (event.event_type !== "BILLING.SUBSCRIPTION.CREATED") {
      return NextResponse.json({ received: true });
    }

    const subscription = event.resource;
    const userId = subscription.custom_id;

    if (!userId) {
      console.error("No user ID found in subscription");
      return NextResponse.json({ error: "No user ID found" }, { status: 400 });
    }

    // Handle the subscription creation
    if (subscription.status === "APPROVAL_PENDING") {
      console.log("Subscription pending approval:", subscription.id);
      // Store the pending subscription in the user's metadata
      await clerkClient.users.updateUser(userId, {
        publicMetadata: {
          subscriptionId: subscription.id,
          subscriptionStatus: "pending",
        },
      });
      return NextResponse.json({ received: true });
    }

    if (subscription.status === "ACTIVE") {
      console.log("Subscription active:", subscription.id);
      // Update the user's plan
      await clerkClient.users.updateUser(userId, {
        publicMetadata: {
          plan: "pro",
          subscriptionId: subscription.id,
          subscriptionStatus: "active",
        },
      });
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
