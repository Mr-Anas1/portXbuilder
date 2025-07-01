import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";
import { z } from "zod";

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

// --- Zod schema for validation ---
const portfolioSchema = z.object({
  user_id: z.string(),
  name: z.string().min(1).max(60).optional(),
  age: z.union([z.string(), z.number()]).optional(),
  profession: z.string().max(100).optional(),
  experience: z.string().max(100).optional(),
  bio: z.string().max(1000).optional(),
  email: z.string().email().optional(),
  location: z.string().max(100).optional(),
  phone: z.string().max(15).optional(),
  github: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  x: z.string().url().optional(),
  instagram: z.string().url().optional(),
  facebook: z.string().url().optional(),
  home_title: z.string().max(100).optional(),
  home_subtitle: z.string().max(150).optional(),
  about_me: z.string().max(1000).optional(),
  profileImage: z.string().url().optional(),
  projects: z.any().optional(),
  skills: z.any().optional(),
});

// --- Simple sanitizer for string fields ---
function sanitize(str) {
  if (typeof str !== "string") return str;
  return str.replace(/[<>]/g, "");
}

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

export async function POST(request) {
  const ip = request.headers.get("x-forwarded-for") || "local";
  if (rateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }
  try {
    const body = await request.json();
    const parsed = portfolioSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.errors },
        { status: 400 }
      );
    }
    const data = parsed.data;
    // Sanitize string fields
    for (const key of Object.keys(data)) {
      if (typeof data[key] === "string") {
        data[key] = sanitize(data[key]);
      }
    }
    // Check if portfolio exists for this user
    const { data: existingPortfolio } = await supabaseAdmin
      .from("portfolios")
      .select("id")
      .eq("user_id", data.user_id)
      .single();
    // For new portfolios, require name, profession, and experience
    if (!existingPortfolio) {
      if (!data.name || !data.profession || !data.experience) {
        return NextResponse.json(
          {
            error:
              "name, profession, and experience are required for new portfolios",
          },
          { status: 400 }
        );
      }
    }
    // Prepare filtered data
    const filteredData = {};
    allowedFields.forEach((field) => {
      if (data[field] !== undefined) {
        filteredData[field] = data[field];
      }
    });
    // Upsert
    let result;
    if (existingPortfolio) {
      result = await supabaseAdmin
        .from("portfolios")
        .update(filteredData)
        .eq("user_id", data.user_id)
        .select(publicFields.join(","));
    } else {
      result = await supabaseAdmin
        .from("portfolios")
        .insert(filteredData)
        .select(publicFields.join(","));
    }
    const { data: updated, error } = result;
    if (error) {
      return NextResponse.json(
        { error: "Error updating portfolio" },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true, data: updated?.[0] });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const ip = request.headers.get("x-forwarded-for") || "local";
  if (rateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    // Get user's Supabase ID
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();
    if (userError || !userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // Get portfolio
    const { data: portfolioData, error: portfolioError } = await supabaseAdmin
      .from("portfolios")
      .select(publicFields.join(","))
      .eq("user_id", userData.id)
      .single();
    if (portfolioError || !portfolioData) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ data: portfolioData });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
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
