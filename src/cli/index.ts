#!/usr/bin/env node

import path from "node:path";
import { firstHappyPathInput } from "../config/defaults.js";
import { generateProject } from "./generate.js";
import { buildGenerationPlanWithOptions } from "./plan.js";
import { formatCommand, formatNamedPlanItem } from "../utils/index.js";
import type { ForgeConfigInput } from "../types.js";

type CliOptions = {
  input: ForgeConfigInput;
  outputRoot?: string;
};

function parseInputOverrides(args: string[], cwd: string): CliOptions {
  const input: ForgeConfigInput = { ...firstHappyPathInput };
  let outputRoot: string | undefined;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--name") {
      const nextValue = args[index + 1];
      if (!nextValue) {
        throw new Error(`Missing value for "${arg}".`);
      }

      input.projectName = nextValue;
      index += 1;
      continue;
    }

    if (arg === "--code-quality") {
      const nextValue = args[index + 1];
      if (!nextValue) {
        throw new Error(`Missing value for "${arg}".`);
      }

      if (nextValue !== "biome" && nextValue !== "eslint-prettier" && nextValue !== "oxlint-oxfmt") {
        throw new Error(`Unsupported code quality option "${nextValue}".`);
      }

      input.codeQuality = nextValue;
      index += 1;
      continue;
    }

    if (arg === "--framework") {
      const nextValue = args[index + 1];
      if (!nextValue) {
        throw new Error(`Missing value for "${arg}".`);
      }

      if (nextValue !== "next" && nextValue !== "vite" && nextValue !== "start") {
        throw new Error(`Unsupported framework "${nextValue}".`);
      }

      input.framework = nextValue;
      index += 1;
      continue;
    }

    if (arg === "--base") {
      const nextValue = args[index + 1];
      if (!nextValue) {
        throw new Error(`Missing value for "${arg}".`);
      }

      if (nextValue !== "base" && nextValue !== "radix") {
        throw new Error(`Unsupported base "${nextValue}".`);
      }

      input.base = nextValue;
      index += 1;
      continue;
    }

    if (arg === "--rtl") {
      input.rtl = true;
      continue;
    }

    if (arg === "--ltr") {
      input.rtl = false;
      continue;
    }

    if (arg === "--fixture") {
      outputRoot = path.join(cwd, "fixtures");
      continue;
    }
  }

  return { input, outputRoot };
}

function printHelp(): void {
  console.log(`Forge

Usage:
  forge --help
  forge plan
  forge plan --framework next --base radix --rtl
  forge plan --code-quality biome
  forge generate
  forge generate --dry-run
  forge generate --name my-app
  forge generate --base radix
  forge generate --fixture
  forge generate --code-quality oxlint-oxfmt

Current behavior:
  Prints or runs the locked first-pass generation plan for Forge.`);
}

async function main(argv: string[]): Promise<void> {
  const [command, ...rest] = argv;
  const cwd = process.cwd();

  if (!command || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  if (command !== "plan") {
    if (command === "generate") {
      const dryRun = rest.includes("--dry-run");
      const parsed = parseInputOverrides(rest, cwd);
      await generateProject(cwd, parsed.input, { dryRun, outputRoot: parsed.outputRoot });
      return;
    }

    throw new Error(`Unknown command "${command}". Try "forge --help".`);
  }

  const parsed = parseInputOverrides(rest, cwd);
  const plan = buildGenerationPlanWithOptions(cwd, parsed.input, {
    outputRoot: parsed.outputRoot
  });

  console.log(`Forge plan for ${plan.config.projectName}`);
  console.log("");
  console.log(`Framework: ${plan.config.frameworkLabel}`);
  console.log(`Base: ${plan.config.base}`);
  console.log(`RTL: ${String(plan.config.rtl)}`);
  console.log(`Locales: ${plan.config.starterLocales.ltr}/${plan.config.starterLocales.rtl}`);
  console.log(`Preset: ${plan.config.presetFamily} (${plan.config.presetCode})`);
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
}

try {
  await main(process.argv.slice(2));
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown error";
  console.error(`Forge failed: ${message}`);
  process.exitCode = 1;
}
