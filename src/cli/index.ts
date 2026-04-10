#!/usr/bin/env node

import * as p from "@clack/prompts";
import { firstHappyPathInput } from "../config/defaults.js";
import { normalizeConfig } from "../config/normalize.js";
import { validateProjectName } from "../config/project-name.js";
import { generateProject } from "./generate.js";
import { getCliDefaults, parseCliArgs } from "./args.js";
import { ASCII_BANNER, baseLabels } from "./labels.js";
import { buildGenerationPlanWithOptions } from "./plan.js";
import { getGenerationSummaryLines } from "./summary.js";
import { formatCommand, formatNamedPlanItem } from "../utils/index.js";
import type { ForgeConfigInput } from "../types.js";

function printHelp(): void {
  console.log(`Forge

Usage:
  forge --help
  forge
  forge plan
  forge plan --framework next --base radix --rtl
  forge plan --code-quality biome
  forge plan --package-manager npm
  forge generate
  forge generate --dry-run
  forge generate --name my-app --framework next --base base --ltr --package-manager pnpm
  forge generate --base radix
  forge generate --fixture
  forge generate --code-quality oxlint-oxfmt
  forge generate --package-manager bun
  forge plan --name my-app --framework next --base base --ltr
  npm create use-forge@latest
  pnpm create use-forge
  bun create use-forge
  yarn create use-forge

Notes:
  forge is the direct executable.
  create-use-forge is the published initializer package behind "npm create use-forge".
  forge plan previews the scaffold, overlays, feature packs, and verification steps without writing files.`);
}

function ensurePromptResult<T>(value: T | symbol): T {
  if (p.isCancel(value)) {
    p.cancel("Canceled.");
    process.exit(0);
  }

  return value;
}

function printBanner(): void {
  console.log(ASCII_BANNER);
  console.log("");
}

async function collectMissingInteractiveInput(
  partialInput: Partial<ForgeConfigInput>,
  detectedPackageManager?: ForgeConfigInput["packageManager"],
): Promise<{ input: ForgeConfigInput; prompted: boolean }> {
  const defaults = getCliDefaults();
  const resolvedInput: ForgeConfigInput = {
    projectName: partialInput.projectName ?? defaults.projectName,
    framework: partialInput.framework ?? defaults.framework,
    base: partialInput.base ?? defaults.base,
    rtl: partialInput.rtl ?? defaults.rtl,
    packageManager:
      partialInput.packageManager ??
      detectedPackageManager ??
      defaults.packageManager,
    codeQuality: partialInput.codeQuality ?? defaults.codeQuality,
  };

  const missingFields =
    partialInput.projectName === undefined ||
    partialInput.framework === undefined ||
    partialInput.base === undefined ||
    partialInput.rtl === undefined ||
    (partialInput.packageManager === undefined &&
      detectedPackageManager === undefined) ||
    partialInput.codeQuality === undefined;

  if (!missingFields) {
    return { input: resolvedInput, prompted: false };
  }

  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error(
      "Missing required inputs. Run Forge in an interactive terminal or provide the remaining flags.",
    );
  }

  printBanner();

  if (partialInput.projectName === undefined) {
    resolvedInput.projectName = ensurePromptResult(
      await p.text({
        message: "What should the project be called?",
        placeholder: defaults.projectName,
        defaultValue: defaults.projectName,
        validate(value) {
          if (typeof value !== "string") {
            return "Project name is required.";
          }

          const result = validateProjectName(value, {
            allowCurrentDirectory: true,
          });
          return result.valid
            ? undefined
            : (result.error ??
                'Project name must use lowercase kebab-case or "." for the current directory.');
        },
      }),
    );
  }

  if (partialInput.framework === undefined) {
    resolvedInput.framework = ensurePromptResult(
      await p.select({
        message: "Which framework do you want to use?",
        initialValue: defaults.framework,
        options: [
          { value: "next", label: "Next.js" },
          { value: "vite", label: "Vite" },
          { value: "start", label: "TanStack Start" },
        ],
      }),
    );
  }

  if (partialInput.base === undefined) {
    resolvedInput.base = ensurePromptResult(
      await p.select({
        message: "Which UI Primitives library do you want to use?",
        initialValue: defaults.base,
        options: [
          { value: "base", label: "Base UI" },
          { value: "radix", label: "Radix UI" },
        ],
      }),
    );
  }

  if (partialInput.rtl === undefined) {
    const direction = ensurePromptResult(
      await p.select({
        message: "Do you want RTL + Arabic support?",
        initialValue: defaults.rtl ? "yes" : "no",
        options: [
          { value: "no", label: "No" },
          { value: "yes", label: "Yes" },
        ],
      }),
    );
    resolvedInput.rtl = direction === "yes";
  }

  if (
    partialInput.packageManager === undefined &&
    detectedPackageManager === undefined
  ) {
    resolvedInput.packageManager = ensurePromptResult(
      await p.select({
        message: "Which package manager should Forge use?",
        initialValue: defaults.packageManager,
        options: [
          { value: "pnpm", label: "pnpm" },
          { value: "npm", label: "npm" },
          { value: "yarn", label: "yarn" },
          { value: "bun", label: "bun" },
        ],
      }),
    );
  }

  if (partialInput.codeQuality === undefined) {
    resolvedInput.codeQuality = ensurePromptResult(
      await p.select({
        message: "Which linter & formatter setup do you want to use?",
        initialValue: defaults.codeQuality,
        options: [
          { value: "biome", label: "Biome" },
          { value: "eslint-prettier", label: "ESLint + Prettier" },
          { value: "oxlint-oxfmt", label: "Oxlint + Oxfmt" },
        ],
      }),
    );
  }

  return { input: resolvedInput, prompted: true };
}

function printGenerationSummary(input: ForgeConfigInput): void {
  for (const line of getGenerationSummaryLines(input)) {
    console.log(line);
  }
}

async function confirmGeneration(input: ForgeConfigInput): Promise<boolean> {
  printGenerationSummary(input);

  return ensurePromptResult(
    await p.confirm({
      message: "Continue?",
      initialValue: true,
    }),
  );
}

async function main(argv: string[]): Promise<void> {
  const cwd = process.cwd();
  const parsed = parseCliArgs(argv, cwd);

  if (parsed.helpRequested) {
    printHelp();
    return;
  }

  if (parsed.command === "plan") {
    const input = {
      ...getCliDefaults(),
      ...firstHappyPathInput,
      ...parsed.input,
    };
    const plan = buildGenerationPlanWithOptions(cwd, input, {
      outputRoot: parsed.outputRoot,
    });

    console.log(`Forge plan for ${plan.config.projectName}`);
    console.log("");
    console.log(`Framework: ${plan.config.frameworkLabel}`);
    console.log(`Base: ${baseLabels[plan.config.base]}`);
    console.log(`Direction: ${plan.config.direction.toUpperCase()}`);
    console.log(`Package manager: ${plan.config.packageManager}`);
    console.log(
      `Locales: ${plan.config.starterLocales.ltr}/${plan.config.starterLocales.rtl}`,
    );
    console.log(
      `Preset: ${plan.config.presetFamily} (${plan.config.presetCode})`,
    );
    console.log(`Code quality: ${plan.config.codeQualityLabel}`);
    console.log("");
    console.log(`Scaffold: ${formatCommand(plan.scaffoldCommand)}`);
    console.log("");
    console.log("Overlays:");
    for (const item of plan.overlays) {
      console.log(formatNamedPlanItem(item));
    }
    console.log("");
    console.log("Feature packs:");
    for (const item of plan.features) {
      console.log(formatNamedPlanItem(item));
    }
    console.log("");
    console.log("Verification:");
    for (const step of plan.verification) {
      console.log(`- ${step.name}: ${formatCommand(step)}`);
    }
    return;
  }

  const promptResult = await collectMissingInteractiveInput(
    parsed.input,
    parsed.detectedPackageManager,
  );
  normalizeConfig(promptResult.input);

  if (promptResult.prompted) {
    const confirmed = await confirmGeneration(promptResult.input);

    if (!confirmed) {
      p.cancel("Canceled.");
      return;
    }
  }

  await generateProject(cwd, promptResult.input, {
    dryRun: parsed.dryRun,
    outputRoot: parsed.outputRoot,
  });
}

try {
  await main(process.argv.slice(2));
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown error";
  console.error(`Forge failed: ${message}`);
  process.exitCode = 1;
}
