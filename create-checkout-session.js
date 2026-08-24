// This runs on the server (Vercel), never in the customer's browser.
// It's the only place your Stripe secret key is used.
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { items, addBag, bagFeeCents, contactEmail } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "No items in order." });
    }

    // Build Stripe line items from the cart. Prices are computed here,
    // server-side, from a source of truth you control — never trust
    // prices sent from the browser.
    const PRICES_CENTS = {
      "biscoff-cookie": 400,
      "pumpkin-roll": 400,
      "carrot-loaf": 1200,
      "crumb-loaf": 1200,
    };
    const NAMES = {
      "biscoff-cookie": "Biscoff Pumpkin Cookies",
      "pumpkin-roll": "Pumpkin Cinnamon Rolls",
      "carrot-loaf": "Carrot Cake Loaf",
      "crumb-loaf": "Cinnamon Crumb Cake Loaf",
    };

    const line_items = items
      .filter((i) => PRICES_CENTS[i.id] && i.qty > 0)
      .map((i) => ({
        price_data: {
          currency: "usd",
          product_data: { name: NAMES[i.id] },
          unit_amount: PRICES_CENTS[i.id],
        },
        quantity: i.qty,
      }));

    if (addBag) {
      line_items.push({
        price_data: {
          currency: "usd",
          product_data: { name: "Bag" },
          unit_amount: bagFeeCents || 50,
        },
        quantity: 1,
      });
    }

    const origin = req.headers.origin || `https://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      customer_email: contactEmail || undefined,
      success_url: `${origin}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?checkout=canceled`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong creating checkout." });
  }
}
