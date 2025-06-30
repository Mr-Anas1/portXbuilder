import { getAuth } from "@clerk/nextjs/server";

export function requireAuth(request) {
  const { userId } = getAuth(request);
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
}
