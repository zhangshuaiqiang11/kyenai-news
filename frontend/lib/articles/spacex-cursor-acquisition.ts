import type { Article } from "../types";

const sourceIds = {
  sec: "src-spacex-cursor-sec-8k",
  reuters: "src-spacex-cursor-reuters",
  axios: "src-spacex-cursor-axios",
  ft: "src-spacex-cursor-ft",
} as const;

export const spacexCursorAcquisitionArticle: Article = {
  id: "article-spacex-cursor-acquisition",
  title: "SpaceX Cursor Acquisition: Deal Status, Timeline, and Developer Impact",
  slug: "spacex-cursor-acquisition-2026",
  summary:
    "SpaceX signed a $60 billion all-stock agreement to acquire Cursor maker Anysphere. The deal is not closed yet; here is the status, expected Q3 2026 timeline, and what developers should watch.",
  category: "AI Coding Agents",
  tags: ["spacex", "cursor", "anysphere", "acquisition", "ai-coding-market"],
  authorName: "Editorial Automation Desk",
  status: "published",
  keywords: [
    "SpaceX Cursor acquisition",
    "Anysphere acquisition",
    "Cursor acquisition 2026",
    "AI coding market",
    "all-stock acquisition",
  ],
  entityIds: ["spacex", "anysphere", "cursor", "xai", "grok"],
  blocks: [
    {
      id: "deal-status-heading",
      type: "heading",
      content: "Deal Status: Signed, Not Yet Closed",
      sourceIds: [sourceIds.sec, sourceIds.reuters, sourceIds.axios],
    },
    {
      id: "deal-status-summary",
      type: "paragraph",
      content:
        "On June 16, 2026, SpaceX exercised its option to acquire Anysphere, the company behind the Cursor AI coding editor, and entered into a $60 billion all-stock transaction. The precise status matters for searchers and Cursor users: this is a signed merger agreement, not a completed closing. SpaceX's Form 8-K says the merger remains subject to closing conditions, including regulatory approvals, and that the company currently expects closing in the third quarter of 2026. Axios described the purchase as an exercise of the call option disclosed earlier in the year.",
      sourceIds: [sourceIds.sec, sourceIds.reuters, sourceIds.axios],
    },
    {
      id: "deal-terms-table",
      type: "fact_table",
      content: [
        "Term|Confirmed detail",
        "Announcement date|June 16, 2026",
        "Buyer|SpaceX",
        "Target|Anysphere, developer of Cursor",
        "Implied value|$60 billion",
        "Consideration|SpaceX shares in an all-stock transaction",
        "Current status|Definitive agreement signed; closing still pending",
        "Expected closing|Third quarter of 2026",
        "Earlier arrangement|SpaceX received an acquisition option through an April 2026 partnership",
      ].join("\n"),
      sourceIds: [sourceIds.sec, sourceIds.reuters, sourceIds.axios, sourceIds.ft],
    },
    {
      id: "timeline-heading",
      type: "heading",
      content: "How the Deal Reached This Point",
      sourceIds: [sourceIds.reuters, sourceIds.axios],
    },
    {
      id: "timeline-body",
      type: "paragraph",
      content:
        "The acquisition did not appear from nowhere on June 16. SpaceX and Cursor disclosed a partnership in April 2026 that combined compute and model-training work with an option for SpaceX to acquire Anysphere for $60 billion. The June Form 8-K converted that earlier option into a signed all-stock merger agreement. This sequence is important because it shows that technical cooperation came before corporate control: the companies were already working together before SpaceX committed to the acquisition structure.",
      sourceIds: [sourceIds.sec, sourceIds.reuters, sourceIds.axios],
    },
    {
      id: "what-buying-heading",
      type: "heading",
      content: "What SpaceX Is Actually Buying",
      sourceIds: [sourceIds.reuters, sourceIds.ft],
    },
    {
      id: "what-buying-body-1",
      type: "paragraph",
      content:
        "Calling Cursor only a code editor understates the asset. Anysphere has built a distribution channel into the daily workflow of professional developers, a fast-growing enterprise software business, and a large stream of coding interactions that can inform model development. Reuters framed the acquisition as a way for SpaceX to strengthen its position in enterprise AI tools and improve the coding capabilities connected to Grok. The Financial Times similarly treated the deal as an expansion of SpaceX's AI ambitions rather than a conventional aerospace acquisition.",
      sourceIds: [sourceIds.reuters, sourceIds.ft],
    },
    {
      id: "what-buying-body-2",
      type: "paragraph",
      content:
        "KyenAI's interpretation is that SpaceX is buying three connected advantages: developer distribution, an application layer with proven business demand, and a tighter feedback loop between compute, models, and real coding work. That conclusion is an inference from the disclosed strategy and deal structure, not a claim that every Cursor interaction will automatically become training data. Data use, customer contracts, and enterprise controls still depend on the policies that survive or change after closing.",
      sourceIds: [sourceIds.reuters, sourceIds.ft],
    },
    {
      id: "stock-heading",
      type: "heading",
      content: "Why the All-Stock Structure Matters",
      sourceIds: [sourceIds.reuters, sourceIds.axios, sourceIds.ft],
    },
    {
      id: "stock-body",
      type: "paragraph",
      content:
        "An all-stock transaction lets SpaceX use its own market value instead of committing $60 billion in cash. The Form 8-K says Cursor common and preferred stock will convert into the right to receive SpaceX Class A common stock, using an implied Cursor equity value of $60.0 billion and a SpaceX stock price based on a seven-trading-day volume-weighted average before closing. The trade-off is dilution: existing SpaceX shareholders give up a portion of future ownership, and Anysphere investors become exposed to SpaceX's broader execution and valuation risks.",
      sourceIds: [sourceIds.sec, sourceIds.reuters, sourceIds.axios, sourceIds.ft],
    },
    {
      id: "user-impact-heading",
      type: "heading",
      content: "What the Agreement Means for Cursor Users",
      sourceIds: [sourceIds.reuters],
    },
    {
      id: "user-impact-body",
      type: "paragraph",
      content:
        "The signed agreement does not by itself prove that Cursor pricing, model choice, privacy terms, or product behavior will change immediately. The clearest strategic direction is deeper cooperation around coding models and Grok, but the practical user questions remain open: whether Cursor stays model-flexible, how enterprise data boundaries are handled, which infrastructure powers future releases, and whether product priorities shift toward the wider SpaceX and xAI ecosystem. Teams should treat the acquisition as a change-of-control signal and review contracts, data-processing terms, export options, and model dependencies before making long-term platform commitments.",
      sourceIds: [sourceIds.reuters],
    },
    {
      id: "kyenai-view-heading",
      type: "heading",
      content: "KyenAI View: The AI Coding Market Is Consolidating Around Full Stacks",
      sourceIds: [sourceIds.reuters, sourceIds.ft],
    },
    {
      id: "kyenai-view-body-1",
      type: "paragraph",
      content:
        "The competitive lesson is larger than one acquisition. AI coding products are becoming difficult to separate from the companies that supply models, compute, distribution, identity, and enterprise contracts. SpaceX can offer Cursor access to capital and infrastructure; Cursor can offer SpaceX an application with direct developer adoption. That combination may accelerate product development, but it can also reduce the independence that made Cursor useful as a neutral layer across several model providers.",
      sourceIds: [sourceIds.reuters, sourceIds.ft],
    },
    {
      id: "kyenai-view-body-2",
      type: "paragraph",
      content:
        "For engineering leaders, the rational response is not an immediate migration or a blind vote of confidence. The better response is to measure concentration risk. Record which workflows depend on Cursor-specific behavior, confirm that repositories and prompts remain portable, keep alternative coding agents testable, and ask vendors how a change of control affects retention, training, subprocessors, and contractual commitments. A stronger product is possible after the deal, but stronger dependency is possible too. Human beings have once again discovered that convenience and leverage arrive in the same box.",
      sourceIds: [sourceIds.reuters, sourceIds.ft],
    },
    {
      id: "watch-heading",
      type: "heading",
      content: "What to Watch Before the Transaction Closes",
      sourceIds: [sourceIds.reuters, sourceIds.axios, sourceIds.ft],
    },
    {
      id: "watch-table",
      type: "fact_table",
      content: [
        "Watch item|Why it matters",
        "Regulatory review|The transaction is signed but cannot be treated as complete until closing conditions are satisfied",
        "Model strategy|Cursor's future balance between Grok and third-party models will affect product neutrality",
        "Enterprise data terms|Customers need clarity on retention, training, subprocessors, and change-of-control rights",
        "Product roadmap|Integration may improve compute access while redirecting engineering priorities",
        "Leadership and governance|Control changes can alter decision rights even when the product brand remains",
        "Portability|Teams should preserve the ability to move instructions, workflows, and repository context to another agent",
      ].join("\n"),
      sourceIds: [sourceIds.reuters, sourceIds.axios, sourceIds.ft],
    },
    {
      id: "faq-completed",
      type: "faq",
      content:
        "Has SpaceX completed its acquisition of Cursor?\nNo. SpaceX has exercised its option and signed the acquisition agreement, but the transaction is still pending closing. The expected closing window is the third quarter of 2026.",
      sourceIds: [sourceIds.sec, sourceIds.reuters, sourceIds.axios],
    },
    {
      id: "faq-all-stock",
      type: "faq",
      content:
        "Is the SpaceX-Cursor transaction an all-stock deal?\nYes. The disclosed consideration is SpaceX stock rather than a $60 billion cash payment.",
      sourceIds: [sourceIds.sec, sourceIds.reuters, sourceIds.axios, sourceIds.ft],
    },
    {
      id: "faq-price",
      type: "faq",
      content:
        "How much is SpaceX paying for Anysphere?\nThe announced transaction values Anysphere, the company behind Cursor, at approximately $60 billion.",
      sourceIds: [sourceIds.reuters, sourceIds.axios],
    },
    {
      id: "faq-close-date",
      type: "faq",
      content:
        "When will the Cursor acquisition close?\nSpaceX expects the transaction to close in the third quarter of 2026, but no exact closing date has been announced.",
      sourceIds: [sourceIds.sec, sourceIds.reuters],
    },
    {
      id: "faq-users",
      type: "faq",
      content:
        "Will Cursor immediately change for users?\nThe agreement does not establish an immediate product, pricing, or privacy change. Users and enterprise buyers should monitor post-signing announcements and updated contractual terms rather than assume either continuity or disruption.",
      sourceIds: [sourceIds.reuters, sourceIds.ft],
    },
    {
      id: "source-boundary",
      type: "source_note",
      content:
        "Evidence boundary: the confirmed facts on this page are the signed $60 billion all-stock merger agreement, the earlier acquisition option, and the expected Q3 2026 closing window. Product-roadmap, data-governance, and competitive implications are explicitly presented as analysis. Sources include SpaceX's Form 8-K, Reuters, Axios, and the Financial Times, all published or filed on June 16, 2026.",
      sourceIds: [sourceIds.sec, sourceIds.reuters, sourceIds.axios, sourceIds.ft],
    },
  ],
  sources: [
    {
      id: sourceIds.sec,
      title: "Space Exploration Technologies Corp. Form 8-K",
      url: "https://www.sec.gov/Archives/edgar/data/1181412/000162828026043411/spaceexplorationtechnologi.htm",
      publisher: "SEC",
      publishedAt: "2026-06-16",
      credibility: 5,
    },
    {
      id: sourceIds.reuters,
      title: "SpaceX locks in $60 billion Cursor deal to close gap with rivals in AI coding race",
      url: "https://www.reuters.com/legal/transactional/spacex-buy-anysphere-60-billion-2026-06-16/",
      publisher: "Reuters",
      publishedAt: "2026-06-16",
      credibility: 5,
    },
    {
      id: sourceIds.axios,
      title: "SpaceX will buy Cursor for $60 billion",
      url: "https://www.axios.com/2026/06/16/spacex-cursor-60-billion-musk",
      publisher: "Axios",
      publishedAt: "2026-06-16",
      credibility: 5,
    },
    {
      id: sourceIds.ft,
      title: "SpaceX leapfrogs Amazon to become world's fifth-most valuable company",
      url: "https://www.ft.com/content/17153f13-b0c8-4331-8f97-32a19a5e966e",
      publisher: "Financial Times",
      publishedAt: "2026-06-16",
      credibility: 5,
    },
  ],
  publishedAt: "2026-06-16T10:35:00Z",
  updatedAt: "2026-06-25",
  version: 3,
  metaTitle: "SpaceX Cursor Acquisition: Deal Status, Timeline, Developer Impact",
  metaDescription:
    "SpaceX Cursor acquisition explained: signed $60B all-stock deal, Q3 2026 closing status, timeline, and what Cursor users should watch.",
};

export const featuredArticles: Article[] = [spacexCursorAcquisitionArticle];
