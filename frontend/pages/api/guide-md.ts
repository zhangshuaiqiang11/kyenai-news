import type { NextApiRequest, NextApiResponse } from "next";

import { buildGuideMarkdown } from "../../lib/guide-markdown";
import { getGuide } from "../../lib/guides";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
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

  res.setHeader("Content-Type", "text/markdown; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate");
  res.status(200).send(markdown);
}
