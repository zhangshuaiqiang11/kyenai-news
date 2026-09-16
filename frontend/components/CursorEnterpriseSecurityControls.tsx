import {
  cursorEnterpriseResponsibilityMatrix,
  cursorEnterpriseSecurityControls,
  cursorEnterpriseSecurityDownloads,
  cursorEnterpriseSecurityRisk,
  cursorEnterpriseSecurityVerifiedAt,
  cursorEnterpriseSecurityVersion,
} from "../lib/cursor-enterprise-security-resource";
import { ARTICLE_REVIEW_OWNER } from "../lib/reviewer";

export function CursorEnterpriseSecurityControls() {
  return (
    <section className="instruction-resource-section" aria-labelledby="cursor-security-controls-heading">
      <div className="instruction-resource-heading">
        <div>
          <p className="instruction-resource-eyebrow">30-control enterprise assessment · v{cursorEnterpriseSecurityVersion}</p>
          <h2 id="cursor-security-controls-heading">Cursor Enterprise administrator security checklist</h2>
        </div>
        <p>Official public claims are separated from KyenAI recommendations; account-specific unknowns require contract or console verification.</p>
      </div>
      <div className="instruction-direct-answer">
        <strong>Start with the connected control chain</strong>
        <p>Enforce identity and Privacy Mode, restrict repositories/models/MCPs, constrain agent execution with sandbox and hooks, export audit evidence, then verify retention and incident terms in the signed agreement.</p>
      </div>
      <aside className="resource-citation-note" aria-label="Human review and testing boundary">
        <strong>Human review owner: <a href={ARTICLE_REVIEW_OWNER.profileUrl} rel="noreferrer" target="_blank">{ARTICLE_REVIEW_OWNER.handle}</a></strong>
        <p>Reviewed for source mapping and procurement questions. Tested by: not claimed without a linked vendor-console run record; buyer-specific behavior remains test-required.</p>
      </aside>
      <div className="mcp-download-links" aria-label="Download Cursor Enterprise security assessment">
        <a href={cursorEnterpriseSecurityDownloads.pdf} download>Download PDF assessment</a>
        <a href={cursorEnterpriseSecurityDownloads.csv} download>Download CSV controls</a>
        <a href={cursorEnterpriseSecurityDownloads.json} download>Download JSON controls</a>
        <a href={cursorEnterpriseSecurityDownloads.review} download>Download Markdown review</a>
        <a href={cursorEnterpriseSecurityDownloads.procurementJson} download>Download procurement matrix JSON</a>
        <a href={cursorEnterpriseSecurityDownloads.procurementCsv} download>Download procurement matrix CSV</a>
      </div>

      <section aria-labelledby="cursor-responsibility-heading">
        <h3 id="cursor-responsibility-heading">Responsibility matrix</h3>
        <div className="instruction-table-scroll">
          <table aria-label="Cursor Enterprise security responsibility matrix">
            <thead><tr><th scope="col">Owner</th><th scope="col">Accountable for</th></tr></thead>
            <tbody>{cursorEnterpriseResponsibilityMatrix.map((item) => (
              <tr key={item.role}><th scope="row">{item.role}</th><td>{item.accountableFor}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="cursor-controls-table-heading">
        <h3 id="cursor-controls-table-heading">30-control procurement review matrix</h3>
        <div className="instruction-table-scroll">
          <table aria-label="Cursor Enterprise procurement review matrix">
            <thead>
              <tr>
                <th scope="col">Control</th>
                <th scope="col">Cursor behavior</th>
                <th scope="col">Enterprise setting / check</th>
                <th scope="col">Risk if skipped</th>
                <th scope="col">Evidence</th>
                <th scope="col">Verified</th>
              </tr>
            </thead>
            <tbody>{cursorEnterpriseSecurityControls.map((control, index) => (
              <tr key={control.id}>
                <th scope="row"><span className="mcp-control-number">{String(index + 1).padStart(2, "0")} · {control.domain}</span>{control.title}<small className="claim-basis">Owner: {control.owner}</small></th>
                <td>{control.guidance}</td>
                <td>{control.contractOrConsoleCheck}<small className="claim-basis">Verify method: {control.verificationMethod}</small></td>
                <td>{cursorEnterpriseSecurityRisk(control)}</td>
                <td>{control.sourceUrls.map((url, sourceIndex) => <a href={url} key={url} rel="noreferrer" target="_blank">Source {sourceIndex + 1}{sourceIndex < control.sourceUrls.length - 1 ? ", " : ""}</a>)}<small className="claim-basis">{control.claimBasis === "official-public" ? "Official public basis" : "KyenAI operational recommendation"}</small></td>
                <td>{cursorEnterpriseSecurityVerifiedAt}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>

      <aside className="resource-citation-note">
        <strong>Verified {cursorEnterpriseSecurityVerifiedAt} · CC BY 4.0</strong>
        <p>KyenAI. (2026). Cursor Enterprise Security Assessment: 30 Administrator Controls (Version {cursorEnterpriseSecurityVersion}). https://www.kyenai.com/articles/cursor-enterprise-organizations-governance</p>
      </aside>
    </section>
  );
}
