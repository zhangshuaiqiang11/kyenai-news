import React from "react";

import report from "../lib/data/instruction-file-adoption-report-2026-q3.json";

const number = new Intl.NumberFormat("en-US");
const dataBase = "/resources/data/instruction-file-adoption-report-2026-q3";
const preferredCitation = "KyenAI. (2026). AI Coding Agent Instruction File Adoption Report — Q3 2026 (Version 2026-Q3) [Data set]. https://www.kyenai.com/guides/ai-coding-agent-instruction-file-adoption-report-2026";

function githubSearchUrl(query: string) {
  return `https://github.com/search?q=${encodeURIComponent(query)}&type=code`;
}

export function InstructionAdoptionReport() {
  return (
    <div className="guide-resource-sections">
      <section className="instruction-resource-section" aria-labelledby="adoption-report-heading">
        <div className="instruction-resource-heading">
          <div>
            <p className="instruction-resource-eyebrow">Original public GitHub dataset · {report.snapshotDate}</p>
            <h2 id="adoption-report-heading">Instruction-file adoption snapshot</h2>
          </div>
          <p>
            {number.format(report.methodology.sampledFiles)} public files across {report.methodology.queryCount} searches;
            raw rows and detected signals are downloadable below.
          </p>
        </div>
        <div className="instruction-direct-answer">
          <strong>What this dataset can—and cannot—show</strong>
          <p>
            GitHub indexed {number.format(report.querySummaries[0].githubFileMatches)} files matching <code>AGENTS.md</code>
            when this snapshot was collected. That is a file-match count, not a count of adopting repositories. The content analysis
            uses GitHub&apos;s first 100 best matches per query, so percentages describe this sample only—not GitHub as a whole.
          </p>
        </div>
        <div className="mcp-download-links" aria-label="Download the instruction-file adoption report data">
          <a href={`${dataBase}.csv`} download>Download raw CSV</a>
          <a href={`${dataBase}.json`} download>Download JSON + methodology</a>
        </div>
      </section>

      <section className="instruction-resource-section" aria-labelledby="adoption-citation-heading">
        <div className="instruction-resource-heading">
          <div>
            <p className="instruction-resource-eyebrow">Stable citation · version 2026-Q3</p>
            <h2 id="adoption-citation-heading">Cite, verify, and reproduce this dataset</h2>
          </div>
          <p>Use the canonical report URL as the identifier; this release has no DOI.</p>
        </div>
        <figure className="adoption-citation-card">
          <blockquote>{preferredCitation}</blockquote>
          <figcaption>Preferred citation; keep the snapshot date and best-match sampling limitation with quoted percentages.</figcaption>
        </figure>
        <div className="mcp-download-links" aria-label="Download citation and reproducibility files">
          <a href={`${dataBase}-citation.bib`} download>Download BibTeX</a>
          <a href={`${dataBase}-citation.cff`} download>Download Citation CFF</a>
          <a href={`${dataBase}-methodology.md`} download>Read reproducibility notes</a>
          <a href={`${dataBase}-manifest.json`} download>Download manifest</a>
          <a href={`${dataBase}-sha256.txt`} download>Verify SHA-256</a>
          <a href={`${dataBase}-generator.mjs`} download>Download generator</a>
        </div>
      </section>

      <section className="instruction-resource-section" aria-labelledby="adoption-file-matches-heading">
        <div className="instruction-resource-heading">
          <div>
            <p className="instruction-resource-eyebrow">Four distinct code-search queries</p>
            <h2 id="adoption-file-matches-heading">Indexed matches and analyzed samples</h2>
          </div>
        </div>
        <div className="instruction-table-scroll">
          <table aria-label="GitHub instruction file match and sample counts">
            <thead>
              <tr>
                <th scope="col">Instruction file</th>
                <th scope="col">GitHub file matches</th>
                <th scope="col">Files analyzed</th>
                <th scope="col">Unique sampled repos</th>
                <th scope="col">Nested-file share</th>
              </tr>
            </thead>
            <tbody>
              {report.querySummaries.map((summary) => (
                <tr key={summary.id}>
                  <th scope="row" data-label="Instruction file">
                    <a href={githubSearchUrl(summary.query)} rel="noreferrer">{summary.label}</a>
                    <small><code>{summary.query}</code></small>
                  </th>
                  <td data-label="GitHub file matches">{number.format(summary.githubFileMatches)}</td>
                  <td data-label="Files analyzed">{summary.sampledFiles}</td>
                  <td data-label="Unique sampled repos">{summary.uniqueSampledRepositories}</td>
                  <td data-label="Nested-file share">{summary.nestedFileSharePct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="instruction-resource-section" aria-labelledby="adoption-content-signals-heading">
        <div className="instruction-resource-heading">
          <div>
            <p className="instruction-resource-eyebrow">Content analysis of readable files</p>
            <h2 id="adoption-content-signals-heading">Tests, security rules, and common gaps</h2>
          </div>
          <p>Each percentage uses the 100 readable files in that row as its denominator.</p>
        </div>
        <div className="adoption-signal-grid">
          {report.querySummaries.map((summary) => (
            <article key={summary.id}>
              <h3>{summary.label}</h3>
              <dl>
                <div>
                  <dt>Top language</dt>
                  <dd>{summary.topLanguages[0]?.label} ({summary.topLanguages[0]?.sharePct}%)</dd>
                </div>
                <div>
                  <dt>Most common test command</dt>
                  <dd>{summary.commonTestCommands[0]?.label || "None detected"} ({summary.commonTestCommands[0]?.sharePct || 0}%)</dd>
                </div>
                <div>
                  <dt>Most common security rule</dt>
                  <dd>{summary.commonSecurityRules[0]?.label || "None detected"} ({summary.commonSecurityRules[0]?.sharePct || 0}%)</dd>
                </div>
                <div>
                  <dt>Most common missing configuration</dt>
                  <dd>{summary.commonMissingConfigurations[0]?.label} ({summary.commonMissingConfigurations[0]?.sharePct}%)</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="instruction-resource-section" aria-labelledby="adoption-method-heading">
        <div className="instruction-resource-heading">
          <div>
            <p className="instruction-resource-eyebrow">Reproducible and bounded</p>
            <h2 id="adoption-method-heading">Methodology and limitations</h2>
          </div>
        </div>
        <ol className="adoption-method-list">
          <li>Ran the four displayed queries through the GitHub REST code-search endpoint on {report.snapshotDate}.</li>
          <li>Kept the first {report.methodology.sampleSizePerQuery} best-match files per query and counted unique repositories inside each sample.</li>
          <li>Fetched public file text and repository metadata, then detected explicit command and policy patterns with the <a href={`${dataBase}-generator.mjs`} download>published generator</a>.</li>
          <li>Deduplicated only exact repository/path pairs within a query; one repository may appear in different query samples.</li>
        </ol>
        <ul className="adoption-limitations">
          {report.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}
        </ul>
        <p className="adoption-source-note">
          Source: <a href="https://docs.github.com/en/rest/search/search?apiVersion=2022-11-28#search-code">GitHub REST API code search documentation</a>.
          Detection reports visible text patterns; it does not evaluate whether an instruction is correct, current, or followed by an agent.
        </p>
      </section>
    </div>
  );
}
