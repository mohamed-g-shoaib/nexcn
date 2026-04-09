import type { ForgeConfig, VerificationStep } from "../types.js";
import { getRunScriptCommand } from "../utils/package-manager.js";

export function getVerificationSteps(config: ForgeConfig): VerificationStep[] {
  if (config.framework === "start") {
    return [
      { name: "build", ...getRunScriptCommand(config.packageManager, "build") },
      { name: "lint", ...getRunScriptCommand(config.packageManager, "lint") },
      { name: "format:check", ...getRunScriptCommand(config.packageManager, "format:check") },
      { name: "typecheck", ...getRunScriptCommand(config.packageManager, "typecheck") }
    ];
  }

  const steps: VerificationStep[] = [
    { name: "lint", ...getRunScriptCommand(config.packageManager, "lint") },
    { name: "format:check", ...getRunScriptCommand(config.packageManager, "format:check") },
    { name: "typecheck", ...getRunScriptCommand(config.packageManager, "typecheck") },
    { name: "build", ...getRunScriptCommand(config.packageManager, "build") }
  ];

  return steps;
}
