import os from "node:os";
import { spawn } from "node:child_process";
import type { ScaffoldCommand, VerificationStep } from "../types.js";

type CommandLike = ScaffoldCommand | VerificationStep;
const MAX_FAILURE_OUTPUT_LENGTH = 6000;

function formatCommandFailureOutput(stdout: string, stderr: string): string {
  const output = [stdout.trim(), stderr.trim()].filter(Boolean).join("\n\n");

  if (!output) {
    return "";
  }

  const visibleOutput =
    output.length > MAX_FAILURE_OUTPUT_LENGTH
      ? `...${output.slice(-MAX_FAILURE_OUTPUT_LENGTH)}`
      : output;

  return `\n\nCommand output:\n${visibleOutput}`;
}

export async function runCommand(
  command: CommandLike,
  cwd: string,
  envOverrides?: NodeJS.ProcessEnv
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const usePinnedCorepackYarn =
      command.command === "corepack" &&
      command.args[0]?.startsWith("yarn@");
    const args =
      usePinnedCorepackYarn && !command.args.includes("--cwd")
        ? [command.args[0], "--cwd", cwd, ...command.args.slice(1)]
        : command.args;
    const effectiveCwd = usePinnedCorepackYarn ? os.tmpdir() : cwd;

    const child =
      process.platform === "win32" && usePinnedCorepackYarn
        ? spawn(command.command, args, {
            cwd: effectiveCwd,
            env: { ...process.env, ...envOverrides },
            shell: true,
            stdio: ["ignore", "pipe", "pipe"]
          })
        : process.platform === "win32"
        ? spawn("cmd.exe", ["/d", "/s", "/c", command.command, ...args], {
            cwd: effectiveCwd,
            env: { ...process.env, ...envOverrides },
            stdio: ["ignore", "pipe", "pipe"]
          })
        : spawn(command.command, args, {
            cwd: effectiveCwd,
            env: { ...process.env, ...envOverrides },
            stdio: ["ignore", "pipe", "pipe"]
          });

    let stdout = "";
    let stderr = "";

    child.stdout?.setEncoding("utf8");
    child.stderr?.setEncoding("utf8");
    child.stdout?.on("data", (chunk: string) => {
      stdout += chunk;
    });
    child.stderr?.on("data", (chunk: string) => {
      stderr += chunk;
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          `Command failed with exit code ${code}: ${command.command} ${args.join(" ")}${formatCommandFailureOutput(stdout, stderr)}`
        )
      );
    });
  });
}
