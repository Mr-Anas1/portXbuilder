import { supabaseAdmin } from "@/lib/supabase-admin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { clerk_id, city, country, state, street, zipcode } = req.body;
  if (!clerk_id) {
    return res.status(400).json({ error: "Missing clerk_id" });
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
    return res.status(500).json({ error: "Failed to update billing info" });
  }
  return res.status(200).json({ message: "Billing info updated" });
}
