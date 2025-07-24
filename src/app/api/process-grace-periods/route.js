import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request) {
  console.log("=== PROCESSING GRACE PERIODS ===");

  try {
    // Get all users who are in grace period and their grace period has expired
    const { data: usersToDowngrade, error: fetchError } = await supabaseAdmin
      .from("users")
      .select("clerk_id, email, grace_period_end, subscription_cancelled_at")
      .eq("subscription_status", "cancelling")
      .not("grace_period_end", "is", null)
      .lt("grace_period_end", new Date().toISOString());

    if (fetchError) {
      console.error("Error fetching users to downgrade:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 500 }
      );
    }

    console.log(`Found ${usersToDowngrade?.length || 0} users to downgrade`);

    if (!usersToDowngrade || usersToDowngrade.length === 0) {
      return NextResponse.json({
        message: "No users to downgrade",
        processed: 0,
      });
    }

    // Downgrade each user
    const downgradedUsers = [];
    const failedUsers = [];

    for (const user of usersToDowngrade) {
      try {
        const { error: updateError } = await supabaseAdmin
          .from("users")
          .update({
            plan: "free",
            subscription_status: "cancelled",
            grace_period_end: null,
            components: {
              home: "Hero 1",
              about: "About 1",
              footer: "Footer 1",
              navbar: "Navbar 1",
              contact: "Contact 1",
              projects: "Project 1",
            },
          })
          .eq("clerk_id", user.clerk_id);

        if (updateError) {
          console.error(
            `Failed to downgrade user ${user.clerk_id}:`,
            updateError
          );
          failedUsers.push({
            clerk_id: user.clerk_id,
            email: user.email,
            error: updateError.message,
          });
        } else {
          console.log(`Successfully downgraded user ${user.email}`);
          downgradedUsers.push({
            clerk_id: user.clerk_id,
            email: user.email,
            grace_period_end: user.grace_period_end,
          });
        }
      } catch (error) {
        console.error(`Error processing user ${user.clerk_id}:`, error);
        failedUsers.push({
          clerk_id: user.clerk_id,
          email: user.email,
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      message: `Processed ${usersToDowngrade.length} users`,
      downgraded: downgradedUsers.length,
      failed: failedUsers.length,
      downgradedUsers,
      failedUsers,
    });
  } catch (error) {
    console.error("Error processing grace periods:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Also handle GET requests for manual testing
export async function GET() {
  console.log("=== CHECKING GRACE PERIODS (GET) ===");

  try {
    // Get all users in grace period
    const { data: gracePeriodUsers, error } = await supabaseAdmin
      .from("users")
      .select(
        "clerk_id, email, plan, subscription_status, grace_period_end, subscription_cancelled_at"
      )
      .eq("subscription_status", "cancelling")
      .not("grace_period_end", "is", null);

    if (error) {
      console.error("Error fetching grace period users:", error);
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 500 }
      );
    }

    const now = new Date();
    const expiredUsers =
      gracePeriodUsers?.filter(
        (user) => new Date(user.grace_period_end) < now
      ) || [];

    const activeGracePeriodUsers =
      gracePeriodUsers?.filter(
        (user) => new Date(user.grace_period_end) >= now
      ) || [];

    return NextResponse.json({
      totalGracePeriodUsers: gracePeriodUsers?.length || 0,
      expiredUsers: expiredUsers.length,
      activeGracePeriodUsers: activeGracePeriodUsers.length,
      expiredUsersList: expiredUsers,
      activeGracePeriodUsersList: activeGracePeriodUsers,
    });
  } catch (error) {
    console.error("Error checking grace periods:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
