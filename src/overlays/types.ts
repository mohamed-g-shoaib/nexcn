import type { GenerationContext, OverlayPlan } from "../types.js";

export interface FrameworkOverlay {
  readonly framework: GenerationContext["config"]["framework"];
  plan(context: GenerationContext): OverlayPlan[];
}
