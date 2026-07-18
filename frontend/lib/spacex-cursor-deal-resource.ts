export const spacexCursorDealResource = {
  verifiedAt: "2026-07-19",
  statusCode: "signed_not_closed",
  statusLabel: "Signed; closing still pending",
  announcedAt: "2026-06-16",
  expectedClosingWindow: "Third quarter of 2026",
  buyer: "SpaceX",
  target: "Anysphere, maker of Cursor",
  impliedEquityValue: "$60 billion",
  consideration: "SpaceX Class A common stock",
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
    date: "2026-07-19",
    event: "KyenAI verification checkpoint: the latest cited filing still describes closing as pending.",
    evidence: "Official filing review; no closing claim inferred from product collaboration",
  },
] as const;

export const spacexCursorConfirmedFacts = [
  "A definitive merger agreement was signed on June 16, 2026.",
  "The transaction uses SpaceX Class A common stock and an implied Anysphere equity value of $60 billion.",
  "Closing remains subject to conditions, including required regulatory approvals.",
  "SpaceX said it expected the merger to close during the third quarter of 2026; it did not publish an exact closing date in the cited filing.",
] as const;

export const spacexCursorOpenQuestions = [
  "The exact closing date and completion of regulatory review",
  "Whether Cursor pricing or contractual terms will change after closing",
  "How model choice, data use, and subprocessors will evolve",
  "Whether product governance or enterprise controls will materially change",
] as const;

export const cursorChangeOfControlChecklist = [
  "Record the Cursor plans, versions, models, extensions, and workflows your team currently depends on.",
  "Archive the current terms, privacy notice, data-use terms, security materials, DPA, and subprocessor list that apply to your account.",
  "Ask legal or procurement owners to identify change-of-control, termination, export, retention, training, and audit clauses.",
  "Map which repositories, prompts, secrets, indexes, agents, and automation jobs depend on Cursor-specific behavior.",
  "Verify repository and instruction-file portability with a small alternative-agent pilot.",
  "Define decision triggers for pricing, model availability, data handling, support, or policy changes.",
  "Recheck official filings and vendor notices before treating the transaction as closed or changing production policy.",
] as const;
