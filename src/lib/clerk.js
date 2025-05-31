import { clerkClient } from "@clerk/nextjs/server";

export async function isUserSubscribed(userId) {
  try {
    const subscriptions = await clerkClient.subscriptions.getUserSubscriptions(
      userId
    );

    // Check if user has an active subscription
    const isPro = subscriptions.some(
      (sub) =>
        sub.status === "active" &&
        (sub.plan === "pro" || sub.plan === "premium") // Add any other pro plan names you use
    );

    console.log("Subscription check:", {
      userId,
      subscriptions,
      isPro,
    });

    return isPro;
  } catch (error) {
    console.error("Error checking subscription:", error);
    return false;
  }
}
