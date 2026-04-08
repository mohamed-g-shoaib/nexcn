import type { ForgeConfig, VerificationStep } from "../types.js";

export function getVerificationSteps(config: ForgeConfig): VerificationStep[] {
  if (config.framework === "start") {
    return [
      { name: "build", command: config.packageManager, args: ["build"] },
      { name: "lint", command: config.packageManager, args: ["lint"] },
      { name: "format:check", command: config.packageManager, args: ["format:check"] },
      { name: "typecheck", command: config.packageManager, args: ["typecheck"] }
    ];
  }

  const steps: VerificationStep[] = [
    { name: "lint", command: config.packageManager, args: ["lint"] },
    { name: "format:check", command: config.packageManager, args: ["format:check"] },
    { name: "typecheck", command: config.packageManager, args: ["typecheck"] },
    { name: "build", command: config.packageManager, args: ["build"] }
  ];

  return steps;
}
