import type { Article } from "../types";

const sourceIds = {
  sec: "src-spacex-cursor-sec-8k",
  secClosing: "src-spacex-cursor-sec-closing-8k",
  cursor: "src-cursor-grok-4-5",
  reuters: "src-spacex-cursor-reuters",
  axios: "src-spacex-cursor-axios",
  ft: "src-spacex-cursor-ft",
} as const;

export const spacexCursorAcquisitionArticle: Article = {
  id: "article-spacex-cursor-acquisition",
  title: "Did SpaceX Buy Cursor? $60B Deal Status and Timeline",
  slug: "spacex-cursor-acquisition-2026",
  summary:
    "Yes. SpaceX completed its $60 billion all-stock acquisition of Anysphere, the company behind Cursor, on August 14, 2026. Track the official closing record, post-close changes, and what Cursor users should review.",
  category: "AI Coding Agents",
  tags: ["spacex", "cursor", "anysphere", "acquisition", "ai-coding-market"],
  authorName: "Editorial Automation Desk",
  status: "published",
  keywords: [
    "SpaceX Cursor acquisition",
    "did SpaceX buy Cursor",
    "is Cursor owned by SpaceX",
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
      content: "Deal Status: Closed on August 14, 2026",
      sourceIds: [sourceIds.sec, sourceIds.secClosing, sourceIds.reuters, sourceIds.axios],
    },
    {
      id: "deal-status-summary",
      type: "paragraph",
      content:
        "On June 16, 2026, SpaceX exercised its option to acquire Anysphere, the company behind the Cursor AI coding editor, and entered into a $60 billion all-stock transaction. SpaceX's August 14, 2026 Form 8-K now confirms that the merger became effective on August 14 and that Cursor became a wholly owned subsidiary of SpaceX. The earlier filing and reporting explain the transaction terms; the later completion filing controls the current status.",
      sourceIds: [sourceIds.sec, sourceIds.secClosing, sourceIds.reuters, sourceIds.axios],
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
        "Current status|Merger completed; Cursor is a wholly owned SpaceX subsidiary",
        "Closing date|August 14, 2026",
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
      id: "post-signing-update-heading",
      type: "heading",
      content: "What Changed After the Agreement Was Signed",
      sourceIds: [sourceIds.cursor, sourceIds.sec],
    },
    {
      id: "post-signing-update-body",
      type: "paragraph",
      content:
        "On July 8, Cursor released Grok 4.5 and said it had trained the model jointly with SpaceXAI using a broad mix that included Cursor developer-agent interaction data. The August 14 SEC filing then confirmed the legal closing. The product announcement still does not establish that every customer input is used for training; teams should rely on the current terms, data-use controls, and contracts that apply to their own account.",
      sourceIds: [sourceIds.cursor, sourceIds.sec, sourceIds.secClosing],
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
      sourceIds: [sourceIds.sec, sourceIds.cursor, sourceIds.reuters],
    },
    {
      id: "user-impact-body",
      type: "paragraph",
      content:
        "The acquisition is now complete, but the closing filing does not by itself prove that Cursor pricing, model choice, privacy terms, or product behavior have changed. The practical user questions are now post-close questions: whether Cursor stays model-flexible, how enterprise data boundaries are handled, which infrastructure powers future releases, and whether product priorities shift toward the wider SpaceX and xAI ecosystem. Teams should review contracts, data-processing terms, export options, and model dependencies before making long-term platform commitments.",
      sourceIds: [sourceIds.sec, sourceIds.secClosing, sourceIds.cursor, sourceIds.reuters],
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
      content: "What Cursor Users Should Watch After Closing",
      sourceIds: [sourceIds.secClosing, sourceIds.reuters, sourceIds.axios, sourceIds.ft],
    },
    {
      id: "watch-table",
      type: "fact_table",
      content: [
        "Watch item|Why it matters",
        "Ownership and governance|The SEC filing confirms Cursor became a wholly owned SpaceX subsidiary on August 14, 2026",
        "Model strategy|Cursor's future balance between Grok and third-party models will affect product neutrality",
        "Enterprise data terms|Customers need clarity on retention, training, subprocessors, and post-close contract rights",
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
        "Has SpaceX completed its acquisition of Cursor?\nYes. SpaceX's August 14, 2026 Form 8-K says the merger became effective on August 14, 2026, and that Cursor became a wholly owned subsidiary of SpaceX.",
      sourceIds: [sourceIds.secClosing, sourceIds.sec, sourceIds.reuters, sourceIds.axios],
    },
    {
      id: "faq-all-stock",
      type: "faq",
      content:
        "Is the SpaceX-Cursor transaction an all-stock deal?\nYes. The disclosed consideration is SpaceX stock rather than a $60 billion cash payment.",
      sourceIds: [sourceIds.sec, sourceIds.reuters, sourceIds.axios, sourceIds.ft],
    },
    {
      id: "faq-owner",
      type: "faq",
      content:
        "Does SpaceX own Cursor now?\nYes. The August 14, 2026 completion filing says Cursor survived the merger as a wholly owned subsidiary of SpaceX. Product collaboration was earlier evidence of cooperation; the completion filing is the evidence of legal ownership.",
      sourceIds: [sourceIds.secClosing, sourceIds.cursor],
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
        "When did the Cursor acquisition close?\nThe merger became effective on August 14, 2026, according to SpaceX's Form 8-K filed on that date.",
      sourceIds: [sourceIds.secClosing, sourceIds.sec],
    },
    {
      id: "faq-users",
      type: "faq",
      content:
        "Will Cursor immediately change for users?\nThe completion filing confirms the ownership change but does not by itself establish immediate product, pricing, or privacy changes. Users and enterprise buyers should monitor post-close announcements and updated contractual terms rather than assume either continuity or disruption.",
      sourceIds: [sourceIds.secClosing, sourceIds.reuters, sourceIds.ft],
    },
    {
      id: "source-boundary",
      type: "source_note",
      content:
        "Evidence boundary: the confirmed transaction facts are the signed $60 billion all-stock merger agreement, the August 14, 2026 effective time, and Cursor's status as a wholly owned SpaceX subsidiary. Cursor's July 8 Grok 4.5 announcement is product-collaboration evidence, while the August 14 SEC filing is the legal closing record. Product-roadmap, data-governance, pricing, and post-close contract implications beyond those records remain unconfirmed or are explicitly presented as analysis.",
      sourceIds: [sourceIds.sec, sourceIds.secClosing, sourceIds.cursor, sourceIds.reuters, sourceIds.axios, sourceIds.ft],
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
      verifiedAt: "2026-09-12",
      verificationConclusion: "The June filing documents the signed transaction and its original closing conditions; it is superseded for current closing status by the August 14 completion filing.",
      verificationChangeNote: "Kept as historical agreement evidence; added the August 14 completion filing as the current legal status source.",
    },
    {
      id: sourceIds.secClosing,
      title: "Space Exploration Technologies Corp. Form 8-K: Completion of Acquisition",
      url: "https://www.sec.gov/Archives/edgar/data/1181412/000162828026056945/spcx-20260814.htm",
      publisher: "SEC",
      publishedAt: "2026-08-14",
      credibility: 5,
      verifiedAt: "2026-09-12",
      verificationConclusion: "The filing states that the merger became effective on August 14, 2026 and Cursor became a wholly owned subsidiary of SpaceX.",
      verificationChangeNote: "Replaced the pending-closing status with the confirmed completion status.",
    },
    {
      id: sourceIds.cursor,
      title: "Introducing Grok 4.5",
      url: "https://cursor.com/blog/grok-4-5",
      publisher: "Cursor",
      publishedAt: "2026-07-08",
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
  updatedAt: "2026-09-12",
  version: 6,
  metaTitle: "Did SpaceX Buy Cursor? $60B Deal Closed",
  metaDescription:
    "Yes. SpaceX completed its $60B all-stock acquisition of Cursor maker Anysphere on August 14, 2026. Read the SEC completion filing, timeline, user impact, and source-linked data.",
};

export const featuredArticles: Article[] = [spacexCursorAcquisitionArticle];
