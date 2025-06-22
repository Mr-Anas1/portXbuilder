import { clerkMiddleware } from "@clerk/nextjs/server";
import { withAuth } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", // Don't run middleware on static files
    "/", // Run middleware on index page
    "/(api|trpc)(?!.*create-subscription).*", // Run middleware on API routes except create-subscription
  ],
};
