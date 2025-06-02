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
    const portfolioData = await request.json();

    if (!portfolioData) {
      console.error("No portfolio data provided");
      return NextResponse.json(
        { error: "No portfolio data provided" },
        { status: 400 }
      );
    }

    if (!portfolioData.user_id) {
      console.error("No user_id provided in data:", portfolioData);
      return NextResponse.json(
        { error: "No user_id provided" },
        { status: 400 }
      );
    }

    // First get the Supabase user ID from the clerk_id
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("clerk_id", portfolioData.user_id)
      .single();

    if (userError) {
      console.error("Error fetching user:", userError);
      return NextResponse.json(
        { error: "Error fetching user data" },
        { status: 500 }
      );
    }

    if (!userData) {
      console.error("No user found with clerk_id:", portfolioData.user_id);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Replace clerk_id with Supabase user ID
    const updatedPortfolioData = {
      ...portfolioData,
      user_id: userData.id,
    };

    // Use upsert with the correct user_id
    const { data, error } = await supabaseAdmin
      .from("portfolios")
      .upsert(updatedPortfolioData, {
        onConflict: "user_id",
      });

    if (error) {
      console.error("Error updating portfolio:", error);
      return NextResponse.json(
        { error: "Error updating portfolio" },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedPortfolioData);
  } catch (error) {
    console.error("Error in portfolio API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
