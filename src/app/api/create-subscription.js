import razorpay from "@/lib/razorpay";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const customer = await razorpay.customers.create({
      name: req.body.name,
      email: req.body.email,
      contact: req.body.contact, // optional
    });

    const subscription = await razorpay.subscriptions.create({
      plan_id:
        req.body.billingPeriod === "yearly"
          ? process.env.RAZORPAY_YEARLY_PLAN_ID
          : process.env.RAZORPAY_MONTHLY_PLAN_ID,
      customer_notify: 1,
      total_count: 12, // how many billing cycles
      customer_id: customer.id,
    });

    res.status(200).json({ subscriptionId: subscription.id });
  } catch (error) {
    console.error("Subscription error:", error);
    res.status(500).json({ error: error.message });
  }
}
