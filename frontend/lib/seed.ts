import type { Article, ArticleBlock, SearchSignal } from "./types";

const rawSeedArticles: Article[] = [
  {
    id: "article-codex-roles",
    title: "OpenAI Expands Codex into Plugins, Sites, and Annotations",
    slug: "openai-codex-plugins-sites-annotations",
    summary:
      "OpenAI's June 2026 Codex update turns coding-agent workflows into role-specific plugins, shareable sites, and in-place annotations.",
    category: "AI Coding Agents",
    tags: ["codex", "plugins", "sites", "knowledge-work"],
    authorName: "Editorial Automation Desk",
    status: "published",
    keywords: ["OpenAI Codex", "AI coding agents", "agent tools"],
    entityIds: ["openai", "openai-codex", "chatgpt"],
    blocks: [
      {
        id: "body-1",
        type: "paragraph",
        content:
          "OpenAI's latest Codex release broadens the product beyond software engineering. The update introduces role-specific plugins, hosted Sites, and annotation-based refinement so teams can turn analysis, plans, and briefs into interactive workspaces.",
        sourceIds: ["src-openai-codex-roles"],
      },
      {
        id: "body-2",
        type: "paragraph",
        content:
          "For AI coding teams, the practical signal is that agent work is moving from isolated code generation into shared, reviewable artifacts. A strong portal article should track availability, workspace controls, and how Sites change developer handoff patterns.",
        sourceIds: ["src-openai-codex-roles"],
      },
    ],
    sources: [
      {
        id: "src-openai-codex-roles",
        title: "Codex for every role, tool, and workflow",
        url: "https://openai.com/index/codex-for-every-role-tool-workflow/",
        publisher: "OpenAI",
        publishedAt: "2026-06-02",
        credibility: 5,
      },
    ],
    publishedAt: "2026-06-02T09:00:00Z",
    updatedAt: "2026-06-04T07:00:00Z",
    version: 1,
    metaTitle: "OpenAI Expands Codex into Plugins, Sites, and Annotations",
    metaDescription:
      "OpenAI's June 2026 Codex update turns coding-agent workflows into role-specific plugins, shareable sites, and in-place annotations.",
  },
  {
    id: "article-github-vscode-agents",
    title: "GitHub Brings Agent-First Workflows Deeper into VS Code Stable",
    slug: "github-copilot-vscode-agents-window-may-2026",
    summary:
      "GitHub's June 3 changelog highlights the Agents window preview, BYOK controls, session sync, terminal safety, and integrated browser improvements in VS Code.",
    category: "AI Coding Agents",
    tags: ["github-copilot", "vscode", "agents-window", "byok"],
    authorName: "Editorial Automation Desk",
    status: "published",
    keywords: ["GitHub Copilot", "VS Code agents", "BYOK coding models"],
    entityIds: ["microsoft", "github", "github-copilot", "visual-studio-code"],
    blocks: [
      {
        id: "body-1",
        type: "paragraph",
        content:
          "GitHub's May release cycle for Copilot in VS Code moves the editor closer to an agent-first workspace. The Agents window is now in Stable as a preview, while remote agents, session sync, BYOK model routing, and terminal safety controls make longer-running coding sessions easier to govern.",
        sourceIds: ["src-github-vscode-may"],
      },
      {
        id: "body-2",
        type: "paragraph",
        content:
          "This is useful news for teams comparing local IDE agents with cloud agents: VS Code is becoming a command center for multiple sessions, changed-file search, screenshots, and model selection rather than only a chat sidebar.",
        sourceIds: ["src-github-vscode-may"],
      },
    ],
    sources: [
      {
        id: "src-github-vscode-may",
        title: "GitHub Copilot in Visual Studio Code, May releases",
        url: "https://github.blog/changelog/2026-06-03-github-copilot-in-visual-studio-code-may-releases/",
        publisher: "GitHub",
        publishedAt: "2026-06-03",
        credibility: 5,
      },
    ],
    publishedAt: "2026-06-03T09:00:00Z",
    updatedAt: "2026-06-04T07:00:00Z",
    version: 1,
    metaDescription:
      "GitHub's June 3 changelog highlights the Agents window preview, BYOK controls, session sync, terminal safety, and integrated browser improvements in VS Code.",
  },
  {
    id: "article-copilot-cli-refresh",
    title: "Copilot CLI Adds Rubber Duck Review, Prompt Scheduling, and Voice Input",
    slug: "github-copilot-cli-rubber-duck-prompt-scheduling",
    summary:
      "GitHub's Copilot CLI refresh adds a redesigned terminal experience, a critic agent, scheduled prompts, and local voice input.",
    category: "IDE & CLI",
    tags: ["github-copilot", "cli", "terminal-agents", "review"],
    authorName: "Editorial Automation Desk",
    status: "published",
    keywords: ["Copilot CLI", "AI terminal agent", "rubber duck review"],
    entityIds: ["microsoft", "github", "github-copilot"],
    blocks: [
      {
        id: "body-1",
        type: "paragraph",
        content:
          "GitHub Copilot CLI now has a refreshed terminal surface and a rubber duck agent that can critique plans, implementation, or tests before the main agent continues.",
        sourceIds: ["src-github-copilot-cli"],
      },
      {
        id: "body-2",
        type: "paragraph",
        content:
          "Prompt scheduling with /every and /after points toward terminal agents that keep checking builds, usage, or repo state over time. Voice input is local, which matters for teams evaluating privacy and developer ergonomics.",
        sourceIds: ["src-github-copilot-cli"],
      },
    ],
    sources: [
      {
        id: "src-github-copilot-cli",
        title: "Copilot CLI: Improved UI, rubber duck, prompt scheduling, and voice input",
        url: "https://github.blog/changelog/2026-06-02-copilot-cli-improved-ui-rubber-duck-prompt-scheduling-and-voice-input/",
        publisher: "GitHub",
        publishedAt: "2026-06-02",
        credibility: 5,
      },
    ],
    publishedAt: "2026-06-02T09:00:00Z",
    updatedAt: "2026-06-04T07:00:00Z",
    version: 1,
    metaDescription:
      "GitHub's Copilot CLI refresh adds a redesigned terminal experience, a critic agent, scheduled prompts, and local voice input.",
  },
  {
    id: "article-copilot-sandboxes",
    title: "GitHub Copilot Sandboxes Put Agent Execution Behind Policy Boundaries",
    slug: "github-copilot-cloud-local-sandboxes-preview",
    summary:
      "GitHub's public preview for cloud and local sandboxes gives Copilot isolated execution environments for agentic development.",
    category: "Security & Governance",
    tags: ["github-copilot", "sandboxes", "security", "governance"],
    authorName: "Editorial Automation Desk",
    status: "published",
    keywords: ["Copilot sandboxes", "agentic development security", "AI coding governance"],
    entityIds: ["microsoft", "github", "github-copilot"],
    blocks: [
      {
        id: "body-1",
        type: "paragraph",
        content:
          "GitHub now lets Copilot run inside isolated local or cloud sandboxes. Local sandboxing restricts filesystem, network, and system access for command execution, while cloud sandboxes provide ephemeral Linux environments hosted by GitHub.",
        sourceIds: ["src-github-copilot-sandboxes"],
      },
      {
        id: "body-2",
        type: "paragraph",
        content:
          "For enterprise AI coding adoption, the product shift is clear: agents need execution layers with identity, policy, and isolation. This article belongs in security and governance monitoring, not just productivity coverage.",
        sourceIds: ["src-github-copilot-sandboxes"],
      },
    ],
    sources: [
      {
        id: "src-github-copilot-sandboxes",
        title: "Cloud and local sandboxes for GitHub Copilot now in public preview",
        url: "https://github.blog/changelog/2026-06-02-cloud-and-local-sandboxes-for-github-copilot-now-in-public-preview/",
        publisher: "GitHub",
        publishedAt: "2026-06-02",
        credibility: 5,
      },
    ],
    publishedAt: "2026-06-02T09:00:00Z",
    updatedAt: "2026-06-04T07:00:00Z",
    version: 1,
    metaDescription:
      "GitHub's public preview for cloud and local sandboxes gives Copilot isolated execution environments for agentic development.",
  },
  {
    id: "article-google-antigravity-cli",
    title: "Google Moves Gemini CLI Users toward Antigravity CLI",
    slug: "google-antigravity-cli-gemini-cli-transition",
    summary:
      "Google is unifying Gemini CLI and Code Assist workflows into Antigravity CLI, an agent-first platform with asynchronous multi-agent execution.",
    category: "IDE & CLI",
    tags: ["google", "antigravity", "gemini-cli", "multi-agent"],
    authorName: "Editorial Automation Desk",
    status: "published",
    keywords: ["Antigravity CLI", "Gemini CLI", "multi-agent coding"],
    entityIds: ["google", "gemini"],
    blocks: [
      {
        id: "body-1",
        type: "paragraph",
        content:
          "Google's Antigravity CLI announcement frames the migration as a move from a terminal assistant to a unified agent-first platform. The new CLI keeps critical Gemini CLI features such as Agent Skills, Hooks, Subagents, and Extensions as Antigravity plugins.",
        sourceIds: ["src-google-antigravity-cli"],
      },
      {
        id: "body-2",
        type: "paragraph",
        content:
          "The important timeline is operational: individual and free Gemini CLI and Gemini Code Assist users need to transition before June 18, 2026, while enterprise access remains under paid Google Cloud and Gemini Enterprise arrangements.",
        sourceIds: ["src-google-antigravity-cli"],
      },
    ],
    sources: [
      {
        id: "src-google-antigravity-cli",
        title: "An important update: Transitioning Gemini CLI to Antigravity CLI",
        url: "https://developers.googleblog.com/en/an-important-update-transitioning-gemini-cli-to-antigravity-cli/",
        publisher: "Google",
        publishedAt: "2026-05-19",
        credibility: 5,
      },
    ],
    publishedAt: "2026-05-19T09:00:00Z",
    updatedAt: "2026-06-04T07:00:00Z",
    version: 1,
    metaDescription:
      "Google is unifying Gemini CLI and Code Assist workflows into Antigravity CLI, an agent-first platform with asynchronous multi-agent execution.",
  },
  {
    id: "article-claude-code-workflows",
    title: "Claude Code Dynamic Workflows Coordinate Parallel Subagents",
    slug: "claude-code-dynamic-workflows-parallel-subagents",
    summary:
      "Anthropic's Claude Code dynamic workflows can generate orchestration scripts, fan work out to subagents, and checkpoint long-running engineering tasks.",
    category: "Agent Workflows",
    tags: ["claude-code", "dynamic-workflows", "subagents", "migrations"],
    authorName: "Editorial Automation Desk",
    status: "published",
    keywords: ["Claude Code", "dynamic workflows", "parallel subagents"],
    entityIds: ["anthropic", "claude-code"],
    blocks: [
      {
        id: "body-1",
        type: "paragraph",
        content:
          "Anthropic introduced dynamic workflows for Claude Code on May 28, 2026. The feature lets Claude write orchestration scripts and coordinate tens to hundreds of parallel subagents in one session.",
        sourceIds: ["src-anthropic-dynamic-workflows"],
      },
      {
        id: "body-2",
        type: "paragraph",
        content:
          "The strongest fit is large engineering work: codebase-wide bug hunts, security audits, framework migrations, and independent adversarial review before results reach the user. The tradeoff is usage: Anthropic warns dynamic workflows consume meaningfully more tokens than normal Claude Code sessions.",
        sourceIds: ["src-anthropic-dynamic-workflows"],
      },
    ],
    sources: [
      {
        id: "src-anthropic-dynamic-workflows",
        title: "Introducing dynamic workflows in Claude Code",
        url: "https://claude.com/blog/introducing-dynamic-workflows-in-claude-code",
        publisher: "Anthropic",
        publishedAt: "2026-05-28",
        credibility: 5,
      },
    ],
    publishedAt: "2026-05-28T09:00:00Z",
    updatedAt: "2026-06-04T07:00:00Z",
    version: 1,
    metaDescription:
      "Anthropic's Claude Code dynamic workflows can generate orchestration scripts, fan work out to subagents, and checkpoint long-running engineering tasks.",
  },
  {
    id: "article-cursor-enterprise-orgs",
    title: "Cursor Enterprise Adds Organization-Level Governance",
    slug: "cursor-enterprise-organizations-governance",
    summary:
      "Cursor's June 3 changelog adds organization containers, multi-team support, usage analytics, and group-level agent permissions for enterprise deployments.",
    category: "Security & Governance",
    tags: ["cursor", "enterprise", "governance", "agent-permissions"],
    authorName: "Editorial Automation Desk",
    status: "published",
    keywords: ["Cursor Enterprise", "AI coding governance", "agent permissions"],
    entityIds: ["cursor"],
    blocks: [
      {
        id: "body-1",
        type: "paragraph",
        content:
          "Cursor Enterprise can now manage multiple teams from one organization-level container. Admins get a rollup of spend and token usage, identity controls, and separate security, governance, budget, and feature settings for each team.",
        sourceIds: ["src-cursor-enterprise-orgs"],
      },
      {
        id: "body-2",
        type: "paragraph",
        content:
          "The new group model is especially relevant for agent governance because cohorts can receive separate model access, spend limits, and agent permissions without creating a new team.",
        sourceIds: ["src-cursor-enterprise-orgs"],
      },
    ],
    sources: [
      {
        id: "src-cursor-enterprise-orgs",
        title: "Organizations for Cursor Enterprise",
        url: "https://cursor.com/changelog/enterprise-organizations",
        publisher: "Cursor",
        publishedAt: "2026-06-03",
        credibility: 5,
      },
    ],
    publishedAt: "2026-06-03T09:00:00Z",
    updatedAt: "2026-06-04T07:00:00Z",
    version: 1,
    metaDescription:
      "Cursor's June 3 changelog adds organization containers, multi-team support, usage analytics, and group-level agent permissions for enterprise deployments.",
  },
  {
    id: "article-gpt-53-codex",
    title: "GPT-5.3-Codex Pushes Coding Agents toward Longer-Running Work",
    slug: "gpt-53-codex-long-running-agentic-coding",
    summary:
      "OpenAI's GPT-5.3-Codex release emphasizes faster agentic coding, frontend work, computer-use tasks, and stronger cybersecurity guardrails.",
    category: "AI Coding Agents",
    tags: ["openai", "gpt-5-3-codex", "coding-models", "security"],
    authorName: "Editorial Automation Desk",
    status: "published",
    keywords: ["GPT-5.3-Codex", "agentic coding model", "AI coding security"],
    entityIds: ["openai", "openai-codex", "chatgpt"],
    blocks: [
      {
        id: "body-1",
        type: "paragraph",
        content:
          "OpenAI describes GPT-5.3-Codex as a model for long-running coding and computer-use tasks. The release highlights benchmark gains, stronger web development behavior, and more interactive steering while the agent works.",
        sourceIds: ["src-openai-gpt-53-codex"],
      },
      {
        id: "body-2",
        type: "paragraph",
        content:
          "The cybersecurity section matters for product teams: OpenAI says the model is classified as high capability for cybersecurity-related tasks and is paired with strengthened safeguards, trusted access, monitoring, and enforcement pipelines.",
        sourceIds: ["src-openai-gpt-53-codex"],
      },
    ],
    sources: [
      {
        id: "src-openai-gpt-53-codex",
        title: "Introducing GPT-5.3-Codex",
        url: "https://openai.com/index/introducing-gpt-5-3-codex/",
        publisher: "OpenAI",
        publishedAt: "2026-02-05",
        credibility: 5,
      },
    ],
    publishedAt: "2026-02-05T09:00:00Z",
    updatedAt: "2026-06-03T07:00:00Z",
    version: 2,
    metaDescription:
      "OpenAI's GPT-5.3-Codex release emphasizes faster agentic coding, frontend work, computer-use tasks, and stronger cybersecurity guardrails.",
  },
  {
    id: "article-github-copilot-sdk-ga",
    title: "GitHub Copilot SDK Reaches General Availability",
    slug: "github-copilot-sdk-general-availability",
    summary:
      "GitHub made the Copilot SDK generally available, giving teams a supported way to embed Copilot's agent runtime into apps, services, and developer tools.",
    category: "AI Coding Agents",
    tags: ["github-copilot", "sdk", "agent-runtime", "mcp"],
    authorName: "Editorial Automation Desk",
    status: "published",
    keywords: ["GitHub Copilot SDK", "agent runtime", "MCP tools"],
    entityIds: ["microsoft", "github", "github-copilot"],
    blocks: [
      {
        id: "body-1",
        type: "paragraph",
        content:
          "GitHub's June 2 changelog says the Copilot SDK is now generally available with a stable API and production-ready support. The SDK exposes the agentic runtime behind Copilot for planning, tool invocation, file edits, streaming, and multi-turn sessions.",
        sourceIds: ["src-github-copilot-sdk-ga"],
      },
      {
        id: "body-2",
        type: "paragraph",
        content:
          "The strongest signal for developer-platform teams is language and tool coverage: GitHub lists SDK support across Node.js, Python, Go, .NET, Rust, and Java, plus custom tools, MCP connections, OpenTelemetry tracing, cloud sessions, and hook points.",
        sourceIds: ["src-github-copilot-sdk-ga"],
      },
    ],
    sources: [
      {
        id: "src-github-copilot-sdk-ga",
        title: "Copilot SDK is now generally available",
        url: "https://github.blog/changelog/2026-06-02-copilot-sdk-is-now-generally-available/",
        publisher: "GitHub",
        publishedAt: "2026-06-02",
        credibility: 5,
      },
    ],
    publishedAt: "2026-06-02T10:00:00Z",
    updatedAt: "2026-06-06T00:00:00Z",
    version: 1,
    metaDescription:
      "GitHub made the Copilot SDK generally available, giving teams a supported way to embed Copilot's agent runtime into apps, services, and developer tools.",
  },
  {
    id: "article-visual-studio-agent-mode-mcp",
    title: "Visual Studio Agent Mode Adds General Availability and MCP Support",
    slug: "visual-studio-agent-mode-mcp-general-availability",
    summary:
      "Microsoft's Visual Studio June update makes Copilot agent mode generally available with MCP support for external tools and richer development context.",
    category: "IDE & CLI",
    tags: ["visual-studio", "github-copilot", "agent-mode", "mcp"],
    authorName: "Editorial Automation Desk",
    status: "published",
    keywords: ["Visual Studio agent mode", "GitHub Copilot", "Model Context Protocol"],
    entityIds: ["microsoft", "github", "github-copilot"],
    blocks: [
      {
        id: "body-1",
        type: "paragraph",
        content:
          "Microsoft says Copilot agent mode is generally available in the Visual Studio June update. The feature can plan a multi-step task, edit code, run commands, react to build or lint failures, and keep a visible action feed for review.",
        sourceIds: ["src-microsoft-vs-agent-mode"],
      },
      {
        id: "body-2",
        type: "paragraph",
        content:
          "MCP support is the important interoperability change. Visual Studio can use mcp.json configuration and compatible servers so agents can reach tools such as repositories, CI/CD systems, telemetry, or design context without bespoke integrations for every service.",
        sourceIds: ["src-microsoft-vs-agent-mode"],
      },
    ],
    sources: [
      {
        id: "src-microsoft-vs-agent-mode",
        title: "Agent mode is now generally available with MCP support",
        url: "https://devblogs.microsoft.com/visualstudio/agent-mode-is-now-generally-available-with-mcp-support/",
        publisher: "Microsoft",
        publishedAt: "2025-06-23",
        credibility: 5,
      },
    ],
    publishedAt: "2025-06-23T10:00:00Z",
    updatedAt: "2026-06-06T00:00:00Z",
    version: 1,
    metaDescription:
      "Microsoft's Visual Studio June update makes Copilot agent mode generally available with MCP support for external tools and richer development context.",
  },
  {
    id: "article-jetbrains-acp-agent-registry",
    title: "JetBrains ACP Agent Registry Opens IDE Access to Multiple Coding Agents",
    slug: "jetbrains-acp-agent-registry",
    summary:
      "JetBrains and Zed launched an ACP Agent Registry so developers can discover and install compatible AI coding agents directly inside supported IDEs.",
    category: "Agent Workflows",
    tags: ["jetbrains", "acp", "agent-registry", "interoperability"],
    authorName: "Editorial Automation Desk",
    status: "published",
    keywords: ["ACP Agent Registry", "AI coding agents", "JetBrains AI"],
    entityIds: [],
    blocks: [
      {
        id: "body-1",
        type: "paragraph",
        content:
          "JetBrains' January 28 post describes the ACP Agent Registry as a directory for AI coding agents inside JetBrains IDEs and Zed. The registry builds on Agent Client Protocol so supporting agents can work across editors through one integration pattern.",
        sourceIds: ["src-jetbrains-acp-registry"],
      },
      {
        id: "body-2",
        type: "paragraph",
        content:
          "The practical value is choice rather than another single-agent surface. Developers can install agents such as Gemini CLI, GitHub Copilot, OpenCode, Qwen Code, or other ACP-compatible tools, then switch based on task, pricing, governance, or team preference.",
        sourceIds: ["src-jetbrains-acp-registry"],
      },
    ],
    sources: [
      {
        id: "src-jetbrains-acp-registry",
        title: "ACP Agent Registry Is Live: Find and Connect AI Coding Agents in Your JetBrains IDE",
        url: "https://blog.jetbrains.com/ai/2026/01/acp-agent-registry/",
        publisher: "JetBrains",
        publishedAt: "2026-01-28",
        credibility: 5,
      },
    ],
    publishedAt: "2026-01-28T10:00:00Z",
    updatedAt: "2026-06-06T00:00:00Z",
    version: 1,
    metaDescription:
      "JetBrains and Zed launched an ACP Agent Registry so developers can discover and install compatible AI coding agents directly inside supported IDEs.",
  },
];

type DepthProfile = {
  scope: string;
  analysis: string;
  implications: string;
  readerDecision: string;
  limits: string;
};

const ARTICLE_DEPTH: Record<string, DepthProfile> = {
  "openai-codex-plugins-sites-annotations": {
    scope: "role-specific Codex workflows, hosted Sites, and annotation review",
    analysis:
      "The useful part is not that another coding assistant exists; it is that Codex output is becoming a reviewable workspace. Sites give teams a stable artifact to inspect, while annotations create a narrow feedback loop around exact paragraphs, plans, or implementation notes. That reduces the vague handoff problem that often makes agent output hard to operationalize.",
    implications:
      "Product and engineering teams should watch whether these artifacts become part of normal review rituals. If Codex Sites are used for specs, launch notes, or migration plans, the governance question shifts from prompt quality to who can publish, annotate, approve, and archive those workspaces.",
    readerDecision:
      "Treat this update as a collaboration-surface signal rather than a pure model-quality signal. The practical decision is whether Codex should sit beside documents, tickets, and code review, or remain a private assistant used by individual operators.",
    limits:
      "Limits and open questions: the source does not prove adoption, pricing impact, retention behavior, or enterprise permission defaults. Those details should stay out of the article until OpenAI publishes product docs or customers provide verifiable implementation evidence.",
  },
  "github-copilot-vscode-agents-window-may-2026": {
    scope: "VS Code agent sessions, BYOK controls, sync, browser, and terminal safety",
    analysis:
      "This update matters because the editor is moving from one chat pane to a multi-session control surface. The Agents window, changed-file search, screenshots, and session sync make it easier to compare work across agent attempts without leaving VS Code. BYOK support also changes procurement because teams can route work through approved model vendors.",
    implications:
      "Teams evaluating Copilot should test the full session lifecycle: start an agent task, inspect files changed, check terminal commands, resume the session on another machine, and confirm which model handled the work. That workflow is more important than a single prompt demo.",
    readerDecision:
      "The decision point is whether VS Code should become the main operator console for agentic development. If developers already live in VS Code, these controls may reduce tool switching; if governance lives elsewhere, the team still needs audit exports and policy alignment.",
    limits:
      "Limits and open questions: the changelog does not settle enterprise rollout timing, default BYOK cost controls, or how every terminal safeguard behaves in complex repositories. Those claims should be verified against product docs or admin-console evidence before publication.",
  },
  "github-copilot-cli-rubber-duck-prompt-scheduling": {
    scope: "terminal agent review, scheduled prompts, local voice input, and CLI ergonomics",
    analysis:
      "The notable change is the critic agent inside a terminal workflow. Rubber duck review creates a second pass before the main agent continues, which can catch weak plans, missing tests, or risky implementation shortcuts. Scheduled prompts also move CLI agents toward monitoring work, not only answering one command at a time.",
    implications:
      "For teams, the first evaluation should be operational rather than theatrical: schedule a build check, ask the critic to review a migration plan, and inspect whether the CLI produces auditable output. Voice input is useful only if it fits the team's privacy, accessibility, and workstation norms.",
    readerDecision:
      "This update is strongest for developers who prefer terminal-first workflows. It is less decisive for organizations that need centralized review logs, because prompt scheduling and critic behavior still need policy and retention boundaries.",
    limits:
      "Limits and open questions: the source does not prove reliability across shells, operating systems, or private repositories. Claims about productivity gains should wait for measured before-and-after data from real teams.",
  },
  "github-copilot-cloud-local-sandboxes-preview": {
    scope: "cloud and local execution isolation for Copilot agent tasks",
    analysis:
      "The information gain is the split between local and cloud isolation. Local sandboxes restrict file, network, and system access around command execution, while cloud sandboxes provide an ephemeral Linux environment. That distinction helps security teams decide where untrusted or high-risk agent work should run.",
    implications:
      "A practical rollout should classify tasks by risk: dependency updates and exploratory commands can use stronger isolation, while normal edits may stay local with narrower permissions. The point is not to trust the agent more; it is to reduce blast radius when the agent makes a bad call.",
    readerDecision:
      "Teams should treat sandboxes as a control layer for agent execution, not as a replacement for code review, secret scanning, or CI. The best early use case is letting an agent investigate or test without broad access to the workstation.",
    limits:
      "Limits and open questions: public preview status means behavior, pricing, platform support, and policy defaults can change. The article should not imply complete protection until GitHub documents the exact boundaries and failure modes.",
  },
  "google-antigravity-cli-gemini-cli-transition": {
    scope: "Gemini CLI migration path, Antigravity plugins, and multi-agent execution",
    analysis:
      "The useful signal is the migration deadline and plugin continuity. Google is positioning Antigravity CLI as the agent-first successor while preserving important Gemini CLI concepts such as Skills, Hooks, Subagents, and Extensions. That gives teams a concrete checklist instead of a vague platform announcement.",
    implications:
      "Teams using Gemini CLI should audit scripts, extensions, account type, and access path before the transition date. The migration work is not only installing a new CLI; it includes confirming plugin behavior, enterprise eligibility, and how asynchronous agents are monitored.",
    readerDecision:
      "This update is a planning trigger for teams with Gemini CLI in developer workflows. If the CLI is experimental, the team can wait; if it is part of internal automation, migration testing should happen before deadline pressure appears.",
    limits:
      "Limits and open questions: the source does not prove parity for every extension, nor does it describe every enterprise billing path. The article should keep those as open items until Google publishes detailed migration notes.",
  },
  "claude-code-dynamic-workflows-parallel-subagents": {
    scope: "orchestration scripts, parallel subagents, checkpoints, and high-token workflows",
    analysis:
      "The important detail is that Claude Code can generate an orchestration script and distribute work across many subagents. That is different from a single long prompt because it changes how large tasks are decomposed, checked, and merged back into a final answer.",
    implications:
      "Teams should reserve dynamic workflows for tasks with clear partitions: migration inventories, large bug hunts, security sweeps, or independent review passes. Using the feature for small edits can waste tokens and create more review work than it saves.",
    readerDecision:
      "The decision point is whether the task truly benefits from parallel investigation. If the work requires one coherent design judgement, a normal agent session may be safer; if it requires broad search across a codebase, subagents can improve coverage.",
    limits:
      "Limits and open questions: Anthropic's source warns about higher token use, and it does not guarantee that every subagent result is correct. Published updates should keep cost, review burden, and merge quality visible.",
  },
  "cursor-enterprise-organizations-governance": {
    scope: "organization containers, multiple teams, analytics, budgets, and agent permissions",
    analysis:
      "The useful change is administrative scope. Cursor is separating organization-level visibility from team-level controls, which matters when one company has different model policies, budgets, and agent permissions across engineering groups. That turns AI coding governance into an operating model rather than a single workspace setting.",
    implications:
      "Enterprise admins should map teams, identity groups, cost centers, and agent permissions before turning on broader access. The strongest early use is separating experimental groups from production-facing teams while still getting organization-level spend and usage visibility.",
    readerDecision:
      "This update is most relevant for companies already standardizing on Cursor. Smaller teams may not need organization containers yet, but enterprises should treat the feature as a policy and reporting layer.",
    limits:
      "Limits and open questions: the changelog does not establish every security default, retention policy, or export format. Those should be verified through admin docs or a controlled enterprise trial before stronger claims are made.",
  },
  "gpt-53-codex-long-running-agentic-coding": {
    scope: "long-running coding, frontend behavior, computer use, and cybersecurity safeguards",
    analysis:
      "The important angle is not only benchmark movement. OpenAI is framing GPT-5.3-Codex around longer-running work, interactive steering, frontend execution, and cybersecurity safeguards. That changes evaluation because teams need to test persistence, correction behavior, and safety boundaries over time.",
    implications:
      "A serious evaluation should include a multi-step code task, a UI fix, a command-line workflow, and a security-sensitive prompt. The goal is to see where the agent asks for steering, where it continues alone, and how monitoring behaves when the task becomes risky.",
    readerDecision:
      "Teams should compare this release against their current agent stack using work samples, not generic benchmark claims. The practical question is whether longer-running autonomy improves completed work without weakening review discipline.",
    limits:
      "Limits and open questions: model-release claims do not prove behavior in a private repository, and cybersecurity classifications need careful interpretation. The article should avoid ranking promises or safety guarantees unless product documentation supports them.",
  },
  "github-copilot-sdk-general-availability": {
    scope: "stable Copilot SDK APIs, agent runtime embedding, tools, MCP, tracing, and hooks",
    analysis:
      "The important shift is that Copilot's agent loop is no longer limited to GitHub-owned surfaces. A stable SDK gives platform teams a supported way to put planning, file edits, tool calls, and streaming sessions inside internal products without rebuilding orchestration from scratch.",
    implications:
      "Teams should evaluate the SDK as infrastructure, not a demo widget. The checklist is authentication, BYOK policy, tool permissions, trace export, session persistence, and whether custom tools can be audited when the agent acts across repositories or services.",
    readerDecision:
      "This update is most relevant if a team wants agentic workflows inside its own developer portal, CI assistant, or internal automation. If the team only needs editor help, existing Copilot surfaces may be enough.",
    limits:
      "Limits and open questions: general availability does not prove fit for every regulated environment, and the source does not publish customer-specific reliability or cost data. Those claims should wait for implementation evidence.",
  },
  "visual-studio-agent-mode-mcp-general-availability": {
    scope: "Visual Studio agent mode, MCP configuration, tool calling, and editable review controls",
    analysis:
      "The useful change is that agent mode is tied to the IDE's own tools instead of only a chat transcript. Visual Studio can let Copilot inspect code, apply edits, run commands, and respond to failures while keeping previews, undo, and action feeds visible to the developer.",
    implications:
      "Teams using Visual Studio should test agent mode against real build errors and repository workflows, then decide which MCP servers are allowed. The biggest risk is over-connecting tools before permission, logging, and data-boundary expectations are clear.",
    readerDecision:
      "This update matters most for Microsoft-stack teams that want agent workflows inside Visual Studio. Teams already standardized on VS Code or web-based agents should compare the governance model rather than treating GA as an automatic migration trigger.",
    limits:
      "Limits and open questions: the post is about Visual Studio's June update and does not guarantee identical behavior across every workload, extension, or MCP server. Security and productivity claims need local validation.",
  },
  "jetbrains-acp-agent-registry": {
    scope: "Agent Client Protocol, IDE agent discovery, one-click installation, and multi-agent choice",
    analysis:
      "The registry is an ecosystem signal more than a single product feature. ACP makes agent interoperability possible; the registry makes it discoverable enough for normal IDE users to try multiple agents without hand-editing configuration first.",
    implications:
      "Developer-experience teams should watch ACP because it can reduce lock-in and let teams compare agents inside the IDE they already use. The governance work shifts to deciding which agents are approved, how credentials are handled, and how agent output is reviewed.",
    readerDecision:
      "This update is useful for teams that want optionality across coding agents. If a company mandates one vendor, the registry may be less urgent, but it still matters as a sign that IDEs are becoming agent marketplaces.",
    limits:
      "Limits and open questions: the registry is a beta-style ecosystem step, and each agent can still require its own subscription, authentication, and safety model. The article should not imply uniform quality or support across listed agents.",
  },
};

export const seedArticles: Article[] = rawSeedArticles.map(enrichArticle);

function enrichArticle(article: Article): Article {
  const primarySource = article.sources[0];
  const sourceIds = primarySource ? [primarySource.id] : [];
  const profile = ARTICLE_DEPTH[article.slug] || fallbackDepthProfile(article);
  const blocks: ArticleBlock[] = [
    ...article.blocks,
    {
      id: "depth-evidence-table",
      type: "fact_table",
      content: [
        "Field|Current evidence",
        `Primary source|${primarySource.publisher}: ${primarySource.title}`,
        `Source date|${primarySource.publishedAt}`,
        `Update scope|${profile.scope}`,
        "Verification note|Official source only; no search-result scraping, no ranking guarantee, no uncited claims",
      ].join("\n"),
      sourceIds,
    },
    { id: "depth-heading-analysis", type: "heading", content: "What This Adds Beyond the Source", sourceIds },
    { id: "depth-analysis", type: "paragraph", content: profile.analysis, sourceIds },
    { id: "depth-heading-implications", type: "heading", content: "Operational Implications", sourceIds },
    { id: "depth-implications", type: "paragraph", content: profile.implications, sourceIds },
    { id: "depth-heading-decision", type: "heading", content: "Reader Decision Point", sourceIds },
    { id: "depth-reader-decision", type: "paragraph", content: profile.readerDecision, sourceIds },
    {
      id: "depth-source-note",
      type: "source_note",
      content: `${profile.limits} Source handling note: KyenAI records the publisher, publication date, and source URL on the page, then keeps the update date tied to evidence-backed edits rather than automatic refreshes. When source material is thin, the system keeps interpretation narrow and waits for stronger documentation. Editorial review compares the new claim against the article summary, fact table, internal links, and listed source before allowing another optimization pass. Search outcomes are measured after publication rather than assumed at writing time.`,
      sourceIds,
    },
  ];

  return { ...article, blocks };
}

function fallbackDepthProfile(article: Article): DepthProfile {
  return {
    scope: `${article.category} update from ${article.sources[0]?.publisher || "the listed source"}`,
    analysis:
      "The article separates the source fact from the operating implication so readers can see what changed and why it matters. This reduces thin rewrite risk and gives search systems clearer entities, dates, and decision context.",
    implications:
      "Teams should treat the update as a prompt for a narrow review: confirm availability, compare it with current tooling, and decide whether the change affects governance, workflow design, or measurement.",
    readerDecision:
      "The page is most useful when a reader needs a fast but sourced view of whether the update affects their roadmap. It should not replace vendor documentation for setup details.",
    limits:
      "Limits and open questions: the source does not answer every rollout, pricing, or policy detail. Those claims should wait for additional documentation or direct product evidence.",
  };
}

export const searchSignals: SearchSignal[] = [
  {
    label: "Agent Runtime Adoption",
    value: "84.2",
    change: "+19.4%",
    direction: "up",
    source: "Official changelog watchlist",
    confidence: "High",
  },
  {
    label: "Enterprise Governance",
    value: "71.8",
    change: "+24.1%",
    direction: "up",
    source: "Cursor and GitHub releases",
    confidence: "High",
  },
  {
    label: "IDE Agent Surface",
    value: "66.5",
    change: "+13.6%",
    direction: "up",
    source: "VS Code and CLI updates",
    confidence: "Medium",
  },
  {
    label: "Unverified Rumor Rate",
    value: "3.1%",
    change: "-6.4%",
    direction: "down",
    source: "Source guardrails",
    confidence: "High",
  },
];
