import Link from "next/link";
import { useMemo, useState } from "react";

import {
  getAgentsMdStarterDefaults,
  renderAgentsMdStarter,
  type AgentsMdStarterInput,
  type AgentsMdStarterStack,
} from "../lib/agents-md-starter-builder";
import { auditInstructionFile } from "../lib/instruction-file-audit";

const stackOptions: Array<{ value: AgentsMdStarterStack; label: string }> = [
  { value: "node", label: "Node.js" },
  { value: "python", label: "Python" },
  { value: "monorepo", label: "Monorepo" },
];

export function AgentsMdStarterBuilder() {
  const [input, setInput] = useState<AgentsMdStarterInput>(() => getAgentsMdStarterDefaults("node"));
  const [copied, setCopied] = useState(false);
  const output = useMemo(() => renderAgentsMdStarter(input), [input]);
  const audit = useMemo(
    () => auditInstructionFile({ tool: "codex", surface: "Codex", filePath: "AGENTS.md", content: output }),
    [output],
  );
  const downloadHref = useMemo(
    () => `data:text/markdown;charset=utf-8,${encodeURIComponent(output)}`,
    [output],
  );

  const update = (field: keyof AgentsMdStarterInput, value: string) => {
    setCopied(false);
    setInput((current) => ({ ...current, [field]: value }));
  };

  const changeStack = (stack: AgentsMdStarterStack) => {
    setCopied(false);
    setInput((current) => getAgentsMdStarterDefaults(stack, current.projectName));
  };

  const copyOutput = async () => {
    if (!navigator.clipboard) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
  };

  return (
    <section className="agents-starter-builder" aria-labelledby="agents-starter-builder-heading">
      <div className="instruction-resource-heading">
        <div>
          <p className="instruction-resource-eyebrow">Browser-only builder</p>
          <h2 id="agents-starter-builder-heading">Build a concise AGENTS.md starter</h2>
        </div>
        <p>Choose a stack, replace every example command, then audit the file before committing it.</p>
      </div>

      <div className="agents-starter-builder-grid">
        <div className="agents-starter-builder-form">
          <label>
            Project name
            <input value={input.projectName} onChange={(event) => update("projectName", event.target.value)} />
          </label>
          <label>
            Repository type
            <select value={input.stack} onChange={(event) => changeStack(event.target.value as AgentsMdStarterStack)}>
              {stackOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <label>
            Install command
            <input value={input.installCommand} onChange={(event) => update("installCommand", event.target.value)} spellCheck={false} />
          </label>
          <label>
            Test command
            <input value={input.testCommand} onChange={(event) => update("testCommand", event.target.value)} spellCheck={false} />
          </label>
          <label>
            Lint command
            <input value={input.lintCommand} onChange={(event) => update("lintCommand", event.target.value)} spellCheck={false} />
          </label>
          <label>
            Build command
            <input value={input.buildCommand} onChange={(event) => update("buildCommand", event.target.value)} spellCheck={false} />
          </label>
          <label>
            Preferred edit paths
            <input value={input.preferredPaths} onChange={(event) => update("preferredPaths", event.target.value)} spellCheck={false} />
          </label>
          <label>
            Restricted paths
            <input value={input.restrictedPaths} onChange={(event) => update("restrictedPaths", event.target.value)} spellCheck={false} />
          </label>
          <p>
            The builder uses fixed rules and never reads your repository. Verify every command and delete guidance already enforced elsewhere.
          </p>
        </div>

        <div className="agents-starter-builder-output">
          <div className="agents-starter-builder-status" role="status" aria-label="Generated starter audit result">
            <span>Rule-based starter check</span>
            <strong>{audit.score}/100 · {audit.grade}</strong>
            <small>{audit.stats.lines} lines · {audit.stats.words} words</small>
          </div>
          <pre aria-label="Generated AGENTS.md preview"><code>{output}</code></pre>
          <div className="agents-starter-builder-actions">
            <button type="button" onClick={copyOutput}>{copied ? "Copied" : "Copy AGENTS.md"}</button>
            <a href={downloadHref} download="AGENTS.md">Download AGENTS.md</a>
            <Link href="/tools/instruction-file-checker">Open the full instruction checker</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
