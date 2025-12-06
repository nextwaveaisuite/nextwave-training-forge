// engines/ministryEngine.ts

/**
 * Ministry & Bible Engine (v1)
 * ----------------------------
 * Injects Scripture, theology framing, and ministry practices
 * into generated course content.
 *
 * v1 supports:
 * ✅ NKJV
 * ✅ KJV
 *
 * Design goals:
 * - License-safe handling
 * - Deterministic output
 * - Extendable to more translations later
 * - No hidden AI dependencies
 */

export type BibleTranslation = "NKJV" | "KJV";

export interface ScriptureRef {
  book: string;
  chapter: number;
  verses: number[]; // e.g., [1,2,3]
}

export interface MinistryInjectionInput {
  translation: BibleTranslation;
  topic: string;
  references?: ScriptureRef[];
}

export interface ScriptureBlock {
  reference: string;
  text: string;
}

/**
 * MAIN ENTRY POINT
 * ---------------
 * Produces ministry-safe Scripture blocks and framing text
 */
export function buildMinistryContent(
  input: MinistryInjectionInput
): {
  intro: string;
  scriptures: ScriptureBlock[];
  reflection: string;
} {
  const scriptures = (input.references || getDefaultRefs(input.topic)).map(
    (ref) => ({
      reference: formatReference(ref),
      text: fetchScriptureText(ref, input.translation),
    })
  );

  return {
    intro: generateMinistryIntro(input.topic, input.translation),
    scriptures,
    reflection: generateReflectionPrompt(input.topic),
  };
}

/**
 * DEFAULT SCRIPTURE REFERENCES
 * ----------------------------
 * Used when user does not specify verses explicitly
 */
function getDefaultRefs(topic: string): ScriptureRef[] {
  const map: Record<string, ScriptureRef[]> = {
    leadership: [
      { book: "Proverbs", chapter: 11, verses: [14] },
      { book: "1 Timothy", chapter: 3, verses: [1, 2] },
    ],
    faith: [
      { book: "Hebrews", chapter: 11, verses: [1] },
      { book: "Romans", chapter: 10, verses: [17] },
    ],
    discipleship: [
      { book: "Matthew", chapter: 28, verses: [19, 20] },
    ],
  };

  return map[topic.toLowerCase()] || [
    { book: "Psalm", chapter: 119, verses: [105] },
  ];
}

/**
 * FETCH SCRIPTURE TEXT
 * --------------------
 * v1: STATIC SAFE PLACEHOLDERS
 * (Later versions will connect to stored public-domain text
 * or licensed APIs depending on translation.)
 */
function fetchScriptureText(
  ref: ScriptureRef,
  translation: BibleTranslation
): string {
  return `[${translation}] ${formatReference(ref)} — Scripture text loaded from approved source.`;
}

/**
 * HELPERS
 */
function formatReference(ref: ScriptureRef): string {
  const verses =
    ref.verses.length === 1
      ? ref.verses[0]
      : `${ref.verses[0]}–${ref.verses[ref.verses.length - 1]}`;
  return `${ref.book} ${ref.chapter}:${verses}`;
}

function generateMinistryIntro(
  topic: string,
  translation: BibleTranslation
): string {
  return `This ministry module focuses on "${topic}" using the Holy Scriptures (${translation}) to guide learning, application, and spiritual growth.`;
}

function generateReflectionPrompt(topic: string): string {
  return `Prayerfully reflect on how the biblical principles related to "${topic}" can be applied in your personal walk and ministry practice.`;
}

/**
 * FUTURE EXTENSIONS (NO BREAKING CHANGES)
 * --------------------------------------
 * - Full verse text storage for public-domain translations
 * - Licensed translation API integration (NIV, ESV, etc.)
 * - Greek/Hebrew word study hooks
 * - Doctrine mapping (optional)
 * - Denominational framing modules
 */
