import path from "node:path";

export function resolveTargetDirectory(
  cwd: string,
  projectName: string,
  outputRoot?: string
): string {
  return path.resolve(outputRoot ?? cwd, projectName);
}

export function isCurrentDirectoryTarget(projectName: string): boolean {
  return projectName === ".";
}

export function getScaffoldProjectName(
  projectName: string,
  cwd: string,
  targetDirectory: string
): string {
  if (!isCurrentDirectoryTarget(projectName)) {
    return projectName;
  }

  return path.basename(cwd || targetDirectory);
}
