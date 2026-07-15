import { useMemo, useState } from "react";

import {
  auditInstructionFile,
  getInstructionSurfaceOptions,
  getRecommendedInstructionPath,
  type InstructionAuditResult,
  type InstructionSurface,
  type InstructionTool,
} from "../lib/instruction-file-audit";
import { instructionTemplates } from "../lib/instruction-resources";

const toolLabels: Record<InstructionTool, string> = {
  codex: "OpenAI Codex",
  "claude-code": "Claude Code",
  "github-copilot": "GitHub Copilot",
  cursor: "Cursor",
};

const templateIdByTool: Record<InstructionTool, string> = {
  codex: "agents-md-template",
  "claude-code": "claude-md-template",
  "github-copilot": "copilot-instructions-template",
  cursor: "cursor-project-rule-template",
};

export function InstructionFileChecker() {
  const [tool, setTool] = useState<InstructionTool>("codex");
  const [surface, setSurface] = useState<InstructionSurface>("Codex");
  const [filePath, setFilePath] = useState("AGENTS.md");
  const [content, setContent] = useState("");
  const [result, setResult] = useState<InstructionAuditResult | null>(null);
  const [copied, setCopied] = useState(false);
  const surfaceOptions = useMemo(() => getInstructionSurfaceOptions(tool), [tool]);
  const recommendedPath = useMemo(() => getRecommendedInstructionPath(tool, surface), [tool, surface]);

  const updateTool = (nextTool: InstructionTool) => {
    const nextSurface = getInstructionSurfaceOptions(nextTool)[0];
    setTool(nextTool);
    setSurface(nextSurface);
    const nextPath = getRecommendedInstructionPath(nextTool, nextSurface);
    setFilePath(nextPath);
    setResult(null);
  };

  const updateSurface = (nextSurface: InstructionSurface) => {
    setSurface(nextSurface);
    setResult(null);
  };

  const runAudit = () => {
    setCopied(false);
    setResult(auditInstructionFile({ tool, surface, filePath, content }));
  };

  const copyRecommendedPath = async () => {
    if (!navigator.clipboard) return;
    await navigator.clipboard.writeText(recommendedPath);
    setCopied(true);
  };

  return (
    <section className="instruction-checker" aria-labelledby="instruction-checker-heading">
      <div className="instruction-checker-heading">
        <div>
          <p className="instruction-resource-eyebrow">Free browser tool</p>
          <h2 id="instruction-checker-heading">Audit your instruction file</h2>
        </div>
        <span>Deterministic rules · No upload</span>
      </div>

      <div className="instruction-checker-grid">
        <div className="instruction-checker-form">
          <div className="instruction-checker-fields">
            <label>
              Tool
              <select value={tool} onChange={(event) => updateTool(event.target.value as InstructionTool)}>
                {Object.entries(toolLabels).map(([value, label]) => (
                  <option value={value} key={value}>{label}</option>
                ))}
              </select>
            </label>
            <label>
              Surface
              <select value={surface} onChange={(event) => updateSurface(event.target.value as InstructionSurface)}>
                {surfaceOptions.map((item) => (
                  <option value={item} key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>
          <label>
            File path
            <input
              value={filePath}
              onChange={(event) => {
                setFilePath(event.target.value);
                setResult(null);
              }}
              spellCheck={false}
            />
          </label>
          <label>
            Instruction content
            <textarea
              value={content}
              onChange={(event) => {
                setContent(event.target.value);
                setResult(null);
              }}
              placeholder="Paste AGENTS.md, CLAUDE.md, Copilot instructions, or a Cursor .mdc rule here."
              rows={18}
              maxLength={100_000}
              spellCheck={false}
            />
          </label>
          <p className="instruction-checker-privacy">
            Your content stays in your browser. The checker makes no network request and stores no instruction text.
          </p>
          <div className="instruction-checker-actions">
            <button className="primary-action" type="button" onClick={runAudit}>Audit instruction file</button>
            <button
              className="secondary-action"
              type="button"
              onClick={() => {
                const template = instructionTemplates.find((item) => item.id === templateIdByTool[tool]);
                setFilePath(template?.targetPath ?? recommendedPath);
                setContent(template?.body ?? "");
                setResult(null);
              }}
            >
              Load strong sample
            </button>
          </div>
        </div>

        <div className="instruction-checker-results" aria-live="polite">
          {result ? (
            <>
              <div className={`instruction-score instruction-score-${result.grade.toLowerCase().replace(/\s+/g, "-")}`} role="status">
                <span>{result.score}/100</span>
                <strong>{result.grade}</strong>
                <small>{result.stats.lines} lines · {result.stats.words} words</small>
              </div>
              <div className="instruction-recommended-path">
                <span>Recommended baseline</span>
                <code>{result.recommendedPath}</code>
                <button type="button" onClick={copyRecommendedPath}>{copied ? "Copied" : "Copy path"}</button>
              </div>
              <dl className="instruction-category-scores" aria-label="Category scores">
                {Object.entries(result.categoryScores).map(([category, score]) => (
                  <div key={category}>
                    <dt>{category}</dt>
                    <dd>{score}</dd>
                  </div>
                ))}
              </dl>
              {result.findings.length ? (
                <ul className="instruction-findings">
                  {result.findings.map((finding) => (
                    <li className={`instruction-finding-${finding.severity}`} key={finding.id}>
                      <div>
                        <span>{finding.severity}</span>
                        <strong>{finding.title}</strong>
                      </div>
                      <p>{finding.detail}</p>
                      <p><b>Fix:</b> {finding.recommendation}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="instruction-checker-empty-success">
                  <strong>No rule-based problems found.</strong>
                  <p>Review the file with your team whenever repository commands, permissions, or tool support changes.</p>
                </div>
              )}
            </>
          ) : (
            <div className="instruction-checker-placeholder">
              <strong>What the checker evaluates</strong>
              <ul>
                <li>Documented file-path compatibility</li>
                <li>Setup and verification commands</li>
                <li>Scope and nested-rule guidance</li>
                <li>Secret, placeholder, and destructive-command risks</li>
                <li>Structure and tool-size guidance</li>
              </ul>
              <p>Results are recommendations, not proof that a tool will execute every instruction correctly.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
