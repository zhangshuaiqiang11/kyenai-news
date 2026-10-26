import type { NextApiRequest, NextApiResponse } from "next";

import { buildGuideMarkdown } from "../../lib/guide-markdown";
import { getGuide } from "../../lib/guides";
import { buildCanonicalUrl } from "../../lib/seo";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const slug = typeof req.query.slug === "string" ? req.query.slug : "";
  const guide = getGuide(slug);

  if (!guide) {
    res.status(404).setHeader("Content-Type", "text/plain").send("Guide not found");
    return;
  }

  const markdown = buildGuideMarkdown(guide);
  const canonical = buildCanonicalUrl(`/guides/${guide.slug}`);

  res.setHeader("Content-Type", "text/markdown; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate");
  res.setHeader("X-Robots-Tag", "noindex, follow");
  res.setHeader("Link", `<${canonical}>; rel="canonical"`);
  res.status(200).send(req.method === "HEAD" ? "" : markdown);
}
