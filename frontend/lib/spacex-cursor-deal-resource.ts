export const spacexCursorDealResource = {
  schemaVersion: "1.2",
  verifiedAt: "2026-09-12",
  statusCode: "closed",
  statusLabel: "Closed on August 14, 2026",
  announcedAt: "2026-06-16",
  closingDate: "2026-08-14",
  expectedClosingWindow: "Completed August 14, 2026",
  nextMilestone: "Monitor post-close Cursor product, privacy, model, and enterprise contract changes",
  license: "CC BY 4.0",
  preferredCitation:
    "KyenAI. (2026). SpaceX-Cursor Deal Status Timeline (Version 1.2, verified September 12, 2026) [Data set]. https://www.kyenai.com/articles/spacex-cursor-acquisition-2026",
  buyer: "SpaceX",
  target: "Anysphere, maker of Cursor",
  impliedEquityValue: "$60 billion",
  consideration: "SpaceX Class A common stock",
  completionFilingUrl:
    "https://www.sec.gov/Archives/edgar/data/1181412/000162828026056945/spcx-20260814.htm",
  officialFilingUrl:
    "https://www.sec.gov/Archives/edgar/data/1181412/000162828026043411/spaceexplorationtechnologi.htm",
  mergerAgreementUrl:
    "https://www.sec.gov/Archives/edgar/data/1181412/000162828026043411/exhibit101-8xk.htm",
  cursorUpdateUrl: "https://cursor.com/blog/grok-4-5",
  downloads: {
    json: "/resources/data/spacex-cursor-deal-status.json",
    csv: "/resources/data/spacex-cursor-deal-timeline.csv",
    checklist: "/resources/cursor-change-of-control-review.md",
  },
} as const;

export const spacexCursorDealTimeline = [
  {
    date: "2026-04-19",
    event: "SpaceX and Cursor enter a compute agreement; public filings also describe a separate acquisition option.",
    evidence: "SpaceX prospectus and June Form 8-K",
  },
  {
    date: "2026-06-16",
    event: "SpaceX, X67 Inc., and Anysphere sign the definitive merger agreement.",
    evidence: "SpaceX Form 8-K and merger agreement",
  },
  {
    date: "2026-07-08",
    event: "Cursor publishes Grok 4.5, described as jointly trained with SpaceXAI.",
    evidence: "Cursor product and research announcement",
  },
  {
    date: "2026-08-14",
    event: "The merger becomes effective and Cursor becomes a wholly owned subsidiary of SpaceX.",
    evidence: "SpaceX Form 8-K: Item 2.01 completion of acquisition",
  },
  {
    date: "2026-09-12",
    event: "KyenAI verification checkpoint: the August 14 completion filing remains the controlling legal status record.",
    evidence: "SEC completion filing reviewed September 12, 2026",
  },
] as const;

export const spacexCursorConfirmedFacts = [
  "A definitive merger agreement was signed on June 16, 2026.",
  "The transaction uses SpaceX Class A common stock and an implied Anysphere equity value of $60 billion.",
  "The merger became effective on August 14, 2026.",
  "Cursor survived the merger as a wholly owned subsidiary of SpaceX.",
] as const;

export const spacexCursorOpenQuestions = [
  "Whether Cursor pricing or contractual terms will change after closing",
  "How model choice, data use, and subprocessors will evolve",
  "Whether product governance or enterprise controls will materially change",
  "How the ownership change affects model-provider relationships and portability",
] as const;

export const cursorChangeOfControlChecklist = [
  "Record the Cursor plans, versions, models, extensions, and workflows your team currently depends on.",
  "Archive the current terms, privacy notice, data-use terms, security materials, DPA, and subprocessor list that apply to your account.",
  "Ask legal or procurement owners to identify change-of-control, termination, export, retention, training, and audit clauses.",
  "Map which repositories, prompts, secrets, indexes, agents, and automation jobs depend on Cursor-specific behavior.",
  "Verify repository and instruction-file portability with a small alternative-agent pilot.",
  "Define decision triggers for pricing, model availability, data handling, support, or policy changes.",
  "Recheck official filings and vendor notices before changing production policy after the closing.",
] as const;
