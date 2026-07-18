import {
  cursorChangeOfControlChecklist,
  spacexCursorConfirmedFacts,
  spacexCursorDealResource,
  spacexCursorDealTimeline,
  spacexCursorOpenQuestions,
} from "../lib/spacex-cursor-deal-resource";

export function SpacexCursorDealTracker() {
  const resource = spacexCursorDealResource;

  return (
    <section className="deal-tracker" aria-labelledby="deal-tracker-heading">
      <div className="deal-tracker-heading">
        <div>
          <p className="instruction-resource-eyebrow">Verified transaction status</p>
          <h2 id="deal-tracker-heading">Current SpaceX-Cursor deal status</h2>
          <p>
            SpaceX signed a definitive agreement to acquire Anysphere, but the cited SEC filing does not say the
            merger has closed. Product collaboration is evidence of collaboration—not proof that ownership has transferred.
          </p>
        </div>
        <span className="deal-status-badge" data-status={resource.statusCode}>{resource.statusLabel}</span>
      </div>

      <dl className="deal-status-grid">
        <div><dt>Agreement signed</dt><dd><time dateTime={resource.announcedAt}>June 16, 2026</time></dd></div>
        <div><dt>Verified through</dt><dd><time dateTime={resource.verifiedAt}>July 19, 2026</time></dd></div>
        <div><dt>Expected window</dt><dd>{resource.expectedClosingWindow}</dd></div>
        <div><dt>Deal value</dt><dd>{resource.impliedEquityValue}, all stock</dd></div>
      </dl>

      <div className="deal-downloads" aria-label="Deal status downloads and primary records">
        <a href={resource.downloads.json} download>Download status JSON</a>
        <a href={resource.downloads.csv} download>Download timeline CSV</a>
        <a href={resource.downloads.checklist} download>Download team checklist</a>
        <a href={resource.officialFilingUrl} rel="noreferrer" target="_blank">Read the SEC filing</a>
        <a href={resource.mergerAgreementUrl} rel="noreferrer" target="_blank">Read the merger agreement</a>
      </div>

      <div className="deal-evidence-columns">
        <section aria-labelledby="confirmed-facts-heading">
          <h3 id="confirmed-facts-heading">Confirmed</h3>
          <ul>{spacexCursorConfirmedFacts.map((fact) => <li key={fact}>{fact}</li>)}</ul>
        </section>
        <section aria-labelledby="open-questions-heading">
          <h3 id="open-questions-heading">Not confirmed</h3>
          <ul>{spacexCursorOpenQuestions.map((question) => <li key={question}>{question}</li>)}</ul>
        </section>
      </div>

      <section className="deal-timeline" aria-labelledby="deal-timeline-heading">
        <div>
          <h3 id="deal-timeline-heading">Evidence timeline</h3>
          <p>Each row separates a dated event from KyenAI&apos;s verification checkpoint.</p>
        </div>
        <ol>
          {spacexCursorDealTimeline.map((item) => (
            <li key={`${item.date}-${item.event}`}>
              <time dateTime={item.date}>{item.date}</time>
              <strong>{item.event}</strong>
              <span>{item.evidence}</span>
            </li>
          ))}
        </ol>
      </section>

      <details className="deal-review-checklist">
        <summary>Team change-of-control review checklist</summary>
        <ol>{cursorChangeOfControlChecklist.map((item) => <li key={item}>{item}</li>)}</ol>
        <p>This operational checklist is not legal advice. Route contract interpretation to qualified counsel.</p>
      </details>
    </section>
  );
}
