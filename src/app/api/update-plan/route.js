import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { userId, plan } = await req.json();

    if (!userId || !plan) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Get user's Supabase ID
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (userError) {
      console.error("Error fetching user data:", userError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch user data" }),
        { status: 500 }
      );
    }

    if (!userData) {
      return new Response(
        JSON.stringify({ error: "User not found in database" }),
        { status: 404 }
      );
    }

    // Update user's plan in Supabase
    const { error: updateError } = await supabase
      .from("users")
      .update({ plan })
      .eq("id", userData.id);

    if (updateError) {
      console.error("Error updating user plan:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update user plan" }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Plan updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating plan:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
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
