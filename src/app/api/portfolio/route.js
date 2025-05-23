import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Helper function to check if a component is pro
const isProComponent = (componentId, sectionType) => {
  const componentMaps = {
    navbar: {
      pro: [2, 3], // IDs of pro components
    },
    hero: {
      pro: [2, 3, 4, 5],
    },
    about: {
      pro: [2, 3, 4],
    },
    projects: {
      pro: [2, 3],
    },
    contact: {
      pro: [2, 3, 4, 5],
    },
    footer: {
      pro: [2],
    },
  };

  return componentMaps[sectionType]?.pro?.includes(componentId) || false;
};

export async function POST(request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's plan
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("plan")
      .eq("id", user.id)
      .single();

    if (userError) {
      return NextResponse.json(
        { error: "Error fetching user data" },
        { status: 500 }
      );
    }

    const isProUser = userData?.plan === "pro";

    // Get the portfolio data from the request
    const portfolioData = await request.json();

    // Validate components
    const sections = [
      "navbar",
      "hero",
      "about",
      "projects",
      "contact",
      "footer",
    ];
    const hasProComponents = sections.some((section) => {
      const componentId = portfolioData[section]?.id;
      return componentId && isProComponent(componentId, section);
    });

    // If user is not pro and trying to use pro components, reject the request
    if (!isProUser && hasProComponents) {
      return NextResponse.json(
        { error: "Pro components are only available for pro users" },
        { status: 403 }
      );
    }

    // If validation passes, proceed with the update
    const { error: updateError } = await supabase
      .from("portfolios")
      .update(portfolioData)
      .eq("user_id", user.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Error updating portfolio" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Portfolio update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
