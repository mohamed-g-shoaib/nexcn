import { normalizeConfig } from "../config/normalize.js";
import type { ForgeConfigInput } from "../types.js";
import { baseLabels } from "./labels.js";

export function getGenerationSummaryLines(input: ForgeConfigInput): string[] {
  const config = normalizeConfig(input);

  return [
    "Configuration",
    `  App name: ${config.projectName}`,
    `  Framework: ${config.frameworkLabel}`,
    `  Base: ${baseLabels[config.base]}`,
    `  Direction: ${config.direction.toUpperCase()}`,
    `  Package manager: ${config.packageManager}`,
    `  Code quality: ${config.codeQualityLabel}`,
    ""
  ];
}
