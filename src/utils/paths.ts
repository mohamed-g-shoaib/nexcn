import path from "node:path";

export function resolveTargetDirectory(
  cwd: string,
  projectName: string,
  outputRoot?: string
): string {
  return path.join(outputRoot ?? cwd, projectName);
}
