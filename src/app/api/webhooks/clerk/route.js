import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/clerk-sdk-node";

export async function POST(req) {
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  let evt;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;
  console.log("Webhook event type:", eventType);

  // Only handle user updates
  if (eventType === "user.updated") {
    // Get the full user data from Clerk
    const userId = evt.data.user?.id || evt.data.userId;
    if (!userId) {
      console.error("No user ID found in webhook data");
      return new Response("No user ID found", { status: 400 });
    }

    try {
      // Get the full user data from Clerk
      const user = await clerkClient.users.getUser(userId);

      // Call the sync-user endpoint with the full user data
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/sync-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );

      if (!response.ok) {
        console.error("Error syncing user:", await response.text());
        return new Response("Error syncing user", { status: 500 });
      }

      console.log("User synced successfully");
    } catch (error) {
      console.error("Error calling sync-user:", error);
      return new Response("Error calling sync-user", { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
