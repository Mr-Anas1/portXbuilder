// Dodo Payments integration will go here
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  // TODO: Implement Dodo Payments subscription creation
  res
    .status(501)
    .json({ error: "Dodo Payments integration not implemented yet" });
}
