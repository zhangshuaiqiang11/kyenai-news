import { getVisibleGuideFaqs } from "./guide-faqs";
import { buildCanonicalUrl } from "./seo";
import type { Guide } from "./types";

function buildQuickAnswer(guide: Guide): string {
  const quickAnswerSection = guide.sections.find(
    (section) => section.heading.trim().toLowerCase() === "quick answer",
  );
  return quickAnswerSection?.body[0] ?? guide.summary;
}

function buildDecisionTableMarkdown(guide: Guide): string {
  const table = guide.decisionTable;
  const header = `| Area | ${table.columns.join(" | ")} |`;
  const separator = `| --- | ${table.columns.map(() => "---").join(" | ")} |`;
  const rows = table.rows.map(
    (row) => `| ${row.label} | ${row.values.join(" | ")} |`,
  );
  return [header, separator, ...rows].join("\n");
}

export function buildGuideMarkdown(guide: Guide): string {
  const canonical = buildCanonicalUrl(`/guides/${guide.slug}`);
  const quickAnswer = buildQuickAnswer(guide);
  const faqs = getVisibleGuideFaqs(guide);
  const lines: string[] = [];

  lines.push(`# ${guide.title}`, "");
  lines.push(guide.summary, "");

  lines.push("## Quick Answer", "", quickAnswer, "");

  lines.push("## Best for", "", guide.audience, "");

  lines.push("## Use this guide to", "", guide.intent, "");

  if (guide.resourceIds?.includes("instruction-adoption-report")) {
    const dataBase = "https://www.kyenai.com/resources/data/instruction-file-adoption-report-2026-q3";
    lines.push("## Dataset citation and verification", "");
    lines.push(
      "Preferred citation: KyenAI. (2026). AI Coding Agent Instruction File Adoption Report — Q3 2026 (Version 2026-Q3) [Data set]. https://www.kyenai.com/guides/ai-coding-agent-instruction-file-adoption-report-2026",
      "",
      "This release has no DOI. Preserve the snapshot date and best-match sampling limitation when citing percentages.",
      "",
      `- [Raw CSV](${dataBase}.csv)`,
      `- [JSON and methodology](${dataBase}.json)`,
      `- [BibTeX citation](${dataBase}-citation.bib)`,
      `- [Citation CFF](${dataBase}-citation.cff)`,
      `- [Reproducibility notes](${dataBase}-methodology.md)`,
      `- [Version and checksum manifest](${dataBase}-manifest.json)`,
      `- [SHA-256 checksums](${dataBase}-sha256.txt)`,
      `- [Published generator](${dataBase}-generator.mjs)`,
      "",
    );
  }

  lines.push("## Recommended play", "");
  guide.recommendedPlay.forEach((item, index) => {
    lines.push(`${index + 1}. ${item}`);
  });
  lines.push("");

  lines.push(`## ${guide.decisionTable.title}`, "", guide.decisionTable.intro, "");
  lines.push(buildDecisionTableMarkdown(guide), "");

  lines.push("## Execution steps", "");
  guide.actionSteps.forEach((step, index) => {
    lines.push(`${index + 1}. **${step.title}** — ${step.body}`);
  });
  lines.push("");

  lines.push("## Common pitfalls", "");
  guide.pitfalls.forEach((pitfall) => {
    lines.push(`- **${pitfall.title}**: ${pitfall.fix}`);
  });
  lines.push("");

  lines.push("## Implementation checklist", "");
  guide.checklist.forEach((item) => {
    lines.push(`- [ ] ${item}`);
  });
  lines.push("");

  lines.push("## FAQ", "");
  faqs.forEach((faq) => {
    lines.push(`**Q: ${faq.question}**`, "", faq.answer, "");
  });

  lines.push("## Evidence sources", "");
  guide.evidence.forEach((source) => {
    lines.push(`- [${source.title}](${source.url}) — ${source.publisher}. ${source.note}`);
  });
  lines.push("");

  if (guide.internalLinks.length > 0) {
    lines.push("## Related guides", "");
    guide.internalLinks.forEach((link) => {
      lines.push(`- [${link.anchor}](/guides/${link.slug}) — ${link.reason}`);
    });
    lines.push("");
  }

  lines.push("---", `Canonical: ${canonical}`, "");

  return lines.join("\n");
}
