import type { FeaturePlan, GenerationContext } from "../types.js";
import type { FeaturePack } from "./types.js";

export class RtlRuntimeFeaturePack implements FeaturePack {
  readonly name = "rtl-runtime";

  applies(context: GenerationContext): boolean {
    return context.config.rtl;
  }

  plan(context: GenerationContext): FeaturePlan {
    return {
      name: this.name,
      description: `Add runtime direction and locale switching for ${context.config.starterLocales.ltr}/${context.config.starterLocales.rtl}.`
    };
  }
}
