# Georgy's Sweets — website

This is a small React site (built with Vite) plus two serverless functions
that talk to Stripe. Pay-at-pickup orders never touch Stripe at all — only
"Pay during checkout" does.

## Before you deploy

Fill in your real pickup address and instructions in `src/App.jsx`, inside
the `CONFIG` object near the top of the file (search for `TODO`).

## 1. Get your Stripe keys

1. Sign up at https://stripe.com — you'll start in **test mode**, which is
   safe to experiment with (no real charges).
2. Go to **Developers → API keys**.
3. Copy the **Publishable key** (starts with `pk_test_...`) — you won't
   need to put this in the code anywhere for this setup, since Stripe
   Checkout is hosted entirely on Stripe's side.
4. Copy the **Secret key** (starts with `sk_test_...`) — keep this private.

## 2. Push this project to GitHub

1. Create a new (empty) repository on GitHub.
2. From this folder, run:
   ```
   git init
   git add .
   git commit -m "Georgy's Sweets site"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

## 3. Deploy on Vercel

1. Sign up at https://vercel.com (free) and click **Add New → Project**.
2. Import the GitHub repo you just pushed.
3. Vercel will auto-detect it as a Vite project — leave the default build
   settings as-is and click **Deploy**.
4. Once deployed, go to **Project Settings → Environment Variables** and add:
   - `STRIPE_SECRET_KEY` = your `sk_test_...` key (or `sk_live_...` once you're live)
5. Redeploy (Vercel will prompt you, or trigger it from the Deployments tab)
   so the new environment variable takes effect.

## 4. Test it

1. Open your live Vercel URL.
2. Add items to your cart, go through checkout, choose "Pay during checkout."
3. On Stripe's page, use the test card `4242 4242 4242 4242`, any future
   expiry date, and any 3-digit CVC.
4. You should land back on your site with an order confirmation, and see
   the test payment appear in your Stripe dashboard under **Payments**
   (make sure "Test mode" is toggled on in the dashboard).

## 5. Add a custom domain (optional)

In Vercel: **Project Settings → Domains** → add your domain (e.g.
`georgyssweets.com`) and follow the DNS instructions from wherever you
bought it.

## 6. Go live

1. In Stripe, finish account verification and switch off test mode.
2. Grab your **live** secret key (`sk_live_...`).
3. Replace the `STRIPE_SECRET_KEY` environment variable in Vercel with the
   live key, and redeploy.

## Local development (optional)

```
npm install
npm run dev
```

The `/api` functions only work when deployed on Vercel (or via `vercel dev`
if you install the Vercel CLI) — running plain `npm run dev` will show the
site but "Pay during checkout" won't be able to reach Stripe locally unless
you also run `vercel dev`.
