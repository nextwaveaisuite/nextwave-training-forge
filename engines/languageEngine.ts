// engines/languageEngine.ts

/**
 * Language & Localization Engine (v1)
 * ----------------------------------
 * Handles:
 * - Language translation
 * - Cultural adaptation hooks
 * - Region-awareness
 *
 * v1 includes:
 * ✅ English (en)
 * ✅ Tok Pisin (tok-pisin)
 *
 * EXTENDABLE to 200+ languages without refactor.
 */

export type SupportedLanguage = "en" | "tok-pisin";

export interface TranslationInput {
  text: string;
  from: SupportedLanguage;
  to: SupportedLanguage;
  country?: string;
}

export interface TranslationResult {
  original: string;
  translated: string;
  language: SupportedLanguage;
}

/**
 * MAIN ENTRY POINT
 */
export function translateText(
  input: TranslationInput
): TranslationResult {
  if (input.from === input.to) {
    return {
      original: input.text,
      translated: input.text,
      language: input.to,
    };
  }

  if (input.from === "en" && input.to === "tok-pisin") {
    return {
      original: input.text,
      translated: englishToTokPisin(input.text),
      language: input.to,
    };
  }

  throw new Error(
    `Unsupported translation path: ${input.from} → ${input.to}`
  );
}

/**
 * EN → TOK PISIN TRANSLATION LOGIC
 * --------------------------------
 * This is intentionally RULE-BASED v1.
 * Later versions can plug into AI or dictionaries.
 */
function englishToTokPisin(text: string): string {
  const dictionary: Record<string, string> = {
    "training": "tren",
    "course": "kos",
    "student": "sumatin",
    "teacher": "tisa",
    "workplace": "ples wok",
    "safety": "sefti",
    "assessment": "sek",
    "learning": "lanem",
    "module": "hap",
    "lesson": "lesen",
    "community": "komuniti",
    "development": "divelopmen",
    "leadership": "lidasip",
  };

  let translated = text.toLowerCase();

  Object.entries(dictionary).forEach(([en, tp]) => {
    const regex = new RegExp(`\\b${en}\\b`, "gi");
    translated = translated.replace(regex, tp);
  });

  // Basic sentence normalization
  translated =
    translated.charAt(0).toUpperCase() + translated.slice(1);

  return translated;
}

/**
 * COURSE-LEVEL TRANSLATION
 * -----------------------
 * Used to translate full course objects.
 */
export function translateCourse<T>(
  course: T,
  to: SupportedLanguage
): T {
  if (to === "en") return course;

  // Shallow protection: only string fields are translated
  return JSON.parse(
    JSON.stringify(course, (_key, value) => {
      if (typeof value === "string") {
        return englishToTokPisin(value);
      }
      return value;
    })
  );
}

/**
 * FUTURE EXTENSION HOOKS (NO BREAKING CHANGES)
 *
 * - AI-powered translation
 * - Cultural rewrites
 * - Multi-language dictionaries
 * - Regional training tone adjustments
 * - Industry-specific phrasing
 */
