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
      return NextResponse.json(
        { error: "No portfolio data provided" },
        { status: 400 }
      );
    }

    // Create or update portfolio using service role
    const { data, error } = await supabaseAdmin
      .from("portfolios")
      .upsert(portfolioData, {
        onConflict: "user_id",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating/updating portfolio:", error);
      return NextResponse.json(
        { error: "Error creating/updating portfolio" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in portfolio API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
