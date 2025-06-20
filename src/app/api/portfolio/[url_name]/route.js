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

export async function GET(request, { params }) {
  try {
    const { url_name } = params;

    // First, get the user data to get the user_id
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("id, url_name")
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
      .select("*")
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

    // Finally, get the user's components and theme
    const { data: userComponents, error: componentsError } = await supabaseAdmin
      .from("users")
      .select("components, theme")
      .eq("id", userData.id)
      .maybeSingle();

    if (componentsError) {
      return NextResponse.json(
        { error: "Error fetching user components" },
        { status: 500 }
      );
    }

    if (!userComponents?.components) {
      return NextResponse.json(
        { error: "No components found for user" },
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
    const theme = validThemes.includes(userComponents.theme)
      ? userComponents.theme
      : "default";

    return NextResponse.json({
      components: userComponents.components,
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
