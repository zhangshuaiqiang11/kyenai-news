import { useMemo, useState } from "react";

import { calculateLoopBudget } from "../lib/loop-engineering-resource";

const numberFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function LoopBudgetCalculator() {
  const [tokensPerIteration, setTokensPerIteration] = useState(25_000);
  const [toolCallsPerIteration, setToolCallsPerIteration] = useState(8);
  const [maxIterations, setMaxIterations] = useState(5);
  const [costPerMillionTokens, setCostPerMillionTokens] = useState(10);
  const [agentCount, setAgentCount] = useState(1);
  const result = useMemo(
    () =>
      calculateLoopBudget({
        tokensPerIteration,
        toolCallsPerIteration,
        maxIterations,
        costPerMillionTokens,
        agentCount,
      }),
    [agentCount, costPerMillionTokens, maxIterations, tokensPerIteration, toolCallsPerIteration],
  );

  return (
    <section className="instruction-resource-section loop-budget-calculator" aria-labelledby="loop-budget-heading">
      <div className="instruction-resource-heading">
        <div>
          <p className="instruction-resource-eyebrow">Browser-based planning tool</p>
          <h2 id="loop-budget-heading">Agent Loop Budget Calculator</h2>
        </div>
        <p>Estimate the hard upper bound before an agent loop starts. No values leave your browser.</p>
      </div>
      <div className="loop-budget-grid">
        <form className="loop-budget-fields" onSubmit={(event) => event.preventDefault()}>
          <label>
            Tokens per iteration
            <input type="number" min="0" max="10000000" step="1000" value={tokensPerIteration} onChange={(event) => setTokensPerIteration(Number(event.target.value))} />
          </label>
          <label>
            Tool calls per iteration
            <input type="number" min="0" max="10000" step="1" value={toolCallsPerIteration} onChange={(event) => setToolCallsPerIteration(Number(event.target.value))} />
          </label>
          <label>
            Maximum iterations
            <input type="number" min="1" max="10000" step="1" value={maxIterations} onChange={(event) => setMaxIterations(Number(event.target.value))} />
          </label>
          <label>
            Cost per 1M tokens (USD)
            <input type="number" min="0" max="10000" step="0.01" value={costPerMillionTokens} onChange={(event) => setCostPerMillionTokens(Number(event.target.value))} />
          </label>
          <label>
            Concurrent agents
            <input type="number" min="1" max="1000" step="1" value={agentCount} onChange={(event) => setAgentCount(Number(event.target.value))} />
          </label>
        </form>
        <div className={`loop-budget-results loop-budget-risk-${result.risk.toLowerCase()}`} aria-live="polite">
          <p className="instruction-resource-eyebrow">Maximum planned exposure</p>
          <dl>
            <div><dt>Tokens</dt><dd>{numberFormatter.format(result.maximumTokens)}</dd></div>
            <div><dt>Tool calls</dt><dd>{numberFormatter.format(result.maximumToolCalls)}</dd></div>
            <div><dt>Estimated token cost</dt><dd>{currencyFormatter.format(result.maximumCostUsd)}</dd></div>
            <div><dt>Risk level</dt><dd>{result.risk}</dd></div>
          </dl>
          <p><strong>Recommended stop rule:</strong> {result.stopRule}</p>
          <small>This is a planning ceiling, not a bill estimate. Cached tokens, output pricing, tool fees, retries outside the loop, and vendor-specific billing can change actual cost.</small>
        </div>
      </div>
    </section>
  );
}
