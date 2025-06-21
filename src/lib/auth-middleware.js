import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Middleware to authenticate API requests using Clerk
 * @param {Request} request - The incoming request
 * @returns {Promise<{user: Object, userId: string} | NextResponse>} - User data or error response
 */
export async function authenticateRequest(request) {
  try {
    const { userId, user } = await auth();

    if (!userId || !user) {
      return NextResponse.json(
        { error: "Unauthorized - Authentication required" },
        { status: 401 }
      );
    }

    return { user, userId };
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  }
}

/**
 * Middleware to validate and sanitize input data
 * @param {Object} data - The data to validate
 * @param {Object} schema - Validation schema
 * @returns {Object} - Sanitized data or throws error
 */
export function validateInput(data, schema) {
  const errors = [];
  const sanitized = {};

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];

    // Required field check
    if (rules.required) {
      if (value === undefined || value === null || value === "") {
        errors.push(`${field} is required`);
        continue;
      }
      // For strings, also check if they're empty after trimming
      if (typeof value === "string" && value.trim() === "") {
        errors.push(`${field} is required`);
        continue;
      }
    }

    // Type check
    if (value && rules.type && typeof value !== rules.type) {
      errors.push(`${field} must be a ${rules.type}`);
      continue;
    }

    // Length check (only for strings)
    if (
      value &&
      typeof value === "string" &&
      rules.maxLength &&
      value.length > rules.maxLength
    ) {
      errors.push(`${field} must be less than ${rules.maxLength} characters`);
      continue;
    }

    // Pattern check (only for strings)
    if (
      value &&
      typeof value === "string" &&
      rules.pattern &&
      !rules.pattern.test(value)
    ) {
      errors.push(`${field} format is invalid`);
      continue;
    }

    // Sanitize string inputs
    if (value && typeof value === "string") {
      sanitized[field] = value.trim().replace(/[<>]/g, "");
    } else {
      sanitized[field] = value;
    }
  }

  if (errors.length > 0) {
    throw new Error(`Validation failed: ${errors.join(", ")}`);
  }

  return sanitized;
}

/**
 * Rate limiting middleware (simple in-memory implementation)
 * For production, use Redis or a proper rate limiting service
 */
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per minute

export function checkRateLimit(identifier) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;

  if (!rateLimitMap.has(identifier)) {
    rateLimitMap.set(identifier, []);
  }

  const requests = rateLimitMap.get(identifier);

  // Remove old requests outside the window
  const validRequests = requests.filter((timestamp) => timestamp > windowStart);
  rateLimitMap.set(identifier, validRequests);

  if (validRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  validRequests.push(now);
  return true;
}

/**
 * CORS headers for API responses
 */
export const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_APP_URL || "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

/**
 * Standard error response helper
 */
export function createErrorResponse(message, status = 400, details = null) {
  const response = {
    error: message,
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === "development" && details) {
    response.details = details;
  }

  return NextResponse.json(response, {
    status,
    headers: corsHeaders,
  });
}

/**
 * Standard success response helper
 */
export function createSuccessResponse(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: corsHeaders,
  });
}
