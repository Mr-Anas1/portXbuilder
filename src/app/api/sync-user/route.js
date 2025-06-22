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
        { error: "No user data provided" },
        { status: 400 }
      );
    }

    const { id, emailAddresses, firstName, lastName, username } = body;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if user exists in Supabase
    const { data: existingUser, error: userError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("clerk_id", id)
      .single();

    if (userError && userError.code !== "PGRST116") {
      console.error("Error checking user:", userError);
      return NextResponse.json(
        { error: "Error checking user" },
        { status: 500 }
      );
    }

    // If user doesn't exist, create them
    if (!existingUser) {
      const email = emailAddresses?.[0]?.emailAddress;
      const name = `${firstName || ""} ${lastName || ""}`.trim();

      const { data: newUser, error: createError } = await supabaseAdmin
        .from("users")
        .insert({
          clerk_id: id,
          email: email,
          name: name || "User",
          url_name: username,
          components: {},
          theme: "default",
          plan: "free",
        })
        .select()
        .single();

      if (createError) {
        console.error("Error creating user:", createError);
        return NextResponse.json(
          { error: "Error creating user" },
          { status: 500 }
        );
      }

      return NextResponse.json(newUser);
    }

    // If user exists, update their data
    const email = emailAddresses?.[0]?.emailAddress;
    const name = `${firstName || ""} ${lastName || ""}`.trim();

    const updateData = {
      email: email,
      name: name || existingUser.name,
    };

    // Only update url_name if it's not already set
    if (!existingUser.url_name && username) {
      updateData.url_name = username;
    }

    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from("users")
      .update(updateData)
      .eq("clerk_id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating user:", updateError);
      return NextResponse.json(
        { error: "Error updating user" },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error in sync-user API:", error);
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
