import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import {
  authenticateRequest,
  validateInput,
  checkRateLimit,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/auth-middleware";

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Input validation schema
const updatePlanSchema = {
  userId: { required: true, maxLength: 100 },
  plan: { required: true, pattern: /^(free|pro)$/ },
};

export async function POST(req) {
  try {
    // Rate limiting
    const clientIP = req.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(clientIP)) {
      return createErrorResponse("Rate limit exceeded", 429);
    }

    // Authentication
    const authResult = await authenticateRequest(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { user, userId } = authResult;

    // Get request body
    const body = await req.json();
    if (!body) {
      return createErrorResponse("No data provided");
    }

    // Input validation
    let validatedData;
    try {
      validatedData = validateInput(body, updatePlanSchema);
    } catch (validationError) {
      return createErrorResponse(validationError.message);
    }

    // Authorization: Ensure user can only update their own plan
    if (validatedData.userId !== userId) {
      return createErrorResponse(
        "Unauthorized - You can only update your own plan",
        403
      );
    }

    // Get user's Supabase ID
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", validatedData.userId)
      .single();

    if (userError) {
      console.error("Error fetching user data:", userError);
      return createErrorResponse("Failed to fetch user data", 500);
    }

    if (!userData) {
      return createErrorResponse("User not found in database", 404);
    }

    // Update user's plan in Supabase
    const { error: updateError } = await supabase
      .from("users")
      .update({ plan: validatedData.plan })
      .eq("id", userData.id);

    if (updateError) {
      console.error("Error updating user plan:", updateError);
      return createErrorResponse("Failed to update user plan", 500);
    }

    return createSuccessResponse({ message: "Plan updated successfully" });
  } catch (error) {
    console.error("Error updating plan:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_APP_URL || "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}
