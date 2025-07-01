import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

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

// --- Simple in-memory rate limiter ---
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 requests per minute per IP

function rateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, last: now };
  if (now - entry.last > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, last: now });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }
  rateLimitMap.set(ip, { count: entry.count + 1, last: entry.last });
  return false;
}

const publicFields = [
  "user_id",
  "name",
  "profession",
  "experience",
  "bio",
  "location",
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

export async function GET(request, { params }) {
  const ip = request.headers.get("x-forwarded-for") || "local";
  if (rateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }
  try {
    const { url_name } = params;
    // First, get the user data to get the user_id
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("id, url_name, components, theme")
      .eq("url_name", url_name)
      .maybeSingle();
    if (userError) {
      return NextResponse.json(
        { error: "Error fetching user data" },
        { status: 500 }
      );
    }
    if (!userData) {
      return NextResponse.json(
        { error: "No user found with URL name" },
        { status: 404 }
      );
    }
    // Then, get the portfolio data using the user_id
    const { data: portfolioData, error: portfolioError } = await supabaseAdmin
      .from("portfolios")
      .select(publicFields.join(","))
      .eq("user_id", userData.id)
      .maybeSingle();
    if (portfolioError) {
      return NextResponse.json(
        { error: "Error fetching portfolio data" },
        { status: 500 }
      );
    }
    if (!portfolioData) {
      return NextResponse.json(
        { error: "No portfolio found for user" },
        { status: 404 }
      );
    }
    // Validate theme
    const validThemes = [
      "default",
      "dark",
      "ocean",
      "forest",
      "sunset",
      "neon",
    ];
    const theme = validThemes.includes(userData.theme)
      ? userData.theme
      : "default";
    return NextResponse.json({
      components: userData.components,
      theme: theme,
      portfolio: portfolioData,
    });
  } catch (error) {
    console.error("Unexpected error in portfolio API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
