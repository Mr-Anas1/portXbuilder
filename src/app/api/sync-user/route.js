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
    const clerkUser = await request.json();

    if (!clerkUser) {
      return NextResponse.json(
        { error: "No clerkUser provided" },
        { status: 400 }
      );
    }

    // First check if user exists by email
    const { data: existingUserByEmail, error: emailError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", clerkUser.emailAddresses[0]?.emailAddress)
      .maybeSingle();

    if (emailError) {
      console.error("Error checking user by email:", emailError);
      return NextResponse.json(
        { error: "Error checking user by email" },
        { status: 500 }
      );
    }

    // If user exists by email but has different clerk_id, update it
    if (existingUserByEmail && existingUserByEmail.clerk_id !== clerkUser.id) {
      const { data: updatedUser, error: updateError } = await supabaseAdmin
        .from("users")
        .update({
          clerk_id: clerkUser.id,
          name: clerkUser.fullName,
          url_name: clerkUser.url_name,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingUserByEmail.id)
        .select()
        .single();

      if (updateError) {
        console.error("Error updating user's clerk_id:", updateError);
        return NextResponse.json(
          { error: "Error updating user's clerk_id" },
          { status: 500 }
        );
      }

      return NextResponse.json(updatedUser);
    }

    // Check if user exists by clerk_id
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("clerk_id", clerkUser.id)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching user by clerk_id:", fetchError);
      return NextResponse.json(
        { error: "Error fetching user by clerk_id" },
        { status: 500 }
      );
    }

    if (existingUser) {
      // Update existing user
      const { data: updatedUser, error: updateError } = await supabaseAdmin
        .from("users")
        .update({
          email: clerkUser.emailAddresses[0]?.emailAddress,
          name: clerkUser.fullName,
          url_name: clerkUser.url_name,
          updated_at: new Date().toISOString(),
        })
        .eq("clerk_id", clerkUser.id)
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
    } else {
      // Create new user
      const { data: newUser, error: insertError } = await supabaseAdmin
        .from("users")
        .insert({
          clerk_id: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress,
          name: clerkUser.fullName,
          url_name: clerkUser.url_name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error creating user:", insertError);
        return NextResponse.json(
          { error: "Error creating user" },
          { status: 500 }
        );
      }

      return NextResponse.json(newUser);
    }
  } catch (error) {
    console.error("Error in sync-user API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
