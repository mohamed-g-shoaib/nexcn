import { spawn } from "node:child_process";
import type { ScaffoldCommand, VerificationStep } from "../types.js";

type CommandLike = ScaffoldCommand | VerificationStep;

export async function runCommand(command: CommandLike, cwd: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child =
      process.platform === "win32"
        ? spawn("cmd.exe", ["/d", "/s", "/c", command.command, ...command.args], {
            cwd,
            stdio: "inherit"
          })
        : spawn(command.command, command.args, {
            cwd,
            stdio: "inherit"
          });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Command failed with exit code ${code}: ${command.command} ${command.args.join(" ")}`));
    });
  });
}
