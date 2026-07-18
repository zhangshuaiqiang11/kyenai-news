import type { Guide } from "./types";

export const expansionGuides: Guide[] = [
  {
    id: "guide-codex-vs-claude-code",
    title: "Codex vs Claude Code",
    slug: "codex-vs-claude-code",
    summary:
      "Compare Codex vs Claude Code by workflow shape, public same-task examples, repository instructions, review effort, and a same-repo checklist your team can run before standardizing.",
    intent: "Developers want a plain comparison of Codex and Claude Code before choosing an AI coding agent.",
    audience: "Developers, staff engineers, and team leads comparing agentic coding tools for real repositories.",
    pageType: "Comparison decision guide",
    secondaryKeywords: ["OpenAI Codex vs Claude Code", "Codex alternatives", "AI coding agent comparison", "agentic loop AI coding"],
    sections: [
      {
        heading: "Quick answer",
        body: [
          "Choose Codex when your workflow centers on AGENTS.md, GitHub-oriented agent execution, built-in parallel worktrees, and OpenAI tooling. Choose Claude Code when terminal-native workflows, CLAUDE.md project memory, hooks, MCP, and Anthropic deployment options better match your team. The better choice depends more on repository workflow, permissions, data controls, and review requirements than on a single benchmark.",
        ],
      },
      {
        heading: "Simple way to decide",
        body: [
          "If the work starts from a product question, a plan, or a review in ChatGPT, Codex is usually the easier first stop.",
          "If the work starts inside a repo with commands, local files, and repeated engineering routines, Claude Code is often the more natural fit.",
          "Neither choice removes review. Treat both tools as agents that can draft, edit, and test, not as a replacement for ownership.",
        ],
      },
      {
        heading: "Where the difference matters",
        body: [
          "The practical difference is workflow shape. Codex fits teams that want OpenAI-native agent work and a bridge from discussion to code. Claude Code fits teams that want command-line control, local project memory, and explicit automation boundaries.",
          "For a small team, the best test is one real bug fix and one real refactor. Watch which tool asks for clearer instructions, which one handles test failures better, and which one leaves a diff that is easier to review.",
        ],
      },
      {
        heading: "Public example evidence",
        body: [
          "Public same-prompt examples can help choose evaluation dimensions, but they should not be treated as universal benchmark data. In one Tom's Guide comparison published on May 17, 2026, Claude Code was described as stronger for immediate usability on a subscription tracker, while Codex was described as stronger for deeper data handling and analytical dashboards on grocery comparison and financing calculator tasks.",
          "Use that as an example of what to measure, not a final verdict for your repository. A real engineering team still needs repository tasks: a bug fix, an API addition, a component refactor, and a test or CI repair under the same prompt, same files, same allowed tools, and same verification command.",
        ],
      },
      {
        heading: "Same-task experiment protocol",
        body: [
          "Run four tasks in the same clean repository state: fix one failing test, add one small API endpoint, refactor one UI component without behavior change, and add or repair one test. For each tool, record elapsed time, changed files, verification pass or fail, human interventions, wrong edits, cost or token use when available, and whether the tool followed AGENTS.md or CLAUDE.md correctly.",
          "If a metric is not captured, write Not measured instead of guessing. Public examples can seed hypotheses, but your decision should come from review effort, reproducibility, safety behavior, and whether the final diff is easy for the team to own.",
        ],
      },
      {
        heading: "Same-repo scoring rubric",
        body: [
          "Score each run on five dimensions: verification outcome, review effort, safety behavior, instruction-file compliance, and diff clarity. Use pass, partial, or fail for verification; low, medium, or high for review effort; and note any permission widening, secret exposure, or unapproved writes.",
          "Prefer the tool that passes verification with the smallest diff and the fewest human interventions, not the tool that finishes fastest with noisy edits. Tie-break with team workflow fit: terminal-first teams may accept more local setup if review effort drops; OpenAI-native teams may accept cloud handoff if artifacts are easier to share.",
        ],
      },
    ],
    recommendedPlay: [
      "Run the same small bug fix in both tools before deciding.",
      "Score the output by review effort, test behavior, safety prompts, and how easy the final diff is to understand.",
      "Keep the page updated with product behavior and official docs, not vague model claims.",
      "Use public examples as hypotheses, then replace them with measured repository data once your team runs the protocol.",
    ],
    decisionTable: {
      title: "Codex vs Claude Code across 13 decision dimensions",
      intro: "Use this source-aware matrix to choose a pilot starting point. Verify product behavior against the linked official documentation before procurement or rollout.",
      columns: ["Choose Codex when", "Choose Claude Code when", "Check before rollout"],
      rows: [
        {
          label: "Installation and runtime",
          values: [
            "You want Codex across app, CLI, IDE, and cloud task surfaces",
            "You want a terminal-native CLI on macOS, Linux, or Windows environments documented by Anthropic",
            "Confirm supported operating systems, authentication, and where execution occurs",
          ],
        },
        {
          label: "Context and repository understanding",
          values: [
            "Open files, selected code, repository setup, and task threads fit the planned handoff",
            "Interactive terminal sessions and resumable local project context fit daily work",
            "Use the same repository state and task boundary; do not compare model marketing claims",
          ],
        },
        {
          label: "Instruction files",
          values: [
            "You maintain root or nested AGENTS.md files",
            "You maintain CLAUDE.md project memory and Claude-specific workflow notes",
            "Keep commands and security rules consistent across files",
          ],
        },
        {
          label: "Permission model",
          values: [
            "Codex approval rules and elevated-command controls match team policy",
            "Claude Code allowed/disallowed tools and permission modes match team policy",
            "Test denied commands, approval prompts, and destructive-action handling",
          ],
        },
        {
          label: "Sandbox",
          values: [
            "Configurable Codex sandboxing and restricted network access fit the threat model",
            "Claude Code filesystem and permission boundaries fit the local environment",
            "Verify write roots, network access, secrets exposure, and escalation paths",
          ],
        },
        {
          label: "GitHub workflow",
          values: [
            "Cloud task delegation, pull requests, reviews, or app handoff are primary",
            "Terminal work that ends in the team's existing Git and PR flow is primary",
            "Measure final diff clarity, test evidence, and reviewer interventions",
          ],
        },
        {
          label: "Parallel tasks",
          values: [
            "Built-in agent threads and isolated worktrees are useful",
            "Claude Code subagents and terminal coordination match the workflow",
            "Prohibit agents from editing the same worktree or files concurrently",
          ],
        },
        {
          label: "MCP and tools",
          values: [
            "Codex skills, apps, web search, and MCP connections fit current tools",
            "Claude Code hooks, MCP servers, and CLI automation fit current tools",
            "Inventory every tool, credential, network destination, and write capability",
          ],
        },
        {
          label: "Enterprise governance",
          values: [
            "OpenAI workspace policies and managed Codex requirements fit governance",
            "Anthropic organization controls or the chosen enterprise platform fit governance",
            "Confirm SSO, audit logs, policy enforcement, retention, and offboarding",
          ],
        },
        {
          label: "Data control",
          values: [
            "The approved OpenAI plan and execution surface meet data requirements",
            "Anthropic API, Amazon Bedrock, or Google Vertex AI routing meets data requirements",
            "Review current contracts and data policies; do not infer them from product names",
          ],
        },
        {
          label: "Cost structure",
          values: [
            "Existing ChatGPT/Codex access and credit model fits measured usage",
            "Existing Claude subscription, API, Bedrock, or Vertex billing fits measured usage",
            "Capture actual task cost and rate limits; write Not measured when unavailable",
          ],
        },
        {
          label: "Best-fit team",
          values: [
            "OpenAI-native teams want app, IDE, cloud, review, and parallel-agent handoff",
            "Terminal-first teams want local commands, hooks, MCP, and subagent workflows",
            "Pilot with the engineers and reviewers who will own the production workflow",
          ],
        },
        {
          label: "Poor-fit scenario",
          values: [
            "Avoid when required controls or surfaces cannot be approved or reproduced",
            "Avoid when terminal access, provider routing, or required permissions cannot be approved",
            "Use neither for an unbounded task with no proof command, owner, or rollback",
          ],
        },
      ],
    },
    actionSteps: [
      {
        title: "Pick one real task",
        body: "Use a small bug, a failing test, or a contained UI change so both tools face the same job.",
      },
      {
        title: "Give both tools the same boundary",
        body: "Name the files they may touch, the command that proves success, and the parts of the repo they should not change.",
      },
      {
        title: "Review the diff, not the demo",
        body: "Compare final code, test output, reasoning notes, and any extra files created along the way.",
      },
      {
        title: "Record unavailable metrics honestly",
        body: "Use Not measured for time, cost, tokens, changed files, or human interventions when the run did not capture them.",
      },
      {
        title: "Choose by workflow fit",
        body: "Pick the tool that your team can review and repeat safely, even if the other tool produced a flashier first answer.",
      },
    ],
    pitfalls: [
      {
        title: "Ranking tools without a task",
        fix: "Use one actual repository task instead of judging from product descriptions.",
      },
      {
        title: "Ignoring review cost",
        fix: "A fast answer is not useful if the diff takes longer to trust.",
      },
      {
        title: "Mixing instruction files",
        fix: "Keep shared project rules consistent across AGENTS.md, CLAUDE.md, and other tool-specific files.",
      },
      {
        title: "Treating public app demos as repo benchmarks",
        fix: "Use public examples to choose dimensions, then run the same controlled task inside your own repository.",
      },
    ],
    internalLinks: [
      {
        slug: "ai-coding-agents-comparison",
        anchor: "compare Codex, Claude Code, Cursor, and GitHub Copilot",
        reason: "Start with the four-tool operating-model map before narrowing to the OpenAI-versus-Anthropic decision.",
      },
      {
        slug: "claude-code-alternatives",
        anchor: "compare seven Claude Code alternatives by workflow",
        reason: "Use the alternatives guide when the decision extends beyond the focused OpenAI-versus-Anthropic comparison.",
      },
      {
        slug: "agents-md-vs-claude-md-cursorrules-copilot-instructions",
        anchor: "AI coding agent instruction files",
        reason: "Tool choice is easier when repository instructions are already clean.",
      },
      {
        slug: "claude-code-subagents-examples",
        anchor: "Claude Code subagents examples",
        reason: "Claude Code becomes more useful when delegation patterns are clear.",
      },
      {
        slug: "agents-md-template-for-ai-coding-agents",
        anchor: "AGENTS.md template",
        reason: "Codex workflows need clear repo instructions before serious use.",
      },
      {
        slug: "loop-engineering-ai-coding-agents",
        anchor: "loop engineering for AI coding agents",
        reason: "Tool choice often leads to whether work stays in one session or becomes a durable plan-execute-verify loop.",
      },
      {
        slug: "codex-vs-github-copilot",
        anchor: "Codex vs GitHub Copilot",
        reason: "Teams comparing OpenAI and Anthropic should also separate model choice from the GitHub control-plane decision.",
      },
    ],
    checklist: [
      "Use one real bug fix for the comparison.",
      "Use the same prompt and repo boundary for both tools.",
      "Run the same verification command.",
      "Compare review effort, not only completion speed.",
      "Record which tool handled failures more clearly.",
      "Update the decision after product behavior changes.",
    ],
    evidence: [
      {
        title: "Introducing the Codex app",
        url: "https://openai.com/index/introducing-the-codex-app/",
        publisher: "OpenAI",
        note: "Official reference for Codex app surfaces, parallel agent threads, worktrees, sandboxing, and availability.",
      },
      {
        title: "OpenAI Codex AGENTS.md documentation",
        url: "https://learn.chatgpt.com/docs/agent-configuration/agents-md",
        publisher: "OpenAI",
        note: "Official repository guidance for AGENTS.md behavior.",
      },
      {
        title: "Claude Code overview",
        url: "https://code.claude.com/docs/en/overview",
        publisher: "Anthropic",
        note: "Official Claude Code workflow overview.",
      },
      {
        title: "Claude Code CLI reference",
        url: "https://docs.anthropic.com/en/docs/claude-code/cli-usage",
        publisher: "Anthropic",
        note: "Official reference for permission flags, headless runs, session continuation, and MCP configuration.",
      },
      {
        title: "Claude Code autonomous workflow update",
        url: "https://www.anthropic.com/news/enabling-claude-code-to-work-more-autonomously",
        publisher: "Anthropic",
        note: "Official note on Claude Code surfaces, checkpoints, subagents, hooks, and background work.",
      },
      {
        title: "Tom's Guide Codex vs Claude Code practical comparison",
        url: "https://www.tomsguide.com/ai/claude-code-vs-openai-codex-i-built-3-real-apps-to-find-the-better-agent-heres-the-verdict",
        publisher: "Tom's Guide",
        note: "Public practical app-building comparison used as an external example, not KyenAI benchmark data.",
      },
    ],
    relatedArticleSlugs: ["openai-codex-plugins-sites-annotations", "claude-code-dynamic-workflows-parallel-subagents"],
    publishedAt: "2026-06-14",
    updatedAt: "2026-07-19",
    metaTitle: "Codex vs Claude Code: Workflow Fit and Same-Repo Test Checklist",
    metaDescription:
      "Compare Codex and Claude Code by repo workflow, instruction files, review effort, MCP/hooks, and a same-task protocol before standardizing.",
    resourceIds: ["codex-claude-decision"],
  },
  {
    id: "guide-agents-md-template",
    title: "AGENTS.md Template for Codex and Monorepos",
    slug: "agents-md-template-for-ai-coding-agents",
    summary:
      "Copy tested AGENTS.md templates for Codex, Node.js, Python, and monorepos, with setup commands, test rules, safe edit boundaries, loading precedence, and review checks.",
    intent: "Developers want a copyable AGENTS.md template instead of another explanation of what instruction files are.",
    audience: "Developers setting up Codex-compatible agents, team leads standardizing repo instructions, and maintainers cleaning stale agent rules.",
    pageType: "Template and checklist",
    secondaryKeywords: ["AGENTS.md template", "AI coding agent instructions template", "Codex AGENTS.md example", "repository instructions template"],
    sections: [
      {
        heading: "Quick answer",
        body: [
          "A useful AGENTS.md template gives Codex copyable repo instructions: project purpose, install command, test command, safe edit boundaries, forbidden files, and review expectations. Start with one root file, then add nested AGENTS.md files only for Node.js, Python, or monorepo packages that need different commands, ownership, or safety boundaries.",
        ],
      },
      {
        heading: "Copyable starter templates",
        body: [
          "Use one root template for the shared policy: project purpose, package manager, install command, development command, test command, build command, formatting command, safe edit boundaries, files to avoid, review expectations, and known failure notes.",
          "For React or Vue apps, name the frontend package path, generated build folders, UI test command, and screenshot or accessibility check. For Python services, name the virtual environment command, test runner, migration boundary, and formatting command. For monorepos, keep root AGENTS.md short and place nested AGENTS.md files only where commands or ownership really differ.",
          "For teams, add one security section: no secrets in prompts, no production writes without approval, no migration edits without owner review, and no generated code merge without tests or human diff review.",
        ],
      },
      {
        heading: "Root vs nested AGENTS.md inheritance",
        body: [
          "Put repo-wide rules in the root AGENTS.md: install commands, global test commands, style rules, forbidden files, and review expectations. Put package-specific exceptions in a nested AGENTS.md, such as apps/web/AGENTS.md or packages/api/AGENTS.md, when that folder has different commands or risk boundaries.",
          "Nested files should override only what changes. If the web app uses npm test and the API uses pytest, write that difference in the nested file instead of duplicating the whole root policy.",
        ],
      },
      {
        heading: "What every template must say",
        body: [
          "Every useful AGENTS.md should declare the test command, completion standard, allowed edit scope, forbidden files, generated folders, secret policy, and review expectation. These are the controls an agent can actually follow during a coding task.",
          "Avoid vague rules like 'write clean code' unless the repo has a command or reviewer habit that checks the rule. Replace vague style advice with concrete commands, file paths, and approval boundaries.",
        ],
      },
      {
        heading: "What not to put in it",
        body: [
          "Do not paste secrets, access tokens, private customer data, or vague motivational rules. Avoid rules like 'write clean code' unless you explain what command or reviewer checks that rule.",
          "Do not copy the same paragraph into every instruction file. Keep one source of truth and link tool-specific files back to it when possible.",
        ],
      },
    ],
    recommendedPlay: [
      "Create a root AGENTS.md first, then add nested files only when a folder has different commands or ownership.",
      "Keep every command copy-pasteable from a clean checkout.",
      "Review AGENTS.md whenever CI, package managers, test commands, or security boundaries change.",
    ],
    decisionTable: {
      title: "AGENTS.md template blocks",
      intro: "Use these blocks as a practical template. Delete anything that is not true for the repo.",
      columns: ["What to write", "Example", "Keep it out when"],
      rows: [
        {
          label: "Repo purpose",
          values: ["One sentence on what the project does", "Next.js marketing site with a FastAPI admin backend", "The repo is private and purpose details reveal sensitive plans"],
        },
        {
          label: "Commands",
          values: ["Install, dev, test, build, lint", "npm run test; npm run build", "The command is stale or only works on one developer machine"],
        },
        {
          label: "Safe boundaries",
          values: ["Allowed files, risky files, generated files", "Do not edit migrations without approval", "The team has not agreed on ownership yet"],
        },
        {
          label: "Review rule",
          values: ["How to prove the change is done", "Show changed files, test result, and known risk", "The rule is only style preference and not checked anywhere"],
        },
        {
          label: "Nested scope",
          values: ["Package-specific commands and boundaries", "apps/web/AGENTS.md uses npm test; packages/api/AGENTS.md uses pytest", "The folder does not actually differ from the root policy"],
        },
      ],
    },
    actionSteps: [
      {
        title: "Write the root file",
        body: "Start with the project purpose, commands, safe boundaries, and review expectations.",
      },
      {
        title: "Test every command",
        body: "Run the listed commands once so the agent does not inherit broken instructions.",
      },
      {
        title: "Add folder-specific notes only when needed",
        body: "Use nested AGENTS.md files for monorepo packages, generated folders, or high-risk areas with different rules.",
      },
      {
        title: "Add a drift owner",
        body: "Name the person or team that updates instructions when CI, package managers, or release flow changes.",
      },
    ],
    pitfalls: [
      {
        title: "Writing a policy novel",
        fix: "Keep the file practical: commands, boundaries, and review steps beat long philosophy.",
      },
      {
        title: "Listing commands nobody runs",
        fix: "Only include commands that work from a clean checkout or explain the required setup.",
      },
      {
        title: "Hiding secrets in instructions",
        fix: "Describe environment variable names and access boundaries, never credential values.",
      },
    ],
    internalLinks: [
      {
        slug: "agents-md-examples-codex-node-python-monorepos",
        anchor: "AGENTS.md examples for Node.js, Python, and monorepos",
        reason: "Template readers often need concrete examples after they understand the required sections.",
      },
      {
        slug: "agents-md-vs-claude-md-cursorrules-copilot-instructions",
        anchor: "AGENTS.md vs CLAUDE.md comparison",
        reason: "Readers who need to choose the right instruction file can start there.",
      },
      {
        slug: "codex-vs-claude-code",
        anchor: "Codex vs Claude Code",
        reason: "AGENTS.md setup matters most when choosing a Codex-compatible workflow.",
      },
      {
        slug: "agent-governance-checklist-for-software-teams",
        anchor: "agent governance checklist",
        reason: "Team instructions should connect to broader approval and audit rules.",
      },
      {
        slug: "loop-engineering-ai-coding-agents",
        anchor: "loop engineering for AI coding agents",
        reason: "AGENTS.md should name the verification command and iteration cap that agent loops rely on.",
      },
    ],
    checklist: [
      "Explain what the repo does in one sentence.",
      "List install, test, build, and lint commands.",
      "Name files or folders the agent should not edit without approval.",
      "Explain how to verify a completed task.",
      "Keep secrets and customer data out of the file.",
      "Review the file when CI or package managers change.",
    ],
    evidence: [
      {
        title: "OpenAI Codex AGENTS.md documentation",
        url: "https://learn.chatgpt.com/docs/agent-configuration/agents-md",
        publisher: "OpenAI",
        note: "Official AGENTS.md behavior and precedence reference.",
      },
      {
        title: "GitHub Copilot custom instructions",
        url: "https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions",
        publisher: "GitHub",
        note: "Official repository instruction reference for Copilot workflows.",
      },
    ],
    relatedArticleSlugs: ["openai-codex-plugins-sites-annotations", "github-copilot-sdk-general-availability"],
    publishedAt: "2026-06-14",
    updatedAt: "2026-07-19",
    metaTitle: "AGENTS.md Template for Codex: Node.js, Python & Monorepos",
    metaDescription:
      "Copy tested AGENTS.md templates for Codex, Node.js, Python and monorepos. Includes setup commands, test rules, safe edit boundaries and review checks.",
    resourceIds: ["agents-md-template"],
  },
  {
    id: "guide-copilot-claude-md-support",
    title: "Does GitHub Copilot Read CLAUDE.md? Support Matrix by Surface",
    slug: "does-github-copilot-read-claude-md-support-matrix",
    summary:
      "GitHub Copilot support for CLAUDE.md is surface-specific. Use the GitHub support matrix before relying on it, and keep .github/copilot-instructions.md as the broad Copilot baseline.",
    intent:
      "Developers want a direct answer about whether GitHub Copilot reads CLAUDE.md in Chat, cloud-agent, code-review, CLI, or IDE workflows.",
    audience: "Maintainers standardizing Copilot, Claude Code, and Codex repository instruction files.",
    pageType: "Support matrix",
    secondaryKeywords: [
      "Does GitHub Copilot read CLAUDE.md",
      "GitHub Copilot CLAUDE.md support",
      "Copilot CLAUDE.md support matrix",
      ".github/copilot-instructions.md vs CLAUDE.md",
    ],
    sections: [
      {
        heading: "Quick answer",
        body: [
          "GitHub Copilot does not have one universal answer for CLAUDE.md. GitHub documents instruction-file support by Copilot surface, so CLAUDE.md should be treated as a surface-specific input. For broad Copilot repository guidance, use .github/copilot-instructions.md and keep CLAUDE.md for Claude Code.",
        ],
      },
      {
        heading: "Support is decided by surface",
        body: [
          "A Copilot Chat session in an IDE, a Copilot coding agent task, a code review flow, and a command-line workflow may not load the same instruction files. That is why the safe question is not only 'Does Copilot read CLAUDE.md?' but 'Which Copilot surface, on which date, reads which file?'",
          "When the GitHub support matrix lists CLAUDE.md for a surface, use it as documented support for that surface. When it does not list CLAUDE.md, do not assume Claude Code memory will be honored by Copilot.",
        ],
      },
      {
        heading: "Recommended file policy",
        body: [
          "Use .github/copilot-instructions.md as the Copilot baseline because it is the repository-wide Copilot instructions path. Use CLAUDE.md for Claude Code project memory. Use AGENTS.md for Codex. If the same repo uses all three, keep shared policy language synchronized but keep each file short enough to review.",
          "The shared policy should cover setup commands, verification commands, safe edit boundaries, secrets policy, generated-file rules, and human review conditions. The tool-specific file should only adapt that policy to the reader that actually loads it.",
        ],
      },
      {
        heading: "Common failure mode",
        body: [
          "The risky pattern is putting all Copilot guidance only in CLAUDE.md because one cloud-agent surface appears to support it. That can leave other Copilot surfaces without the repository rule you expected: no production writes, no secrets, required tests, or a specific package command.",
          "The opposite mistake is saying Copilot never reads CLAUDE.md. The current safer wording is surface-specific: verify the surface, then keep .github/copilot-instructions.md as the broad baseline unless your usage is intentionally narrower.",
        ],
      },
      {
        heading: "How to verify your repository",
        body: [
          "Inventory the surfaces your team actually uses: IDE chat, GitHub web, coding agent tasks, code review, CLI, and any organization-level instruction sources. Then compare each surface against the current GitHub support matrix and update adapters in one reviewed change.",
          "After updating files, run one small repository task in each surface and inspect whether the output followed the expected setup command, safety rule, and verification command. Record the date because support matrices and product behavior can change.",
        ],
      },
    ],
    recommendedPlay: [
      "Use .github/copilot-instructions.md as the broad Copilot repository baseline.",
      "Keep CLAUDE.md for Claude Code, and treat Copilot CLAUDE.md support as surface-specific.",
      "Verify each Copilot surface your team uses before deleting or consolidating instruction files.",
      "Update adapters together when setup commands, test commands, or security boundaries change.",
    ],
    decisionTable: {
      title: "CLAUDE.md support decision table",
      intro: "Use this table before deciding where Copilot-facing repository guidance should live.",
      columns: ["Question", "Safe answer", "Action"],
      rows: [
        {
          label: "Need broad Copilot coverage?",
          values: [
            "Use .github/copilot-instructions.md as the baseline",
            "CLAUDE.md support is not the broad default across every Copilot surface",
            "Keep Copilot rules in the GitHub instructions path",
          ],
        },
        {
          label: "Using Claude Code?",
          values: [
            "Use CLAUDE.md for Claude Code memory",
            "Do not remove it just because Copilot has its own instructions file",
            "Synchronize shared commands and safety boundaries",
          ],
        },
        {
          label: "Using Codex?",
          values: [
            "Use AGENTS.md for Codex repository instructions",
            "Do not expect AGENTS.md, CLAUDE.md, and Copilot paths to be interchangeable",
            "Keep one maintained policy and concise adapters",
          ],
        },
        {
          label: "Unsure about a Copilot surface?",
          values: [
            "Check the current GitHub support matrix",
            "Avoid global yes-or-no claims",
            "Run a small controlled task and record what was followed",
          ],
        },
      ],
    },
    actionSteps: [
      {
        title: "List active Copilot surfaces",
        body: "Write down whether the team uses IDE Chat, GitHub web tasks, coding agent flows, code review, CLI, or organization-level instructions.",
      },
      {
        title: "Map files to each surface",
        body: "Compare AGENTS.md, CLAUDE.md, .github/copilot-instructions.md, and path-specific instructions against the current support matrix.",
      },
      {
        title: "Set the broad baseline",
        body: "Put Copilot-wide repository rules in .github/copilot-instructions.md, then keep Claude-specific memory in CLAUDE.md.",
      },
      {
        title: "Run a tiny behavior check",
        body: "Ask each surface to perform a small task that depends on one instruction, then record whether it followed the expected rule.",
      },
    ],
    pitfalls: [
      {
        title: "Using CLAUDE.md as the only Copilot file",
        fix: "Keep .github/copilot-instructions.md for broad Copilot repository coverage.",
      },
      {
        title: "Saying Copilot never reads CLAUDE.md",
        fix: "Use surface-specific wording and point readers to the current GitHub support matrix.",
      },
      {
        title: "Letting adapters drift",
        fix: "Choose one maintained policy and update AGENTS.md, CLAUDE.md, Copilot instructions, and Cursor rules together.",
      },
    ],
    internalLinks: [
      {
        slug: "agents-md-vs-claude-md-cursorrules-copilot-instructions",
        anchor: "AGENTS.md vs CLAUDE.md vs Copilot instructions",
        reason: "The main comparison explains how all instruction-file adapters fit together.",
      },
      {
        slug: "agents-md-template-for-ai-coding-agents",
        anchor: "View the AGENTS.md template for monorepos",
        reason: "Teams using Codex need a parallel AGENTS.md adapter beside Copilot and Claude files.",
      },
      {
        slug: "agent-governance-checklist-for-software-teams",
        anchor: "agent governance checklist for software teams",
        reason: "Instruction files should carry the same permission and approval language as the governance checklist.",
      },
      {
        slug: "secure-mcp-servers-ai-coding-agents",
        anchor: "MCP security checklist",
        reason: "Tool and credential rules belong in both Copilot instructions and MCP security planning.",
      },
    ],
    checklist: [
      "Confirm which Copilot surfaces the team uses.",
      "Check the current GitHub support matrix before relying on CLAUDE.md.",
      "Keep .github/copilot-instructions.md for broad Copilot guidance.",
      "Keep CLAUDE.md for Claude Code memory and workflows.",
      "Synchronize shared commands, safety boundaries, and verification rules.",
      "Record the verification date because support can change.",
    ],
    evidence: [
      {
        title: "Custom instructions support in GitHub Copilot",
        url: "https://docs.github.com/en/copilot/reference/custom-instructions-support",
        publisher: "GitHub",
        note: "Official matrix for which Copilot surfaces support which instruction files.",
      },
      {
        title: "Add repository custom instructions for GitHub Copilot",
        url: "https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions",
        publisher: "GitHub",
        note: "Official repository-wide Copilot instructions path and setup guidance.",
      },
      {
        title: "Claude Code memory",
        url: "https://code.claude.com/docs/en/memory",
        publisher: "Anthropic",
        note: "Official CLAUDE.md project memory behavior for Claude Code.",
      },
    ],
    relatedArticleSlugs: ["github-copilot-sdk-general-availability"],
    publishedAt: "2026-06-18",
    updatedAt: "2026-07-14",
    metaTitle: "Does GitHub Copilot Read CLAUDE.md? Surface Matrix",
    metaDescription:
      "Check when GitHub Copilot reads CLAUDE.md, when to use copilot-instructions.md, and which Copilot surfaces need each file.",
    resourceIds: ["copilot-surface-matrix"],
  },
  {
    id: "guide-agents-md-examples-codex",
    title: "AGENTS.md Examples for Codex: Node.js, Python and Monorepos",
    slug: "agents-md-examples-codex-node-python-monorepos",
    summary:
      "Copy practical AGENTS.md patterns for Codex projects, including Node.js apps, Python services, and monorepos with nested package instructions.",
    intent:
      "Developers want concrete AGENTS.md examples for Codex instead of only a checklist or conceptual comparison.",
    audience: "Developers and maintainers writing Codex repository instructions for real projects.",
    pageType: "Examples and templates",
    secondaryKeywords: [
      "AGENTS.md examples",
      "Codex AGENTS.md examples",
      "AGENTS.md Node.js example",
      "AGENTS.md Python example",
      "AGENTS.md monorepo example",
    ],
    sections: [
      {
        heading: "Quick answer",
        body: [
          "A good AGENTS.md example gives Codex the repo purpose, allowed edit scope, setup commands, verification commands, generated-file boundaries, secret policy, and review expectations. Start with one root file, then add nested AGENTS.md files only where Node.js, Python, or monorepo packages need different commands.",
        ],
      },
      {
        heading: "Node.js example",
        body: [
          "Use a Node.js AGENTS.md when the main risk is stale package commands or broad frontend edits. Include package manager, install command, development command, test command, build command, lint command, generated folders, and UI verification notes.",
          "Example wording: 'Use npm. Run npm test before completion. Run npm run build for public page changes. Do not edit .env files, generated coverage reports, or production deployment files without approval. For UI changes, mention the route checked and any visual risk.'",
        ],
      },
      {
        heading: "Python service example",
        body: [
          "Use a Python AGENTS.md when the agent needs to know virtual environment setup, test runner, migrations, formatting, and API boundary rules. Name whether pytest, ruff, mypy, Alembic, or another tool proves the change.",
          "Example wording: 'Create a virtual environment only when needed. Run pytest for backend changes. Do not create or edit migrations without approval. Never log secrets or customer data. If a test requires unavailable external services, report the blocker instead of weakening the test.'",
        ],
      },
      {
        heading: "Monorepo example",
        body: [
          "In a monorepo, the root AGENTS.md should stay short: repo purpose, shared safety rules, top-level install command, workspace layout, generated folders, and the rule for nested files. Then add apps/web/AGENTS.md, packages/api/AGENTS.md, or docs/AGENTS.md only when commands or ownership differ.",
          "Example wording for a nested file: 'Inside apps/web, use npm test and npm run build. Avoid touching packages/api unless the task explicitly includes backend behavior. For routes, verify the relevant page in a browser and mention mobile overflow risk.'",
        ],
      },
      {
        heading: "What to keep out",
        body: [
          "Do not include tokens, private URLs, customer data, personal credentials, or vague taste rules. Agents follow concrete commands and file boundaries better than slogans.",
          "Do not duplicate the full root file into every nested AGENTS.md. Duplication makes drift likely. A nested file should explain only what changes inside that directory.",
        ],
      },
    ],
    recommendedPlay: [
      "Start with a root AGENTS.md that covers shared commands, safety, and completion criteria.",
      "Add nested AGENTS.md files only for folders with different commands, generated files, or ownership.",
      "Keep every example copyable, but replace placeholder commands with commands that pass from a clean checkout.",
      "Review examples whenever package managers, CI commands, or repo boundaries change.",
    ],
    decisionTable: {
      title: "Which AGENTS.md example should you use?",
      intro: "Pick the smallest example that matches the repo shape and risk boundary.",
      columns: ["Use this example", "When it fits", "What must be explicit"],
      rows: [
        {
          label: "Root baseline",
          values: [
            "Every Codex-enabled repository",
            "The repo has one shared install, test, and build flow",
            "Purpose, commands, forbidden files, secrets policy, and review rule",
          ],
        },
        {
          label: "Node.js app",
          values: [
            "Frontend, Next.js, React, API routes, or package scripts drive the work",
            "UI and build commands are easy to confuse",
            "Package manager, route checks, generated folders, and build command",
          ],
        },
        {
          label: "Python service",
          values: [
            "Backend behavior, tests, migrations, or formatting are the main risk",
            "The agent needs a clear test runner and migration rule",
            "pytest command, migration boundary, env policy, and external service limits",
          ],
        },
        {
          label: "Nested monorepo file",
          values: [
            "A folder has different commands or owner review",
            "Root instructions would be too broad or misleading",
            "Local commands, local forbidden paths, and when to escalate",
          ],
        },
      ],
    },
    actionSteps: [
      {
        title: "Choose the root baseline",
        body: "Write the repo purpose, shared commands, safe edit scope, generated folders, secret policy, and completion standard.",
      },
      {
        title: "Replace placeholders",
        body: "Swap npm, pnpm, pytest, build, lint, and browser-check examples for commands that actually pass in the repository.",
      },
      {
        title: "Add nested files only where needed",
        body: "Create folder-level AGENTS.md files when a package has different commands, owners, generated files, or approval rules.",
      },
      {
        title: "Test the instruction",
        body: "Run one small Codex task that depends on the file and confirm the agent used the expected command and respected the boundary.",
      },
    ],
    pitfalls: [
      {
        title: "Copying examples without testing commands",
        fix: "Run the commands once and update the example before asking an agent to follow it.",
      },
      {
        title: "Making nested files too long",
        fix: "Keep local files focused on what changes in that folder.",
      },
      {
        title: "Turning AGENTS.md into a secrets file",
        fix: "List environment variable names and approval boundaries, never secret values.",
      },
    ],
    internalLinks: [
      {
        slug: "agents-md-template-for-ai-coding-agents",
        anchor: "AGENTS.md template for Codex and monorepos",
        reason: "The template page gives a compact checklist to pair with these examples.",
      },
      {
        slug: "agents-md-vs-claude-md-cursorrules-copilot-instructions",
        anchor: "AGENTS.md vs CLAUDE.md comparison",
        reason: "Readers should understand which tools read AGENTS.md before standardizing examples.",
      },
      {
        slug: "codex-vs-claude-code",
        anchor: "Codex vs Claude Code",
        reason: "Instruction examples should match the agent workflow the team chooses.",
      },
      {
        slug: "loop-engineering-ai-coding-agents",
        anchor: "loop engineering for AI coding agents",
        reason: "Good AGENTS.md examples name the verification command and stop rule used in agent loops.",
      },
    ],
    checklist: [
      "Include the repository purpose.",
      "List install, test, build, lint, and formatting commands when they exist.",
      "Name generated folders and files that should not be edited.",
      "State the secret and credential policy.",
      "Define the completion standard and expected verification output.",
      "Use nested files only when folder-level commands or risks differ.",
    ],
    evidence: [
      {
        title: "Use AGENTS.md with Codex",
        url: "https://learn.chatgpt.com/docs/agent-configuration/agents-md",
        publisher: "OpenAI",
        note: "Official Codex guidance for AGENTS.md scope, precedence, and repository instructions.",
      },
      {
        title: "AGENTS.md repository",
        url: "https://agents.md/",
        publisher: "AGENTS.md",
        note: "Community reference for AGENTS.md examples and cross-tool repository guidance.",
      },
    ],
    relatedArticleSlugs: ["openai-codex-plugins-sites-annotations"],
    publishedAt: "2026-06-18",
    updatedAt: "2026-07-14",
    metaTitle: "AGENTS.md Examples for Codex, Node.js, Python",
    metaDescription:
      "Copy AGENTS.md examples for Codex projects, including Node.js apps, Python services, monorepos, nested files, commands, and review rules.",
  },
  {
    id: "guide-agent-mode-vs-chat-mode",
    title: "Agent Mode vs Chat Mode: Differences, Risks and When to Use Each",
    slug: "agent-mode-vs-chat-mode-in-ide",
    summary:
      "Use chat mode for questions and small explanations. Use agent mode when the assistant must inspect files, edit code, run commands, react to errors, and bring a task closer to done.",
    intent: "Developers want to know when to use agent mode instead of ordinary chat in VS Code, Cursor, Visual Studio, or similar IDEs.",
    audience: "Developers trying AI-assisted IDE workflows without wanting a vendor-heavy feature comparison.",
    pageType: "Decision tree",
    secondaryKeywords: ["AI agent mode vs chat mode", "VS Code agent mode", "AI coding agent vs chat", "IDE agent mode"],
    sections: [
      {
        heading: "Quick answer",
        body: [
          "Chat mode is for asking; agent mode is for doing. Use chat for explanations, small snippets, and planning. Use agent mode only when the assistant must inspect files, modify code, run terminal commands, react to failures, and return a reviewable diff with a verification result.",
        ],
      },
      {
        heading: "Key differences",
        body: [
          "The real difference is permission and feedback. Chat mode usually answers from conversation context. Agent mode can inspect the repository, edit files, run commands, observe failures, and continue until the task is done or a stop rule fires.",
          "That extra power creates extra risk. Agent mode can touch more files, spend more tokens, run unsafe commands, or follow the wrong scope if the task is vague. Give it allowed files, forbidden files, terminal limits, and a proof command before it starts.",
        ],
      },
      {
        heading: "Use chat mode when",
        body: [
          "The question is small, the answer can fit in one reply, and the assistant does not need to touch files. Examples: explain a stack trace, compare two APIs, rewrite a small function, or ask what a config option means.",
          "Chat mode is also safer when the task is vague. Ask the assistant to help shape the task first, then switch to agent mode after the boundary is clear.",
        ],
      },
      {
        heading: "Use agent mode when",
        body: [
          "The task has a clear done condition: edit these files, run this command, fix this failing test, or update this UI. Agent mode is useful because it can loop through code, commands, errors, and fixes.",
          "Give it a narrow job. A good prompt says what to change, what not to change, and how to prove the work is done.",
        ],
      },
      {
        heading: "High-risk scenarios",
        body: [
          "Stay in chat or require approval when the work touches secrets, billing, production configuration, migrations, destructive commands, broad network access, or generated files that are hard to review. Agent mode should propose a plan first in those cases.",
          "If the task cannot be verified by a command, screenshot, artifact, or human acceptance step, do not run it as an open-ended agent session.",
        ],
      },
    ],
    recommendedPlay: [
      "Start in chat mode when you are still deciding what the task is.",
      "Switch to agent mode only after you can name the target files, constraints, and verification command.",
      "For risky work, ask the agent to propose a patch first and wait before applying it.",
    ],
    decisionTable: {
      title: "Chat mode and agent mode decision tree",
      intro: "Choose the mode by what the assistant must do, not by how complex the topic sounds.",
      columns: ["Use chat mode", "Use agent mode", "Safety note"],
      rows: [
        {
          label: "Explaining",
          values: ["Explain code, error messages, APIs, or tradeoffs", "Only if explanation needs codebase inspection across files", "Do not let the assistant edit while the question is still vague"],
        },
        {
          label: "Editing",
          values: ["Small snippet or one-file suggestion", "Multi-file change, refactor, UI update, or test fix", "Name the files and the verification command"],
        },
        {
          label: "Debugging",
          values: ["Understand the likely cause", "Reproduce, inspect logs, patch, and rerun checks", "Avoid broad rewrites before the cause is known"],
        },
        {
          label: "Reviewing",
          values: ["Ask for a second opinion on a diff", "Ask for changes only after review findings are clear", "Keep final merge responsibility with a human reviewer"],
        },
        {
          label: "Terminal and network",
          values: ["Ask what a command does before running it", "Run bounded install, test, build, or lint commands", "Block destructive, production, or credentialed commands unless approved"],
        },
        {
          label: "Cost",
          values: ["One answer or short iteration is enough", "The agent must inspect, patch, and verify across multiple turns", "Set a stop rule when repeated failures or token use grow"],
        },
      ],
    },
    actionSteps: [
      {
        title: "Write the task in one sentence",
        body: "If you cannot write the desired outcome clearly, stay in chat mode and clarify the task first.",
      },
      {
        title: "Name the allowed area",
        body: "Tell the agent which files, folders, or modules it may inspect and edit.",
      },
      {
        title: "Give the proof command",
        body: "Add the test, build, or manual check that proves the change worked.",
      },
      {
        title: "Review the final diff",
        body: "Agent mode can move faster than your attention, so read the changed files before merging.",
      },
    ],
    pitfalls: [
      {
        title: "Using agent mode for unclear work",
        fix: "Ask chat mode to turn the vague idea into a bounded task first.",
      },
      {
        title: "Letting the agent decide the scope",
        fix: "Give allowed files, forbidden files, and the success check in the prompt.",
      },
      {
        title: "Treating a passing command as full review",
        fix: "Tests help, but still inspect the diff for product and security mistakes.",
      },
    ],
    internalLinks: [
      {
        slug: "local-vs-cloud-ai-coding-agent",
        anchor: "local vs cloud AI coding agent",
        reason: "Mode choice often leads to where the agent should run.",
      },
      {
        slug: "claude-code-subagents-examples",
        anchor: "Claude Code subagents examples",
        reason: "When agent mode is not enough, subagent delegation may be the next workflow.",
      },
      {
        slug: "agent-governance-checklist-for-software-teams",
        anchor: "agent governance checklist",
        reason: "Teams should define when agent actions need approval.",
      },
      {
        slug: "loop-engineering-ai-coding-agents",
        anchor: "loop engineering for AI coding agents",
        reason: "Agent mode can loop through errors; durable loops need explicit stop rules beyond a single IDE session.",
      },
    ],
    checklist: [
      "Use chat for explanation and planning.",
      "Use agent mode for bounded edits with a proof command.",
      "Name files the agent may change.",
      "Name files the agent must avoid.",
      "Review the final diff before merging.",
      "Record risky prompts that need approval next time.",
    ],
    evidence: [
      {
        title: "VS Code agent mode",
        url: "https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode",
        publisher: "Microsoft",
        note: "Official VS Code documentation for agent mode behavior.",
      },
      {
        title: "GitHub Copilot coding agent",
        url: "https://docs.github.com/en/copilot/concepts/coding-agent/coding-agent",
        publisher: "GitHub",
        note: "Official GitHub concept reference for coding agents.",
      },
    ],
    relatedArticleSlugs: ["github-copilot-vscode-agents-window-may-2026", "visual-studio-agent-mode-mcp-general-availability"],
    publishedAt: "2026-06-14",
    updatedAt: "2026-06-18",
    metaTitle: "Agent Mode vs Chat Mode: Risks and Use Cases",
    metaDescription:
      "Compare agent mode vs chat mode by file edits, terminal commands, network risk, token cost, safe use cases, and stop rules.",
  },
  {
    id: "guide-local-vs-cloud-agent",
    title: "Local vs Cloud AI Coding Agents: Security, Cost and Speed Compared",
    slug: "local-vs-cloud-ai-coding-agent",
    summary:
      "Use a local coding agent when privacy, local tools, and quick feedback matter most. Use a cloud coding agent when the task is long-running, isolated, or better handled as an asynchronous branch or pull request.",
    intent: "Developers and team leads want to decide whether AI coding agents should run locally or in a cloud environment.",
    audience: "Engineering teams comparing local IDE or CLI agents with cloud sandboxes and asynchronous coding agents.",
    pageType: "Decision matrix",
    secondaryKeywords: ["local coding agent vs cloud coding agent", "AI coding agent sandbox", "cloud coding agent", "local AI coding agent"],
    sections: [
      {
        heading: "Quick answer",
        body: [
          "Use a local AI coding agent when privacy, exact dev-environment context, and fast interactive feedback matter most. Use a cloud coding agent when the work is long-running, easy to isolate, and better reviewed as a branch or pull request. The safe choice depends on data access, command risk, cost visibility, and review flow.",
        ],
      },
      {
        heading: "Security, cost, and speed comparison",
        body: [
          "Local agents keep more context on the developer machine and can use local services quickly, but they sit closer to credentials, private files, and shell access. Cloud agents can isolate work on a branch or sandbox, but teams still need scoped credentials, logs, and revocation.",
          "Cost is not only model price. Include developer attention, failed retries, parallel runs, CI minutes, and review time. Speed is also task-shaped: local is often faster for tight steering; cloud is often better for long background work that can wait for review.",
        ],
      },
      {
        heading: "When local is better",
        body: [
          "Use local agents when the task needs your exact dev environment, local services, editor context, or quick interactive steering. Local work is easier to watch, but it also means the agent is closer to your files, credentials, and shell.",
          "Local is usually the safer first step for small fixes, reading code, writing tests, and changes that need tight human review.",
        ],
      },
      {
        heading: "When cloud is better",
        body: [
          "Use cloud agents when a task can run in an isolated environment, take longer, or be reviewed later as a branch. Cloud sandboxes can reduce risk to a developer machine, but they still need scoped credentials and audit logs.",
          "Cloud is useful for repetitive migration work, background investigation, dependency updates, or tasks that should not block the developer's local session.",
        ],
      },
      {
        heading: "Hybrid architecture",
        body: [
          "A practical team often uses both. Keep planning, risky debugging, and secret-adjacent work local. Send isolated refactors, dependency checks, test-writing, and documentation updates to cloud branches after the task has clear boundaries.",
          "The handoff rule is simple: if the cloud agent does not need production secrets, private local services, or broad write access, it is a candidate for asynchronous cloud work. If it does, keep it local or require a human approval checkpoint.",
        ],
      },
    ],
    recommendedPlay: [
      "Start new workflows locally or in a low-risk cloud sandbox before giving broad write permissions.",
      "Use cloud agents for long-running tasks only when branch, log, and rollback rules are clear.",
      "Treat local and cloud agents as different risk profiles, not as good versus bad options.",
    ],
    decisionTable: {
      title: "Local and cloud coding agent matrix",
      intro: "Use this matrix before giving an agent access to a real repository.",
      columns: ["Prefer local", "Prefer cloud", "Guardrail"],
      rows: [
        {
          label: "Data access",
          values: ["Sensitive files stay on the developer machine", "A clean repo snapshot is enough", "Do not expose secrets unless the workflow explicitly needs them"],
        },
        {
          label: "Privacy",
          values: ["Private context stays near the developer workstation", "Only scoped repository data is shared with the sandbox", "Classify customer, secret, and regulated data before choosing"],
        },
        {
          label: "Task length",
          values: ["Short, interactive, or exploratory work", "Long-running branch work or background checks", "Require a clear completion report"],
        },
        {
          label: "Commands",
          values: ["Commands rely on local services or hardware", "Commands can run in an isolated Linux or hosted environment", "Separate read, write, network, and deploy permissions"],
        },
        {
          label: "Review",
          values: ["Developer reviews each step closely", "Team reviews a branch, PR, or artifact after completion", "Keep logs and changed files visible"],
        },
        {
          label: "Cost and speed",
          values: ["Fast steering for short tasks and local checks", "Background execution for longer tasks and parallel branches", "Set per-run budgets and stop repeated failures"],
        },
      ],
    },
    actionSteps: [
      {
        title: "Classify the task",
        body: "Mark whether it needs local services, secrets, network access, or production data.",
      },
      {
        title: "Choose the smallest useful environment",
        body: "Prefer a limited local session or sandbox before giving a cloud agent broad repository access.",
      },
      {
        title: "Set the review path",
        body: "Decide whether the output is a diff, branch, PR, report, or checklist before the agent starts.",
      },
      {
        title: "Write down rollback",
        body: "For cloud work, make sure the branch can be closed and credentials can be revoked quickly.",
      },
    ],
    pitfalls: [
      {
        title: "Assuming cloud is automatically safer",
        fix: "Cloud isolation helps, but bad credentials or broad write access can still create damage.",
      },
      {
        title: "Running local agents with too much access",
        fix: "Limit files, shell commands, and network use for high-risk tasks.",
      },
      {
        title: "Skipping audit logs",
        fix: "Keep a record of prompt, tool calls, changed files, command output, and approval steps.",
      },
    ],
    internalLinks: [
      {
        slug: "agent-mode-vs-chat-mode-in-ide",
        anchor: "agent mode vs chat mode",
        reason: "Local and cloud choices usually come after deciding whether the assistant should act.",
      },
      {
        slug: "agent-governance-checklist-for-software-teams",
        anchor: "agent governance checklist",
        reason: "Environment choice should follow the team's permission and audit rules.",
      },
      {
        slug: "secure-mcp-servers-ai-coding-agents",
        anchor: "secure MCP servers",
        reason: "MCP tools can change the risk profile of both local and cloud agents.",
      },
      {
        slug: "loop-engineering-ai-coding-agents",
        anchor: "loop engineering for AI coding agents",
        reason: "Long-running cloud loops need branch isolation, budgets, and termination rules before unattended runs.",
      },
    ],
    checklist: [
      "Classify data sensitivity before choosing an environment.",
      "Use local agents for interactive, machine-specific tasks.",
      "Use cloud agents for isolated long-running tasks.",
      "Scope credentials and network access.",
      "Keep logs and changed files visible.",
      "Define rollback before deployment-related work.",
    ],
    evidence: [
      {
        title: "GitHub Copilot coding agent",
        url: "https://docs.github.com/en/copilot/concepts/coding-agent/coding-agent",
        publisher: "GitHub",
        note: "Official reference for asynchronous coding agent workflows.",
      },
      {
        title: "Cloud and local sandboxes for GitHub Copilot",
        url: "https://github.blog/changelog/2026-06-02-cloud-and-local-sandboxes-for-github-copilot-now-in-public-preview/",
        publisher: "GitHub",
        note: "Official changelog for local and cloud sandbox behavior.",
      },
      {
        title: "VS Code agent mode",
        url: "https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode",
        publisher: "Microsoft",
        note: "Official local IDE agent mode reference.",
      },
    ],
    relatedArticleSlugs: ["github-copilot-cloud-local-sandboxes-preview", "github-copilot-vscode-agents-window-may-2026"],
    publishedAt: "2026-06-14",
    updatedAt: "2026-06-18",
    metaTitle: "Local vs Cloud AI Coding Agents",
    metaDescription:
      "Compare local vs cloud AI coding agents by privacy, security, cost, speed, sandboxing, hybrid workflows, and team risk.",
  },
  {
    id: "guide-agent-governance-checklist",
    title: "AI Coding Agent Governance Checklist: Permissions, Logs and Approvals",
    slug: "agent-governance-checklist-for-software-teams",
    summary:
      "A useful coding agent governance checklist covers identity, permissions, tool access, logs, human approval, sandboxing, cost limits, and incident response. Start with a small pilot before wider rollout.",
    intent: "Engineering leaders and platform teams want a one-page governance checklist for adopting AI coding agents.",
    audience: "Engineering managers, platform teams, security reviewers, and developer-experience teams rolling out coding agents.",
    pageType: "Governance checklist",
    secondaryKeywords: ["AI coding agent governance", "AI coding agent audit logs", "coding agent policy", "AI agent permissions checklist", "loop engineering"],
    sections: [
      {
        heading: "Quick answer",
        body: [
          "Before a software team rolls out AI coding agents, decide who can use them, what tools they can call, what they may change, what needs approval, where logs are stored, how secrets are protected, and how to roll back or stop bad runs. Governance is useful only when it becomes an executable checklist.",
        ],
      },
      {
        heading: "Minimum governance set",
        body: [
          "Start with identity, permission tiers, allowed tools, approval rules, audit logs, sandbox policy, cost controls, and incident response. If any of these are missing, keep the rollout small.",
          "The first rollout should use low-risk repos, read-heavy tasks, and clear human review. Add write access only when the team can explain what happened after each agent run.",
        ],
      },
      {
        heading: "Permission levels",
        body: [
          "Use tiers instead of one broad agent permission. Tier 0 is read-only explanation and search. Tier 1 allows local file edits on a branch. Tier 2 allows command execution for approved test, lint, and build commands. Tier 3 allows network or MCP access. Tier 4 covers deploy, migration, billing, production, or destructive actions and should require explicit human approval.",
          "A team can start with only Tier 0 and Tier 1. Add higher tiers when audit logs, owners, rollback, and approval prompts are already working.",
        ],
      },
      {
        heading: "Prohibited actions and approval conditions",
        body: [
          "Ban agents from copying secrets into prompts, changing production configuration, deleting data, editing migrations, changing billing, widening permissions, or publishing external messages without approval. These are not productivity tasks; they are control-plane actions.",
          "Require approval when a task touches credentials, customer data, deployment paths, database schema, external network writes, large generated changes, or repeated failed retries. The approval prompt should name the actor, repository, action, target, rollback limit, and expected evidence.",
        ],
      },
      {
        heading: "Audit log fields",
        body: [
          "Keep logs useful and secret-redacted. Record actor, team, repository, branch, agent surface, model or tool version when available, prompt summary, tools called, files changed, commands run, approval state, final outcome, and rollback link.",
          "Do not store raw secrets, customer payloads, access tokens, or private content unrelated to the review. Good logs let a reviewer reconstruct a consequential action without collecting sensitive data by accident.",
        ],
      },
      {
        heading: "Good policy feels practical",
        body: [
          "A good policy tells developers what they can do today. It should not read like a legal memo. Use simple rules: which tasks are allowed, which tasks need approval, which data is off-limits, and which command or review proves the work is safe.",
        ],
      },
    ],
    recommendedPlay: [
      "Run a two-week pilot with one team, one repository, and a narrow set of agent permissions.",
      "Write approval rules before enabling write, deploy, external network, or production-data access.",
      "Review logs weekly during the pilot and update the policy from real incidents, not imagined edge cases.",
    ],
    decisionTable: {
      title: "Coding agent governance checklist",
      intro: "Use this as a first-pass policy map before enabling agents across a software team.",
      columns: ["Minimum rule", "Why it matters", "Launch gate"],
      rows: [
        {
          label: "Identity",
          values: ["Know which user, team, and repo started the agent", "Makes accountability possible", "Agent activity is tied to a user or service account"],
        },
        {
          label: "Permissions",
          values: ["Split read, write, command, network, and deploy access", "Limits damage when context is wrong", "High-risk actions need approval"],
        },
        {
          label: "Forbidden actions",
          values: ["List actions agents may not perform without explicit approval", "Prevents control-plane drift", "Secrets, production writes, billing, deploy, deletion, and migrations are gated"],
        },
        {
          label: "Logs",
          values: ["Record prompt summary, tools, changed files, commands, and approvals", "Makes review and incident response possible", "Logs avoid secrets but keep useful traceability"],
        },
        {
          label: "Review",
          values: ["Require a human diff review before merge", "Agents can pass tests and still change the wrong thing", "No auto-merge for high-risk repos"],
        },
        {
          label: "Emergency stop",
          values: ["Disable agent access, revoke credentials, close branches, and preserve logs", "Limits blast radius after a bad run", "Owner and rollback path are known before launch"],
        },
      ],
    },
    actionSteps: [
      {
        title: "Write the pilot boundary",
        body: "Choose one team, one repository type, allowed tasks, forbidden tasks, and a review owner.",
      },
      {
        title: "Create permission tiers",
        body: "Separate read-only, limited write, command execution, network access, and deployment paths.",
      },
      {
        title: "Define audit fields",
        body: "Record actor, repo, session, tools called, files changed, commands run, approval state, and final outcome.",
      },
      {
        title: "Review after two weeks",
        body: "Keep what developers actually used, remove confusing rules, and close gaps found in logs or reviews.",
      },
      {
        title: "Publish the Markdown policy",
        body: "Keep a copyable checklist in the engineering handbook or repo instructions so developers can apply the same approval, logging, and rollback rules during real work.",
      },
    ],
    pitfalls: [
      {
        title: "Starting with a company-wide rollout",
        fix: "Start with a small pilot so the policy learns from real work before it scales.",
      },
      {
        title: "Treating all tools as equal",
        fix: "A read-only docs lookup and a deploy command need different approval paths.",
      },
      {
        title: "Logging either too much or too little",
        fix: "Keep traceability, but do not store secrets or unnecessary private payloads.",
      },
    ],
    internalLinks: [
      {
        slug: "secure-mcp-servers-ai-coding-agents",
        anchor: "MCP security checklist",
        reason: "MCP permissions are one of the most common governance boundaries.",
      },
      {
        slug: "local-vs-cloud-ai-coding-agent",
        anchor: "local vs cloud AI coding agent",
        reason: "Environment choice affects permissions, logs, and rollback.",
      },
      {
        slug: "agents-md-template-for-ai-coding-agents",
        anchor: "AGENTS.md template",
        reason: "Some governance rules should be visible inside repo instructions.",
      },
      {
        slug: "loop-engineering-ai-coding-agents",
        anchor: "loop engineering for AI coding agents",
        reason: "Governance for unattended loops needs iteration caps, audit logs, and escalation before team-wide rollout.",
      },
    ],
    checklist: [
      "Name the pilot team and repository scope.",
      "Separate read, write, command, network, and deploy permissions.",
      "Require approval for destructive or production-facing actions.",
      "Ban agents from copying secrets, changing billing, deleting data, or deploying without approval.",
      "Record actor, repo, branch, tool surface, files changed, commands run, approval state, and outcome.",
      "Keep audit logs without storing secrets.",
      "Require human review before merging agent changes.",
      "Document rollback and emergency stop steps.",
      "Write an incident response path before broad rollout.",
    ],
    evidence: [
      {
        title: "GitHub Copilot coding agent",
        url: "https://docs.github.com/en/copilot/concepts/coding-agent/coding-agent",
        publisher: "GitHub",
        note: "Official reference for agentic coding workflows and review paths.",
      },
      {
        title: "Cursor Enterprise organizations",
        url: "https://cursor.com/changelog/enterprise-organizations",
        publisher: "Cursor",
        note: "Official product reference for organization-level governance controls.",
      },
      {
        title: "OWASP Top 10 for LLM Applications",
        url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/",
        publisher: "OWASP",
        note: "Security reference for common LLM application risks.",
      },
    ],
    relatedArticleSlugs: [
      "github-copilot-cloud-local-sandboxes-preview",
      "cursor-enterprise-organizations-governance",
      "visual-studio-agent-mode-mcp-general-availability",
    ],
    publishedAt: "2026-06-14",
    updatedAt: "2026-06-18",
    metaTitle: "AI Coding Agent Governance Checklist",
    metaDescription:
      "Use this AI coding agent governance checklist for permissions, logs, approval gates, prohibited actions, rollback, and emergency stop.",
  },
  {
    id: "guide-loop-engineering",
    title: "What Is Loop Engineering for AI Coding Agents?",
    slug: "loop-engineering-ai-coding-agents",
    summary:
      "Learn what loop engineering means for AI coding agents with a browser-based budget calculator, control-loop examples, stop rules, token and cost caps, verification commands, and Addy Osmani's workflow context.",
    intent:
      "Developers want to move from prompting agents task-by-task to designing durable loops that plan, change code, verify results, and stop safely.",
    audience: "Developers, staff engineers, and platform teams adopting agentic coding workflows in Cursor, Claude Code, Codex, or custom CI agents.",
    pageType: "Practical loop design guide",
    secondaryKeywords: [
      "Addy Osmani loop engineering AI coding agents",
      "loop engineering AI agents Addy Osmani",
      "agentic loop AI coding",
      "Cursor loop automation",
      "Claude Code /loop scheduling",
      "plan-execute-verify agent loop",
      "loop engineering vs prompt engineering",
    ],
    sections: [
      {
        heading: "Quick answer",
        body: [
          "Loop engineering for AI coding agents means designing the repeatable control loop around the agent, not writing one better prompt. Addy Osmani's loop engineering approach is useful context, but the practical repo loop is Plan → Act → Observe → Verify → Stop, a stricter version of the act → observe → reason cycle: give the agent a bounded goal, inspect tests or diffs, retry only with a changed strategy, and stop on token or cost caps, repeated failure, risky permission changes, or a required human checkpoint.",
        ],
      },
      {
        heading: "What Is Loop Engineering?",
        body: [
          "Loop engineering is the practice of designing the repeatable control system around an AI agent: goal, context, tool access, observation, verification, retry policy, and stop rules. In coding work, that system should read repository evidence such as test output, compiler errors, diffs, logs, screenshots, or review comments before deciding the next step.",
          "The reason it matters for software teams is simple: a coding agent can sound confident while still looping on the wrong file, rerunning the same failing command, or expanding scope without proof. A loop-engineered workflow makes the agent show evidence, change strategy after failure, and stop before cost, risk, or permissions drift out of bounds.",
        ],
      },
      {
        heading: "What Is Addy Osmani's Loop Engineering Approach?",
        body: [
          "The useful reading of Osmani's idea is that engineers should stop babysitting every agent turn and start designing the operating loop around the agent. The prompt still matters, but it is only one part of a system that also includes tools, feedback, memory, cost limits, and termination.",
          "In a coding workflow, that means the loop must know what done looks like before the first edit happens. A good loop names the repository task, the allowed files or tools, the command that proves progress, the maximum attempts, and the human checkpoint for risky actions.",
        ],
      },
      {
        heading: "How Does Loop Engineering Work for AI Coding Agents?",
        body: [
          "Start with a plan, then let the agent act on the smallest useful change. The observe step reads evidence from the repository rather than trusting a fluent status update: failing tests, compiler output, diffs, logs, screenshots, or MCP tool responses. Verification turns that observation into a verdict. Retry only when the next attempt changes the strategy; otherwise stop and hand the evidence to a human.",
          "This is why loop engineering is especially useful for AI coding agents. Software work already has observable signals: tests pass or fail, builds complete or fail, files changed or did not, and pull requests can be reviewed. The loop should attach to those signals instead of treating agent confidence as evidence.",
        ],
      },
      {
        heading: "Loop Engineering vs Prompt Engineering",
        body: [
          "Prompt engineering optimizes a single instruction or conversation. Loop engineering designs the repeated system around that instruction: context loading, tool access, action, observation, verification, retries, and stop conditions. A strong prompt can still fail inside a weak loop if the agent cannot see test output or has no rule for when to stop.",
          "Loop engineering is also different from a cron job. A cron job runs a fixed command on a schedule. A coding-agent loop observes current state and decides the next action before it continues. If nothing inside the run observes evidence and changes strategy, it is scheduling, not loop engineering.",
        ],
      },
      {
        heading: "Where loops live in today's tools",
        body: [
          "Claude Code supports recurring work through /loop scheduling, hooks that fire at lifecycle points, subagents for split explore-implement-verify roles, and headless or CI-style runs that persist after a laptop closes. Cursor supports long-running cloud agents, parallel agents on isolated branches, and Automations triggered by GitHub, Slack, Linear, or schedules. Codex and similar agents implement loops through tool calls, subagents, and repository instructions that name verification commands.",
          "The surface differs by vendor, but the architecture repeats: goal, context, tools, observation, adjustment, termination. Pick the tool by where your team already works, then design the loop around observable repo evidence rather than model charisma.",
        ],
      },
      {
        heading: "A Practical Loop Engineering Example",
        body: [
          "Suppose a dependency upgrade breaks frontend tests. A weak instruction says: fix the tests. A loop-engineered instruction says: inspect the failing output first, edit only the affected test or component files, run the focused test command, then run the wider project check if the focused command passes. Retry once with a different hypothesis, but stop after the same failure repeats twice.",
          "That example matters because the loop is not trying to be autonomous in every direction. It is narrow, observable, and cheap to review. The agent can keep working through routine failure, but it must stop before rewriting unrelated files, touching production configuration, or burning more attempts on the same root cause.",
        ],
      },
      {
        heading: "When Should an AI Agent Stop the Loop?",
        body: [
          "Stop rules are not administrative decoration; they are the safety feature. Stop when verification passes, when an iteration cap is reached, when the same failure repeats, when the next action requires wider permissions, when cost crosses the budget, or when the agent can no longer tie its next action to observed evidence.",
          "For team use, make the stop rule visible in AGENTS.md, CLAUDE.md, a Copilot instructions file, or the workflow configuration that starts the loop. The safest loops are boring to audit: every retry has a reason, every escalation has an owner, and every successful run leaves a concise artifact.",
        ],
      },
      {
        heading: "AI coding agent workflow checklist",
        body: [
          "Before scaling Automations, /loop schedules, or cloud agents, confirm the workflow has a named owner, a bounded goal, a verification command, a retry cap, a human checkpoint for risky actions, and a log that avoids secrets.",
          "The checklist should answer five questions: what done looks like, what evidence the loop reads, what tools it may call, when it must stop, and who approves escalation. If any answer is missing, the workflow is still a prompt, not loop engineering.",
          "Pilot on one repository task first. Record review time, token use, and human interventions actually observed. Add parallel agents or schedules only after a single-threaded loop is trustworthy.",
        ],
      },
      {
        heading: "Common Patterns and When to Use Them",
        body: [
          "Plan-execute-verify fits bounded repo tasks with a clear pass command. Retry-with-cap helps flaky setup steps but needs a hard attempt limit per item. Evaluator-optimizer pairs work well for reviews and docs when criteria are explicit. Explore-narrow prevents premature edits in unfamiliar code. Scheduled wake-up loops handle recurring triage. Human-in-the-loop checkpoints belong before production, permission widening, or destructive operations.",
          "Anthropic's agent guidance recommends adding complexity only when simpler flows fail. Start with one loop on one repository task, measure review effort and token use, then add subagents or schedules only when the simpler loop stalls.",
        ],
      },
    ],
    recommendedPlay: [
      "Start with one real repository task and a single plan-execute-verify loop before adding schedules or parallel agents.",
      "Write the done signal as a command or artifact, not a vibe: passing tests, green build, opened PR, or filed ticket.",
      "Cap iterations per item and escalate when the same failure repeats twice with the same root cause.",
      "Separate exploration from implementation so read-only passes cannot mutate production paths.",
      "Budget tokens and concurrency before running unattended cloud or scheduled loops.",
    ],
    decisionTable: {
      title: "When to prompt vs when to loop",
      intro: "Use this table to decide whether a task needs a durable loop or a single supervised agent session.",
      columns: ["Prompt once when", "Design a loop when", "Stop rule to add"],
      rows: [
        {
          label: "Task shape",
          values: [
            "The steps are predictable and fit one focused session",
            "The agent must read errors, revise, and re-run verification",
            "Name the verification command and maximum iterations",
          ],
        },
        {
          label: "Duration",
          values: [
            "You can stay at the keyboard for the whole task",
            "Work should continue while you review other items or close the laptop",
            "Set a schedule or queue with a summary artifact per run",
          ],
        },
        {
          label: "Risk",
          values: [
            "Changes are reversible and confined to a local branch",
            "The loop touches shared files, CI, production config, or permissions",
            "Require a human checkpoint before merge or deploy",
          ],
        },
        {
          label: "Cost",
          values: [
            "Token use is small and visible in one sitting",
            "Retries, parallel agents, or long horizons can compound quickly",
            "Set per-run and per-day budgets with automatic stop",
          ],
        },
        {
          label: "Team workflow",
          values: [
            "One engineer needs a quick answer or small patch",
            "A team wants repeatable triage, review, or hygiene across repos",
            "Publish run logs without secrets and name an owner for loop drift",
          ],
        },
      ],
    },
    actionSteps: [
      {
        title: "Name the goal and done signal",
        body: "Write what finished means in observable terms: command output, PR state, ticket link, or report section. Avoid fuzzy goals like 'make it better' that let the loop run without a verdict.",
      },
      {
        title: "Choose the first pattern",
        body: "Default to plan-execute-verify for code changes. Add evaluator-optimizer only when review criteria are explicit. Reserve scheduled wake-up loops for recurring triage after the single-task loop works once.",
      },
      {
        title: "Wire observation before speed",
        body: "Give the agent tests, linters, build commands, diff review, or MCP tools that return ground truth. A loop without observation is just expensive repetition.",
      },
      {
        title: "Set termination and escalation",
        body: "Cap attempts per file or task, stop when the same error repeats, and name who approves production or permission changes. Document what the loop should do when blocked.",
      },
      {
        title: "Write the loop into repository instructions",
        body: "Record the verification command, retry cap, forbidden paths, and human checkpoint in AGENTS.md, CLAUDE.md, Copilot instructions, or the workflow file that launches the loop.",
      },
      {
        title: "Pilot, measure, then parallelize",
        body: "Run the loop on one repo task, record review time, token use, and human interventions actually observed. Add parallel agents or cloud handoff only when single-threaded loops are trustworthy.",
      },
    ],
    pitfalls: [
      {
        title: "Fuzzy goals with no done signal",
        fix: "Translate goals into a verification command, required artifact, or explicit human acceptance step before the first unattended run.",
      },
      {
        title: "Unbounded retries on the same mistake",
        fix: "Cap iterations per item and change strategy after repeated failures instead of paying for identical attempts.",
      },
      {
        title: "Cron without an agent decision-maker",
        fix: "Ensure each run observes current state and chooses the next action; a fixed script on a timer is scheduling, not loop engineering.",
      },
      {
        title: "Parallel agents on shared files",
        fix: "Isolate branches or assign disjoint ownership; merge results deliberately instead of letting agents overwrite each other.",
      },
    ],
    internalLinks: [
      {
        slug: "claude-code-subagents-examples",
        anchor: "Claude Code subagents workflow examples",
        reason: "Subagents are a common way to split explore, implement, and verify inside a loop.",
      },
      {
        slug: "claude-code-hooks-mcp-setup",
        anchor: "Claude Code hooks and MCP setup",
        reason: "Hooks and MCP supply the observation and tool access loops need to act on real systems.",
      },
      {
        slug: "agent-mode-vs-chat-mode-in-ide",
        anchor: "agent mode vs chat mode in IDE",
        reason: "Loops usually run in agent mode; chat mode stays better for one-off questions.",
      },
      {
        slug: "local-vs-cloud-ai-coding-agent",
        anchor: "local vs cloud AI coding agent",
        reason: "Long-running loops often move to cloud agents once local proof is complete.",
      },
      {
        slug: "agent-governance-checklist-for-software-teams",
        anchor: "agent governance checklist",
        reason: "Unattended loops need permissions, logs, and approval rules before team-wide rollout.",
      },
      {
        slug: "agents-md-vs-claude-md-cursorrules-copilot-instructions",
        anchor: "AI coding agent instruction files",
        reason: "Loops inherit verification commands and boundaries from repository instruction adapters.",
      },
      {
        slug: "codex-vs-claude-code",
        anchor: "Codex vs Claude Code",
        reason: "Pick the tool surface first, then design the loop around where your team already works.",
      },
      {
        slug: "secure-mcp-servers-ai-coding-agents",
        anchor: "MCP security checklist",
        reason: "Observation tools inside loops often use MCP; scope permissions before unattended runs.",
      },
    ],
    checklist: [
      "Write the goal and done signal in observable terms.",
      "Pick plan-execute-verify as the default loop pattern.",
      "Attach tests, linters, or builds as loop observation.",
      "Cap iterations and name escalation for repeated failures.",
      "Add human checkpoints before production or destructive actions.",
      "Budget tokens and parallel agents before unattended runs.",
      "Log outcomes without secrets and assign a loop owner.",
    ],
    evidence: [
      {
        title: "Loop Engineering",
        url: "https://addyosmani.com/blog/loop-engineering/",
        publisher: "Addy Osmani",
        note: "Practitioner overview of moving from prompting agents to designing autonomous loops.",
      },
      {
        title: "Building effective AI agents",
        url: "https://www.anthropic.com/research/building-effective-agents",
        publisher: "Anthropic",
        note: "Official guidance on agent workflows, evaluator-optimizer loops, and when to add complexity.",
      },
      {
        title: "What is loop engineering?",
        url: "https://kilo.ai/articles/what-is-loop-engineering",
        publisher: "Kilo",
        note: "Defines the plan-search-modify-verify-repair cycle for AI-assisted software work.",
      },
      {
        title: "Claude Code overview",
        url: "https://docs.anthropic.com/en/docs/claude-code/overview",
        publisher: "Anthropic",
        note: "Places scheduling, hooks, subagents, and headless runs in the Claude Code workflow.",
      },
    ],
    relatedArticleSlugs: [
      "claude-code-dynamic-workflows-parallel-subagents",
      "cursor-enterprise-organizations-governance",
      "github-copilot-cloud-local-sandboxes-preview",
    ],
    publishedAt: "2026-06-15",
    updatedAt: "2026-07-19",
    metaTitle: "What Is Loop Engineering? Addy Osmani, AI Agent Loops, Stop Rules",
    metaDescription:
      "Design AI agent loops around goals, tools, verification, retries, and stop rules. Estimate token cost, tool calls, and risk with the free budget calculator.",
    resourceIds: ["loop-engineering"],
  },
  {
    id: "guide-ai-coding-agents-comparison",
    title: "AI Coding Agents Comparison: Codex, Claude Code, Cursor, and Copilot",
    slug: "ai-coding-agents-comparison",
    summary:
      "Compare Codex, Claude Code, Cursor, and GitHub Copilot by starting surface, repository instructions, parallel work, model boundary, permissions, review path, and team governance.",
    intent: "Developers and engineering leaders want one evidence-led comparison of the four major coding-agent operating models before opening pairwise product guides.",
    audience: "Developers, platform teams, engineering managers, security reviewers, and buyers choosing an AI coding-agent operating model.",
    pageType: "AI coding agents comparison hub",
    secondaryKeywords: [
      "AI coding agent comparison",
      "Codex vs Claude Code vs Cursor vs Copilot",
      "coding agents comparison 2026",
      "AI coding tools for teams",
      "CLI vs IDE coding agent",
      "coding agent decision matrix",
      "enterprise AI coding agent comparison",
    ],
    sections: [
      {
        heading: "Quick answer",
        body: [
          "Choose Codex when an OpenAI-native agent workspace, separate threads, worktrees, and cross-surface handoff fit the team. Choose Claude Code when terminal-first repository work and Anthropic-native tooling fit. Choose GitHub Copilot when GitHub policy, existing IDEs, pull requests, and its instruction ecosystem should remain the control plane. Choose Cursor when the team wants an AI-first editor plus foreground and remote cloud agents. There is no universal winner: use the five-question selector, then run the same bounded repository task with the leading two tools.",
        ],
      },
      {
        heading: "Compare operating models, not old product labels",
        body: [
          "The autocomplete-versus-agent framing is obsolete. All four products now cover more than inline completion on at least one surface. Codex combines app, CLI, IDE, cloud, GitHub-oriented review, and mobile handoff. Claude Code centers repository work in the terminal and supports hooks, subagents, skills, MCP, and automation paths. GitHub Copilot spans supported editors, GitHub, CLI, cloud coding agent, code review, custom agents, skills, hooks, and MCP. Cursor combines an AI-first editor with rules, agents, cloud agents, web, mobile, and source-control integrations.",
          "The useful comparison is operational: where a task begins, which identity and policy system owns it, which files supply instructions, whether work runs locally or remotely, how permissions are widened, where the diff is reviewed, and who can revoke access. Feature counts without those constraints produce a misleading shortlist.",
        ],
      },
      {
        heading: "Four product shapes at a glance",
        body: [
          "Codex is an OpenAI coding-agent environment whose app makes multiple delegated tasks and isolated worktrees visible. Claude Code is a terminal-centered agent that stays close to the shell, repository, and Anthropic model family. GitHub Copilot is a GitHub and editor ecosystem whose agent surfaces share organization policy and repository workflows. Cursor is a dedicated AI code editor whose agent experience extends into remote Cloud Agents.",
          "These descriptions are starting shapes, not capability ceilings. Each vendor keeps adding adjacent surfaces, and availability can vary by plan, organization policy, operating system, editor, region, or preview status. This page was checked against official documentation on July 19, 2026; procurement decisions should recheck the linked sources.",
        ],
      },
      {
        heading: "Where should agent work begin?",
        body: [
          "Start with Codex if the desired command center is a dedicated OpenAI app that can supervise separate local or cloud tasks. Start with Claude Code if developers want the terminal to remain the primary interface and the repository shell is the natural review context. Start with Copilot if issues, pull requests, GitHub identity, and a mixed editor estate must stay central. Start with Cursor if the organization is comfortable adopting an AI-first editor as the daily development surface.",
          "Do not choose only from a product demo. Inventory the surfaces the organization will actually enable: desktop app, terminal, VS Code, JetBrains, GitHub.com, cloud agents, mobile steering, code review, CI, and scheduled automation. A feature that cannot be approved or supported in the real environment should not influence the decision.",
        ],
      },
      {
        heading: "Repository instructions and durable context",
        body: [
          "Codex uses root and nested AGENTS.md files for durable repository guidance. Claude Code uses CLAUDE.md memory files and supports scoped project guidance alongside commands, hooks, skills, and subagents. GitHub Copilot supports repository-wide and path-specific instruction files plus personal, organization, and agent instructions on documented surfaces. Cursor supports versioned .mdc project rules in .cursor/rules, user and team rules, and AGENTS.md.",
          "If more than one product is approved, do not maintain contradictory policy copies. Put shared build commands, test commands, safe edit scope, generated-file rules, security boundaries, and completion criteria in one canonical source. Generate or audit product adapters and verify which files each enabled surface actually reads.",
        ],
      },
      {
        heading: "Local, cloud, and parallel execution",
        body: [
          "Codex app threads can use isolated worktrees so independent tasks do not collide in one checkout. Claude Code supports subagents and headless or automation patterns around terminal work. GitHub Copilot can delegate through its cloud coding agent and split CLI work through /fleet. Cursor Cloud Agents run asynchronously in isolated virtual machines connected to approved source-control repositories.",
          "Parallel capability increases coordination risk. Assign disjoint ownership, start from named commits, cap continuation or retry steps, share verification commands, and require a human to resolve integration conflicts. Remote agents also need explicit rules for network access, repository credentials, retained data, package installation, secrets, and cleanup.",
        ],
      },
      {
        heading: "Model choice and vendor boundary",
        body: [
          "Codex provides an OpenAI-native model and workspace relationship. Claude Code centers Anthropic models. GitHub Copilot documents a multi-provider model catalog administered through GitHub plans and policy. Cursor exposes model choice inside its editor and agent environment. A broader catalog can help procurement and task matching, while a narrower vendor boundary can simplify approval, support, and evaluation.",
          "Do not turn model names into permanent product verdicts. Availability, routing, context limits, token rates, and preview status change. Evaluate the exact approved model and product version, and record automatic model selection when the product chooses on the user's behalf.",
        ],
      },
      {
        heading: "Permissions, security, and governance",
        body: [
          "Compare the narrowest configuration the team can operate. For every product, document allowed repositories and directories, tool and command permissions, network access, MCP servers, hooks, plugins or extensions, secret boundaries, remote-environment identity, audit evidence, approval gates, cost caps, and revocation. A sandbox option is one control, not a complete security program.",
          "The strongest operational fit is often the product whose administration boundary already has an accountable owner. OpenAI workspace owners may govern Codex more consistently; Anthropic administrators may already own Claude access; GitHub organization owners may control Copilot seats and repository policy; Cursor administrators may own editor rollout and privacy settings. Ownership is a decision criterion because unowned controls drift.",
        ],
      },
      {
        heading: "Pricing and usage need a workload model",
        body: [
          "Monthly plan labels do not capture coding-agent cost. Estimate active developers, completion use, agent sessions, long context, cloud tasks, parallel agents, code review, premium or credit-based model usage, overages, and administrative overhead. Use current vendor plan and billing pages rather than copying one dated price table.",
          "Keep procurement evidence reproducible: record the plan URL, access date, currency, tax treatment, included allowances, model multiplier or credit rule, overage behavior, and whether enterprise controls require a different tier. If a product does not expose task-level cost or tokens, mark the metric Not measured.",
        ],
      },
      {
        heading: "How to run a fair four-tool pilot",
        body: [
          "Begin with the same clean commit and one bounded task. Give every tool the same prompt, readable instruction files, allowed directories, tools, network policy, timebox, and verification command. Record product version, selected model, elapsed time, changed files, human interventions, permission grants, verification result, review findings, and only the cost data the product exposes.",
          "A useful first cohort includes a failing-test repair, a small API or UI change, and a behavior-preserving refactor. Preserve failures and raw outputs. Do not declare a faster run the winner when tests fail, the diff is unsafe, or reviewer time rises. Repeat the task when a transient service or setup error would otherwise distort the comparison.",
        ],
      },
      {
        heading: "Can a team use more than one coding agent?",
        body: [
          "Yes, if responsibilities are explicit. A team might keep Copilot or Cursor for editor-native assistance, use Codex or Claude Code for separately delegated repository work, and route cloud tasks through the control plane already approved for that repository. The combination should solve distinct workflow needs rather than duplicate subscriptions by habit.",
          "Assign one primary tool per task or branch, keep shared repository policy synchronized, apply the same CI and review gates, and designate a human owner for the final merge. Reassess the tool set when usage evidence shows overlap, instruction drift, unclear audit ownership, or costs that cannot be attributed.",
        ],
      },
    ],
    recommendedPlay: [
      "Choose the operating surface and administrative owner before comparing model claims.",
      "Use the five-question selector to create a shortlist, then run the same repository task with the leading two products.",
      "Keep one canonical repository policy and audit every product-specific instruction adapter.",
      "Score verification, permissions, interventions, review effort, and measurable cost instead of output speed alone.",
      "Recheck official feature, model, plan, and data-policy pages before procurement or renewal.",
    ],
    decisionTable: {
      title: "Codex vs Claude Code vs GitHub Copilot vs Cursor",
      intro: "This workflow matrix uses official documentation reviewed July 19, 2026. It does not claim a quality winner or replace a controlled repository pilot.",
      columns: ["Codex", "Claude Code", "GitHub Copilot", "Cursor"],
      rows: [
        { label: "Primary shape", values: ["OpenAI agent across app, CLI, IDE, cloud, and mobile handoff", "Terminal-first Anthropic coding agent", "GitHub and editor ecosystem with CLI and cloud agent", "AI-first editor with foreground and Cloud Agents"] },
        { label: "Natural starting point", values: ["Dedicated app thread or CLI", "Repository terminal", "GitHub issue, pull request, IDE, or CLI", "Cursor editor, web, or mobile agent"] },
        { label: "Repository guidance", values: ["Root and nested AGENTS.md", "CLAUDE.md and scoped project memory", "Copilot instructions plus agent files by surface", ".cursor/rules and AGENTS.md"] },
        { label: "Parallel pattern", values: ["Separate threads and isolated worktrees", "Subagents coordinated from the terminal", "Cloud agent and CLI /fleet", "Parallel Cloud Agents in isolated VMs"] },
        { label: "Remote execution", values: ["Cloud tasks and remote environments", "Headless and automation workflows depend on configuration", "GitHub cloud coding agent and cloud-backed sessions", "Background agents in remote environments"] },
        { label: "Model boundary", values: ["OpenAI-native", "Anthropic-native", "GitHub-administered multi-provider catalog", "Cursor-administered model selection"] },
        { label: "Extensions", values: ["Skills, plugins, hooks, MCP, automations", "Skills, hooks, subagents, MCP, SDK", "Custom agents, skills, plugins, hooks, MCP", "Rules, extensions, MCP, background-agent API"] },
        { label: "Permission focus", values: ["Sandbox and approval configuration", "Tool permissions, hooks, and environment policy", "Tool, path, URL, repository, and organization policy", "Editor approvals plus remote-agent repository and network access"] },
        { label: "Review path", values: ["App diff review, editor handoff, or pull request", "Terminal diff and normal Git review", "GitHub-native pull request and code-review workflow", "Editor review or source-control-connected Cloud Agent output"] },
        { label: "Administration", values: ["OpenAI workspace and Codex controls", "Anthropic access and team controls", "GitHub organization and enterprise policy", "Cursor team dashboard and privacy controls"] },
        { label: "Strong starting fit", values: ["OpenAI-standardized teams supervising delegated tasks", "Terminal-oriented teams standardized on Claude", "GitHub-standardized teams with mixed IDEs", "Teams adopting an AI-first editor"] },
        { label: "Required proof", values: ["Same-task verification and permission log", "Same-task verification and permission log", "Same-task verification and permission log", "Same-task verification and permission log"] },
      ],
    },
    actionSteps: [
      { title: "Inventory approved surfaces", body: "List the app, CLI, IDE, GitHub, cloud, mobile, code-review, and automation surfaces the team can actually support." },
      { title: "Name the control owner", body: "Assign identity, repository access, models, instructions, tools, logs, billing, limits, and revocation to accountable teams." },
      { title: "Freeze a pilot task", body: "Use one clean commit, prompt, instruction set, permission boundary, timebox, and verification command." },
      { title: "Record reviewable evidence", body: "Capture versions, models, changed files, interventions, grants, test output, review findings, and only measurable cost." },
      { title: "Choose and re-evaluate", body: "Standardize the smallest useful tool set, then revisit it when product support, policy, workload, or usage evidence changes." },
    ],
    pitfalls: [
      { title: "Calling one product only autocomplete", fix: "Evaluate the exact app, CLI, IDE, cloud-agent, code-review, and automation surfaces available today." },
      { title: "Choosing from feature counts", fix: "Map every feature to an approved task, owner, permission boundary, proof command, and review path." },
      { title: "Treating model scores as product scores", fix: "Pilot the complete product configuration, including instructions, tools, permissions, context, and review effort." },
      { title: "Publishing a stale price winner", fix: "Use current vendor pages and a workload model; label unavailable task-level usage Not measured." },
      { title: "Running every tool with full access", fix: "Start with narrow repository, directory, tool, network, and secret permissions and record every exception." },
    ],
    internalLinks: [
      { slug: "claude-code-alternatives", anchor: "compare Claude Code alternatives by reason to switch", reason: "Move from the four-tool operating-model shortlist to a wider set of commercial and open-source pilot options." },
      { slug: "codex-vs-claude-code", anchor: "compare Codex with Claude Code", reason: "Open the OpenAI-versus-Anthropic workflow decision after building a shortlist." },
      { slug: "codex-vs-github-copilot", anchor: "compare Codex with GitHub Copilot", reason: "Separate the OpenAI agent-workspace decision from the GitHub control-plane decision." },
      { slug: "agents-md-vs-claude-md-cursorrules-copilot-instructions", anchor: "compare repository instruction files", reason: "Verify which policy file each approved surface reads." },
      { slug: "local-vs-cloud-ai-coding-agent", anchor: "choose local or cloud execution", reason: "Decide the execution boundary before selecting a vendor surface." },
      { slug: "agent-mode-vs-chat-mode-in-ide", anchor: "choose agent mode or chat mode", reason: "Define when the assistant may act instead of only answer." },
      { slug: "agent-governance-checklist-for-software-teams", anchor: "apply the coding-agent governance checklist", reason: "Turn product selection into owned permissions, logs, approvals, limits, and revocation." },
      { slug: "secure-mcp-servers-ai-coding-agents", anchor: "secure MCP tool access", reason: "Apply least privilege when any shortlisted product can call external tools." },
      { slug: "loop-engineering-ai-coding-agents", anchor: "design bounded verification loops", reason: "Use shared stop rules and proof commands in every product pilot." },
    ],
    checklist: [
      "Inventory the exact product surfaces and repositories in scope.",
      "Name the identity, policy, billing, log, and revocation owners.",
      "Verify instruction-file support on every enabled surface.",
      "Use the same clean commit and bounded task for pilots.",
      "Start with least-privilege tools, paths, URLs, network, and secrets.",
      "Record product versions, selected models, prompts, grants, and verification output.",
      "Measure human interventions and review findings.",
      "Use current vendor plan pages for any cost comparison.",
    ],
    evidence: [
      { title: "Introducing the Codex app", url: "https://openai.com/index/introducing-the-codex-app/", publisher: "OpenAI", note: "Official Codex app description covering threads, worktrees, skills, automations, sandboxing, and cross-surface work." },
      { title: "Use AGENTS.md with Codex", url: "https://learn.chatgpt.com/docs/agent-configuration/agents-md", publisher: "OpenAI", note: "Official root and nested repository-instruction discovery and precedence guidance." },
      { title: "Claude Code overview", url: "https://code.claude.com/docs/en/overview", publisher: "Anthropic", note: "Official overview of Claude Code surfaces, repository work, integrations, and automation paths." },
      { title: "How Claude remembers your project", url: "https://code.claude.com/docs/en/memory", publisher: "Anthropic", note: "Official CLAUDE.md memory locations, scope, and project instruction behavior." },
      { title: "Create custom subagents", url: "https://code.claude.com/docs/en/sub-agents", publisher: "Anthropic", note: "Official subagent roles, tools, permissions, and delegation guidance." },
      { title: "About GitHub Copilot CLI", url: "https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli", publisher: "GitHub", note: "Official CLI capabilities, permissions, plan mode, custom agents, skills, hooks, MCP, and instruction guidance." },
      { title: "Support for different types of custom instructions", url: "https://docs.github.com/en/copilot/reference/custom-instructions-support", publisher: "GitHub", note: "Official instruction support matrix across GitHub, IDE, cloud-agent, code-review, and CLI surfaces." },
      { title: "Cursor Cloud Agents", url: "https://cursor.com/docs/cloud-agent", publisher: "Cursor", note: "Official isolated-VM workflow, supported source-control providers, parallel agents, environments, network controls, MCP, hooks, and billing notes." },
      { title: "Cursor rules", url: "https://cursor.com/docs/rules", publisher: "Cursor", note: "Official project, user, and team rules plus AGENTS.md and .cursor/rules guidance." },
      { title: "Cursor for iOS", url: "https://cursor.com/docs/cloud-agent/mobile", publisher: "Cursor", note: "Official Cloud Agent handoff, supervision, review, and availability across mobile, web, and desktop surfaces." },
    ],
    relatedArticleSlugs: [
      "openai-codex-plugins-sites-annotations",
      "github-copilot-cloud-local-sandboxes-preview",
      "cursor-enterprise-organizations-governance",
    ],
    publishedAt: "2026-07-19",
    updatedAt: "2026-07-19",
    metaTitle: "AI Coding Agent Comparison: Codex, Claude, Cursor & Copilot",
    metaDescription:
      "Compare Codex, Claude Code, Cursor, and GitHub Copilot across app, CLI, agents, instructions, models, permissions, review, and team governance.",
    resourceIds: ["coding-agent-comparison"],
  },
  {
    id: "guide-codex-vs-github-copilot",
    title: "Codex vs GitHub Copilot: Which Coding Agent Fits Your Team?",
    slug: "codex-vs-github-copilot",
    summary:
      "Compare Codex vs GitHub Copilot by app, CLI, IDE, cloud-agent, instruction-file, model, parallel-work, permission, billing, and team-governance fit—with a six-question decision tool.",
    intent: "Developers and engineering leaders want to choose between Codex and GitHub Copilot for agentic coding work, not just autocomplete.",
    audience: "Developers, platform teams, engineering managers, and enterprise buyers evaluating coding-agent workflows.",
    pageType: "Comparison decision guide",
    secondaryKeywords: [
      "OpenAI Codex vs GitHub Copilot",
      "GitHub Copilot vs Codex",
      "Codex CLI vs Copilot CLI",
      "Codex alternative",
      "GitHub Copilot alternative",
      "best AI coding agent for teams",
      "Codex vs Copilot pricing",
    ],
    sections: [
      {
        heading: "Quick answer",
        body: [
          "Choose Codex when your team wants an OpenAI-native agent across the desktop app, CLI, IDE, cloud, and mobile handoff, with AGENTS.md and isolated worktree-based parallelism. Choose GitHub Copilot when GitHub organization policy, broad editor coverage, multiple model providers, repository and path-specific instructions, and issue-to-pull-request workflows are the stronger fit. Neither is only a code-completion product in 2026, so compare the exact surfaces your team will deploy.",
        ],
      },
      {
        heading: "The old comparison is no longer useful",
        body: [
          "A comparison that calls Codex an autonomous agent and GitHub Copilot an autocomplete extension is now incomplete. Codex spans its app, CLI, IDE integration, cloud tasks, GitHub-oriented review, skills, plugins, hooks, automations, remote environments, and mobile steering. GitHub Copilot spans editor completion and chat, a local and cloud-capable CLI, cloud coding agent, code review, custom agents, skills, hooks, MCP, model selection, and GitHub-native administration.",
          "The useful question is not which product can edit more than one file. Both can inspect repositories, change code, run commands, and work toward a verified result on supported surfaces. The decision is where work starts, which control plane owns it, how permissions are constrained, what instruction files already exist, and how the final diff enters your review process.",
        ],
      },
      {
        heading: "Codex vs GitHub Copilot at a glance",
        body: [
          "Codex is the cleaner starting point for teams that already use ChatGPT or OpenAI workspaces and want one agent relationship across local and cloud execution. The Codex app gives multiple tasks separate threads and built-in worktrees, while the CLI exposes configurable sandbox and approval modes. AGENTS.md supplies durable repository guidance that can narrow by directory.",
          "GitHub Copilot is the cleaner starting point when repositories, issues, pull requests, seats, policy, and developer identity already live in GitHub. Copilot can stay inside supported editors, run in a terminal, or accept cloud tasks. Its instruction system is broader but more surface-dependent: repository-wide instructions, path-specific files, organization and personal rules, plus agent instruction files such as AGENTS.md on documented surfaces.",
        ],
      },
      {
        heading: "Codex app vs Copilot in GitHub and the IDE",
        body: [
          "The Codex app is designed as a command center for multiple agent threads. Each task can use an isolated worktree, and a reviewer can inspect the diff, comment, continue the thread, or open the changes in an editor. This fits work that begins as a delegated outcome: investigate a defect, implement a feature, repair CI, or keep a recurring workflow moving.",
          "Copilot's advantage is distribution across the GitHub and editor surfaces teams already use. A developer can move from inline assistance and chat to agent mode, CLI work, cloud-agent delegation, code review, or a pull-request workflow without introducing a separate repository control plane. The exact feature and instruction support varies by surface, so procurement should name the IDEs and GitHub features that are actually approved.",
        ],
      },
      {
        heading: "Codex CLI vs GitHub Copilot CLI",
        body: [
          "Both CLIs can read and edit files, run commands, use tools, and work iteratively. Codex exposes sandbox modes and approval policies at launch, and shares sessions and configuration with other Codex surfaces. Copilot CLI exposes tool, path, and URL permissions, plan mode, MCP, custom agents, skills, hooks, model selection, GitHub pull-request commands, local sandboxing, cloud sessions, and context or usage views.",
          "For unattended work, do not compare only whether a permissive flag exists. Compare the restrictive default you can operate: allowed directories, network access, destructive commands, secret access, maximum continuation steps, audit evidence, and who may widen permissions. GitHub warns that Copilot CLI path scoping is heuristic; OpenAI likewise recommends sandbox and approval controls. A safe pilot should record every permission grant rather than using an all-access mode by default.",
        ],
      },
      {
        heading: "Parallel agents and isolated work",
        body: [
          "Codex makes parallelism visible through separate app threads and built-in worktrees. This is useful when several agents must explore or implement independent paths without modifying the same checkout. The reviewer can keep each diff and conversation separate, then choose which branch to continue or integrate.",
          "GitHub Copilot offers parallel patterns through the cloud coding agent and Copilot CLI's /fleet command, which delegates parts of a task to subagents. The GitHub-native route is attractive when work should begin from issues and end as pull requests. In either product, parallel execution is safe only when ownership is disjoint, verification commands are shared, and one reviewer resolves integration conflicts.",
        ],
      },
      {
        heading: "AGENTS.md vs Copilot custom instructions",
        body: [
          "Codex uses AGENTS.md as its primary repository instruction surface, including nested files for directory-specific commands and boundaries. That gives teams a simple canonical policy: purpose, setup, tests, safe edit scope, generated files, security rules, and completion evidence.",
          "Copilot supports a larger instruction family. The broad repository baseline is .github/copilot-instructions.md; path-specific rules use .github/instructions files; personal and organization rules apply on supported surfaces; and agent instruction files such as AGENTS.md or CLAUDE.md are supported selectively. This flexibility is valuable, but it creates a synchronization risk. Keep one shared policy source and generate or audit surface adapters instead of copying divergent rules by hand.",
        ],
      },
      {
        heading: "Models, extensions, and ecosystem fit",
        body: [
          "Codex is an OpenAI-native product. That simplifies the model, account, workspace, and support relationship for organizations already standardized on OpenAI. Its extensibility includes skills, plugins, MCP connections, hooks, and automations that can package repeatable work across the app and CLI.",
          "GitHub Copilot documents a broad supported-model catalog and lets users select a model or use automatic selection where plans and policies allow it. Copilot CLI also supports custom agents, skills, hooks, plugins, and MCP. Model variety can be an advantage for procurement or task matching, but it also increases evaluation and governance work: every approved model may differ in availability, token pricing, context, data handling, and behavior.",
        ],
      },
      {
        heading: "Pricing and usage are not one static number",
        body: [
          "Codex usage is available through eligible ChatGPT plans, with optional additional credits where offered. GitHub Copilot uses individual or organization plans and, under its current billing documentation, AI Credits derived from token use and model rates. Both vendors can change allowances, overage rules, included models, and temporary promotions.",
          "Do not publish a winner based on one monthly sticker price. Model the team's real workload: active developers, completion use, agent sessions, code review, parallel tasks, long context, overages, and administrative overhead. Record the plan page and date used for the estimate. This guide intentionally does not freeze a price table that could become wrong after the July 19, 2026 verification date.",
        ],
      },
      {
        heading: "Security and enterprise rollout",
        body: [
          "For Codex, review local sandbox modes, approval policies, workspace controls, cloud-environment configuration, plugins, MCP servers, hooks, network access, and the path from agent output to a reviewed change. For Copilot, review organization policy, seat assignment, model availability, tool and path permissions, cloud-agent access, repository instructions, MCP, hooks, extensions, and GitHub audit ownership.",
          "The safer product is the one your organization can configure narrowly and inspect consistently. Require named owners, approved repositories, least-privilege tools, secret boundaries, network allowlists, review gates, cost caps, and revocation. Do not equate a sandbox toggle with a complete security program, and do not let a pilot run with production credentials merely to reduce setup time.",
        ],
      },
      {
        heading: "How to run a fair same-repository pilot",
        body: [
          "Start from the same clean commit. Give each tool the same bug fix or small feature, prompt, readable instruction files, allowed tools, network policy, time window, and verification command. Record product and CLI versions, selected model, elapsed time, changed files, human interventions, permission grants, verification result, review comments, and any cost data the product exposes.",
          "Run at least one failing-test repair, one small API or UI change, and one refactor with no intended behavior change. Preserve failures and raw outputs. A faster run that fails verification or produces a high-risk diff is not a win. If cost, token use, or reviewer time is unavailable, label it Not measured rather than estimating from a marketing plan.",
        ],
      },
      {
        heading: "Can teams use Codex and Copilot together?",
        body: [
          "Yes. A common division is Copilot for editor-native assistance, GitHub review, and issue-to-pull-request workflows, with Codex for separate delegated threads, worktree-isolated exploration, OpenAI-connected workflows, or long-running automations. The tools overlap more than they used to, so the division should be explicit rather than based on old product stereotypes.",
          "When both are allowed, avoid maintaining two conflicting instruction systems. Put shared repository facts and safety rules in a canonical source, adapt them to documented surfaces, and audit drift. Assign one tool per task or branch, use the same CI gates, and keep ownership of the final merge with a human reviewer.",
        ],
      },
    ],
    recommendedPlay: [
      "Choose the approved work surface and control plane before comparing model claims.",
      "Run the six-question decision tool, then verify the result with the same bounded repository task in both products.",
      "Keep one canonical instruction policy and audit Codex and Copilot adapters for drift.",
      "Verify current plan allowances and model availability on the vendor pages before procurement.",
      "Score verification, permissions, interventions, and review effort—not output speed alone.",
    ],
    decisionTable: {
      title: "Codex vs GitHub Copilot across 14 decision dimensions",
      intro: "This matrix reflects official product documentation reviewed July 19, 2026. Support can vary by Copilot surface and organization policy; verify before rollout.",
      columns: ["Codex", "GitHub Copilot", "Decision rule"],
      rows: [
        { label: "Primary product shape", values: ["OpenAI agent across app, CLI, IDE, cloud, and mobile handoff", "GitHub and editor assistant plus CLI, cloud agent, and code review", "Choose where tasks should begin and be supervised"] },
        { label: "Local CLI", values: ["Codex CLI with sandbox and approval configuration", "Copilot CLI with tool, path, URL, sandbox, model, and context controls", "Pilot the restrictive configuration, not an all-access flag"] },
        { label: "IDE workflow", values: ["Codex IDE integration and app-to-editor handoff", "Broad Copilot editor distribution with chat, completion, and agent surfaces", "Inventory the exact IDEs your team supports"] },
        { label: "Cloud delegation", values: ["Independent cloud tasks in repository environments", "GitHub cloud coding agent and cloud-backed CLI sessions", "Choose the approved identity, repository, and review boundary"] },
        { label: "Parallel work", values: ["Separate threads and built-in worktrees", "Cloud tasks plus CLI /fleet subagents", "Require disjoint ownership and shared verification"] },
        { label: "Repository instructions", values: ["Root and nested AGENTS.md", ".github/copilot-instructions.md, path-specific rules, and agent files by surface", "Keep one canonical policy and prevent adapter drift"] },
        { label: "Model selection", values: ["OpenAI-native Codex model path", "Supported multi-provider model catalog and auto selection", "Balance procurement simplicity against model choice"] },
        { label: "Extensions", values: ["Skills, plugins, hooks, MCP, and automations", "Custom agents, skills, plugins, hooks, and MCP", "Compare governance and reuse, not feature-name counts"] },
        { label: "Permissions", values: ["Configurable sandbox and approval policies", "Tool, path, and URL approvals plus local sandbox options", "Record grants and keep production credentials out of pilots"] },
        { label: "Planning and autonomy", values: ["Interactive and delegated agent threads with configurable approvals", "Plan mode, autopilot, continuation caps, and programmatic CLI", "Cap autonomous steps and define escalation"] },
        { label: "GitHub workflow", values: ["Review diffs and create or hand off pull requests", "Native repositories, issues, pull requests, cloud agent, and code review", "Prefer Copilot when GitHub is the required control plane"] },
        { label: "Usage model", values: ["Eligible ChatGPT plans plus optional credits where offered", "Copilot plans and AI Credits based on documented token rates", "Estimate the real workload using current vendor pages"] },
        { label: "Administration", values: ["OpenAI workspace and Codex controls", "GitHub organization and enterprise policy", "Choose the team that can own identity, policy, logs, and revocation"] },
        { label: "Poor-fit scenario", values: ["Poorer fit when GitHub policy and model variety are non-negotiable", "Poorer fit when the team wants one OpenAI-native multi-agent command center", "Do not force a tool across a control plane the team cannot govern"] },
      ],
    },
    actionSteps: [
      { title: "Name the real surfaces", body: "List app, CLI, IDE, GitHub, cloud agent, code review, mobile, and automation surfaces the team will actually enable." },
      { title: "Freeze a pilot task", body: "Use one commit, prompt, instruction set, permission boundary, and verification command for both products." },
      { title: "Measure reviewable outcomes", body: "Record verification, interventions, permission grants, changed files, review comments, and only the cost data actually available." },
      { title: "Choose the control plane", body: "Assign ownership for seats, models, repository access, instructions, tools, logs, limits, and revocation." },
      { title: "Recheck changing claims", body: "Verify plans, models, feature availability, and data policy against the linked official sources before signing or renewal." },
    ],
    pitfalls: [
      { title: "Treating Copilot as autocomplete only", fix: "Evaluate its IDE, CLI, cloud-agent, code-review, custom-agent, skill, hook, MCP, and parallel surfaces." },
      { title: "Counting features instead of workflows", fix: "Map every claimed feature to a task owner, permission boundary, proof command, and review path." },
      { title: "Publishing stale price tables", fix: "Link current vendor plan pages, state the verification date, and model the team's actual token and agent workload." },
      { title: "Using permissive flags in the pilot", fix: "Start with narrow tool, path, URL, network, and secret access; record every exception." },
      { title: "Calling an unverified output a benchmark win", fix: "Require tests or another observable completion criterion and publish failures alongside passes." },
    ],
    internalLinks: [
      { slug: "ai-coding-agents-comparison", anchor: "compare four AI coding-agent operating models", reason: "Place the OpenAI-versus-GitHub decision inside the broader Codex, Claude Code, Cursor, and Copilot shortlist." },
      { slug: "codex-vs-claude-code", anchor: "compare Codex with Claude Code", reason: "Separate the OpenAI-vs-Anthropic decision from the GitHub control-plane decision." },
      { slug: "agents-md-vs-claude-md-cursorrules-copilot-instructions", anchor: "compare Codex and Copilot instruction files", reason: "Verify which repository instruction surface each enabled product feature reads." },
      { slug: "agents-md-template-for-ai-coding-agents", anchor: "copy a tested AGENTS.md template", reason: "Give both agent pilots concrete setup, test, safety, and completion guidance." },
      { slug: "local-vs-cloud-ai-coding-agent", anchor: "choose local or cloud agent execution", reason: "Decide execution location before comparing vendor surfaces." },
      { slug: "loop-engineering-ai-coding-agents", anchor: "design bounded agent loops", reason: "Set verification, retry, cost, and stop rules for either CLI." },
      { slug: "agent-governance-checklist-for-software-teams", anchor: "apply the coding-agent governance checklist", reason: "Turn product selection into owned identity, permission, logging, and incident controls." },
      { slug: "secure-mcp-servers-ai-coding-agents", anchor: "secure MCP access", reason: "Both ecosystems can connect tools through MCP and need least-privilege controls." },
    ],
    checklist: [
      "Inventory the exact Codex and Copilot surfaces in scope.",
      "Verify official feature and instruction support by surface.",
      "Use the same repository commit and task for the pilot.",
      "Start with least-privilege tool, path, URL, and network access.",
      "Record versions, models, prompts, permissions, and verification output.",
      "Measure human interventions and review effort.",
      "Use current vendor plan pages for any cost estimate.",
      "Assign owners for policy, billing, logs, and revocation.",
    ],
    evidence: [
      { title: "Introducing the Codex app", url: "https://openai.com/index/introducing-the-codex-app/", publisher: "OpenAI", note: "Official description of Codex app threads, worktrees, skills, automations, sandboxing, surfaces, and plan access." },
      { title: "Codex CLI — Getting Started", url: "https://help.openai.com/en/articles/11096431", publisher: "OpenAI", note: "Official Codex CLI overview covering local repository work and approval modes." },
      { title: "Use AGENTS.md with Codex", url: "https://learn.chatgpt.com/docs/agent-configuration/agents-md", publisher: "OpenAI", note: "Official Codex repository instruction discovery and scoped precedence guidance." },
      { title: "About GitHub Copilot CLI", url: "https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli", publisher: "GitHub", note: "Official CLI capabilities, permissions, plan mode, custom agents, skills, hooks, MCP, and instruction guidance." },
      { title: "Allowing GitHub Copilot CLI to work autonomously", url: "https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot", publisher: "GitHub", note: "Official autopilot, permission, continuation-limit, safety, and AI Credit considerations." },
      { title: "Support for different types of custom instructions", url: "https://docs.github.com/en/copilot/reference/custom-instructions-support", publisher: "GitHub", note: "Official instruction-file support matrix across GitHub, IDE, cloud agent, review, and CLI surfaces." },
      { title: "Plans for GitHub Copilot", url: "https://docs.github.com/en/copilot/get-started/plans", publisher: "GitHub", note: "Official current plan positioning and included Copilot capabilities." },
      { title: "Models and pricing for GitHub Copilot", url: "https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing", publisher: "GitHub", note: "Official current model-token and AI Credit billing reference; values should be rechecked before procurement." },
    ],
    relatedArticleSlugs: [
      "openai-codex-plugins-sites-annotations",
      "github-copilot-cloud-local-sandboxes-preview",
      "github-copilot-sdk-general-availability",
    ],
    publishedAt: "2026-07-19",
    updatedAt: "2026-07-19",
    metaTitle: "Codex vs GitHub Copilot: Agent Workflow & Team Fit (2026)",
    metaDescription:
      "Compare Codex vs GitHub Copilot across app, CLI, IDE, cloud agents, instructions, models, permissions, billing, and governance. Use the decision tool.",
    resourceIds: ["codex-copilot-decision"],
  },
  {
    id: "guide-instruction-file-adoption-report-2026",
    title: "AI Coding Agent Instruction File Adoption Report — Q3 2026",
    slug: "ai-coding-agent-instruction-file-adoption-report-2026",
    summary:
      "Explore a reproducible public GitHub snapshot of 400 AGENTS.md, CLAUDE.md, Copilot instruction, and Cursor rule files, including indexed match counts, language mix, test commands, security rules, and common gaps.",
    intent: "Developers and researchers want current public data on how AI coding agent instruction files are written and what important controls they omit.",
    audience: "Engineering leaders, developer-tool researchers, platform teams, and maintainers designing repository instructions for coding agents.",
    pageType: "Original data report",
    secondaryKeywords: [
      "AGENTS.md adoption",
      "CLAUDE.md adoption",
      "copilot-instructions.md examples",
      "Cursor MDC rules",
      "AI coding agent instruction file statistics",
      "GitHub AGENTS.md report",
    ],
    sections: [
      {
        heading: "Quick answer",
        body: [
          "On July 19, 2026, GitHub code search returned 158,592 indexed file matches for AGENTS.md, 56,888 for .github/copilot-instructions.md, 46,772 for CLAUDE.md, and 8,392 for Cursor MDC rules. These are file matches—not unique repositories or adoption rates. KyenAI separately analyzed the first 100 best-match public files for each query to report content signals and gaps.",
        ],
      },
      {
        heading: "What the GitHub match counts mean",
        body: [
          "The headline numbers come from GitHub's public code-search API at one point in time. A repository can contain more than one matching file, generated copies can be indexed, forks may be present, and GitHub does not expose the total number of eligible repositories for these queries. For those reasons, dividing a match count by a guessed repository total would create a false adoption rate.",
          "Use the counts as a reproducible search-visibility snapshot: they show how many indexed files matched the exact query when collected. Use the sample analysis to form hypotheses about instruction quality, then validate those hypotheses in a random or stratified study before making population claims.",
        ],
      },
      {
        heading: "What the 400-file sample found",
        body: [
          "All 100 AGENTS.md and CLAUDE.md sample files were readable. The Copilot query produced 99 readable files and the Cursor query produced 100. Every query also produced 99 or 100 unique repositories within its own sample, reducing—but not eliminating—duplicate-repository effects.",
          "Explicit verification and security guidance were often absent. In the AGENTS.md sample, 68% lacked a detected security or approval rule and 53% lacked detected verification or completion criteria. In the Cursor rule sample, 87% lacked a detected security or approval rule, 83% lacked detected completion criteria, and 75% lacked an explicit test command. These are deterministic text detections, not judgments about repository quality.",
        ],
      },
      {
        heading: "Test commands and security patterns",
        body: [
          "The most frequently detected test command in sampled AGENTS.md files was pytest at 11%, followed by cargo test at 10% and go test at 7%. The top detected AGENTS.md security category was secrets and credentials at 24%. CLAUDE.md most often named npm test at 12%, while production restrictions appeared in 36% of its sample.",
          "A missing text pattern does not prove that a repository lacks tests or security controls; the rules may live in CI, contributor documentation, policy tooling, or another instruction file. The report measures whether the sampled file itself gives an agent an explicit, recognizable command or boundary.",
        ],
      },
      {
        heading: "How to use this report",
        body: [
          "Benchmark your own instruction file against five practical categories: setup, explicit test commands, completion criteria, scope or precedence, and security or approval rules. Copy only controls that are true for your repository, and run each command from a clean checkout before publishing it to an agent.",
          "For research or citation, download the JSON to preserve the query totals, methodology, summaries, limitations, and raw rows together. Use the CSV when you need repository URLs and detected signals for independent analysis. Always cite the snapshot date and the best-match sampling limitation next to any percentage.",
        ],
      },
    ],
    recommendedPlay: [
      "Treat GitHub match totals as file counts, never as unique-repository adoption rates.",
      "Use the sample gaps as an audit checklist for setup, tests, completion, scope, and safety.",
      "Download the JSON when citing results so the date, query, denominator, and limitations remain attached.",
      "Repeat the generator on a later date to measure search-index change with the same method.",
    ],
    decisionTable: {
      title: "Instruction-file snapshot by surface",
      intro: "Choose the row that matches the tool surface you are researching; the match totals and sample results are not interchangeable.",
      columns: ["Search query", "Snapshot finding", "Interpretation boundary"],
      rows: [
        {
          label: "AGENTS.md",
          values: ["filename:AGENTS.md", "158,592 indexed file matches; 100 sampled files", "May include multiple files per repository and forks"],
        },
        {
          label: "CLAUDE.md",
          values: ["filename:CLAUDE.md", "46,772 indexed file matches; 100 sampled files", "Measures filenames, not active Claude Code use"],
        },
        {
          label: "Copilot instructions",
          values: ["filename:copilot-instructions.md path:.github", "56,888 indexed file matches; 100 sampled files", "Path query covers the repository-wide file, not every Copilot instruction surface"],
        },
        {
          label: "Cursor MDC rules",
          values: ["extension:mdc path:.cursor/rules", "8,392 indexed file matches; 100 sampled files", "Counts individual rule files, so one repository may contribute many"],
        },
      ],
    },
    actionSteps: [
      { title: "Choose the exact surface", body: "Match your coding tool to its documented instruction path before comparing counts or content." },
      { title: "Preserve the denominator", body: "State whether a percentage uses readable files, sampled files, unique sample repositories, or GitHub file matches." },
      { title: "Audit your repository", body: "Check for setup, tests, verification, scope, and security rules with the downloadable categories." },
      { title: "Reproduce or extend", body: "Run the generator with a GitHub token, record the new date, and compare like-for-like queries." },
    ],
    pitfalls: [
      { title: "Calling file matches an adoption rate", fix: "Say indexed file matches and publish the unique-repository count only for the analyzed sample." },
      { title: "Treating best-match results as random", fix: "Label every sample percentage as descriptive of GitHub's first 100 best matches for that query." },
      { title: "Equating absence with failure", fix: "Describe missing detected patterns; do not claim the repository lacks a control elsewhere." },
      { title: "Citing a live number without a date", fix: "Include the July 19, 2026 snapshot date or regenerate the dataset before publication." },
    ],
    internalLinks: [
      {
        slug: "agents-md-vs-claude-md-cursorrules-copilot-instructions",
        anchor: "compare AGENTS.md, CLAUDE.md, Copilot instructions, and Cursor rules",
        reason: "Use official support documentation to choose the correct file after reviewing the public data.",
      },
      {
        slug: "agents-md-template-for-ai-coding-agents",
        anchor: "download an AGENTS.md template",
        reason: "Turn the report's common gaps into a tested repository policy.",
      },
      {
        slug: "agents-md-examples-codex-node-python-monorepos",
        anchor: "review Node.js, Python, and monorepo AGENTS.md examples",
        reason: "Compare the detected language and test-command patterns with complete examples.",
      },
      {
        slug: "agent-governance-checklist-for-software-teams",
        anchor: "apply the AI agent governance checklist",
        reason: "Move security and approval guidance from prose into owned team controls.",
      },
    ],
    checklist: [
      "Name the exact GitHub query and snapshot date.",
      "Separate indexed file matches from unique sampled repositories.",
      "State that GitHub best-match ordering is not random.",
      "Keep sample percentages tied to readable-file denominators.",
      "Describe regex detections as signals, not quality judgments.",
      "Link the downloadable raw rows and methodology.",
      "Regenerate before citing the figures as current.",
    ],
    evidence: [
      {
        title: "REST API endpoints for search: Search code",
        url: "https://docs.github.com/en/rest/search/search?apiVersion=2022-11-28#search-code",
        publisher: "GitHub",
        note: "Primary documentation for the public code-search endpoint, result totals, ordering, and API constraints used by the generator.",
      },
      {
        title: "Understanding GitHub Code Search syntax",
        url: "https://docs.github.com/en/search-github/github-code-search/understanding-github-code-search-syntax",
        publisher: "GitHub",
        note: "Primary documentation for filename, path, and extension query qualifiers used in the four searches.",
      },
    ],
    relatedArticleSlugs: [],
    publishedAt: "2026-07-19",
    updatedAt: "2026-07-19",
    metaTitle: "AI Agent Instruction File Adoption: GitHub Data Report",
    metaDescription:
      "See GitHub match counts and a 400-file sample of AGENTS.md, CLAUDE.md, Copilot instructions, and Cursor rules. Download the raw CSV and JSON.",
    resourceIds: ["instruction-adoption-report"],
  },
  {
    id: "guide-claude-code-alternatives",
    title: "7 Claude Code Alternatives for Different Coding Workflows",
    slug: "claude-code-alternatives",
    summary:
      "Compare Codex, GitHub Copilot, Cursor, Gemini CLI, Cline, Aider, and OpenCode by the workflow problem you need to solve—not by an invented universal ranking.",
    intent: "Developers and engineering teams want a current, evidence-led shortlist of Claude Code alternatives and a safe way to decide whether switching is worth the migration cost.",
    audience: "Developers, staff engineers, platform teams, security reviewers, and buyers evaluating a replacement or complement for Claude Code.",
    pageType: "Alternatives decision guide",
    secondaryKeywords: [
      "alternatives to Claude Code",
      "Claude Code alternative",
      "free Claude Code alternative",
      "open source Claude Code alternative",
      "Claude Code alternatives for teams",
      "Claude Code replacement",
      "Codex vs Claude Code alternatives",
    ],
    sections: [
      {
        heading: "Quick answer",
        body: [
          "Start with Codex for an OpenAI-native agent workspace; GitHub Copilot for a GitHub and existing-IDE control plane; Cursor for an AI-first editor plus Cloud Agents; Gemini CLI for Google's open-source terminal agent; Cline for explicit approvals and provider choice in an editor or terminal; Aider for a lightweight Git-centered terminal workflow; and OpenCode for an open-source multi-provider terminal, desktop, or IDE client. Stay with Claude Code when its terminal workflow, CLAUDE.md, Anthropic model boundary, permissions, and review cost already fit. The right answer is a pilot starting point, not a universal winner.",
        ],
      },
      {
        heading: "When you should stay with Claude Code",
        body: [
          "A new tool is not automatically an improvement. Claude Code already provides repository-aware terminal work, project instructions and memory, permissions, hooks, subagents, MCP connections, sessions, and automation paths. If the current setup passes verification, fits the approved Anthropic boundary, and produces reviewable diffs at an acceptable cost, migration may add instruction drift, retraining, duplicate subscriptions, and governance work without solving a measured problem.",
          "Write down the reason to switch before comparing products. Useful reasons are concrete: GitHub must own identity and pull requests; the team needs an AI-first editor; provider choice is mandatory; an open-source client is required; Google Cloud authentication is already approved; or the current review and permission workflow is too expensive. If the reason is only curiosity or a benchmark headline, keep Claude Code as the baseline and run a time-boxed pilot without replacing it.",
        ],
      },
      {
        heading: "1. Codex: for an OpenAI-native agent workspace",
        body: [
          "Codex is the closest alternative when the desired change is the command center rather than the terminal itself. OpenAI documents Codex across its app, CLI, IDE, and cloud workflows. The app can separate delegated work into threads and isolated worktrees, while AGENTS.md provides durable root and directory-scoped repository guidance. That shape fits teams already using OpenAI workspaces or wanting several bounded agent tasks visible from one place.",
          "The tradeoff is a real platform migration: models, accounts, repository instructions, sandbox and approval settings, cloud environments, plugins, MCP connections, billing, and administration all need review. Do not compare a fully configured Claude Code workflow with a permissive Codex demo. Give both the same clean commit, prompt, allowed tools, timebox, and proof command, then compare verification, interventions, permission grants, diff clarity, and reviewer effort.",
        ],
      },
      {
        heading: "2. GitHub Copilot: for GitHub and existing IDEs",
        body: [
          "GitHub Copilot is the strongest starting point when repositories, organization identity, issues, pull requests, seats, and policy should remain the control plane. Copilot spans supported IDEs, GitHub, CLI, cloud coding agent, code review, custom agents, skills, hooks, MCP, and model selection. This can reduce organizational migration when developers use several editors but already work inside GitHub governance.",
          "The main caution is surface variation. Instruction-file support, models, permissions, plan features, and organization policy differ across IDE chat, CLI, cloud agent, review, and GitHub.com. Name the exact surfaces the team will deploy before calling a feature supported. Keep one canonical repository policy and verify how .github/copilot-instructions.md, path-specific rules, AGENTS.md, and CLAUDE.md are handled by each enabled surface.",
        ],
      },
      {
        heading: "3. Cursor: for an AI-first editor and Cloud Agents",
        body: [
          "Cursor is the natural pilot when the team wants the editor itself to become the AI operating surface. Its workflow combines an AI-first code editor, project and team rules, foreground agent work, and remote Cloud Agents connected to approved source-control repositories. This can fit teams that want to move between interactive editing and asynchronous remote tasks without centering every job in a terminal session.",
          "Changing editors is broader than changing assistants. Evaluate extension compatibility, onboarding, privacy settings, repository access, network controls, remote-environment identity, model routing, Cloud Agent availability, review path, and plan administration. Use the current term Cloud Agents—Cursor's documentation says they were formerly called Background Agents—and verify local and remote tasks separately because their permissions and operational risks are different.",
        ],
      },
      {
        heading: "4. Gemini CLI: for Google's open-source terminal agent",
        body: [
          "Gemini CLI is a relevant Claude Code alternative for terminal teams aligned with Google. Google describes it as an Apache-2.0 open-source terminal agent with file operations, shell commands, web fetching, Google Search grounding, MCP, non-interactive scripting, GEMINI.md context files, checkpointing, and GitHub workflow integration. Authentication can use a Google account, Gemini API key, or Vertex AI, depending on the workload and organization.",
          "Do not freeze today's quota or model names into a long-term procurement claim. Free allowances, request limits, available models, billing, and enterprise requirements can change, and the correct authentication path affects data handling and administration. Verify the current official quota and terms on the day of the pilot. Record which account, project, model, release channel, sandbox, trusted-folder, and telemetry settings were used.",
        ],
      },
      {
        heading: "5. Cline: for explicit approval and provider choice",
        body: [
          "Cline is an open-source alternative for teams that want the coding agent in an editor or terminal while choosing how model access is billed. Its current documentation describes file reads and writes, terminal commands, browser use, explicit approval, CLI and headless automation, VS Code and JetBrains experiences, checkpoints, MCP, hooks, skills, and bring-your-own-key or managed access paths. That makes it a useful pilot for visible human-in-the-loop control and provider flexibility.",
          "Open source does not collapse the evaluation into one product. The client, selected model provider, credentials, usage charges, data terms, enterprise controls, extensions, and auto-approval settings each create a boundary. Pilot one provider and one restrictive approval configuration first. Treat Kanban, headless automation, and parallel worktrees as separate higher-autonomy evaluations rather than enabling them during the initial comparison.",
        ],
      },
      {
        heading: "6. Aider: for a lightweight Git-centered terminal workflow",
        body: [
          "Aider is a strong alternative when a developer wants terminal pair programming with explicit file context and close Git integration. Its documentation covers editing a local Git repository, a repository map, automatic commits and undo workflows, linting and testing, coding conventions, scripting, IDE and browser bridges, and connections to many model providers and local runtimes. The client can therefore be smaller and more provider-neutral than a managed agent workspace.",
          "That different product shape is also the tradeoff. Aider is not a drop-in replica of every Claude Code surface, team control, or subagent workflow. Provider setup and model behavior remain part of the test, and API or local-model costs still apply. Evaluate whether the simple Git loop reduces review effort: inspect commits, undo behavior, test repair, context selection, generated changes, and the amount of manual steering required.",
        ],
      },
      {
        heading: "7. OpenCode: for an open-source multi-provider agent client",
        body: [
          "OpenCode is an open-source coding agent available through a terminal interface, desktop app, or IDE extension. Its current documentation includes provider configuration, AGENTS.md initialization, Plan and Build modes, permissions, policies, tools, agents, MCP servers, LSP integration, GitHub and GitLab workflows, and a broad customization surface. It is a useful pilot when the client must be open source and the team wants to choose among approved model providers.",
          "Provider choice shifts responsibility to the adopter. API keys, model terms, token cost, data policy, network access, plugins, custom tools, and configuration now need explicit owners. Open-source software is not the same as free model usage, and a provider subscription does not automatically supply enterprise governance. Start in read-only Plan mode, review the generated AGENTS.md, approve one provider, and run a bounded Build-mode task without production secrets.",
        ],
      },
      {
        heading: "Free and open-source alternatives are not cost-free",
        body: [
          "Gemini CLI, Cline, Aider, and OpenCode have open-source client paths, but the complete workflow may still use paid APIs, subscriptions, hosted services, cloud projects, or local hardware. Even when a vendor offers a free allowance, quotas, eligible models, rate limits, data terms, and account requirements can change. A credible cost comparison separates client license, model usage, seats, overages, cloud compute, administration, security review, and developer time.",
          "Use current vendor pages on the day of evaluation and record the access date, currency, plan, model, included allowance, and overage rule. At task level, record only the cost or token data the product exposes. Mark anything else Not measured. A lower sticker price is not a win when setup, failed verification, manual repair, or review time costs more than the tool saves.",
        ],
      },
      {
        heading: "How to run a fair replacement pilot",
        body: [
          "Pick the leading two alternatives from the selector and keep Claude Code as the baseline. Start every run from the same clean commit. Use the same bounded bug fix, feature, or refactor; prompt; readable instruction files; allowed directories and tools; network policy; timebox; and verification command. Record product and CLI version, model, authentication path, changed files, elapsed time, human interventions, permission grants, verification result, reviewer findings, and measurable cost.",
          "Run at least three task types: repair one failing test, implement one small API or UI change, and perform one behavior-preserving refactor. Preserve failed runs and setup problems. A product should not win because it silently widened permissions, skipped tests, or produced a larger diff faster. Choose the smallest tool set the team can govern, and keep more than one product only when each has a named workflow rather than overlapping by habit.",
        ],
      },
    ],
    recommendedPlay: [
      "Write one measurable reason to switch before comparing products.",
      "Use the selector to choose a pilot starting point, including the option to stay with Claude Code.",
      "Run the leading alternatives and Claude Code from the same clean commit with identical boundaries and verification.",
      "Compare permission grants, interventions, diff clarity, reviewer effort, and measurable cost—not feature counts.",
      "Recheck official models, quotas, plans, data terms, and enterprise controls before rollout or procurement.",
    ],
    decisionTable: {
      title: "Claude Code alternatives by workflow reason",
      intro: "Use this matrix to choose a pilot, not to declare a universal quality winner. Product facts were reviewed against official sources on July 19, 2026.",
      columns: ["Natural fit", "Main tradeoff", "Verify before switching"],
      rows: [
        { label: "Stay with Claude Code", values: ["Terminal-first Anthropic workflow already performs well", "Keeps the current vendor and instruction boundary", "Baseline verification, review effort, cost, and the actual unsolved problem"] },
        { label: "Codex", values: ["OpenAI app, CLI, IDE, cloud, threads, worktrees, and AGENTS.md", "Changes workspace, models, instructions, and administration", "Sandbox, approvals, cloud environment, repository policy, and same-task result"] },
        { label: "GitHub Copilot", values: ["GitHub identity, pull requests, organization policy, and existing IDEs", "Support and controls vary by surface", "Exact IDE, CLI, cloud-agent, review, model, and instruction support"] },
        { label: "Cursor", values: ["AI-first editor plus remote Cloud Agents", "Editor adoption becomes part of the migration", "Local vs remote permissions, rules, privacy, network, and review path"] },
        { label: "Gemini CLI", values: ["Google-aligned open-source terminal agent and scripting", "Auth, quotas, models, and billing vary by path", "Google account, API, or Vertex route; current limits; sandbox; telemetry"] },
        { label: "Cline", values: ["Editor or terminal agent with explicit approval and provider choice", "Client and provider boundaries must both be governed", "Model access, billing, auto-approval, MCP, hooks, and enterprise controls"] },
        { label: "Aider", values: ["Lightweight terminal pair programming with Git integration", "Different operating model from a managed agent workspace", "Provider, repository map, commits, undo, tests, context, and review effort"] },
        { label: "OpenCode", values: ["Open-source terminal, desktop, or IDE client with provider choice", "More configuration and provider responsibility", "API keys, provider policy, AGENTS.md, Plan mode, permissions, and model cost"] },
      ],
    },
    actionSteps: [
      { title: "Name the switching trigger", body: "Write the one workflow, control-plane, provider, cost, permission, or interface constraint the current setup does not solve." },
      { title: "Choose two candidates", body: "Use the selector and decision table to shortlist no more than two alternatives while keeping Claude Code as the baseline." },
      { title: "Freeze the pilot", body: "Use one clean commit, task, prompt, instruction set, permission boundary, timebox, and proof command for every run." },
      { title: "Collect reviewable evidence", body: "Record versions, models, auth, grants, interventions, changed files, test output, review findings, and only measurable cost." },
      { title: "Decide or stay", body: "Switch only when the alternative measurably improves the named constraint without creating an unacceptable governance or migration cost." },
    ],
    pitfalls: [
      { title: "Ranking tools without a switching reason", fix: "Start from the constraint to solve; a generic winner list cannot reflect the team's control plane, permissions, or review process." },
      { title: "Calling open source free", fix: "Separate the client license from model usage, hosted services, cloud compute, local hardware, security review, and operations." },
      { title: "Comparing different tasks or permissions", fix: "Use the same commit, prompt, allowed tools, network policy, timebox, and verification command for every candidate." },
      { title: "Copying a stale price table", fix: "Link current plan and quota pages, state the access date, and mark unavailable task-level cost Not measured." },
      { title: "Migrating instruction files blindly", fix: "Keep one canonical policy, map it to documented product surfaces, and test precedence and scope before removing CLAUDE.md." },
      { title: "Keeping every pilot tool", fix: "Retain multiple products only when each owns a distinct workflow with accountable policy, billing, logs, and revocation." },
    ],
    internalLinks: [
      { slug: "codex-vs-claude-code", anchor: "compare Codex and Claude Code directly", reason: "Use the focused pairwise guide after the alternatives selector points to an OpenAI-native pilot." },
      { slug: "ai-coding-agents-comparison", anchor: "compare the four major coding-agent operating models", reason: "Place the seven-option shortlist inside a deeper Codex, Claude Code, Copilot, and Cursor governance matrix." },
      { slug: "codex-vs-github-copilot", anchor: "compare Codex with GitHub Copilot", reason: "Separate the OpenAI-workspace decision from the GitHub control-plane decision." },
      { slug: "agents-md-vs-claude-md-cursorrules-copilot-instructions", anchor: "map repository instruction files by tool", reason: "Verify AGENTS.md, CLAUDE.md, Copilot instruction, Cursor rule, and surface-specific support before migration." },
      { slug: "local-vs-cloud-ai-coding-agent", anchor: "choose local or cloud agent execution", reason: "Decide where work may run before comparing vendor automation and remote-agent claims." },
      { slug: "secure-mcp-servers-ai-coding-agents", anchor: "secure MCP and provider access", reason: "Every alternative that can call external tools needs least-privilege credentials, logs, and revocation." },
      { slug: "loop-engineering-ai-coding-agents", anchor: "design a bounded agent pilot loop", reason: "Use shared verification, retry, cost, and stop rules for each replacement candidate." },
      { slug: "agent-governance-checklist-for-software-teams", anchor: "apply the coding-agent governance checklist", reason: "Turn the shortlist into owned identity, repository, permission, logging, billing, and incident controls." },
    ],
    checklist: [
      "State one measurable reason for leaving or complementing Claude Code.",
      "Keep Claude Code as the controlled baseline during evaluation.",
      "Verify every product claim against a current official source.",
      "Use the same commit, task, prompt, tools, network policy, and proof command.",
      "Start every candidate with least-privilege permissions and no production secrets.",
      "Record the client, model, version, authentication path, and instruction files.",
      "Measure verification, interventions, diff clarity, reviewer effort, and available cost.",
      "Separate open-source client status from provider and model charges.",
      "Assign owners for policy, billing, logs, limits, support, and revocation.",
      "Remove duplicate tools when the pilot does not prove a distinct workflow benefit.",
    ],
    evidence: [
      { title: "Claude Code overview", url: "https://code.claude.com/docs/en/overview", publisher: "Anthropic", note: "Official baseline for Claude Code surfaces, repository workflows, integrations, and administration paths." },
      { title: "Introducing the Codex app", url: "https://openai.com/index/introducing-the-codex-app/", publisher: "OpenAI", note: "Official Codex app description covering threads, worktrees, skills, automations, sandboxing, and cross-surface work." },
      { title: "About GitHub Copilot CLI", url: "https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli", publisher: "GitHub", note: "Official CLI, plan mode, tools, permissions, custom agents, skills, hooks, MCP, and GitHub workflow reference." },
      { title: "Cursor Cloud Agents", url: "https://cursor.com/docs/cloud-agent", publisher: "Cursor", note: "Official remote Cloud Agent workflow and current terminology for the feature formerly called Background Agents." },
      { title: "Gemini CLI", url: "https://github.com/google-gemini/gemini-cli", publisher: "Google", note: "Official open-source repository covering terminal tools, GEMINI.md, MCP, scripting, authentication, quotas, and release channels." },
      { title: "Cline overview", url: "https://docs.cline.bot/cline-overview", publisher: "Cline", note: "Official editor, terminal, approval, provider, CLI, Kanban, SDK, and enterprise overview." },
      { title: "Aider documentation", url: "https://aider.chat/docs/", publisher: "Aider", note: "Official terminal, Git, repository map, test and lint, model provider, scripting, and configuration documentation." },
      { title: "OpenCode intro", url: "https://opencode.ai/docs/", publisher: "OpenCode", note: "Official open-source terminal, desktop, IDE, provider, AGENTS.md, Plan mode, permission, and customization overview." },
    ],
    relatedArticleSlugs: [
      "openai-codex-plugins-sites-annotations",
      "github-copilot-cloud-local-sandboxes-preview",
      "cursor-enterprise-organizations-governance",
    ],
    publishedAt: "2026-07-19",
    updatedAt: "2026-07-19",
    metaTitle: "7 Claude Code Alternatives by Workflow (2026)",
    metaDescription:
      "Compare Codex, Copilot, Cursor, Gemini CLI, Cline, Aider, and OpenCode by interface, model choice, permissions, cost model, and team fit.",
    resourceIds: ["claude-code-alternatives"],
  },
];
