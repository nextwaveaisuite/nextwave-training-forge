// config/stripe.ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

// Your Stripe Price ID for PRO plan (monthly)
export const STRIPE_PRO_PRICE_ID = "price_PRO_MONTHLY_ID";
