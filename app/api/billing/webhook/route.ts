// app/api/billing/webhook/route.ts

import { NextResponse } from "next/server";
import { stripe } from "../../../../config/stripe";
import { upgradeSessionTier } from "../../../../lib/auth";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const email = (event.data.object as any).customer_email;
    if (email) {
      upgradeSessionTier(email);
    }
  }

  return NextResponse.json({ received: true });
}
