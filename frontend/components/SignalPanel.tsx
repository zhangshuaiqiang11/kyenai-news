import { ArrowDown, ArrowUp } from "lucide-react";

import { searchSignals } from "../lib/seed";

export function SignalPanel() {
  return (
    <aside className="side-rail" aria-label="Search performance signals">
      <section className="panel">
        <div className="panel-heading">
          <h2>Search Performance Signals</h2>
          <span>7D</span>
        </div>
        <div className="signal-list">
          {searchSignals.map((signal) => (
            <div className="signal-item" key={signal.label}>
              <div>
                <strong>{signal.label}</strong>
                <span>{signal.source}</span>
              </div>
              <div className="signal-value">
                <b>{signal.value}</b>
                <span className={signal.direction === "up" ? "positive" : "negative"}>
                  {signal.direction === "up" ? <ArrowUp aria-hidden="true" size={14} /> : <ArrowDown aria-hidden="true" size={14} />}
                  {signal.change}
                </span>
              </div>
              <div className="sparkline" aria-hidden="true">
                <span style={{ width: signal.direction === "up" ? "72%" : "42%" }} />
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="panel">
        <div className="panel-heading">
          <h2>Trusted Source Updates</h2>
          <span>Live</span>
        </div>
        <ul className="source-updates">
          <li>
            <b>Google Search Central</b>
            <span>Structured data and AI search guidance watched daily.</span>
          </li>
          <li>
            <b>Bing Webmaster Blog</b>
            <span>IndexNow and AI citation signals tracked.</span>
          </li>
          <li>
            <b>IndexNow Docs</b>
            <span>URL submission protocol monitored for changes.</span>
          </li>
        </ul>
      </section>
      <section className="panel system-panel">
        <h2>System Status</h2>
        <p>All guardrails operational. Failed evidence checks skip publish and create an alert.</p>
      </section>
    </aside>
  );
}

