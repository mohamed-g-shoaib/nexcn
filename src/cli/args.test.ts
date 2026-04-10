import test from "node:test";
import assert from "node:assert/strict";
import { detectDefaultPackageManager, getCliDefaults, parseCliArgs } from "./args.js";

test("detectDefaultPackageManager falls back to pnpm", () => {
  assert.equal(detectDefaultPackageManager(""), undefined);
});

test("detectDefaultPackageManager reads npm user agents", () => {
  assert.equal(detectDefaultPackageManager("npm/10.8.0 node/v22.0.0"), "npm");
  assert.equal(detectDefaultPackageManager("pnpm/10.29.3 npm/? node/v24.0.0"), "pnpm");
  assert.equal(detectDefaultPackageManager("yarn/1.22.22 npm/? node/v24.0.0"), "yarn");
  assert.equal(detectDefaultPackageManager("bun/1.2.0 npm/? node/v24.0.0"), "bun");
});

test("getCliDefaults applies happy-path defaults with detected package manager", () => {
  const defaults = getCliDefaults("npm/10.8.0 node/v22.0.0");

  assert.deepEqual(defaults, {
    projectName: "my-app",
    framework: "next",
    base: "base",
    rtl: false,
    packageManager: "npm",
    codeQuality: "biome"
  });
});

test("getCliDefaults falls back to pnpm when package manager cannot be detected", () => {
  assert.equal(getCliDefaults("").packageManager, "pnpm");
});

test("parseCliArgs defaults to generate command", () => {
  const parsed = parseCliArgs([], "D:\\Developer\\nexcn", "");

  assert.equal(parsed.command, "generate");
  assert.equal(parsed.helpRequested, false);
  assert.equal(parsed.detectedPackageManager, undefined);
  assert.deepEqual(parsed.input, {});
});

test("parseCliArgs supports generate flags and ignores a standalone --", () => {
  const parsed = parseCliArgs(
    [
      "generate",
      "--",
      "--name",
      "demo-app",
      "--framework",
      "vite",
      "--base",
      "radix",
      "--rtl",
      "--package-manager",
      "bun",
      "--code-quality",
      "oxlint-oxfmt",
      "--dry-run",
      "--fixture"
    ],
    "D:\\Developer\\nexcn",
    ""
  );

  assert.equal(parsed.command, "generate");
  assert.equal(parsed.dryRun, true);
  assert.equal(parsed.outputRoot, "D:\\Developer\\nexcn\\fixtures");
  assert.deepEqual(parsed.input, {
    projectName: "demo-app",
    framework: "vite",
    base: "radix",
    rtl: true,
    packageManager: "bun",
    codeQuality: "oxlint-oxfmt"
  });
});

test("parseCliArgs supports the plan command", () => {
  const parsed = parseCliArgs(["plan", "--framework", "start"], "D:\\Developer\\nexcn", "");

  assert.equal(parsed.command, "plan");
  assert.deepEqual(parsed.input, { framework: "start" });
});

test("parseCliArgs rejects unsupported values", () => {
  assert.throws(
    () => parseCliArgs(["generate", "--framework", "astro"], "D:\\Developer\\nexcn", ""),
    /Unsupported framework/
  );
});
