import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { session_id } = req.query;
  if (!session_id) return res.status(400).json({ error: "Missing session_id" });

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    return res.status(200).json({
      paid: session.payment_status === "paid",
      amount_total: session.amount_total,
      customer_email: session.customer_details?.email,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Could not verify session." });
  }
}
