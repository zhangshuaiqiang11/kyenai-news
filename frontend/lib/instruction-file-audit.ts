import { toolInstructionSupport } from "./instruction-resources";

export type InstructionTool = "codex" | "claude-code" | "github-copilot" | "cursor";

export type InstructionSurface =
  | "Codex"
  | "Claude Code"
  | "Cursor IDE"
  | "Cursor CLI"
  | "GitHub.com Copilot Chat"
  | "GitHub.com Copilot cloud agent"
  | "GitHub.com Copilot code review"
  | "VS Code Copilot Chat"
  | "VS Code Copilot cloud agent"
  | "VS Code Copilot code review"
  | "Visual Studio Copilot Chat"
  | "Visual Studio Copilot code review"
  | "JetBrains Copilot Chat"
  | "JetBrains Copilot cloud agent"
  | "JetBrains Copilot code review"
  | "Eclipse Copilot Chat"
  | "Eclipse Copilot cloud agent"
  | "Eclipse Copilot code review"
  | "Xcode Copilot Chat"
  | "Xcode Copilot cloud agent"
  | "Xcode Copilot code review"
  | "Copilot CLI";

export type AuditSeverity = "pass" | "warning" | "error";

export type AuditCategory =
  | "compatibility"
  | "operability"
  | "scope"
  | "safety"
  | "verification"
  | "maintainability";

export type InstructionAuditFinding = {
  id: string;
  category: AuditCategory;
  severity: AuditSeverity;
  title: string;
  detail: string;
  recommendation: string;
  deduction: number;
};

export type InstructionAuditInput = {
  tool: InstructionTool;
  surface: InstructionSurface;
  filePath: string;
  content: string;
};

export type InstructionAuditResult = {
  score: number;
  grade: "Strong" | "Good" | "Needs work" | "High risk";
  recommendedPath: string;
  compatiblePath: boolean;
  findings: InstructionAuditFinding[];
  categoryScores: Record<AuditCategory, number>;
  stats: {
    lines: number;
    words: number;
    bytes: number;
    headings: number;
  };
};

const CATEGORY_MAX: Record<AuditCategory, number> = {
  compatibility: 15,
  operability: 20,
  scope: 15,
  safety: 20,
  verification: 20,
  maintainability: 10,
};

const RECOMMENDED_PATHS: Record<InstructionTool, string> = {
  codex: "AGENTS.md",
  "claude-code": "CLAUDE.md",
  "github-copilot": ".github/copilot-instructions.md",
  cursor: ".cursor/rules/project-guidance.mdc",
};

const TOOL_SURFACES: Record<InstructionTool, readonly InstructionSurface[]> = {
  codex: ["Codex"],
  "claude-code": ["Claude Code"],
  cursor: ["Cursor IDE", "Cursor CLI"],
  "github-copilot": [
    "GitHub.com Copilot Chat",
    "GitHub.com Copilot cloud agent",
    "GitHub.com Copilot code review",
    "VS Code Copilot Chat",
    "VS Code Copilot cloud agent",
    "VS Code Copilot code review",
    "Visual Studio Copilot Chat",
    "Visual Studio Copilot code review",
    "JetBrains Copilot Chat",
    "JetBrains Copilot cloud agent",
    "JetBrains Copilot code review",
    "Eclipse Copilot Chat",
    "Eclipse Copilot cloud agent",
    "Eclipse Copilot code review",
    "Xcode Copilot Chat",
    "Xcode Copilot cloud agent",
    "Xcode Copilot code review",
    "Copilot CLI",
  ],
};

const normalizePath = (filePath: string) => filePath.trim().replace(/^\.\//, "").replace(/\\/g, "/");
const baseName = (filePath: string) => normalizePath(filePath).split("/").pop() ?? "";

export function getRecommendedInstructionPath(tool: InstructionTool, _surface: InstructionSurface): string {
  return RECOMMENDED_PATHS[tool];
}

export function getInstructionSurfaceOptions(tool: InstructionTool): readonly InstructionSurface[] {
  return TOOL_SURFACES[tool];
}

function getCopilotPathKind(filePath: string): ToolInstructionSupportPath | null {
  const normalized = normalizePath(filePath);
  const basename = baseName(filePath);
  if (normalized === ".github/copilot-instructions.md") return "repository";
  if (/^\.github\/instructions\/.+\.instructions\.md$/i.test(normalized)) return "path-specific";
  if (/^AGENTS\.md$/i.test(basename)) return "agents";
  if (/^CLAUDE\.md$/i.test(basename)) return "claude";
  return null;
}

type ToolInstructionSupportPath = "repository" | "path-specific" | "agents" | "claude";

const COPILOT_RESOURCE_IDS: Record<ToolInstructionSupportPath, string[]> = {
  repository: ["copilot-repository-instructions"],
  "path-specific": ["copilot-path-specific-instructions"],
  agents: ["copilot-agents-md"],
  claude: ["copilot-claude-md-documented-surfaces", "copilot-claude-md-unlisted-surfaces"],
};

type CursorInstructionPath = "rules" | "agents" | "claude" | "legacy";

const CURSOR_RESOURCE_IDS: Record<CursorInstructionPath, string[]> = {
  rules: ["cursor-project-rules"],
  agents: ["cursor-agents-md-ide", "cursor-agents-md-cli"],
  claude: ["cursor-claude-md-cli"],
  legacy: ["cursor-cursorrules-legacy"],
};

function getCursorPathKind(filePath: string): CursorInstructionPath | null {
  const normalized = normalizePath(filePath);
  const basename = baseName(filePath);
  if (/^\.cursor\/rules\/.+\.mdc$/i.test(normalized)) return "rules";
  if (normalized === ".cursorrules") return "legacy";
  if (/^AGENTS\.md$/i.test(basename)) return "agents";
  if (/^CLAUDE\.md$/i.test(basename)) return "claude";
  return null;
}

function isCompatiblePath(tool: InstructionTool, surface: InstructionSurface, filePath: string): boolean {
  const normalized = normalizePath(filePath);
  const basename = baseName(filePath);

  if (tool === "codex") {
    return surface === "Codex" && (basename === "AGENTS.md" || basename === "AGENTS.override.md");
  }

  if (tool === "claude-code") {
    return surface === "Claude Code" && (basename === "CLAUDE.md" || basename === "CLAUDE.local.md");
  }

  if (tool === "cursor") {
    const pathKind = getCursorPathKind(filePath);
    if (!pathKind || !TOOL_SURFACES.cursor.includes(surface)) return false;
    const resourceIds = new Set(CURSOR_RESOURCE_IDS[pathKind]);
    return toolInstructionSupport.some(
      (record) =>
        resourceIds.has(record.id) &&
        (record.status === "documented" || record.status === "legacy") &&
        record.surfaces.includes(surface),
    );
  }

  const pathKind = getCopilotPathKind(filePath);
  if (!pathKind || !TOOL_SURFACES[tool].includes(surface)) return false;
  const resourceIds = new Set(COPILOT_RESOURCE_IDS[pathKind]);
  return toolInstructionSupport.some(
    (record) =>
      resourceIds.has(record.id) &&
      record.status === "documented" &&
      record.surfaces.includes(surface),
  );
}

function gradeFor(score: number): InstructionAuditResult["grade"] {
  if (score >= 90) return "Strong";
  if (score >= 75) return "Good";
  if (score >= 60) return "Needs work";
  return "High risk";
}

export function auditInstructionFile(input: InstructionAuditInput): InstructionAuditResult {
  const content = input.content.trim();
  const recommendedPath = getRecommendedInstructionPath(input.tool, input.surface);
  const compatiblePath = isCompatiblePath(input.tool, input.surface, input.filePath);
  const lines = content ? content.split(/\r?\n/).length : 0;
  const stats = {
    lines,
    words: content ? content.split(/\s+/).filter(Boolean).length : 0,
    bytes: new TextEncoder().encode(content).length,
    headings: content ? (content.match(/^#{1,6}\s+\S+/gm) ?? []).length : 0,
  };
  const categoryScores = { ...CATEGORY_MAX };
  const findings: InstructionAuditFinding[] = [];

  const addFinding = (finding: InstructionAuditFinding) => {
    findings.push(finding);
    categoryScores[finding.category] = Math.max(0, categoryScores[finding.category] - finding.deduction);
  };

  if (!content) {
    addFinding({
      id: "empty-content",
      category: "operability",
      severity: "error",
      title: "No instructions to audit",
      detail: "The instruction file is empty, so an agent has no executable project guidance.",
      recommendation: `Start with a scoped ${recommendedPath} that includes setup, safety, verification, and completion rules.`,
      deduction: CATEGORY_MAX.operability,
    });

    return {
      score: 0,
      grade: "High risk",
      recommendedPath,
      compatiblePath,
      findings,
      categoryScores: Object.fromEntries(Object.keys(categoryScores).map((key) => [key, 0])) as Record<AuditCategory, number>,
      stats,
    };
  }

  if (!compatiblePath) {
    addFinding({
      id: "path-mismatch",
      category: "compatibility",
      severity: "error",
      title: "File path is not supported for this selection",
      detail: "The selected tool and surface do not document automatic discovery at this path.",
      recommendation: `Use ${recommendedPath}, or select the tool surface that supports the current file.`,
      deduction: 15,
    });
  } else if (
    input.tool === "github-copilot" &&
    normalizePath(input.filePath) !== ".github/copilot-instructions.md"
  ) {
    addFinding({
      id: "portable-copilot-baseline",
      category: "compatibility",
      severity: "warning",
      title: "Supported on this surface, but not the broadest Copilot baseline",
      detail: "This agent instruction file is supported by the selected Copilot surface, while repository-wide Copilot instructions cover more Copilot experiences.",
      recommendation: "Keep shared rules in .github/copilot-instructions.md and use this file only for agent-specific additions.",
      deduction: 0,
    });
  }

  const contentLines = content.split(/\r?\n/);
  const contentClauses = contentLines.flatMap((line) =>
    line
      .split(/(?<=[.!?;])\s+|\s+(?:but|however)\s+/i)
      .map((clause) => clause.trim())
      .filter(Boolean),
  );
  const setupCommandPattern = /\b(?:npm\s+(?:ci|install)|pnpm\s+(?:install|i)|yarn\s+(?:install|--immutable)|bun\s+install|pipx?\s+install|python(?:3)?\s+-m\s+pip\s+install|poetry\s+install|uv\s+sync|make\s+(?:setup|bootstrap|install)|docker\s+compose\s+(?:build|up)|\.\/scripts\/[\w./-]*(?:setup|bootstrap)[\w./-]*)\b/i;
  const verificationCommandPattern = /\b(?:npm\s+(?:test|run\s+(?:test|lint|build|typecheck|type-check|check))|pnpm\s+(?:test|lint|build|typecheck|type-check|check)|yarn\s+(?:test|lint|build|typecheck|type-check|check)|bun\s+(?:test|run\s+(?:test|lint|build|typecheck|type-check|check))|pytest|python(?:3)?\s+-m\s+pytest|go\s+test|cargo\s+(?:test|clippy|check)|make\s+(?:test|lint|build|check)|ruff\s+(?:check|format)|eslint|tsc\s+--noEmit)\b/i;
  const safetyGuardrailPattern = /\b(?:do\s+not|don't|never|must\s+not|avoid|forbidden|ask\s+before|requires?\s+(?:explicit\s+)?approval|without\s+(?:explicit\s+)?approval)\b/i;
  const commandNegationPattern = /\b(?:do\s+not|don't|never|must\s+not|should\s+not|cannot|can't|avoid|forbidden|not\s+allowed)\b/i;
  const safetyTargetPattern = /\b(?:secret|credential|token|password|destructive|database|generated\s+files?|lockfiles?|dependenc(?:y|ies)|permission|network|production|force[- ]?push)\b/i;
  const getNearestCommandPrefix = (clause: string, commandIndex: number) => {
    const prefix = clause.slice(0, commandIndex);
    const coordinatorPattern = /(?:,\s*|\s+)(?:and|but|however|then)\s+/gi;
    let boundary = 0;
    let coordinatorMatch: RegExpExecArray | null;
    while ((coordinatorMatch = coordinatorPattern.exec(prefix)) !== null) {
      const candidateStart = coordinatorMatch.index + coordinatorMatch[0].length;
      const candidate = prefix.slice(candidateStart);
      if (/\b(?:always|then|please|must|should|may|can|run|execute|use|install|verify|test|build)\b/i.test(candidate)) {
        boundary = candidateStart;
      }
    }
    return prefix.slice(boundary);
  };
  const hasAffirmativeCommand = (pattern: RegExp) => contentClauses.some((clause) => {
    const match = clause.match(pattern);
    if (!match || match.index === undefined) return false;
    const prefix = getNearestCommandPrefix(clause, match.index);
    const suffix = clause.slice(match.index + match[0].length);
    const prohibitedAfterCommand = /^\s+(?:is|are)\s+(?:forbidden|not\s+allowed)\b/i.test(suffix);
    return !commandNegationPattern.test(prefix) && !prohibitedAfterCommand;
  });
  const hasSetupCommand = hasAffirmativeCommand(setupCommandPattern);
  const hasVerificationCommand = hasAffirmativeCommand(verificationCommandPattern);
  const hasScopeGuidance = contentLines.some((line) =>
    /\b(?:appl(?:y|ies)\s+to|entire\s+repository|whole\s+(?:repository|repo)|repository\s+root|nested\s+(?:directory|file|instruction)|package-specific|under\s+(?:`?[^\s`]+\/?`?))\b/i.test(line),
  );
  const hasSafetyGuardrail = contentLines.some(
    (line) => safetyGuardrailPattern.test(line) && safetyTargetPattern.test(line),
  );
  const hasCompletionDeliverable = contentLines.some(
    (line) =>
      /\b(?:summari[sz]e|report|list|include)\b/i.test(line) &&
      /\b(?:changed\s+files?|changes|checks?\s+run|verification\s+results?|remaining\s+risks?|skipped\s+checks?)\b/i.test(line),
  );

  const checks: Array<{
    passes: boolean;
    id: string;
    category: AuditCategory;
    deduction: number;
    title: string;
    detail: string;
    recommendation: string;
  }> = [
    {
      passes: hasSetupCommand,
      id: "missing-setup",
      category: "operability",
      deduction: 12,
      title: "Setup guidance is missing",
      detail: "Agents need the canonical dependency or bootstrap command before changing code.",
      recommendation: "Add exact install and local-start commands that are safe to run in this repository.",
    },
    {
      passes: hasVerificationCommand,
      id: "missing-verification",
      category: "verification",
      deduction: 15,
      title: "Verification commands are missing",
      detail: "There is no deterministic definition of a safe, complete change.",
      recommendation: "List the exact test, lint, type-check, and production build commands that apply.",
    },
    {
      passes: hasScopeGuidance,
      id: "missing-scope",
      category: "scope",
      deduction: 10,
      title: "Instruction scope is unclear",
      detail: "Agents cannot tell which files inherit these rules or whether nearer files override them.",
      recommendation: "State the directory scope and how nested instruction files change the rules.",
    },
    {
      passes: hasSafetyGuardrail,
      id: "missing-safety",
      category: "safety",
      deduction: 10,
      title: "Safety boundaries are missing",
      detail: "The file does not establish guardrails for secrets, destructive actions, or approval-sensitive work.",
      recommendation: "Add explicit prohibitions and actions that require human confirmation.",
    },
    {
      passes: hasCompletionDeliverable,
      id: "missing-completion",
      category: "operability",
      deduction: 5,
      title: "Completion reporting is missing",
      detail: "The file does not define what the agent should report when work is done.",
      recommendation: "Require a concise summary of files changed, checks run, and unresolved risks.",
    },
  ];

  for (const check of checks) {
    if (!check.passes) {
      addFinding({
        id: check.id,
        category: check.category,
        severity: "warning",
        title: check.title,
        detail: check.detail,
        recommendation: check.recommendation,
        deduction: check.deduction,
      });
    }
  }

  if (!hasSetupCommand && !hasVerificationCommand) {
    addFinding({
      id: "no-executable-command",
      category: "operability",
      severity: "error",
      title: "No executable repository command found",
      detail: "Generic mentions of setup, tests, or builds do not tell an agent what it can actually run.",
      recommendation: "Add at least one repository-specific setup command and one deterministic verification command.",
      deduction: 8,
    });
  }

  if (stats.headings < 2) {
    addFinding({
      id: "weak-structure",
      category: "maintainability",
      severity: "warning",
      title: "Instructions are difficult to scan",
      detail: "Few or no Markdown headings separate setup, rules, verification, and completion guidance.",
      recommendation: "Use short headings and lists so both humans and agents can locate constraints quickly.",
      deduction: 5,
    });
  }

  if (/(?:<[A-Z][A-Z0-9_-]{2,}>|\b(?:TODO|TBD|REPLACE_ME)\b|\byour[-_](?:team|project|command|value)\b)/i.test(content)) {
    addFinding({
      id: "unresolved-placeholders",
      category: "maintainability",
      severity: "warning",
      title: "Unresolved placeholders found",
      detail: "The file contains placeholder markers that may turn instructions into ambiguous or invalid commands.",
      recommendation: "Replace every placeholder with a repository-specific value or clearly mark it as an example.",
      deduction: 8,
    });
  }

  if (/[\u202A-\u202E\u2066-\u2069]/u.test(content)) {
    addFinding({
      id: "bidirectional-control-character",
      category: "safety",
      severity: "error",
      title: "Hidden bidirectional control character",
      detail: "The file contains an invisible Unicode direction-control character that can disguise the visual order of instructions.",
      recommendation: "Remove the control character and review the affected line as plain text before committing it.",
      deduction: 20,
    });
  }

  const packageManagers = [
    ["npm", /\bnpm\s+(?:ci|install|test|run)\b/i],
    ["pnpm", /\bpnpm\s+(?:install|i|test|run|lint|build)\b/i],
    ["yarn", /\byarn\s+(?:install|test|run|lint|build)\b/i],
    ["bun", /\bbun\s+(?:install|test|run)\b/i],
  ].filter(([, pattern]) => (pattern as RegExp).test(content)).map(([name]) => name as string);
  if (packageManagers.length > 1) {
    addFinding({
      id: "multiple-package-managers",
      category: "operability",
      severity: "warning",
      title: "Multiple package managers need explicit scope",
      detail: `Commands reference ${packageManagers.join(", ")}, which can produce conflicting lockfiles or ambiguous setup steps.`,
      recommendation: "Name the directory or workspace that uses each package manager, or keep one canonical manager.",
      deduction: 5,
    });
  }

  if (input.tool === "cursor" && /\.mdc$/i.test(normalizePath(input.filePath))) {
    const frontmatter = content.match(/^---\s*\n([\s\S]*?)\n---(?:\s*\n|$)/);
    const validCursorMetadata = Boolean(
      frontmatter &&
      /^(?:description|globs):/m.test(frontmatter[1]) &&
      /^alwaysApply:\s*(?:true|false)\s*$/m.test(frontmatter[1]),
    );
    if (!validCursorMetadata) {
      addFinding({
        id: "invalid-cursor-frontmatter",
        category: "compatibility",
        severity: "error",
        title: "Cursor rule frontmatter is missing or incomplete",
        detail: "A .mdc project rule needs a fenced metadata block with rule matching fields and an explicit alwaysApply boolean.",
        recommendation: "Add opening and closing --- lines, description or globs, and alwaysApply: true or false.",
        deduction: 10,
      });
    }
  }

  const possibleSecret =
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i.test(content) ||
    /\b(?:sk-[A-Za-z0-9_-]{20,}|gh[pousr]_[A-Za-z0-9_]{20,}|AKIA[0-9A-Z]{16})\b/.test(content) ||
    /\b(?:api[_ -]?key|token|password|secret)\s*[:=]\s*["']?[A-Za-z0-9_\-/.+=]{18,}/i.test(content);
  if (possibleSecret) {
    addFinding({
      id: "possible-secret",
      category: "safety",
      severity: "error",
      title: "Possible embedded secret",
      detail: "A value matching a credential pattern was detected. The matched value is intentionally never included in audit output.",
      recommendation: "Remove the value, rotate it if it was real, and reference an environment-variable name instead.",
      deduction: 20,
    });
  }

  const destructiveCommandPattern = /\b(?:git\s+reset\s+--hard|git\s+clean\s+-[a-z]*f|git\s+push\s+--force|rm\s+-rf|drop\s+(?:table|database))\b/i;
  const hasUnconditionalDestructiveCommand = contentClauses.some((clause) => {
    const match = clause.match(destructiveCommandPattern);
    if (!match || match.index === undefined) return false;
    const prefix = getNearestCommandPrefix(clause, match.index);
    const suffix = clause.slice(match.index + match[0].length);
    const directlyProhibited = /\b(?:do\s+not|don't|never|must\s+not|should\s+not|cannot|can't|avoid)\s+(?:(?:ever|directly|automatically)\s+)?(?:run|execute|use|invoke|call)?\s*`?\s*$/i.test(prefix) ||
      /\b(?:forbidden|not\s+allowed)\s+to\s+(?:run|execute|use|invoke|call)?\s*`?\s*$/i.test(prefix);
    const approvalBefore = /\b(?:ask\s+before|requires?\s+(?:explicit\s+)?approval\s+(?:before|to))\b/i.test(prefix);
    const approvalAfter = /\brequires?\s+(?:explicit\s+)?approval\b/i.test(suffix);
    const prohibitedAfter = /^\s+(?:is|are)\s+(?:forbidden|not\s+allowed)\b/i.test(suffix);
    const prohibitedWithoutApproval = directlyProhibited && /\bwithout\s+(?:explicit\s+)?approval\b/i.test(suffix);
    return !(directlyProhibited || approvalBefore || approvalAfter || prohibitedAfter || prohibitedWithoutApproval);
  });
  if (hasUnconditionalDestructiveCommand) {
    addFinding({
      id: "destructive-command",
      category: "safety",
      severity: "error",
      title: "Unconditional destructive command",
      detail: "The file instructs agents to run a command that can irreversibly discard work or data.",
      recommendation: "Remove the command or require explicit human approval and a reversible backup procedure.",
      deduction: 20,
    });
  }

  const oversized =
    (input.tool === "claude-code" && stats.lines > 200) ||
    (input.tool === "codex" && stats.bytes > 32_768) ||
    stats.lines > 500 ||
    stats.bytes > 49_152;
  if (oversized) {
    addFinding({
      id: "oversized-content",
      category: "maintainability",
      severity: "warning",
      title: "Instruction file is unusually large",
      detail: "Large always-on instruction files consume context and make critical rules harder to find.",
      recommendation: "Keep the root file concise and move specialized guidance into scoped or linked files.",
      deduction: 8,
    });
  }

  const score = Object.values(categoryScores).reduce((total, value) => total + value, 0);
  return {
    score,
    grade: gradeFor(score),
    recommendedPath,
    compatiblePath,
    findings,
    categoryScores,
    stats,
  };
}
