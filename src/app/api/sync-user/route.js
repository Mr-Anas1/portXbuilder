import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isUserSubscribed } from "@/lib/clerk";

export async function POST(request) {
  try {
    const user = await request.json();
    const supabase = createRouteHandlerClient({ cookies });

    // Log the entire user object to see what we're receiving
    console.log("Received user data:", {
      id: user.id,
      email: user.emailAddresses?.[0]?.emailAddress,
      publicMetadata: user.publicMetadata,
      privateMetadata: user.privateMetadata,
      unsafeMetadata: user.unsafeMetadata,
    });

    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id", user.id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching user:", fetchError);
      return NextResponse.json(
        { error: "Error fetching user" },
        { status: 500 }
      );
    }

    // Check actual subscription status
    const isPro = await isUserSubscribed(user.id);
    console.log("User subscription status:", { userId: user.id, isPro });

    if (existingUser) {
      // Update existing user's plan status if it has changed
      if (existingUser.plan !== (isPro ? "pro" : "free")) {
        console.log(
          "Updating user plan from",
          existingUser.plan,
          "to",
          isPro ? "pro" : "free"
        );

        const { error: updateError } = await supabase
          .from("users")
          .update({
            plan: isPro ? "pro" : "free",
            updated_at: new Date().toISOString(),
          })
          .eq("clerk_id", user.id);

        if (updateError) {
          console.error("Error updating user plan:", updateError);
          return NextResponse.json(
            { error: "Error updating user plan" },
            { status: 500 }
          );
        }
      }
      return NextResponse.json(existingUser);
    }

    // Create new user with plan status
    const { data: newUser, error: createError } = await supabase
      .from("users")
      .insert({
        clerk_id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        plan: isPro ? "pro" : "free",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
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
  } catch (error) {
    console.error("Error in sync-user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
