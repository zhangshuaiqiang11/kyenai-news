import type { NextApiRequest, NextApiResponse } from "next";

import { getArticles } from "../../lib/api";
import { getGlossaryTerms } from "../../lib/glossary";
import { getGuides } from "../../lib/guides";
import { submitToIndexNow, validateIndexNowUrls } from "../../lib/indexnow";
import { getPublishedArticles } from "../../lib/publication";
import { buildCanonicalUrl } from "../../lib/seo";
import type { Article } from "../../lib/types";

type ResponseBody = {
  ok: boolean;
  submitted: number;
  status: string;
  errors: string[];
};

const RATE_LIMIT_WINDOW_MS = 30_000;
const lastSubmissionByClient = new Map<string, number>();

function getClientId(req: NextApiRequest): string {
  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return forwarded || req.socket.remoteAddress || "unknown";
}

export function buildDefaultUrlList(articles: Article[]): string[] {
  const urls = [
    buildCanonicalUrl("/"),
    buildCanonicalUrl("/guides"),
    buildCanonicalUrl("/tools/instruction-file-checker"),
  ];
  for (const guide of getGuides()) {
    urls.push(buildCanonicalUrl(`/guides/${guide.slug}`));
  }
  urls.push(buildCanonicalUrl("/glossary"));
  for (const term of getGlossaryTerms()) {
    urls.push(buildCanonicalUrl(`/glossary/${term.slug}`));
  }
  for (const article of getPublishedArticles(articles)) {
    urls.push(buildCanonicalUrl(`/articles/${article.slug}`));
  }
  return Array.from(new Set(urls));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseBody>) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ ok: false, submitted: 0, status: "method-not-allowed", errors: ["Method not allowed"] });
    return;
  }

  const providedToken = String(req.headers["x-indexnow-token"] || "");
  const expectedToken = process.env.INDEXNOW_SUBMIT_TOKEN;
  if (!expectedToken) {
    res.status(503).json({ ok: false, submitted: 0, status: "not-configured", errors: ["IndexNow submission is not configured"] });
    return;
  }
  if (!providedToken || providedToken !== expectedToken) {
    res.status(401).json({ ok: false, submitted: 0, status: "unauthorized", errors: ["Invalid or missing token"] });
    return;
  }


  const clientId = getClientId(req);
  const now = Date.now();
  const previousSubmission = lastSubmissionByClient.get(clientId) || 0;
  if (now - previousSubmission < RATE_LIMIT_WINDOW_MS) {
    res.status(429).json({ ok: false, submitted: 0, status: "rate-limited", errors: ["Try again later"] });
    return;
  }

  const inputUrls = Array.isArray(req.body?.urls) ? req.body.urls.filter((u: unknown) => typeof u === "string") : null;
  const urls = inputUrls && inputUrls.length > 0
    ? (inputUrls as string[])
    : buildDefaultUrlList(await getArticles());

  const validated = validateIndexNowUrls(urls);
  if (validated.errors.length > 0) {
    res.status(400).json({ ok: false, submitted: 0, status: "invalid-urls", errors: validated.errors });
    return;
  }

  lastSubmissionByClient.set(clientId, now);
  const result = await submitToIndexNow(validated.urls);
  res.status(result.httpStatus).json({
    ok: result.errors.length === 0,
    submitted: result.submitted,
    status: result.status,
    errors: result.errors,
  });
}
