// engines/tierGatekeeper.ts
export type UserTier =
  | "FREE"
  | "PRO"
  | "ELITE"
  | "MINISTRY"
  | "ENTERPRISE"
  | "GOVERNMENT"
  | "GLOBAL_ACADEMY";

export const TIER_MATRIX = {
  FREE: { allowMinistryMode: false, languages: ["en"] },
  PRO: { allowMinistryMode: true, languages: ["en", "tok-pisin"] },
  ELITE: { allowMinistryMode: true, languages: ["all"] },
  MINISTRY: { allowMinistryMode: true, languages: ["all"] },
  ENTERPRISE: { allowMinistryMode: true, languages: ["all"] },
  GOVERNMENT: { allowMinistryMode: false, languages: ["all"] },
  GLOBAL_ACADEMY: { allowMinistryMode: true, languages: ["all"] },
};

export function assertTierAccess() {
  return true;
}
