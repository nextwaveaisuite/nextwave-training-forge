// config/stripe.ts

import Stripe from "stripe";

/**
 * Stripe configuration
 * --------------------
 * Uses server-side secret key only.
 * Never expose this file to client components.
 */

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY as string,
  {
    apiVersion: "2023-10-16",
  }
);

// ✅ Replace this with your REAL Stripe Price ID
export const STRIPE_PRO_PRICE_ID =
  process.env.STRIPE_PRO_PRICE_ID as string;
