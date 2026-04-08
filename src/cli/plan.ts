import { firstHappyPathInput } from "../config/defaults.js";
import { normalizeConfig } from "../config/normalize.js";
import {
  CodeQualityFeaturePack,
  DocsFeaturePack,
  PolishCssFeaturePack,
  RtlRuntimeFeaturePack,
  SoundsFeaturePack,
  StarterSurfaceFeaturePack
} from "../features/index.js";
import { NextFrameworkOverlay, TanStackStartFrameworkOverlay, ViteFrameworkOverlay } from "../overlays/index.js";
import { ShadcnScaffoldAdapter } from "../scaffold/index.js";
import type { FeaturePack } from "../features/index.js";
import type { FrameworkOverlay } from "../overlays/index.js";
import type { ForgeConfigInput, GenerationContext } from "../types.js";
import { resolveTargetDirectory } from "../utils/index.js";
import { getVerificationSteps } from "../verify/index.js";

const overlays: FrameworkOverlay[] = [
  new NextFrameworkOverlay(),
  new ViteFrameworkOverlay(),
  new TanStackStartFrameworkOverlay()
];

const featurePacks: FeaturePack[] = [
  new CodeQualityFeaturePack(),
  new RtlRuntimeFeaturePack(),
  new SoundsFeaturePack(),
  new StarterSurfaceFeaturePack(),
  new DocsFeaturePack(),
  new PolishCssFeaturePack()
];

export function buildGenerationPlan(cwd: string, input: ForgeConfigInput = firstHappyPathInput) {
  return buildGenerationPlanWithOptions(cwd, input);
}

export function buildGenerationPlanWithOptions(
  cwd: string,
  input: ForgeConfigInput = firstHappyPathInput,
  options?: { outputRoot?: string }
) {
  const config = normalizeConfig(input);
  const context: GenerationContext = {
    cwd,
    config,
    targetDirectory: resolveTargetDirectory(cwd, config.projectName, options?.outputRoot)
  };

  const scaffoldAdapter = new ShadcnScaffoldAdapter();
  const overlay = overlays.find((candidate) => candidate.framework === config.framework);

  if (!overlay) {
    throw new Error(`No overlay is registered for framework "${config.framework}".`);
  }

  return {
    config,
    context,
    scaffoldAdapter,
    scaffoldCommand: scaffoldAdapter.buildCommand(context),
    overlays: overlay.plan(context),
    featurePacks: featurePacks.filter((pack) => pack.applies(context)),
    features: featurePacks.filter((pack) => pack.applies(context)).map((pack) => pack.plan(context)),
    verification: getVerificationSteps(config)
  };
}
