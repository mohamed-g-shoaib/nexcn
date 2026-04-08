import type { FeaturePlan, GenerationContext } from "../types.js";

export interface FeaturePack {
  readonly name: string;
  applies(context: GenerationContext): boolean;
  plan(context: GenerationContext): FeaturePlan;
  apply?(context: GenerationContext, projectDirectory: string): Promise<void>;
}
