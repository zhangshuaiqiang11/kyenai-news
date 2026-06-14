import React from "react";

import { BenchmarkPanel } from "./BenchmarkPanel";
import { InstructionCompatibilityMatrix } from "./InstructionCompatibilityMatrix";
import { InstructionScopeGuide } from "./InstructionScopeGuide";
import { RepositoryTree } from "./RepositoryTree";
import { TemplateDownloads } from "./TemplateDownloads";

export function InstructionGuideResources() {
  return (
    <div className="guide-resource-sections">
      <InstructionCompatibilityMatrix />
      <InstructionScopeGuide />
      <RepositoryTree />
      <TemplateDownloads />
      <BenchmarkPanel />
    </div>
  );
}
