import type { FeaturePlan, GenerationContext } from "../types.js";
import type { FeaturePack } from "./types.js";

export class StarterSurfaceFeaturePack implements FeaturePack {
  readonly name = "starter-surface";

  applies(): boolean {
    return true;
  }

  plan(context: GenerationContext): FeaturePlan {
    return {
      name: this.name,
      description: `Render the minimal editable starter with theme switching${context.config.rtl ? " and language switching" : ""}.`
    };
  }
}
