const GA4_MEASUREMENT_ID = /^G-[A-Z0-9]{6,14}$/;
const PLACEHOLDER_IDS = new Set(["G-XXXXXXXXXX", "G-0000000000"]);

export type GrowthEventName = "tool_use" | "template_copy" | "resource_download_click";

export type GrowthEventParameters = {
  page_path: string;
  tool_id?: string;
  action_id?: string;
  resource_id?: string;
};

const IDENTIFIER_PATTERN = /^[a-z0-9][a-z0-9_-]{0,79}$/;
const PATH_PATTERN = /^\/(?:[a-z0-9][a-z0-9/._-]{0,158})?$/;

export function getValidGaId(value = process.env.NEXT_PUBLIC_GA_ID): string | null {
  const normalized = value?.trim().toUpperCase() ?? "";
  if (!normalized || PLACEHOLDER_IDS.has(normalized) || !GA4_MEASUREMENT_ID.test(normalized)) {
    return null;
  }
  return normalized;
}

export function getCurrentPagePath(): string {
  if (typeof window === "undefined") return "/unknown";
  return window.location.pathname || "/";
}

export function trackGrowthEvent(name: GrowthEventName, parameters: GrowthEventParameters): boolean {
  const gtag = typeof window === "undefined" ? undefined : window.gtag;
  if (!getValidGaId() || !gtag || !isSafeEventParameters(parameters)) return false;

  try {
    gtag("event", name, {
      event_category: "KyenAI growth",
      ...parameters,
    });
    return true;
  } catch {
    return false;
  }
}

export function resourceIdFromHref(href: string): string | null {
  try {
    const url = new URL(href, "https://www.kyenai.com");
    if (url.origin !== "https://www.kyenai.com" || !url.pathname.startsWith("/resources/")) return null;
    return url.pathname;
  } catch {
    return null;
  }
}

function isSafeEventParameters(parameters: GrowthEventParameters): boolean {
  if (!PATH_PATTERN.test(parameters.page_path)) return false;
  return [parameters.tool_id, parameters.action_id, parameters.resource_id].every(
    (value) => value === undefined || (value.startsWith("/") ? PATH_PATTERN : IDENTIFIER_PATTERN).test(value),
  );
}
