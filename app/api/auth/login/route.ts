import { NextResponse } from "next/server";
import { startSession } from "@/lib/auth";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ success: false, error: "Email required" }, { status: 400 });
  }

  startSession(email.toLowerCase());

  return NextResponse.json({ success: true });
}
