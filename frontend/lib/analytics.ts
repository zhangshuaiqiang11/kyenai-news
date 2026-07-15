const GA4_MEASUREMENT_ID = /^G-[A-Z0-9]{6,14}$/;
const PLACEHOLDER_IDS = new Set(["G-XXXXXXXXXX", "G-0000000000"]);

export function getValidGaId(value = process.env.NEXT_PUBLIC_GA_ID): string | null {
  const normalized = value?.trim().toUpperCase() ?? "";
  if (!normalized || PLACEHOLDER_IDS.has(normalized) || !GA4_MEASUREMENT_ID.test(normalized)) {
    return null;
  }
  return normalized;
}
