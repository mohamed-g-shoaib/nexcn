import { mkdir } from "node:fs/promises";
import { buildGenerationPlanWithOptions } from "./plan.js";
import { applyFrameworkOverlay } from "../overlays/index.js";
import type { ForgeConfigInput, GenerateOptions } from "../types.js";
import {
  ensureParentDirectory,
  formatCommand,
  pathExists,
  pruneFixtureArtifacts,
  resolveGeneratedProjectPaths,
  runCommand
} from "../utils/index.js";

function getStepLabel(index: number, total: number, label: string): string {
  return `[${index}/${total}] ${label}`;
}

export async function generateProject(
  cwd: string,
  input: ForgeConfigInput,
  options: GenerateOptions
): Promise<void> {
  const plan = buildGenerationPlanWithOptions(cwd, input, { outputRoot: options.outputRoot });

  if (await pathExists(plan.context.targetDirectory)) {
    throw new Error(`Target directory already exists: ${plan.context.targetDirectory}`);
  }

  const totalSteps =
    3 +
    plan.featurePacks.filter((pack) => pack.apply).length +
    plan.verification.length +
    (options.outputRoot ? 1 : 0);

  console.log(`Target directory: ${plan.context.targetDirectory}`);
  console.log(getStepLabel(1, totalSteps, `Scaffold via ${plan.scaffoldAdapter.name}`));
  console.log(`  ${formatCommand(plan.scaffoldCommand)}`);

  if (options.dryRun) {
    return;
  }

  await ensureParentDirectory(plan.context.targetDirectory);
  await mkdir(plan.context.targetDirectory, { recursive: true });

  await runCommand(plan.scaffoldCommand, cwd);

  const resolvedPaths = await resolveGeneratedProjectPaths(plan.context);

  console.log(`Resolved project directory: ${resolvedPaths.projectDirectory}`);
  console.log(getStepLabel(2, totalSteps, `Apply ${plan.context.config.frameworkLabel} overlay`));

  await applyFrameworkOverlay(plan.context, resolvedPaths.projectDirectory);

  let stepNumber = 3;

  for (const featurePack of plan.featurePacks) {
    if (!featurePack.apply) {
      continue;
    }

    console.log(getStepLabel(stepNumber, totalSteps, `Apply feature pack: ${featurePack.name}`));
    await featurePack.apply(plan.context, resolvedPaths.projectDirectory);
    stepNumber += 1;
  }

  console.log(getStepLabel(stepNumber, totalSteps, "Normalize generated formatting"));
  console.log(`  ${plan.context.config.packageManager} format`);
  await runCommand(
    {
      name: "format",
      command: plan.context.config.packageManager,
      args: ["format"]
    },
    resolvedPaths.projectDirectory
  );
  stepNumber += 1;

  for (const [index, step] of plan.verification.entries()) {
    console.log(getStepLabel(stepNumber + index, totalSteps, `Verify ${step.name}`));
    console.log(`  ${formatCommand(step)}`);
    await runCommand(step, resolvedPaths.projectDirectory);
  }

  if (options.outputRoot) {
    console.log(
      getStepLabel(stepNumber + plan.verification.length, totalSteps, "Prune retained fixture artifacts")
    );
    await pruneFixtureArtifacts(resolvedPaths.projectDirectory);
  }
}
