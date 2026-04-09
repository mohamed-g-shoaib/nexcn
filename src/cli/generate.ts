import { cp, mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { buildGenerationPlanWithOptions } from "./plan.js";
import { applyFrameworkOverlay } from "../overlays/index.js";
import type { ForgeConfigInput, GenerateOptions } from "../types.js";
import {
  ensureParentDirectory,
  formatCommand,
  getInstallProjectCommand,
  getRunScriptCommand,
  isCurrentDirectoryTarget,
  isDirectoryEmpty,
  pathExists,
  pruneFixtureArtifacts,
  resetProjectInstallArtifacts,
  resolveGeneratedProjectPaths,
  runCommand
} from "../utils/index.js";

function getStepLabel(index: number, total: number, label: string): string {
  return `[${index}/${total}] ${label}`;
}

async function preparePackageManagerBoundary(
  packageManager: string,
  projectDirectory: string
): Promise<void> {
  if (packageManager !== "yarn") {
    return;
  }

  await writeFile(path.join(projectDirectory, "yarn.lock"), "", "utf8");
  await writeFile(path.join(projectDirectory, ".yarnrc.yml"), "nodeLinker: node-modules\n", "utf8");
}

export async function generateProject(
  cwd: string,
  input: ForgeConfigInput,
  options: GenerateOptions
): Promise<void> {
  const plan = buildGenerationPlanWithOptions(cwd, input, { outputRoot: options.outputRoot });
  const scaffoldWorkspace = await mkdtemp(path.join(os.tmpdir(), "forge-scaffold-"));
  const scaffoldTargetDirectory = path.join(scaffoldWorkspace, "target");
  const scaffoldContext = {
    ...plan.context,
    targetDirectory: scaffoldTargetDirectory
  };
  const scaffoldCommand = plan.scaffoldAdapter.buildCommand(scaffoldContext);

  const targetExists = await pathExists(plan.context.targetDirectory);
  const targetingCurrentDirectory = isCurrentDirectoryTarget(plan.context.config.projectName);

  if (targetExists && !targetingCurrentDirectory) {
    throw new Error(`Target directory already exists: ${plan.context.targetDirectory}`);
  }

  if (targetExists && targetingCurrentDirectory && !(await isDirectoryEmpty(plan.context.targetDirectory))) {
    throw new Error(
      `Current directory is not empty: ${plan.context.targetDirectory}. Use an empty folder or choose a project name.`
    );
  }

  const totalSteps =
    5 +
    plan.featurePacks.filter((pack) => pack.apply).length +
    plan.verification.length +
    (options.outputRoot ? 1 : 0);

  console.log(`Target directory: ${plan.context.targetDirectory}`);
  console.log(getStepLabel(1, totalSteps, `Scaffold via ${plan.scaffoldAdapter.name}`));
  console.log(`  ${formatCommand(scaffoldCommand)}`);

  if (options.dryRun) {
    await rm(scaffoldWorkspace, { recursive: true, force: true });
    return;
  }

  await ensureParentDirectory(plan.context.targetDirectory);
  await mkdir(scaffoldTargetDirectory, { recursive: true });

  try {
    await runCommand(scaffoldCommand, scaffoldWorkspace);
    const tempResolvedPaths = await resolveGeneratedProjectPaths(scaffoldContext);

    await resetProjectInstallArtifacts(tempResolvedPaths.projectDirectory);
    await cp(tempResolvedPaths.projectDirectory, plan.context.targetDirectory, { recursive: true });
  } finally {
    await rm(scaffoldWorkspace, { recursive: true, force: true });
  }

  const resolvedPaths = {
    requestedTargetDirectory: plan.context.targetDirectory,
    projectDirectory: plan.context.targetDirectory
  };

  console.log(`Resolved project directory: ${resolvedPaths.projectDirectory}`);
  console.log(getStepLabel(2, totalSteps, `Normalize ${plan.context.config.packageManager} install state`));
  const installStep = getInstallProjectCommand(plan.context.config.packageManager);
  console.log(`  ${formatCommand(installStep)}`);
  await resetProjectInstallArtifacts(resolvedPaths.projectDirectory);
  await preparePackageManagerBoundary(plan.context.config.packageManager, resolvedPaths.projectDirectory);
  await runCommand(installStep, resolvedPaths.projectDirectory);

  console.log(getStepLabel(3, totalSteps, `Apply ${plan.context.config.frameworkLabel} overlay`));

  await applyFrameworkOverlay(plan.context, resolvedPaths.projectDirectory);

  let stepNumber = 4;

  for (const featurePack of plan.featurePacks) {
    if (!featurePack.apply) {
      continue;
    }

    console.log(getStepLabel(stepNumber, totalSteps, `Apply feature pack: ${featurePack.name}`));
    await featurePack.apply(plan.context, resolvedPaths.projectDirectory);
    stepNumber += 1;
  }

  console.log(
    getStepLabel(stepNumber, totalSteps, `Reconcile ${plan.context.config.packageManager} install state`)
  );
  console.log(`  ${formatCommand(installStep)}`);
  await resetProjectInstallArtifacts(resolvedPaths.projectDirectory);
  await preparePackageManagerBoundary(plan.context.config.packageManager, resolvedPaths.projectDirectory);
  await runCommand(installStep, resolvedPaths.projectDirectory);
  stepNumber += 1;

  console.log(getStepLabel(stepNumber, totalSteps, "Normalize generated formatting"));
  const formatStep = {
    name: "format",
    ...getRunScriptCommand(plan.context.config.packageManager, "format")
  };
  console.log(`  ${formatStep.command} ${formatStep.args.join(" ")}`);
  await runCommand(formatStep, resolvedPaths.projectDirectory);
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
