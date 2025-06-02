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
    const user = await request.json();

    if (!user) {
      return NextResponse.json(
        { error: "No user data provided" },
        { status: 400 }
      );
    }

    // Check if user exists in Supabase
    const { data: existingUser, error: userError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("clerk_id", user.id)
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
      const { data: newUser, error: createError } = await supabaseAdmin
        .from("users")
        .insert({
          clerk_id: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          name: user.firstName + " " + user.lastName,
          url_name: user.username,
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
    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from("users")
      .update({
        email: user.emailAddresses[0]?.emailAddress,
        name: user.firstName + " " + user.lastName,
        url_name: user.username,
      })
      .eq("clerk_id", user.id)
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
