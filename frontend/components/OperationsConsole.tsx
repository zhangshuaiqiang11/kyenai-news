import { useEffect, useState } from "react";
import { Activity, RotateCcw, Send, ShieldCheck, Sparkles } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

type Overview = {
  article_count: number;
  source_count: number;
  entity_count: number;
  job_count: number;
  categories: string[];
  latest_updated_at: string;
  production_data_requirements: string[];
  guardrails: Record<string, string | string[]>;
};

type Job = {
  id: string;
  status: string;
  trigger_reason: string;
  article_slug: string;
  validation_result?: { passed: boolean; failures: string[]; risk_level: string };
};

type IntegrationStatus = {
  name: string;
  configured: boolean;
  required_env: string[];
};

export function OperationsConsole() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void refresh();
  }, []);

  async function refresh() {
    try {
      const [overviewResponse, jobsResponse] = await Promise.all([
        fetch(`${API_BASE}/api/admin/overview`),
        fetch(`${API_BASE}/api/admin/jobs`),
      ]);
      if (overviewResponse.ok) {
        setOverview(await overviewResponse.json());
      }
      if (jobsResponse.ok) {
        setJobs(await jobsResponse.json());
      }
      const integrationsResponse = await fetch(`${API_BASE}/api/admin/integrations`);
      if (integrationsResponse.ok) {
        setIntegrations(await integrationsResponse.json());
      }
    } catch {
      addLog("Backend is not reachable yet.");
    }
  }

  async function runCollect() {
    await runAction("Collected search metrics and created eligible jobs.", "/api/jobs/collect-search-metrics");
  }

  async function runOptimize() {
    const pending = jobs.find((job) => job.status === "pending");
    if (!pending) {
      addLog("No pending job found. Collect metrics first.");
      return;
    }
    await runAction(`Optimized ${pending.article_slug}.`, `/api/jobs/optimize-article?job_id=${pending.id}`);
  }

  async function runPublish() {
    const approved = jobs.find((job) => job.status === "approved");
    if (!approved) {
      addLog("No approved job found. Optimize a pending job first.");
      return;
    }
    await runAction(`Published ${approved.article_slug}.`, `/api/jobs/publish-approved-patch?job_id=${approved.id}`);
  }

  async function runRollback() {
    await runAction("Rollback requested for the SEO workflow case article.", "/api/jobs/rollback/article-seo-case");
  }

  async function runAction(successMessage: string, path: string) {
    setBusy(true);
    try {
      const response = await fetch(`${API_BASE}${path}`, { method: "POST" });
      if (!response.ok) {
        addLog(`Action failed with ${response.status}.`);
      } else {
        addLog(successMessage);
      }
      await refresh();
    } catch {
      addLog("Backend is not reachable yet.");
    } finally {
      setBusy(false);
    }
  }

  function addLog(message: string) {
    setLog((items) => [message, ...items].slice(0, 6));
  }

  return (
    <div className="operations-grid">
      <section className="ops-panel">
        <h2>Automation Control</h2>
        <div className="ops-actions">
          <button disabled={busy} onClick={runCollect} type="button">
            <Activity aria-hidden="true" size={18} /> Collect Signals
          </button>
          <button disabled={busy} onClick={runOptimize} type="button">
            <Sparkles aria-hidden="true" size={18} /> Optimize
          </button>
          <button disabled={busy} onClick={runPublish} type="button">
            <Send aria-hidden="true" size={18} /> Publish
          </button>
          <button disabled={busy} onClick={runRollback} type="button">
            <RotateCcw aria-hidden="true" size={18} /> Rollback
          </button>
        </div>
      </section>
      <section className="ops-panel">
        <h2>Overview</h2>
        {overview ? (
          <dl className="ops-metrics">
            <div><dt>Articles</dt><dd>{overview.article_count}</dd></div>
            <div><dt>Sources</dt><dd>{overview.source_count}</dd></div>
            <div><dt>Entities</dt><dd>{overview.entity_count}</dd></div>
            <div><dt>Jobs</dt><dd>{overview.job_count}</dd></div>
            <div><dt>Categories</dt><dd>{overview.categories.length}</dd></div>
          </dl>
        ) : (
          <p>Waiting for backend overview.</p>
        )}
      </section>
      <section className="ops-panel guardrail-panel">
        <h2><ShieldCheck aria-hidden="true" size={20} /> Guardrails</h2>
        <ul>
          <li>Failed validation: skip and alert</li>
          <li>Source policy: authoritative whitelist</li>
          <li>AI output: structured JSON patch</li>
          <li>Brand mentions: official entity ledger only</li>
        </ul>
      </section>
      <section className="ops-panel">
        <h2>Production Data</h2>
        {overview ? (
          <ul className="integration-list">
            {overview.production_data_requirements.map((requirement) => {
              const status = integrations.find((item) => item.name === requirement);
              return (
                <li key={requirement}>
                  <strong>{requirement.replace(/_/g, " ")}</strong>
                  <span className={status?.configured ? "configured" : "missing"}>
                    {status?.configured ? "Configured" : "Needs credentials"}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>Waiting for backend overview.</p>
        )}
      </section>
      <section className="ops-panel">
        <h2>Jobs</h2>
        <div className="job-list">
          {jobs.map((job) => (
            <article key={job.id}>
              <strong>{job.article_slug}</strong>
              <span>{job.status}</span>
              <p>{job.trigger_reason}</p>
            </article>
          ))}
          {jobs.length === 0 ? <p>No jobs yet.</p> : null}
        </div>
      </section>
      <section className="ops-panel ops-log">
        <h2>Run Log</h2>
        <ul>
          {log.map((item) => <li key={item}>{item}</li>)}
          {log.length === 0 ? <li>No local actions in this browser session.</li> : null}
        </ul>
      </section>
    </div>
  );
}
