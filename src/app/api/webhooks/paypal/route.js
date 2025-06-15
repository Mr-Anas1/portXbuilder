import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs";

export async function POST(req) {
  try {
    // Log the raw request
    console.log("Received webhook request");

    const event = await req.json();
    console.log("Webhook event:", {
      type: event.event_type,
      subscriptionId: event.resource?.id,
      status: event.resource?.status,
      userId: event.resource?.custom_id,
    });

    // Verify this is a subscription event
    if (event.event_type !== "BILLING.SUBSCRIPTION.CREATED") {
      console.log("Ignoring non-subscription event");
      return NextResponse.json({ received: true });
    }

    const subscription = event.resource;
    const userId = subscription.custom_id;

    if (!userId) {
      console.error("No user ID found in subscription");
      return NextResponse.json({ error: "No user ID found" }, { status: 400 });
    }

    try {
      // Verify the user exists
      const user = await clerkClient.users.getUser(userId);
      console.log("Found user:", user.id);
    } catch (error) {
      console.error("Error finding user:", error);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Handle the subscription creation
    if (subscription.status === "APPROVAL_PENDING") {
      console.log("Processing pending subscription:", subscription.id);
      try {
        // Store the pending subscription in the user's metadata
        await clerkClient.users.updateUser(userId, {
          publicMetadata: {
            subscriptionId: subscription.id,
            subscriptionStatus: "pending",
          },
        });
        console.log("Updated user metadata for pending subscription");
      } catch (error) {
        console.error("Error updating user metadata:", error);
        return NextResponse.json(
          { error: "Failed to update user" },
          { status: 500 }
        );
      }
      return NextResponse.json({ received: true });
    }

    if (subscription.status === "ACTIVE") {
      console.log("Processing active subscription:", subscription.id);
      try {
        // Update the user's plan
        await clerkClient.users.updateUser(userId, {
          publicMetadata: {
            plan: "pro",
            subscriptionId: subscription.id,
            subscriptionStatus: "active",
          },
        });
        console.log("Updated user plan to pro");
      } catch (error) {
        console.error("Error updating user plan:", error);
        return NextResponse.json(
          { error: "Failed to update plan" },
          { status: 500 }
        );
      }
    }

    console.log("Successfully processed webhook");
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
