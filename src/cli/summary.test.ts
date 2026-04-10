import test from "node:test";
import assert from "node:assert/strict";
import { getGenerationSummaryLines } from "./summary.js";

test("getGenerationSummaryLines formats user-facing labels", () => {
  const lines = getGenerationSummaryLines({
    projectName: "demo-app",
    framework: "start",
    base: "radix",
    rtl: true,
    packageManager: "yarn",
    codeQuality: "eslint-prettier"
  });

  assert.deepEqual(lines, [
    "Configuration",
    "  App name: demo-app",
    "  Framework: TanStack Start",
    "  Base: Radix UI",
    "  Direction: RTL",
    "  Package manager: yarn",
    "  Code quality: ESLint + Prettier",
    ""
  ]);
});
