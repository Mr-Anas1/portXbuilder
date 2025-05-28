import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId, urlName, components } = await request.json();

    const supabase = createRouteHandlerClient({ cookies });

    // Update the user's data
    const { data, error } = await supabase
      .from("users")
      .update({
        url_name: urlName,
        components: components,
      })
      .eq("id", userId)
      .select();

    if (error) {
      console.error("Error updating user:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error in update-user route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
