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
      console.error("No portfolio data provided");
      return NextResponse.json(
        { error: "No portfolio data provided" },
        { status: 400 }
      );
    }

    if (!portfolioData.user_id) {
      console.error("No user_id provided in data:", portfolioData);
      return NextResponse.json(
        { error: "No user_id provided" },
        { status: 400 }
      );
    }

    console.log("Received portfolio data:", portfolioData);

    // Create or update portfolio using service role
    const { data: existingData, error: fetchError } = await supabaseAdmin
      .from("portfolios")
      .select("*")
      .eq("user_id", portfolioData.user_id)
      .single();

    console.log("Fetch result:", { existingData, fetchError });

    // If no portfolio exists yet, create a new one with default values
    if (fetchError && fetchError.code === "PGRST116") {
      console.log("No existing portfolio found, creating new one");
      const insertData = {
        user_id: portfolioData.user_id,
        ...portfolioData,
      };
      console.log("Inserting new portfolio with data:", insertData);

      const { data, error } = await supabaseAdmin
        .from("portfolios")
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error("Error creating portfolio:", error);
        return NextResponse.json(
          { error: "Error creating portfolio" },
          { status: 500 }
        );
      }

      console.log("Successfully created new portfolio:", data);
      return NextResponse.json(data);
    }

    if (fetchError) {
      console.error("Error fetching existing portfolio:", fetchError);
      return NextResponse.json(
        { error: "Error fetching existing portfolio" },
        { status: 500 }
      );
    }

    // Merge existing data with new data, ensuring we don't overwrite with undefined values
    const mergedData = {
      ...existingData,
      ...Object.fromEntries(
        Object.entries(portfolioData).filter(
          ([_, value]) => value !== undefined
        )
      ),
    };

    console.log("Merged data for update:", mergedData);

    const { data, error } = await supabaseAdmin
      .from("portfolios")
      .upsert(mergedData, {
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

    console.log("Successfully updated portfolio:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in portfolio API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
