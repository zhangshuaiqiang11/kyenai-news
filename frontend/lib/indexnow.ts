import { SITE_URL } from "./seo";

export const INDEXNOW_KEY = "9f8a3c1e7b6d4025a1c9e8f2b7d4a6c0";
export const INDEXNOW_KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

export type IndexNowResult = {
  submitted: number;
  status: string;
  errors: string[];
  httpStatus: number;
};

export function validateIndexNowUrls(urls: string[]): { urls: string[]; errors: string[] } {
  const expectedOrigin = new URL(SITE_URL).origin;
  const valid = new Set<string>();
  const errors: string[] = [];

  for (const rawUrl of urls) {
    try {
      const parsed = new URL(rawUrl.trim());
      if (parsed.origin !== expectedOrigin || parsed.protocol !== "https:") {
        errors.push(`URL must use the ${expectedOrigin} origin`);
        continue;
      }
      parsed.hash = "";
      valid.add(parsed.href);
    } catch {
      errors.push("Invalid URL");
    }
  }

  return { urls: Array.from(valid), errors };
}

function resolveHost(): string {
  const envHost = process.env.INDEXNOW_HOST;
  if (envHost && envHost.trim()) {
    return envHost.trim();
  }
  try {
    return new URL(SITE_URL).host;
  } catch {
    return "www.kyenai.com";
  }
}

export async function submitToIndexNow(urls: string[]): Promise<IndexNowResult> {
  const validated = validateIndexNowUrls(urls.map((url) => url.trim()).filter(Boolean));
  if (validated.errors.length > 0) {
    return { submitted: 0, status: "invalid-urls", errors: validated.errors, httpStatus: 400 };
  }
  if (validated.urls.length === 0) {
    return { submitted: 0, status: "no-urls", errors: [], httpStatus: 400 };
  }

  const body = {
    host: resolveHost(),
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: validated.urls,
  };

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });

    if (response.ok || response.status === 200) {
      return { submitted: validated.urls.length, status: "ok", errors: [], httpStatus: response.status };
    }

    return {
      submitted: 0,
      status: `http-${response.status}`,
      errors: [`IndexNow responded with ${response.status}`],
      httpStatus: response.status,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      submitted: 0,
      status: "error",
      errors: [message],
      httpStatus: 502,
    };
  }
}
