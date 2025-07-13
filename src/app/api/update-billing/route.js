import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request) {
  const body = await request.json();
  const { clerk_id, city, country, state, street, zipcode } = body;
  if (!clerk_id) {
    return Response.json({ error: "Missing clerk_id" }, { status: 400 });
  }
  const { error } = await supabaseAdmin
    .from("users")
    .update({
      billing_city: city,
      billing_country: country,
      billing_state: state,
      billing_street: street,
      billing_zipcode: zipcode,
    })
    .eq("clerk_id", clerk_id);
  if (error) {
    return Response.json(
      { error: "Failed to update billing info" },
      { status: 500 }
    );
  }
  return Response.json({ message: "Billing info updated" });
}
