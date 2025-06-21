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

// Input validation schema
const portfolioSchema = {
  user_id: { required: true },
  name: { required: true, maxLength: 100 },
  age: { required: false },
  profession: { required: true, maxLength: 100 },
  experience: { required: true, maxLength: 50 },
  bio: { required: false, maxLength: 1000 },
  email: { required: false, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  location: { required: false, maxLength: 100 },
  phone: { required: false, maxLength: 20 },
  github: { required: false, maxLength: 200 },
  linkedin: { required: false, maxLength: 200 },
  x: { required: false, maxLength: 200 },
  instagram: { required: false, maxLength: 200 },
  facebook: { required: false, maxLength: 200 },
  home_title: { required: false, maxLength: 100 },
  home_subtitle: { required: false, maxLength: 200 },
  about_me: { required: false, maxLength: 2000 },
  profileImage: { required: false, maxLength: 500 },
  projects: { required: false, type: "object" },
  skills: { required: false, type: "object" },
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
      return createErrorResponse("No portfolio data provided");
    }

    // Input validation
    let validatedData;
    try {
      validatedData = validateInput(body, portfolioSchema);
    } catch (validationError) {
      return createErrorResponse(validationError.message);
    }

    // Convert age to number for database compatibility (user_id should remain as UUID string)
    if (validatedData.age) {
      validatedData.age = parseInt(validatedData.age, 10);
      if (isNaN(validatedData.age)) {
        return createErrorResponse("Invalid age format");
      }
    }

    // Filter out fields that might not exist in the database schema
    const allowedFields = [
      "user_id",
      "name",
      "age",
      "profession",
      "experience",
      "bio",
      "email",
      "location",
      "phone",
      "github",
      "linkedin",
      "x",
      "instagram",
      "facebook",
      "home_title",
      "home_subtitle",
      "about_me",
      "profileImage",
      "projects",
      "skills",
    ];

    const filteredData = {};
    allowedFields.forEach((field) => {
      if (validatedData[field] !== undefined) {
        filteredData[field] = validatedData[field];
      }
    });

    // Try to authenticate, but don't fail if no auth (for initial portfolio creation)
    let authResult;
    try {
      authResult = await authenticateRequest(request);
    } catch (error) {
      // If authentication fails, we'll proceed without it for initial portfolio creation
      authResult = null;
    }

    // If we have authentication, verify the user can only update their own portfolio
    if (authResult && !(authResult instanceof NextResponse)) {
      const { user, userId } = authResult;

      // Get user's Supabase ID
      const { data: userData, error: userError } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("clerk_id", userId)
        .single();

      if (userError || !userData) {
        return createErrorResponse("User not found", 404);
      }

      // Ensure the user_id in the request matches the authenticated user
      if (validatedData.user_id !== userData.id) {
        return createErrorResponse(
          "Unauthorized - You can only update your own portfolio",
          403
        );
      }
    }

    // Use upsert with the validated user_id
    const { data, error } = await supabaseAdmin
      .from("portfolios")
      .upsert(filteredData, {
        onConflict: "user_id",
      });

    if (error) {
      console.error("Error updating portfolio:", error);
      return createErrorResponse("Error updating portfolio", 500);
    }

    return createSuccessResponse({ success: true, data: filteredData });
  } catch (error) {
    console.error("Error in portfolio API:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

export async function GET(request) {
  try {
    // Rate limiting
    const clientIP = request.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(clientIP)) {
      return createErrorResponse("Rate limit exceeded", 429);
    }

    // Authentication
    const authResult = await authenticateRequest(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { user, userId } = authResult;

    // Get user's Supabase ID
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (userError || !userData) {
      return createErrorResponse("User not found", 404);
    }

    // Get portfolio data
    const { data: portfolioData, error: portfolioError } = await supabaseAdmin
      .from("portfolios")
      .select("*")
      .eq("user_id", userData.id)
      .single();

    if (portfolioError) {
      console.error("Error fetching portfolio:", portfolioError);
      return createErrorResponse("Error fetching portfolio", 500);
    }

    return createSuccessResponse({ portfolio: portfolioData });
  } catch (error) {
    console.error("Error in portfolio GET API:", error);
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
