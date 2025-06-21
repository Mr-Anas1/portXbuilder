import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import {
  authenticateRequest,
  validateInput,
  checkRateLimit,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/auth-middleware";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Input validation schema for user data
const userSchema = {
  id: { required: true, maxLength: 100 },
  emailAddresses: { required: true, type: "object" },
  firstName: { required: false, maxLength: 50 },
  lastName: { required: false, maxLength: 50 },
  username: { required: false, maxLength: 50 },
};

export async function POST(request) {
  try {
    // Rate limiting
    const clientIP = request.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(clientIP)) {
      return createErrorResponse("Rate limit exceeded", 429);
    }

    // Get request body
    const body = await request.json();
    if (!body) {
      return createErrorResponse("No user data provided");
    }

    // Input validation
    let validatedData;
    try {
      validatedData = validateInput(body, userSchema);
    } catch (validationError) {
      return createErrorResponse(validationError.message);
    }

    // Try to authenticate, but don't fail if no auth (for initial user creation)
    let authResult;
    try {
      authResult = await authenticateRequest(request);
    } catch (error) {
      // If authentication fails, we'll proceed without it for initial user creation
      authResult = null;
    }

    // If we have authentication, verify the user can only sync their own data
    if (authResult && !(authResult instanceof NextResponse)) {
      const { userId } = authResult;
      if (validatedData.id !== userId) {
        return createErrorResponse(
          "Unauthorized - You can only sync your own data",
          403
        );
      }
    }

    // Check if user exists in Supabase
    const { data: existingUser, error: userError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("clerk_id", validatedData.id)
      .single();

    if (userError && userError.code !== "PGRST116") {
      console.error("Error checking user:", userError);
      return createErrorResponse("Error checking user", 500);
    }

    // If user doesn't exist, create them
    if (!existingUser) {
      const email = validatedData.emailAddresses?.[0]?.emailAddress;
      const name = `${validatedData.firstName || ""} ${
        validatedData.lastName || ""
      }`.trim();

      const { data: newUser, error: createError } = await supabaseAdmin
        .from("users")
        .insert({
          clerk_id: validatedData.id,
          email: email,
          name: name || "User",
          url_name: validatedData.username,
          components: {},
          theme: "default",
          plan: "free",
        })
        .select()
        .single();

      if (createError) {
        console.error("Error creating user:", createError);
        return createErrorResponse("Error creating user", 500);
      }

      return createSuccessResponse(newUser);
    }

    // If user exists, update their data
    const email = validatedData.emailAddresses?.[0]?.emailAddress;
    const name = `${validatedData.firstName || ""} ${
      validatedData.lastName || ""
    }`.trim();

    const updateData = {
      email: email,
      name: name || existingUser.name,
    };

    // Only update url_name if it's not already set
    if (!existingUser.url_name && validatedData.username) {
      updateData.url_name = validatedData.username;
    }

    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from("users")
      .update(updateData)
      .eq("clerk_id", validatedData.id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating user:", updateError);
      return createErrorResponse("Error updating user", 500);
    }

    return createSuccessResponse(updatedUser);
  } catch (error) {
    console.error("Error in sync-user API:", error);
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
