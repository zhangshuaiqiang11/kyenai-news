from __future__ import annotations

from typing import TypedDict

from app.models import Article, ArticleBlock, EvidenceSource, Source


class DepthProfile(TypedDict):
    scope: str
    analysis: str
    implications: str
    reader_decision: str
    limits: str


def source(
    source_id: str,
    title: str,
    url: str,
    publisher: str,
    published_at: str,
    credibility: int = 5,
) -> EvidenceSource:
    return EvidenceSource(
        id=source_id,
        title=title,
        url=url,
        publisher=publisher,
        published_at=published_at,
        credibility=credibility,
    )


def article(
    article_id: str,
    title: str,
    slug: str,
    summary: str,
    category: str,
    tags: list[str],
    keywords: list[str],
    source_item: EvidenceSource,
    published_at: str,
    updated_at: str,
    version: int,
    body: list[str],
    entity_ids: list[str],
) -> Article:
    blocks = [
        ArticleBlock(
            id=f"body-{index + 1}",
            type="paragraph",
            content=paragraph,
            source_ids=[source_item.id],
        )
        for index, paragraph in enumerate(body)
    ]
    blocks.extend(depth_blocks(slug, category, source_item))

    return Article(
        id=article_id,
        title=title,
        slug=slug,
        summary=summary,
        category=category,
        tags=tags,
        author_name="Editorial Automation Desk",
        status="published",
        keywords=keywords,
        entity_ids=entity_ids,
        blocks=blocks,
        sources=[source_item],
        published_at=published_at,
        updated_at=updated_at,
        version=version,
        meta_title=title,
        meta_description=summary,
        schema_data={"@type": "Article", "about": keywords},
    )


ARTICLE_DEPTH: dict[str, DepthProfile] = {
    "openai-codex-plugins-sites-annotations": {
        "scope": "role-specific Codex workflows, hosted Sites, and annotation review",
        "analysis": "The useful part is not that another coding assistant exists; it is that Codex output is becoming a reviewable workspace. Sites give teams a stable artifact to inspect, while annotations create a narrow feedback loop around exact paragraphs, plans, or implementation notes. That reduces the vague handoff problem that often makes agent output hard to operationalize.",
        "implications": "Product and engineering teams should watch whether these artifacts become part of normal review rituals. If Codex Sites are used for specs, launch notes, or migration plans, the governance question shifts from prompt quality to who can publish, annotate, approve, and archive those workspaces.",
        "reader_decision": "Treat this update as a collaboration-surface signal rather than a pure model-quality signal. The practical decision is whether Codex should sit beside documents, tickets, and code review, or remain a private assistant used by individual operators.",
        "limits": "Limits and open questions: the source does not prove adoption, pricing impact, retention behavior, or enterprise permission defaults. Those details should stay out of the article until OpenAI publishes product docs or customers provide verifiable implementation evidence.",
    },
    "github-copilot-vscode-agents-window-may-2026": {
        "scope": "VS Code agent sessions, BYOK controls, sync, browser, and terminal safety",
        "analysis": "This update matters because the editor is moving from one chat pane to a multi-session control surface. The Agents window, changed-file search, screenshots, and session sync make it easier to compare work across agent attempts without leaving VS Code. BYOK support also changes procurement because teams can route work through approved model vendors.",
        "implications": "Teams evaluating Copilot should test the full session lifecycle: start an agent task, inspect files changed, check terminal commands, resume the session on another machine, and confirm which model handled the work. That workflow is more important than a single prompt demo.",
        "reader_decision": "The decision point is whether VS Code should become the main operator console for agentic development. If developers already live in VS Code, these controls may reduce tool switching; if governance lives elsewhere, the team still needs audit exports and policy alignment.",
        "limits": "Limits and open questions: the changelog does not settle enterprise rollout timing, default BYOK cost controls, or how every terminal safeguard behaves in complex repositories. Those claims should be verified against product docs or admin-console evidence before publication.",
    },
    "github-copilot-cli-rubber-duck-prompt-scheduling": {
        "scope": "terminal agent review, scheduled prompts, local voice input, and CLI ergonomics",
        "analysis": "The notable change is the critic agent inside a terminal workflow. Rubber duck review creates a second pass before the main agent continues, which can catch weak plans, missing tests, or risky implementation shortcuts. Scheduled prompts also move CLI agents toward monitoring work, not only answering one command at a time.",
        "implications": "For teams, the first evaluation should be operational rather than theatrical: schedule a build check, ask the critic to review a migration plan, and inspect whether the CLI produces auditable output. Voice input is useful only if it fits the team's privacy, accessibility, and workstation norms.",
        "reader_decision": "This update is strongest for developers who prefer terminal-first workflows. It is less decisive for organizations that need centralized review logs, because prompt scheduling and critic behavior still need policy and retention boundaries.",
        "limits": "Limits and open questions: the source does not prove reliability across shells, operating systems, or private repositories. Claims about productivity gains should wait for measured before-and-after data from real teams.",
    },
    "github-copilot-cloud-local-sandboxes-preview": {
        "scope": "cloud and local execution isolation for Copilot agent tasks",
        "analysis": "The information gain is the split between local and cloud isolation. Local sandboxes restrict file, network, and system access around command execution, while cloud sandboxes provide an ephemeral Linux environment. That distinction helps security teams decide where untrusted or high-risk agent work should run.",
        "implications": "A practical rollout should classify tasks by risk: dependency updates and exploratory commands can use stronger isolation, while normal edits may stay local with narrower permissions. The point is not to trust the agent more; it is to reduce blast radius when the agent makes a bad call.",
        "reader_decision": "Teams should treat sandboxes as a control layer for agent execution, not as a replacement for code review, secret scanning, or CI. The best early use case is letting an agent investigate or test without broad access to the workstation.",
        "limits": "Limits and open questions: public preview status means behavior, pricing, platform support, and policy defaults can change. The article should not imply complete protection until GitHub documents the exact boundaries and failure modes.",
    },
    "google-antigravity-cli-gemini-cli-transition": {
        "scope": "Gemini CLI migration path, Antigravity plugins, and multi-agent execution",
        "analysis": "The useful signal is the migration deadline and plugin continuity. Google is positioning Antigravity CLI as the agent-first successor while preserving important Gemini CLI concepts such as Skills, Hooks, Subagents, and Extensions. That gives teams a concrete checklist instead of a vague platform announcement.",
        "implications": "Teams using Gemini CLI should audit scripts, extensions, account type, and access path before the transition date. The migration work is not only installing a new CLI; it includes confirming plugin behavior, enterprise eligibility, and how asynchronous agents are monitored.",
        "reader_decision": "This update is a planning trigger for teams with Gemini CLI in developer workflows. If the CLI is experimental, the team can wait; if it is part of internal automation, migration testing should happen before deadline pressure appears.",
        "limits": "Limits and open questions: the source does not prove parity for every extension, nor does it describe every enterprise billing path. The article should keep those as open items until Google publishes detailed migration notes.",
    },
    "claude-code-dynamic-workflows-parallel-subagents": {
        "scope": "orchestration scripts, parallel subagents, checkpoints, and high-token workflows",
        "analysis": "The important detail is that Claude Code can generate an orchestration script and distribute work across many subagents. That is different from a single long prompt because it changes how large tasks are decomposed, checked, and merged back into a final answer.",
        "implications": "Teams should reserve dynamic workflows for tasks with clear partitions: migration inventories, large bug hunts, security sweeps, or independent review passes. Using the feature for small edits can waste tokens and create more review work than it saves.",
        "reader_decision": "The decision point is whether the task truly benefits from parallel investigation. If the work requires one coherent design judgement, a normal agent session may be safer; if it requires broad search across a codebase, subagents can improve coverage.",
        "limits": "Limits and open questions: Anthropic's source warns about higher token use, and it does not guarantee that every subagent result is correct. Published updates should keep cost, review burden, and merge quality visible.",
    },
    "cursor-enterprise-organizations-governance": {
        "scope": "organization containers, multiple teams, analytics, budgets, and agent permissions",
        "analysis": "The useful change is administrative scope. Cursor is separating organization-level visibility from team-level controls, which matters when one company has different model policies, budgets, and agent permissions across engineering groups. That turns AI coding governance into an operating model rather than a single workspace setting.",
        "implications": "Enterprise admins should map teams, identity groups, cost centers, and agent permissions before turning on broader access. The strongest early use is separating experimental groups from production-facing teams while still getting organization-level spend and usage visibility.",
        "reader_decision": "This update is most relevant for companies already standardizing on Cursor. Smaller teams may not need organization containers yet, but enterprises should treat the feature as a policy and reporting layer.",
        "limits": "Limits and open questions: the changelog does not establish every security default, retention policy, or export format. Those should be verified through admin docs or a controlled enterprise trial before stronger claims are made.",
    },
    "gpt-53-codex-long-running-agentic-coding": {
        "scope": "long-running coding, frontend behavior, computer use, and cybersecurity safeguards",
        "analysis": "The important angle is not only benchmark movement. OpenAI is framing GPT-5.3-Codex around longer-running work, interactive steering, frontend execution, and cybersecurity safeguards. That changes evaluation because teams need to test persistence, correction behavior, and safety boundaries over time.",
        "implications": "A serious evaluation should include a multi-step code task, a UI fix, a command-line workflow, and a security-sensitive prompt. The goal is to see where the agent asks for steering, where it continues alone, and how monitoring behaves when the task becomes risky.",
        "reader_decision": "Teams should compare this release against their current agent stack using work samples, not generic benchmark claims. The practical question is whether longer-running autonomy improves completed work without weakening review discipline.",
        "limits": "Limits and open questions: model-release claims do not prove behavior in a private repository, and cybersecurity classifications need careful interpretation. The article should avoid ranking promises or safety guarantees unless product documentation supports them.",
    },
    "github-copilot-sdk-general-availability": {
        "scope": "stable Copilot SDK APIs, agent runtime embedding, tools, MCP, tracing, and hooks",
        "analysis": "The important shift is that Copilot's agent loop is no longer limited to GitHub-owned surfaces. A stable SDK gives platform teams a supported way to put planning, file edits, tool calls, and streaming sessions inside internal products without rebuilding orchestration from scratch.",
        "implications": "Teams should evaluate the SDK as infrastructure, not a demo widget. The checklist is authentication, BYOK policy, tool permissions, trace export, session persistence, and whether custom tools can be audited when the agent acts across repositories or services.",
        "reader_decision": "This update is most relevant if a team wants agentic workflows inside its own developer portal, CI assistant, or internal automation. If the team only needs editor help, existing Copilot surfaces may be enough.",
        "limits": "Limits and open questions: general availability does not prove fit for every regulated environment, and the source does not publish customer-specific reliability or cost data. Those claims should wait for implementation evidence.",
    },
    "visual-studio-agent-mode-mcp-general-availability": {
        "scope": "Visual Studio agent mode, MCP configuration, tool calling, and editable review controls",
        "analysis": "The useful change is that agent mode is tied to the IDE's own tools instead of only a chat transcript. Visual Studio can let Copilot inspect code, apply edits, run commands, and respond to failures while keeping previews, undo, and action feeds visible to the developer.",
        "implications": "Teams using Visual Studio should test agent mode against real build errors and repository workflows, then decide which MCP servers are allowed. The biggest risk is over-connecting tools before permission, logging, and data-boundary expectations are clear.",
        "reader_decision": "This update matters most for Microsoft-stack teams that want agent workflows inside Visual Studio. Teams already standardized on VS Code or web-based agents should compare the governance model rather than treating GA as an automatic migration trigger.",
        "limits": "Limits and open questions: the post is about Visual Studio's June update and does not guarantee identical behavior across every workload, extension, or MCP server. Security and productivity claims need local validation.",
    },
    "jetbrains-acp-agent-registry": {
        "scope": "Agent Client Protocol, IDE agent discovery, one-click installation, and multi-agent choice",
        "analysis": "The registry is an ecosystem signal more than a single product feature. ACP makes agent interoperability possible; the registry makes it discoverable enough for normal IDE users to try multiple agents without hand-editing configuration first.",
        "implications": "Developer-experience teams should watch ACP because it can reduce lock-in and let teams compare agents inside the IDE they already use. The governance work shifts to deciding which agents are approved, how credentials are handled, and how agent output is reviewed.",
        "reader_decision": "This update is useful for teams that want optionality across coding agents. If a company mandates one vendor, the registry may be less urgent, but it still matters as a sign that IDEs are becoming agent marketplaces.",
        "limits": "Limits and open questions: the registry is a beta-style ecosystem step, and each agent can still require its own subscription, authentication, and safety model. The article should not imply uniform quality or support across listed agents.",
    },
}


def depth_blocks(slug: str, category: str, source_item: EvidenceSource) -> list[ArticleBlock]:
    profile = ARTICLE_DEPTH.get(slug) or {
        "scope": f"{category} update from {source_item.publisher}",
        "analysis": "The article separates the source fact from the operating implication so readers can see what changed and why it matters. This reduces thin rewrite risk and gives search systems clearer entities, dates, and decision context.",
        "implications": "Teams should treat the update as a prompt for a narrow review: confirm availability, compare it with current tooling, and decide whether the change affects governance, workflow design, or measurement.",
        "reader_decision": "The page is most useful when a reader needs a fast but sourced view of whether the update affects their roadmap. It should not replace vendor documentation for setup details.",
        "limits": "Limits and open questions: the source does not answer every rollout, pricing, or policy detail. Those claims should wait for additional documentation or direct product evidence.",
    }
    source_ids = [source_item.id]
    return [
        ArticleBlock(
            id="depth-evidence-table",
            type="fact_table",
            content="\n".join(
                [
                    "Field|Current evidence",
                    f"Primary source|{source_item.publisher}: {source_item.title}",
                    f"Source date|{source_item.published_at}",
                    f"Update scope|{profile['scope']}",
                    "Verification note|Official source only; no search-result scraping, no ranking guarantee, no uncited claims",
                ]
            ),
            source_ids=source_ids,
        ),
        ArticleBlock(id="depth-heading-analysis", type="heading", content="What This Adds Beyond the Source", source_ids=source_ids),
        ArticleBlock(id="depth-analysis", type="paragraph", content=profile["analysis"], source_ids=source_ids),
        ArticleBlock(id="depth-heading-implications", type="heading", content="Operational Implications", source_ids=source_ids),
        ArticleBlock(id="depth-implications", type="paragraph", content=profile["implications"], source_ids=source_ids),
        ArticleBlock(id="depth-heading-decision", type="heading", content="Reader Decision Point", source_ids=source_ids),
        ArticleBlock(id="depth-reader-decision", type="paragraph", content=profile["reader_decision"], source_ids=source_ids),
        ArticleBlock(
            id="depth-source-note",
            type="source_note",
            content=f"{profile['limits']} Source handling note: KyenAI records the publisher, publication date, and source URL on the page, then keeps the update date tied to evidence-backed edits rather than automatic refreshes. When source material is thin, the system keeps interpretation narrow and waits for stronger documentation. Editorial review compares the new claim against the article summary, fact table, internal links, and listed source before allowing another optimization pass. Search outcomes are measured after publication rather than assumed at writing time.",
            source_ids=source_ids,
        ),
    ]


OPENAI_CODEX_ROLES = source(
    "src-openai-codex-roles",
    "Codex for every role, tool, and workflow",
    "https://openai.com/index/codex-for-every-role-tool-workflow/",
    "OpenAI",
    "2026-06-02",
)

OPENAI_GPT_53_CODEX = source(
    "src-openai-gpt-53-codex",
    "Introducing GPT-5.3-Codex",
    "https://openai.com/index/introducing-gpt-5-3-codex/",
    "OpenAI",
    "2026-02-05",
)

GITHUB_VSCODE_MAY = source(
    "src-github-vscode-may",
    "GitHub Copilot in Visual Studio Code, May releases",
    "https://github.blog/changelog/2026-06-03-github-copilot-in-visual-studio-code-may-releases/",
    "GitHub",
    "2026-06-03",
)

GITHUB_CLI = source(
    "src-github-copilot-cli",
    "Copilot CLI: Improved UI, rubber duck, prompt scheduling, and voice input",
    "https://github.blog/changelog/2026-06-02-copilot-cli-improved-ui-rubber-duck-prompt-scheduling-and-voice-input/",
    "GitHub",
    "2026-06-02",
)

GITHUB_SANDBOXES = source(
    "src-github-copilot-sandboxes",
    "Cloud and local sandboxes for GitHub Copilot now in public preview",
    "https://github.blog/changelog/2026-06-02-cloud-and-local-sandboxes-for-github-copilot-now-in-public-preview/",
    "GitHub",
    "2026-06-02",
)

GOOGLE_ANTIGRAVITY = source(
    "src-google-antigravity-cli",
    "An important update: Transitioning Gemini CLI to Antigravity CLI",
    "https://developers.googleblog.com/en/an-important-update-transitioning-gemini-cli-to-antigravity-cli/",
    "Google",
    "2026-05-19",
)

ANTHROPIC_WORKFLOWS = source(
    "src-anthropic-dynamic-workflows",
    "Introducing dynamic workflows in Claude Code",
    "https://claude.com/blog/introducing-dynamic-workflows-in-claude-code",
    "Anthropic",
    "2026-05-28",
)

CURSOR_ENTERPRISE = source(
    "src-cursor-enterprise-orgs",
    "Organizations for Cursor Enterprise",
    "https://cursor.com/changelog/enterprise-organizations",
    "Cursor",
    "2026-06-03",
)


GITHUB_COPILOT_SDK_GA = source(
    "src-github-copilot-sdk-ga",
    "Copilot SDK is now generally available",
    "https://github.blog/changelog/2026-06-02-copilot-sdk-is-now-generally-available/",
    "GitHub",
    "2026-06-02",
)

MICROSOFT_VS_AGENT_MODE = source(
    "src-microsoft-vs-agent-mode",
    "Agent mode is now generally available with MCP support",
    "https://devblogs.microsoft.com/visualstudio/agent-mode-is-now-generally-available-with-mcp-support/",
    "Microsoft",
    "2025-06-23",
)

JETBRAINS_ACP_REGISTRY = source(
    "src-jetbrains-acp-registry",
    "ACP Agent Registry Is Live: Find and Connect AI Coding Agents in Your JetBrains IDE",
    "https://blog.jetbrains.com/ai/2026/01/acp-agent-registry/",
    "JetBrains",
    "2026-01-28",
)


def seed_articles() -> list[Article]:
    return [
        article(
            "article-codex-roles",
            "OpenAI Expands Codex into Plugins, Sites, and Annotations",
            "openai-codex-plugins-sites-annotations",
            "OpenAI's June 2026 Codex update turns coding-agent workflows into role-specific plugins, shareable sites, and in-place annotations.",
            "AI Coding Agents",
            ["codex", "plugins", "sites", "knowledge-work"],
            ["OpenAI Codex", "AI coding agents", "agent tools"],
            OPENAI_CODEX_ROLES,
            "2026-06-02T09:00:00Z",
            "2026-06-04T07:00:00Z",
            1,
            [
                "OpenAI's latest Codex release broadens the product beyond software engineering. The update introduces role-specific plugins, hosted Sites, and annotation-based refinement so teams can turn analysis, plans, and briefs into interactive workspaces.",
                "For AI coding teams, the practical signal is that agent work is moving from isolated code generation into shared, reviewable artifacts. A strong portal article should track availability, workspace controls, and how Sites change developer handoff patterns.",
            ],
            ["openai", "openai-codex", "chatgpt"],
        ),
        article(
            "article-github-vscode-agents",
            "GitHub Brings Agent-First Workflows Deeper into VS Code Stable",
            "github-copilot-vscode-agents-window-may-2026",
            "GitHub's June 3 changelog highlights the Agents window preview, BYOK controls, session sync, terminal safety, and integrated browser improvements in VS Code.",
            "AI Coding Agents",
            ["github-copilot", "vscode", "agents-window", "byok"],
            ["GitHub Copilot", "VS Code agents", "BYOK coding models"],
            GITHUB_VSCODE_MAY,
            "2026-06-03T09:00:00Z",
            "2026-06-04T07:00:00Z",
            1,
            [
                "GitHub's May release cycle for Copilot in VS Code moves the editor closer to an agent-first workspace. The Agents window is now in Stable as a preview, while remote agents, session sync, BYOK model routing, and terminal safety controls make longer-running coding sessions easier to govern.",
                "This is useful news for teams comparing local IDE agents with cloud agents: VS Code is becoming a command center for multiple sessions, changed-file search, screenshots, and model selection rather than only a chat sidebar.",
            ],
            ["microsoft", "github", "github-copilot", "visual-studio-code"],
        ),
        article(
            "article-copilot-cli-refresh",
            "Copilot CLI Adds Rubber Duck Review, Prompt Scheduling, and Voice Input",
            "github-copilot-cli-rubber-duck-prompt-scheduling",
            "GitHub's Copilot CLI refresh adds a redesigned terminal experience, a critic agent, scheduled prompts, and local voice input.",
            "IDE & CLI",
            ["github-copilot", "cli", "terminal-agents", "review"],
            ["Copilot CLI", "AI terminal agent", "rubber duck review"],
            GITHUB_CLI,
            "2026-06-02T09:00:00Z",
            "2026-06-04T07:00:00Z",
            1,
            [
                "GitHub Copilot CLI now has a refreshed terminal surface and a rubber duck agent that can critique plans, implementation, or tests before the main agent continues.",
                "Prompt scheduling with /every and /after points toward terminal agents that keep checking builds, usage, or repo state over time. Voice input is local, which matters for teams evaluating privacy and developer ergonomics.",
            ],
            ["microsoft", "github", "github-copilot"],
        ),
        article(
            "article-copilot-sandboxes",
            "GitHub Copilot Sandboxes Put Agent Execution Behind Policy Boundaries",
            "github-copilot-cloud-local-sandboxes-preview",
            "GitHub's public preview for cloud and local sandboxes gives Copilot isolated execution environments for agentic development.",
            "Security & Governance",
            ["github-copilot", "sandboxes", "security", "governance"],
            ["Copilot sandboxes", "agentic development security", "AI coding governance"],
            GITHUB_SANDBOXES,
            "2026-06-02T09:00:00Z",
            "2026-06-04T07:00:00Z",
            1,
            [
                "GitHub now lets Copilot run inside isolated local or cloud sandboxes. Local sandboxing restricts filesystem, network, and system access for command execution, while cloud sandboxes provide ephemeral Linux environments hosted by GitHub.",
                "For enterprise AI coding adoption, the product shift is clear: agents need execution layers with identity, policy, and isolation. This article belongs in security and governance monitoring, not just productivity coverage.",
            ],
            ["microsoft", "github", "github-copilot"],
        ),
        article(
            "article-google-antigravity-cli",
            "Google Moves Gemini CLI Users toward Antigravity CLI",
            "google-antigravity-cli-gemini-cli-transition",
            "Google is unifying Gemini CLI and Code Assist workflows into Antigravity CLI, an agent-first platform with asynchronous multi-agent execution.",
            "IDE & CLI",
            ["google", "antigravity", "gemini-cli", "multi-agent"],
            ["Antigravity CLI", "Gemini CLI", "multi-agent coding"],
            GOOGLE_ANTIGRAVITY,
            "2026-05-19T09:00:00Z",
            "2026-06-04T07:00:00Z",
            1,
            [
                "Google's Antigravity CLI announcement frames the migration as a move from a terminal assistant to a unified agent-first platform. The new CLI keeps critical Gemini CLI features such as Agent Skills, Hooks, Subagents, and Extensions as Antigravity plugins.",
                "The important timeline is operational: individual and free Gemini CLI and Gemini Code Assist users need to transition before June 18, 2026, while enterprise access remains under paid Google Cloud and Gemini Enterprise arrangements.",
            ],
            ["google", "gemini"],
        ),
        article(
            "article-claude-code-workflows",
            "Claude Code Dynamic Workflows Coordinate Parallel Subagents",
            "claude-code-dynamic-workflows-parallel-subagents",
            "Anthropic's Claude Code dynamic workflows can generate orchestration scripts, fan work out to subagents, and checkpoint long-running engineering tasks.",
            "Agent Workflows",
            ["claude-code", "dynamic-workflows", "subagents", "migrations"],
            ["Claude Code", "dynamic workflows", "parallel subagents"],
            ANTHROPIC_WORKFLOWS,
            "2026-05-28T09:00:00Z",
            "2026-06-04T07:00:00Z",
            1,
            [
                "Anthropic introduced dynamic workflows for Claude Code on May 28, 2026. The feature lets Claude write orchestration scripts and coordinate tens to hundreds of parallel subagents in one session.",
                "The strongest fit is large engineering work: codebase-wide bug hunts, security audits, framework migrations, and independent adversarial review before results reach the user. The tradeoff is usage: Anthropic warns dynamic workflows consume meaningfully more tokens than normal Claude Code sessions.",
            ],
            ["anthropic", "claude-code"],
        ),
        article(
            "article-cursor-enterprise-orgs",
            "Cursor Enterprise Adds Organization-Level Governance",
            "cursor-enterprise-organizations-governance",
            "Cursor's June 3 changelog adds organization containers, multi-team support, usage analytics, and group-level agent permissions for enterprise deployments.",
            "Security & Governance",
            ["cursor", "enterprise", "governance", "agent-permissions"],
            ["Cursor Enterprise", "AI coding governance", "agent permissions"],
            CURSOR_ENTERPRISE,
            "2026-06-03T09:00:00Z",
            "2026-06-04T07:00:00Z",
            1,
            [
                "Cursor Enterprise can now manage multiple teams from one organization-level container. Admins get a rollup of spend and token usage, identity controls, and separate security, governance, budget, and feature settings for each team.",
                "The new group model is especially relevant for agent governance because cohorts can receive separate model access, spend limits, and agent permissions without creating a new team.",
            ],
            ["cursor"],
        ),
        article(
            "article-gpt-53-codex",
            "GPT-5.3-Codex Pushes Coding Agents toward Longer-Running Work",
            "gpt-53-codex-long-running-agentic-coding",
            "OpenAI's GPT-5.3-Codex release emphasizes faster agentic coding, frontend work, computer-use tasks, and stronger cybersecurity guardrails.",
            "AI Coding Agents",
            ["openai", "gpt-5-3-codex", "coding-models", "security"],
            ["GPT-5.3-Codex", "agentic coding model", "AI coding security"],
            OPENAI_GPT_53_CODEX,
            "2026-02-05T09:00:00Z",
            "2026-06-03T07:00:00Z",
            2,
            [
                "OpenAI describes GPT-5.3-Codex as a model for long-running coding and computer-use tasks. The release highlights benchmark gains, stronger web development behavior, and more interactive steering while the agent works.",
                "The cybersecurity section matters for product teams: OpenAI says the model is classified as high capability for cybersecurity-related tasks and is paired with strengthened safeguards, trusted access, monitoring, and enforcement pipelines.",
            ],
            ["openai", "openai-codex", "chatgpt"],
        ),
        article(
            "article-github-copilot-sdk-ga",
            "GitHub Copilot SDK Reaches General Availability",
            "github-copilot-sdk-general-availability",
            "GitHub made the Copilot SDK generally available, giving teams a supported way to embed Copilot's agent runtime into apps, services, and developer tools.",
            "AI Coding Agents",
            ["github-copilot", "sdk", "agent-runtime", "mcp"],
            ["GitHub Copilot SDK", "agent runtime", "MCP tools"],
            GITHUB_COPILOT_SDK_GA,
            "2026-06-02T10:00:00Z",
            "2026-06-06T00:00:00Z",
            1,
            [
                "GitHub's June 2 changelog says the Copilot SDK is now generally available with a stable API and production-ready support. The SDK exposes the agentic runtime behind Copilot for planning, tool invocation, file edits, streaming, and multi-turn sessions.",
                "The strongest signal for developer-platform teams is language and tool coverage: GitHub lists SDK support across Node.js, Python, Go, .NET, Rust, and Java, plus custom tools, MCP connections, OpenTelemetry tracing, cloud sessions, and hook points.",
            ],
            ["microsoft", "github", "github-copilot"],
        ),
        article(
            "article-visual-studio-agent-mode-mcp",
            "Visual Studio Agent Mode Adds General Availability and MCP Support",
            "visual-studio-agent-mode-mcp-general-availability",
            "Microsoft's Visual Studio June update makes Copilot agent mode generally available with MCP support for external tools and richer development context.",
            "IDE & CLI",
            ["visual-studio", "github-copilot", "agent-mode", "mcp"],
            ["Visual Studio agent mode", "GitHub Copilot", "Model Context Protocol"],
            MICROSOFT_VS_AGENT_MODE,
            "2025-06-23T10:00:00Z",
            "2026-06-06T00:00:00Z",
            1,
            [
                "Microsoft says Copilot agent mode is generally available in the Visual Studio June update. The feature can plan a multi-step task, edit code, run commands, react to build or lint failures, and keep a visible action feed for review.",
                "MCP support is the important interoperability change. Visual Studio can use mcp.json configuration and compatible servers so agents can reach tools such as repositories, CI/CD systems, telemetry, or design context without bespoke integrations for every service.",
            ],
            ["microsoft", "github", "github-copilot"],
        ),
        article(
            "article-jetbrains-acp-agent-registry",
            "JetBrains ACP Agent Registry Opens IDE Access to Multiple Coding Agents",
            "jetbrains-acp-agent-registry",
            "JetBrains and Zed launched an ACP Agent Registry so developers can discover and install compatible AI coding agents directly inside supported IDEs.",
            "Agent Workflows",
            ["jetbrains", "acp", "agent-registry", "interoperability"],
            ["ACP Agent Registry", "AI coding agents", "JetBrains AI"],
            JETBRAINS_ACP_REGISTRY,
            "2026-01-28T10:00:00Z",
            "2026-06-06T00:00:00Z",
            1,
            [
                "JetBrains' January 28 post describes the ACP Agent Registry as a directory for AI coding agents inside JetBrains IDEs and Zed. The registry builds on Agent Client Protocol so supporting agents can work across editors through one integration pattern.",
                "The practical value is choice rather than another single-agent surface. Developers can install agents such as Gemini CLI, GitHub Copilot, OpenCode, Qwen Code, or other ACP-compatible tools, then switch based on task, pricing, governance, or team preference.",
            ],
            [],
        ),
    ]


def seed_sources() -> list[Source]:
    return [
        Source(
            id=f"watch-{source_item.id}",
            name=source_item.title,
            url=source_item.url,
            type="web",
            credibility=source_item.credibility,
            crawl_frequency="daily",
        )
        for source_item in [
            OPENAI_CODEX_ROLES,
            OPENAI_GPT_53_CODEX,
            GITHUB_VSCODE_MAY,
            GITHUB_CLI,
            GITHUB_SANDBOXES,
            GOOGLE_ANTIGRAVITY,
            ANTHROPIC_WORKFLOWS,
            CURSOR_ENTERPRISE,
            GITHUB_COPILOT_SDK_GA,
            MICROSOFT_VS_AGENT_MODE,
            JETBRAINS_ACP_REGISTRY,
        ]
    ]
