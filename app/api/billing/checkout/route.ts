// app/api/billing/checkout/route.ts

import { NextResponse } from "next/server";
import { stripe, STRIPE_PRO_PRICE_ID } from "@/config/stripe";
import { getSession } from "@/lib/auth";

export async function POST() {
  const session = getSession();

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Not authenticated" },
      { status: 401 }
    );
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: STRIPE_PRO_PRICE_ID,
        quantity: 1,
      },
    ],
    customer_email: session.email,
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/billing/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/billing/cancel`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
