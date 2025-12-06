// engines/tierGatekeeper.ts

/**
 * Tier Gatekeeper
 * ----------------
 * Central authority for enforcing:
 * - User tier permissions
 * - Feature access
 * - Language access
 * - Bible translation access
 * - Usage limits
 *
 * This file is SECURITY-CRITICAL.
 * All engine access must pass through this layer.
 */

export type UserTier =
  | "FREE"
  | "PRO"
  | "ELITE"
  | "MINISTRY"
  | "ENTERPRISE"
  | "GOVERNMENT"
  | "GLOBAL_ACADEMY";

export interface TierPermissions {
  maxCoursesPerMonth: number | "unlimited";
  allowedLanguages: string[] | "all";
  allowedBibleTranslations: string[];
  allowMinistryMode: boolean;
  allowComplianceEngine: boolean;
  allowMultiNation: boolean;
}

/**
 * SINGLE SOURCE OF TRUTH
 * ----------------------
 * If you ever want to change what a tier can do,
 * this is the ONLY place it should be edited.
 */
export const TIER_MATRIX: Record<UserTier, TierPermissions> = {
  FREE: {
    maxCoursesPerMonth: 1,
    allowedLanguages: ["en"],
    allowedBibleTranslations: [],
    allowMinistryMode: false,
    allowComplianceEngine: false,
    allowMultiNation: false,
  },

  PRO: {
    maxCoursesPerMonth: "unlimited",
    allowedLanguages: ["en", "tok-pisin"],
    allowedBibleTranslations: ["NKJV", "KJV"],
    allowMinistryMode: true,
    allowComplianceEngine: false,
    allowMultiNation: false,
  },

  ELITE: {
    maxCoursesPerMonth: "unlimited",
    allowedLanguages: "all",
    allowedBibleTranslations: [
      "NKJV",
      "KJV",
      "ESV",
      "NIV",
      "NLT",
      "ASV",
      "AMP",
    ],
    allowMinistryMode: true,
    allowComplianceEngine: true,
    allowMultiNation: true,
  },

  MINISTRY: {
    maxCoursesPerMonth: "unlimited",
    allowedLanguages: "all",
    allowedBibleTranslations: [
      "NKJV",
      "KJV",
      "ESV",
      "NIV",
      "NLT",
      "ASV",
      "AMP",
    ],
    allowMinistryMode: true,
    allowComplianceEngine: false,
    allowMultiNation: true,
  },

  ENTERPRISE: {
    maxCoursesPerMonth: "unlimited",
    allowedLanguages: "all",
    allowedBibleTranslations: [
      "NKJV",
      "KJV",
      "ESV",
      "NIV",
      "NLT",
      "ASV",
      "AMP",
    ],
    allowMinistryMode: true,
    allowComplianceEngine: true,
    allowMultiNation: true,
  },

  GOVERNMENT: {
    maxCoursesPerMonth: "unlimited",
    allowedLanguages: "all",
    allowedBibleTranslations: [],
    allowMinistryMode: false,
    allowComplianceEngine: true,
    allowMultiNation: true,
  },

  GLOBAL_ACADEMY: {
    maxCoursesPerMonth: "unlimited",
    allowedLanguages: "all",
    allowedBibleTranslations: [
      "NKJV",
      "KJV",
      "ESV",
      "NIV",
      "NLT",
      "ASV",
      "AMP",
    ],
    allowMinistryMode: true,
    allowComplianceEngine: true,
    allowMultiNation: true,
  },
};

/**
 * Throws HARD errors.
 * This is intentional.
 * Security failures must never be silent.
 */
export function assertTierAccess(
  tier: UserTier,
  options: {
    requestedLanguage?: string;
    requestedBibleTranslation?: string;
    ministryMode?: boolean;
    multiNation?: boolean;
    compliance?: boolean;
  }
) {
  const permissions = TIER_MATRIX[tier];

  if (!permissions) {
    throw new Error(`Invalid or unknown tier: ${tier}`);
  }

  if (
    options.requestedLanguage &&
    permissions.allowedLanguages !== "all" &&
    !permissions.allowedLanguages.includes(options.requestedLanguage)
  ) {
    throw new Error(
      `Tier ${tier} is not allowed to use language "${options.requestedLanguage}"`
    );
  }

  if (
    options.requestedBibleTranslation &&
    !permissions.allowedBibleTranslations.includes(
      options.requestedBibleTranslation
    )
  ) {
    throw new Error(
      `Tier ${tier} is not allowed to use Bible translation "${options.requestedBibleTranslation}"`
    );
  }

  if (options.ministryMode && !permissions.allowMinistryMode) {
    throw new Error(`Tier ${tier} is not allowed to use Ministry Mode`);
  }

  if (options.multiNation && !permissions.allowMultiNation) {
    throw new Error(`Tier ${tier} is not allowed multi-nation course generation`);
  }

  if (options.compliance && !permissions.allowComplianceEngine) {
    throw new Error(`Tier ${tier} is not allowed to use the Compliance Engine`);
  }

  return true;
}

/**
 * Lightweight helper
 */
export function canUseFeature(
  tier: UserTier,
  feature:
    | "MINISTRY"
    | "COMPLIANCE"
    | "MULTI_NATION"
): boolean {
  const permissions = TIER_MATRIX[tier];

  if (!permissions) return false;

  if (feature === "MINISTRY") return permissions.allowMinistryMode;
  if (feature === "COMPLIANCE") return permissions.allowComplianceEngine;
  if (feature === "MULTI_NATION") return permissions.allowMultiNation;

  return false;
}
