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
    secondaryKeywords: ["OpenAI Codex vs Claude Code", "Codex alternatives", "Claude Code alternatives", "AI coding agent comparison", "agentic loop AI coding"],
    sections: [
      {
        heading: "Quick answer",
        body: [
          "Codex vs Claude Code is a workflow decision: choose Codex when OpenAI-native planning, code review, and shareable agent work fit your team; choose Claude Code when terminal-local memory, hooks, MCP servers, and subagents are part of daily engineering. Use public comparisons as examples, then run one same-repository bug fix, API change, component refactor, and test repair before calling either tool better.",
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
      title: "Codex and Claude Code fit map",
      intro: "Use this table to pick the starting tool by workflow, not by brand preference.",
      columns: ["Choose Codex when", "Choose Claude Code when", "Check before rollout"],
      rows: [
        {
          label: "Daily workspace",
          values: [
            "Planning, code review, and task handoff already happen around OpenAI tools",
            "The team works from terminal sessions and repository-local context",
            "Confirm where instructions, logs, and generated artifacts are stored",
          ],
        },
        {
          label: "Repository guidance",
          values: [
            "You want AGENTS.md-style repository instructions for Codex-compatible workflows",
            "You rely on CLAUDE.md memory and Claude-specific workflow notes",
            "Keep commands and security rules consistent across files",
          ],
        },
        {
          label: "Automation",
          values: [
            "You need agent work that can move from conversation to code artifacts",
            "You want hooks, MCP, and subagents as explicit control points",
            "Start read-only or low-risk until the workflow proves useful",
          ],
        },
        {
          label: "Team review",
          values: [
            "You want reviewable outputs that fit OpenAI/Codex collaboration habits",
            "You want terminal-local changes that can be checked with existing commands",
            "Require tests, diff review, and rollback for both",
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
        title: "OpenAI Codex AGENTS.md documentation",
        url: "https://developers.openai.com/codex/guides/agents-md",
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
    updatedAt: "2026-06-26",
    metaTitle: "Codex vs Claude Code: Workflow Fit and Same-Repo Test Checklist",
    metaDescription:
      "Compare Codex and Claude Code by repo workflow, instruction files, review effort, MCP/hooks, and a same-task protocol before standardizing.",
  },
  {
    id: "guide-agents-md-template",
    title: "AGENTS.md Template: Practical Examples for Codex and Monorepos",
    slug: "agents-md-template-for-ai-coding-agents",
    summary:
      "Copy an AGENTS.md template for Codex, Node.js, Python, and monorepos, then add safe edit boundaries, test commands, forbidden files, and review expectations.",
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
        url: "https://github.com/openai/codex/blob/main/docs/agents_md.md",
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
    updatedAt: "2026-06-26",
    metaTitle: "AGENTS.md Template: Copyable Examples for Codex, Node.js, Python",
    metaDescription:
      "AGENTS.md template for Codex: copy Node.js, Python, and monorepo examples with test commands, forbidden files, safe edit boundaries, and review rules.",
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
        url: "https://docs.anthropic.com/en/docs/claude-code/memory",
        publisher: "Anthropic",
        note: "Official CLAUDE.md project memory behavior for Claude Code.",
      },
    ],
    relatedArticleSlugs: ["github-copilot-sdk-general-availability"],
    updatedAt: "2026-06-18",
    metaTitle: "Does GitHub Copilot Read CLAUDE.md? Surface Matrix",
    metaDescription:
      "Check when GitHub Copilot reads CLAUDE.md, when to use copilot-instructions.md, and which Copilot surfaces need each file.",
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
        url: "https://developers.openai.com/codex/guides/agents-md",
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
    updatedAt: "2026-06-18",
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
    updatedAt: "2026-06-18",
    metaTitle: "AI Coding Agent Governance Checklist",
    metaDescription:
      "Use this AI coding agent governance checklist for permissions, logs, approval gates, prohibited actions, rollback, and emergency stop.",
  },
  {
    id: "guide-loop-engineering",
    title: "Loop Engineering for AI Coding Agents: Addy Osmani's Workflow Explained",
    slug: "loop-engineering-ai-coding-agents",
    summary:
      "Learn what loop engineering means for AI coding agents: Addy Osmani's workflow, examples, stop rules, token and cost caps, verification commands, and checkpoints.",
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
          "Addy Osmani's loop engineering approach means designing the operating loop around the agent, not writing one better prompt. For AI coding agents, the practical loop is Plan → Act → Observe → Verify → Stop, a stricter version of the act → observe → reason cycle: give the agent a bounded repo goal, inspect evidence such as tests or diffs, retry only with a changed strategy, and stop on token or cost caps, repeated failure, risky permission changes, or a required human checkpoint.",
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
    updatedAt: "2026-06-26",
    metaTitle: "What Is Loop Engineering? AI Agent Loops, Examples, Stop Rules",
    metaDescription:
      "Loop engineering designs repeatable AI agent loops around goals, tools, verification, retries, stop rules, and cost caps instead of one better prompt.",
    resourceIds: ["loop-engineering"],
  },
];
