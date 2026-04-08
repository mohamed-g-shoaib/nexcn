import type { FeaturePlan, GenerationContext } from "../types.js";
import type { FeaturePack } from "./types.js";

export class PolishCssFeaturePack implements FeaturePack {
  readonly name = "polish-css";

  applies(): boolean {
    return true;
  }

  plan(_context: GenerationContext): FeaturePlan {
    return {
      name: this.name,
      description:
        "Apply shared scrollbar and text-selection styling with minimal starter polish."
    };
  }
}
