# KyenAI Real-Backlink Outreach Playbook

Owner: KyenAI Founder  
Reply address: editorial@kyenai.com  
Last updated: 2026-07-30

This playbook is for earning editorially relevant citations to KyenAI's public research assets. It prohibits paid dofollow placement, automated bulk email, link exchanges, private blog networks, unrelated directories, and using GitHub issues as promotional surfaces.

## 1. Decide whether a website is worth contacting

Contact a site only when all of these are true:

1. It published or materially updated a relevant developer-tools, AI engineering, platform engineering, DevSecOps, or AI governance page within the last 12 months.
2. The target page is publicly reachable, indexable, written for a real audience, and not a scraped or mass-generated directory.
3. A KyenAI asset would add data, a reusable template, a security assessment, or a correction that the page does not already provide.
4. The site does not require payment for a dofollow link and is not part of a reciprocal-link network.
5. The audience and target page match one of the four campaigns in the private outreach ledger.

Record the exact target URL, publication date, author or editor route, recommended KyenAI asset, and one-sentence relevance proof before drafting outreach.

## 2. Find a legitimate author or editorial route

Use this order:

1. Named author profile or contact method on the target article.
2. Publication editorial, corrections, tips, newsletter, or contributor page.
3. A company press or content contact if the target is a vendor research blog.
4. A relevant public community submission form whose rules permit resources.

Do not guess email addresses, scrape personal data, or contact unrelated sales/support staff. If no legitimate route is visible, mark the row `contact-route-missing` and move on.

## 3. Prove relevance in one sentence

Use this structure:

> Your [specific article/section] covers [specific problem]; KyenAI's [named asset] adds [unique data/template/control] with [version/date/method], so it may be useful as a supporting resource for readers.

The sentence must mention something that appears on the recipient's page. Avoid generic praise and do not lead with a request for a backlink.

## 4. Send once and follow up once

- Work in batches of no more than 10 contacts.
- Obtain approval for the exact recipients and message text before sending.
- Send from `editorial@kyenai.com` and sign as `KyenAI Founder`.
- Personalize the subject, first sentence, and suggested asset.
- Ask whether the resource is useful; do not demand anchor text or a dofollow attribute.
- Follow up once after seven calendar days.
- If there is no reply after the follow-up, stop.

## 5. Handle link terms correctly

- Paid dofollow request: decline. Do not negotiate.
- Sponsored editorial opportunity: consider only with clear sponsorship disclosure and `rel="sponsored"`; do not count it as an earned editorial backlink.
- Nofollow link: accept if the page and audience are relevant. It can still drive qualified readers and discovery.
- Guest article: accept only when KyenAI can contribute original value and the publisher controls editorial review. Avoid exact-match anchor requirements and duplicated articles.
- Link exchange: decline systematic or conditional exchanges.

## 6. Verify an earned link

A link counts only after all checks pass:

1. The source URL returns HTTP 200 without an erroneous redirect.
2. The visible page contains a clickable link to the intended `https://www.kyenai.com/...` target.
3. Record the actual anchor text and `rel` attributes (`nofollow`, `sponsored`, `ugc`, or none).
4. The KyenAI target returns HTTP 200 and its canonical points to itself.
5. Record first-discovered and last-verified dates in the backlink registry.
6. Recheck monthly. If the page disappears, the link is removed, or the target changes, update the registry instead of continuing to count it.

Do not count an accepted pitch, unlinked brand mention, social post, unpublished draft, or submitted community post as an acquired backlink.

## 7. Measure in Google Search Console

For each target page:

1. Save the outreach start date.
2. Compare the page's clicks, impressions, CTR, and average position for the following 14 days against the previous 14 days.
3. Repeat with a 28-day comparison.
4. Review the query table for new non-brand queries and position changes, not only total clicks.
5. Annotate confirmed external-link discovery dates separately from on-page deployment dates.
6. Do not attribute every change to backlinks; Google updates, query mix, titles, internal links, and seasonality can move at the same time.

## Outreach templates

Each template is a draft. Replace every bracketed field and obtain approval before sending.

### A. Research citation

Subject: Source-backed dataset for your [topic] coverage

Hi [Name],

Your article on [specific article point] discusses [topic]. KyenAI has published a versioned 400-file GitHub instruction-file dataset with raw CSV/JSON, methodology, BibTeX, CFF, manifest, and SHA-256 checksums:

[canonical asset URL]

The sample covers the first 100 readable best matches for AGENTS.md, CLAUDE.md, Copilot instruction files, and Cursor rules. It is explicitly not presented as a GitHub-wide adoption rate. If the data is useful for a future update or source list, the canonical page has the citation and limitations.

Best,  
KyenAI Founder  
editorial@kyenai.com

### B. Resource-page addition

Subject: Reusable [template/checklist] for your [resource page]

Hi [Name],

Your [page title] helps readers with [specific task]. KyenAI's [asset name] adds a downloadable [runbook/checklist/template pack] with [specific differentiator], version and license:

[canonical asset URL]

It may be useful as a practical companion resource. No reciprocal link or paid placement is requested; I am sending it because it directly covers the gap in [specific section].

Best,  
KyenAI Founder  
editorial@kyenai.com

### C. Data correction or addition

Subject: Source update for [article title]

Hi [Name],

I noticed the section on [specific statement]. The current primary record says [brief factual correction or added nuance]. KyenAI maintains a dated status dataset that separates signed-agreement evidence from legal closing and product collaboration:

[canonical asset URL]

The page links the SEC filing and publishes its timeline as JSON and CSV. I hope this is useful for a correction or future update; the key point is [one-sentence correction].

Best,  
KyenAI Founder  
editorial@kyenai.com

### D. Newsletter submission

Subject: Submission: [asset title] — [one-line reader benefit]

Hi [Name],

For [newsletter name]'s readers, KyenAI has released [asset title], a [dataset/runbook/security assessment/template pack] for [audience outcome]:

[canonical asset URL]

Why it may fit:

- [unique point 1]
- [unique point 2]
- Version [version], verified [date], with [license/method]

Suggested one-line description: “[neutral 20–30 word description].”

Best,  
KyenAI Founder  
editorial@kyenai.com

## One permitted follow-up

Subject: Re: [original subject]

Hi [Name],

One quick follow-up in case the [asset type] is useful for your [article/newsletter/resource page]. The canonical page is [URL], and the most relevant part for your readers is [specific value].

No reply is needed if it is not a fit; I will not follow up again.

Best,  
KyenAI Founder  
editorial@kyenai.com
