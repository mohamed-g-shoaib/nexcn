import type { FeaturePlan, OverlayPlan, ScaffoldCommand, VerificationStep } from "../types.js";

export function formatCommand(command: ScaffoldCommand | VerificationStep): string {
  return [command.command, ...command.args].join(" ");
}

export function formatNamedPlanItem(item: OverlayPlan | FeaturePlan): string {
  return `- ${item.name}: ${item.description}`;
}
