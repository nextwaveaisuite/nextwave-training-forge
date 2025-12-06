import { getSession } from "@/lib/auth";

// ...

const session = getSession();
if (!session) {
  return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
}

checkRateLimit(session.email);

assertTierAccess(session.tier, {
  requestedLanguage: language,
  requestedBibleTranslation: bibleTranslation,
  ministryMode,
});
