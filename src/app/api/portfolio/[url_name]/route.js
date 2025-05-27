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
    console.log("Fetching portfolio for URL name:", url_name);

    // First, get the user data to get the user_id
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("id, url_name")
      .eq("url_name", url_name)
      .maybeSingle();

    console.log("User data fetch attempt:", {
      url_name,
      userData,
      userError,
      errorDetails: userError
        ? {
            code: userError.code,
            message: userError.message,
            details: userError.details,
            hint: userError.hint,
          }
        : null,
    });

    if (userError) {
      return NextResponse.json(
        { error: "Error fetching user data", details: userError },
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

    console.log("Portfolio data fetch result:", {
      portfolioData,
      portfolioError,
      errorDetails: portfolioError
        ? {
            code: portfolioError.code,
            message: portfolioError.message,
            details: portfolioError.details,
            hint: portfolioError.hint,
          }
        : null,
    });

    if (portfolioError) {
      return NextResponse.json(
        { error: "Error fetching portfolio data", details: portfolioError },
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

    console.log("User components fetch result:", {
      userComponents,
      componentsError,
      errorDetails: componentsError
        ? {
            code: componentsError.code,
            message: componentsError.message,
            details: componentsError.details,
            hint: componentsError.hint,
          }
        : null,
    });

    if (componentsError) {
      return NextResponse.json(
        { error: "Error fetching user components", details: componentsError },
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
    });
  } catch (error) {
    console.error("Unexpected error in portfolio API:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
