import {
  cursorEnterpriseResponsibilityMatrix,
  cursorEnterpriseSecurityControls,
  cursorEnterpriseSecurityDownloads,
  cursorEnterpriseSecurityVerifiedAt,
  cursorEnterpriseSecurityVersion,
} from "../lib/cursor-enterprise-security-resource";

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
      <div className="mcp-download-links" aria-label="Download Cursor Enterprise security assessment">
        <a href={cursorEnterpriseSecurityDownloads.pdf} download>Download PDF assessment</a>
        <a href={cursorEnterpriseSecurityDownloads.csv} download>Download CSV controls</a>
        <a href={cursorEnterpriseSecurityDownloads.json} download>Download JSON controls</a>
        <a href={cursorEnterpriseSecurityDownloads.review} download>Download Markdown review</a>
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
        <h3 id="cursor-controls-table-heading">30 verifiable controls</h3>
        <div className="instruction-table-scroll">
          <table aria-label="30 Cursor Enterprise security controls">
            <thead>
              <tr><th scope="col"># / Control</th><th scope="col">Owner</th><th scope="col">How to verify</th><th scope="col">Contract or console check</th></tr>
            </thead>
            <tbody>{cursorEnterpriseSecurityControls.map((control, index) => (
              <tr key={control.id}>
                <th scope="row"><span className="mcp-control-number">{String(index + 1).padStart(2, "0")} · {control.domain}</span>{control.title}</th>
                <td>{control.owner}</td>
                <td>{control.verificationMethod}<small className="claim-basis">{control.claimBasis === "official-public" ? "Official public basis" : "KyenAI operational recommendation"}</small></td>
                <td>{control.contractOrConsoleCheck}</td>
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
