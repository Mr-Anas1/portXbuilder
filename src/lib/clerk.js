import { clerkClient } from "@clerk/nextjs";

export async function isUserSubscribed(userId) {
  try {
    if (!userId) {
      console.error("No userId provided to isUserSubscribed");
      return false;
    }

    const subscriptions = await clerkClient.subscriptions.getUserSubscriptions(
      userId
    );
    return subscriptions && subscriptions.length > 0;
  } catch (error) {
    console.error("Error checking subscription:", error);
    return false;
  }
}
