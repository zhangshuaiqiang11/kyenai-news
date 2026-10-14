import React from "react";

import {
  loopBuildingBlocks,
  loopEngineeringExample,
  loopEngineeringPseudoCode,
  loopProofContractDownload,
  loopProofContractPreview,
  loopProofGateChecks,
  loopProofPack,
  loopStopRules,
  loopWorkflowSteps,
} from "../lib/loop-engineering-resource";
import { CodeExampleCard } from "./CodeExampleCard";
import { LoopBudgetCalculator } from "./LoopBudgetCalculator";
import { LoopPatternMatrix } from "./LoopPatternMatrix";

export function LoopEngineeringResources() {
  return (
    <div className="guide-resource-sections">
      <section className="instruction-resource-section" aria-labelledby="loop-workflow-heading">
        <div className="instruction-resource-heading">
          <div>
            <p className="instruction-resource-eyebrow">Workflow</p>
            <h2 id="loop-workflow-heading">Plan, act, observe, verify, retry or stop</h2>
          </div>
          <p>Use this as the first loop design before adding schedules, subagents, or cloud runners.</p>
        </div>
        <ol className="loop-workflow-steps" aria-label="Loop engineering five-step workflow">
          {loopWorkflowSteps.map((step) => (
            <li key={step.id}>
              <strong>{step.label}</strong>
              <span>{step.detail}</span>
            </li>
          ))}
        </ol>
      </section>

      <LoopPatternMatrix />

      <LoopBudgetCalculator />

      <section className="instruction-resource-section" aria-labelledby="loop-definition-heading">
        <div className="instruction-resource-heading">
          <div>
            <p className="instruction-resource-eyebrow">Definition</p>
            <h2 id="loop-definition-heading">Loop engineering is the outer control system</h2>
          </div>
          <p>It governs an agent&apos;s repeated attempts; it is not merely asking the model to try again.</p>
        </div>
        <div className="instruction-direct-answer" role="note" aria-label="Loop engineering definition">
          <strong>Operational definition</strong>
          <p>
            Loop engineering designs the outer plan → act → observe → verify cycle around an AI agent. A complete loop
            names its done signal, evidence gate, retry strategy, stop rules, token/time/cost budget, permission boundary,
            and escalation owner before execution starts.
          </p>
        </div>
      </section>

      <section className="instruction-resource-section" aria-labelledby="loop-proof-heading">
        <div className="instruction-resource-heading">
          <div>
            <p className="instruction-resource-eyebrow">Proof of done</p>
            <h2 id="loop-proof-heading">Evidence gate for an AI coding agent loop</h2>
          </div>
          <p>
            Use this KyenAI template to turn an agent&apos;s completion claim into an auditable state transition.
          </p>
        </div>

        <div className="guide-action-list">
          {loopProofGateChecks.map((gate) => (
            <article key={gate.id}>
              <h3>{gate.title}</h3>
              <p>{gate.detail}</p>
            </article>
          ))}
        </div>

        <div className="instruction-template-grid instruction-template-grid-single">
          <CodeExampleCard
            title="Proof-of-done contract"
            purpose="Copy the JSON template into your runner, replace the placeholders, and allow a terminal-state transition only after every required receipt is current and independently checked."
            body={loopProofContractPreview}
            downloadHref={loopProofContractDownload}
            downloadName="proof-of-done-contract.json"
            cautions={[
              "This is a KyenAI starter contract, not the Proof-or-Stop reference implementation.",
              "A passed gate proves only the named check under its stated trust model; it does not prove semantic program correctness.",
            ]}
          />
        </div>

        <aside className="resource-citation-note" aria-label="Loop Engineering Proof-of-Done Pack citation">
          <strong>{loopProofPack.name} · v{loopProofPack.version} · {loopProofPack.license}</strong>
          <p>{loopProofPack.preferredCitation}</p>
          <div className="mcp-download-links">
            <a href={loopProofPack.downloads.runbook} download>Download Markdown runbook</a>
            <a href={loopProofPack.downloads.checklist} download>Download CSV checklist</a>
            <a href={loopProofPack.downloads.example} download>Download completed example</a>
            <a href={loopProofPack.downloads.contract} download>Download JSON contract</a>
          </div>
        </aside>
      </section>

      <section className="instruction-resource-section" aria-labelledby="loop-example-heading">
        <div className="instruction-resource-heading">
          <div>
            <p className="instruction-resource-eyebrow">Practical example</p>
            <h2 id="loop-example-heading">{loopEngineeringExample.title}</h2>
          </div>
          <p>{loopEngineeringExample.scenario}</p>
        </div>
        <ol className="guide-step-list">
          {loopEngineeringExample.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="instruction-resource-section" aria-labelledby="loop-pseudocode-heading">
        <div className="instruction-resource-heading">
          <div>
            <p className="instruction-resource-eyebrow">Implementation sketch</p>
            <h2 id="loop-pseudocode-heading">Pseudo-code for a bounded agent loop</h2>
          </div>
          <p>Translate this control structure into LangGraph, a CI job, or your agent runner of choice.</p>
        </div>
        <div className="instruction-template-grid instruction-template-grid-single">
          <CodeExampleCard
            title="Bounded plan-act-observe-verify loop"
            purpose="Shows the loop controls that matter: verification, attempt cap, repeated-failure detection, and human escalation."
            body={loopEngineeringPseudoCode}
            cautions={[
              "Do not run unattended loops against production paths without an approval checkpoint.",
              "Record real token, cost, and intervention numbers only when your runner actually measures them.",
            ]}
          />
        </div>
      </section>

      <section className="instruction-resource-section" aria-labelledby="loop-stop-rules-heading">
        <div className="instruction-resource-heading">
          <div>
            <p className="instruction-resource-eyebrow">Stop rules</p>
            <h2 id="loop-stop-rules-heading">When should an AI agent stop the loop?</h2>
          </div>
          <p>Termination is the safety feature. Add it before parallelism, schedules, or broader permissions.</p>
        </div>
        <ul className="guide-checklist">
          {loopStopRules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>

      <section className="instruction-resource-section" aria-labelledby="loop-building-blocks-heading">
        <div className="instruction-resource-heading">
          <div>
            <p className="instruction-resource-eyebrow">Anatomy</p>
            <h2 id="loop-building-blocks-heading">Five loop building blocks</h2>
          </div>
          <p>Every durable coding-agent loop needs these controls before you scale parallelism or schedules.</p>
        </div>
        <div className="guide-action-list">
          {loopBuildingBlocks.map((block) => (
            <article key={block.id}>
              <h3>{block.title}</h3>
              <p>{block.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
