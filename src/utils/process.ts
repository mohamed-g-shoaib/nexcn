import os from "node:os";
import { spawn } from "node:child_process";
import type { ScaffoldCommand, VerificationStep } from "../types.js";

type CommandLike = ScaffoldCommand | VerificationStep;

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
            stdio: "inherit"
          })
        : process.platform === "win32"
        ? spawn("cmd.exe", ["/d", "/s", "/c", command.command, ...args], {
            cwd: effectiveCwd,
            env: { ...process.env, ...envOverrides },
            stdio: "inherit"
          })
        : spawn(command.command, args, {
            cwd: effectiveCwd,
            env: { ...process.env, ...envOverrides },
            stdio: "inherit"
          });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Command failed with exit code ${code}: ${command.command} ${args.join(" ")}`));
    });
  });
}
