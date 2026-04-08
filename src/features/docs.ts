import type { FeaturePlan, GenerationContext } from "../types.js";
import type { FeaturePack } from "./types.js";

export class DocsFeaturePack implements FeaturePack {
  readonly name = "docs";

  applies(): boolean {
    return true;
  }

  plan(context: GenerationContext): FeaturePlan {
    return {
      name: this.name,
      description: `Generate a minimal user-facing README for the ${context.config.frameworkLabel} starter.`
    };
  }
}
