import type { NextApiRequest, NextApiResponse } from "next";

import { getGlossaryTerms } from "../../lib/glossary";
import { getGuides } from "../../lib/guides";
import { INDEXNOW_KEY, submitToIndexNow } from "../../lib/indexnow";
import { buildCanonicalUrl } from "../../lib/seo";

type ResponseBody = {
  ok: boolean;
  submitted: number;
  status: string;
  errors: string[];
};

function buildDefaultUrlList(): string[] {
  const urls = [buildCanonicalUrl("/"), buildCanonicalUrl("/guides")];
  for (const guide of getGuides()) {
    urls.push(buildCanonicalUrl(`/guides/${guide.slug}`));
  }
  urls.push(buildCanonicalUrl("/glossary"));
  for (const term of getGlossaryTerms()) {
    urls.push(buildCanonicalUrl(`/glossary/${term.slug}`));
  }
  return urls;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseBody>) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ ok: false, submitted: 0, status: "method-not-allowed", errors: ["Method not allowed"] });
    return;
  }

  const providedToken = String(req.headers["x-indexnow-token"] || "");
  const expectedToken = process.env.INDEXNOW_KEY || INDEXNOW_KEY;
  if (!providedToken || providedToken !== expectedToken) {
    res.status(401).json({ ok: false, submitted: 0, status: "unauthorized", errors: ["Invalid or missing token"] });
    return;
  }

  const inputUrls = Array.isArray(req.body?.urls) ? req.body.urls.filter((u: unknown) => typeof u === "string") : null;
  const urls = inputUrls && inputUrls.length > 0 ? (inputUrls as string[]) : buildDefaultUrlList();

  const result = await submitToIndexNow(urls);
  res.status(200).json({
    ok: result.errors.length === 0,
    submitted: result.submitted,
    status: result.status,
    errors: result.errors,
  });
}
