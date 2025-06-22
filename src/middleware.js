import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const publicApiRoutes = [
  "/api/verify-payment",
  "/api/webhooks",
  "/api/update-plan",
];

function customMiddleware(request) {
  const { pathname } = request.nextUrl;

  const isPublicApiRoute = publicApiRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isPublicApiRoute) {
    return NextResponse.next();
  }

  return clerkMiddleware()(request); // ✅ Correct usage
}

export default customMiddleware;

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)",
    "/(dashboard|create|pricing|sign-in|sign-up)(.*)",
  ],
};
