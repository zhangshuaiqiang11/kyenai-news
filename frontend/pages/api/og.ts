import type { NextApiRequest, NextApiResponse } from "next";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapTitle(title: string, maxLineLength = 28): string[] {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return ["KyenAI"];
  }

  const lines: string[] = [];
  let current = words[0];

  for (const word of words.slice(1)) {
    const candidate = `${current} ${word}`;
    if (candidate.length <= maxLineLength) {
      current = candidate;
      continue;
    }
    lines.push(current);
    current = word;
  }

  lines.push(current);
  return lines.slice(0, 3);
}

function buildOgSvg(title: string): string {
  const lines = wrapTitle(title);
  const lineElements = lines
    .map((line, index) => {
      const y = 250 + index * 72;
      return `<text x="600" y="${y}" font-family="system-ui,-apple-system,sans-serif" font-size="56" font-weight="700" fill="#f8fafc" text-anchor="middle" letter-spacing="-1">${escapeXml(line)}</text>`;
    })
    .join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0f172a"/>
  <rect x="0" y="0" width="4" height="630" fill="#3b82f6"/>
  ${lineElements}
  <text x="600" y="520" font-family="system-ui,-apple-system,sans-serif" font-size="24" fill="#94a3b8" text-anchor="middle">KyenAI · AI coding agent guides and evidence</text>
  <text x="600" y="560" font-family="system-ui,-apple-system,sans-serif" font-size="20" fill="#475569" text-anchor="middle">kyenai.com</text>
</svg>`;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const rawTitle = typeof req.query.title === "string" ? req.query.title : "KyenAI";
  const title = rawTitle.slice(0, 120);

  res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400");
  res.status(200).send(buildOgSvg(title));
}
