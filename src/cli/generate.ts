import { cp, mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import * as p from "@clack/prompts";
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

function formatDuration(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function shouldUseSpinner(): boolean {
  return Boolean(process.stdout.isTTY && !process.env.NO_COLOR);
}

type ProgressStepOptions = {
  hint?: string;
  hintAfterMs?: number;
  longRunningHint?: string;
  longRunningHintAfterMs?: number;
};

async function runProgressStep<T>(
  index: number,
  total: number,
  label: string,
  task: () => Promise<T>,
  options: ProgressStepOptions = {}
): Promise<T> {
  const startTime = Date.now();
  const hintAfterMs = options.hintAfterMs ?? 15_000;
  const longRunningHintAfterMs = options.longRunningHintAfterMs ?? 90_000;

  const getMessage = (): string => {
    const elapsed = formatDuration(Date.now() - startTime);
    return `${getStepLabel(index, total, label)} ${elapsed}`;
  };

  if (!shouldUseSpinner()) {
    console.log(`${getStepLabel(index, total, label)} started`);
    const result = await task();
    console.log(`${getStepLabel(index, total, label)} done ${formatDuration(Date.now() - startTime)}`);
    return result;
  }

  const spinner = p.spinner();
  let hintShown = false;
  let longRunningHintShown = false;
  const interval = setInterval(() => {
    const elapsedMs = Date.now() - startTime;
    let message = getMessage();

    if (options.longRunningHint && elapsedMs >= longRunningHintAfterMs) {
      longRunningHintShown = true;
      message = `${message}\n${options.longRunningHint}`;
    } else if (options.hint && elapsedMs >= hintAfterMs) {
      hintShown = true;
      message = `${message}\n${options.hint}`;
    }

    spinner.message(message);
  }, 1000);

  interval.unref?.();
  spinner.start(getMessage());

  try {
    const result = await task();
    clearInterval(interval);
    spinner.stop(`${getStepLabel(index, total, label)} done ${formatDuration(Date.now() - startTime)}`);
    return result;
  } catch (error) {
    clearInterval(interval);
    const suffix = longRunningHintShown || hintShown ? "" : ` ${formatDuration(Date.now() - startTime)}`;
    spinner.stop(`${getStepLabel(index, total, label)} failed${suffix}`);
    throw error;
  }
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

  console.log("Forge");
  console.log("");
  console.log(`Target: ${plan.context.targetDirectory}`);
  console.log("");

  if (options.dryRun) {
    console.log(getStepLabel(1, totalSteps, `Scaffold via ${plan.scaffoldAdapter.name}`));
    console.log(`  ${formatCommand(scaffoldCommand)}`);
    await rm(scaffoldWorkspace, { recursive: true, force: true });
    return;
  }

  await ensureParentDirectory(plan.context.targetDirectory);
  await mkdir(scaffoldTargetDirectory, { recursive: true });

  try {
    await runProgressStep(
      1,
      totalSteps,
      `Scaffold via ${plan.scaffoldAdapter.name}`,
      async () => {
        await runCommand(scaffoldCommand, scaffoldWorkspace);
      },
      {
        hint: "Scaffolding can take a minute on a fresh run.",
        longRunningHint: "Still scaffolding. This depends on the upstream scaffold and package cache."
      }
    );
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

  const installStep = getInstallProjectCommand(plan.context.config.packageManager);
  await runProgressStep(
    2,
    totalSteps,
    "Install dependencies",
    async () => {
      await resetProjectInstallArtifacts(resolvedPaths.projectDirectory);
      await preparePackageManagerBoundary(plan.context.config.packageManager, resolvedPaths.projectDirectory);
      await runCommand(installStep, resolvedPaths.projectDirectory);
    },
    {
      hint: "Fresh installs can take a few minutes.",
      longRunningHint: "Still installing. This step depends on network speed and package cache."
    }
  );

  await runProgressStep(3, totalSteps, `Apply ${plan.context.config.frameworkLabel} overlay`, async () => {
    await applyFrameworkOverlay(plan.context, resolvedPaths.projectDirectory);
  });

  let stepNumber = 4;

  for (const featurePack of plan.featurePacks) {
    const applyFeaturePack = featurePack.apply;

    if (!applyFeaturePack) {
      continue;
    }

    await runProgressStep(stepNumber, totalSteps, `Apply ${featurePack.name}`, async () => {
      await applyFeaturePack(plan.context, resolvedPaths.projectDirectory);
    });
    stepNumber += 1;
  }

  await runProgressStep(
    stepNumber,
    totalSteps,
    "Reconcile dependencies",
    async () => {
      await resetProjectInstallArtifacts(resolvedPaths.projectDirectory);
      await preparePackageManagerBoundary(plan.context.config.packageManager, resolvedPaths.projectDirectory);
      await runCommand(installStep, resolvedPaths.projectDirectory);
    },
    {
      hint: "Resolving the final dependency state.",
      longRunningHint: "Still reconciling dependencies. Warm installs are usually faster after this run."
    }
  );
  stepNumber += 1;

  const formatStep = {
    name: "format",
    ...getRunScriptCommand(plan.context.config.packageManager, "format")
  };
  await runProgressStep(stepNumber, totalSteps, "Format files", async () => {
    await runCommand(formatStep, resolvedPaths.projectDirectory);
  });
  stepNumber += 1;

  for (const [index, step] of plan.verification.entries()) {
    const isBuildStep = step.name === "build";

    await runProgressStep(
      stepNumber + index,
      totalSteps,
      `Verify ${step.name}`,
      async () => {
        await runCommand(step, resolvedPaths.projectDirectory);
      },
      isBuildStep
        ? {
            hint: "Production builds can take a little longer.",
            longRunningHint: "Still building. TanStack Start and cold caches can take longer here."
          }
        : {}
    );
  }

  if (options.outputRoot) {
    await runProgressStep(
      stepNumber + plan.verification.length,
      totalSteps,
      "Prune retained fixture artifacts",
      async () => {
        await pruneFixtureArtifacts(resolvedPaths.projectDirectory);
      }
    );
  }

  console.log("");
  console.log(`Created ${plan.context.config.projectName} at ${resolvedPaths.projectDirectory}`);
  console.log("");
  console.log("Next steps:");
  console.log(`  cd ${resolvedPaths.projectDirectory}`);
  console.log(`  ${formatCommand(getRunScriptCommand(plan.context.config.packageManager, "dev"))}`);
}
