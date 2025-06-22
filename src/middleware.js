import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// List of API routes that don't need authentication
const publicApiRoutes = [
  "/api/verify-payment",
  "/api/webhooks",
  "/api/update-plan",
];

function customMiddleware(request) {
  const { pathname } = request.nextUrl;

  // Check if this is a public API route
  const isPublicApiRoute = publicApiRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If it's a public API route, skip authentication
  if (isPublicApiRoute) {
    return NextResponse.next();
  }

  // Otherwise, apply Clerk authentication
  return clerkMiddleware()(request);
}

export default customMiddleware;

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", // Don't run middleware on static files
    "/", // Run middleware on index page
    "/(api|trpc)(.*)", // Run middleware on API routes
    "/(dashboard|create|pricing|sign-in|sign-up)(.*)", // Run middleware on protected pages
  ],
};
