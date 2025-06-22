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

export async function POST(request) {
  try {
    // Get request body
    const body = await request.json();
    if (!body) {
      return NextResponse.json(
        { error: "No portfolio data provided" },
        { status: 400 }
      );
    }

    const {
      user_id,
      name,
      age,
      profession,
      experience,
      bio,
      email,
      location,
      phone,
      github,
      linkedin,
      x,
      instagram,
      facebook,
      home_title,
      home_subtitle,
      about_me,
      profileImage,
      projects,
      skills,
    } = body;

    if (!user_id || !name || !profession || !experience) {
      return NextResponse.json(
        { error: "user_id, name, profession, and experience are required" },
        { status: 400 }
      );
    }

    // Convert age to number for database compatibility
    let ageNumber = null;
    if (age) {
      ageNumber = parseInt(age, 10);
      if (isNaN(ageNumber)) {
        return NextResponse.json(
          { error: "Invalid age format" },
          { status: 400 }
        );
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
      if (body[field] !== undefined) {
        filteredData[field] = field === "age" ? ageNumber : body[field];
      }
    });

    // Use upsert with the validated user_id
    const { data, error } = await supabaseAdmin
      .from("portfolios")
      .upsert(filteredData, {
        onConflict: "user_id",
      });

    if (error) {
      console.error("Error updating portfolio:", error);
      return NextResponse.json(
        { error: "Error updating portfolio" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: filteredData });
  } catch (error) {
    console.error("Error in portfolio API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
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

    // Get portfolio data
    const { data: portfolioData, error: portfolioError } = await supabaseAdmin
      .from("portfolios")
      .select("*")
      .eq("user_id", userData.id)
      .single();

    if (portfolioError) {
      console.error("Error fetching portfolio:", portfolioError);
      return NextResponse.json(
        { error: "Error fetching portfolio" },
        { status: 500 }
      );
    }

    return NextResponse.json({ portfolio: portfolioData });
  } catch (error) {
    console.error("Error in portfolio GET API:", error);
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
