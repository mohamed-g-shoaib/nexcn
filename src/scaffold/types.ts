import type { GenerationContext, ScaffoldCommand } from "../types.js";

export interface ScaffoldAdapter {
  readonly name: string;
  supports(context: GenerationContext): boolean;
  buildCommand(context: GenerationContext): ScaffoldCommand;
}
