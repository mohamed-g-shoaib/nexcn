import { readFile, writeFile } from "node:fs/promises";
import { parse } from "jsonc-parser";

function parseTsconfigLikeJson(source: string): {
  compilerOptions?: Record<string, unknown>;
} {
  return parse(source) as {
    compilerOptions?: Record<string, unknown>;
  };
}

export async function removeDeprecatedBaseUrl(tsconfigPath: string): Promise<void> {
  let currentConfig: string;

  try {
    currentConfig = await readFile(tsconfigPath, "utf8");
  } catch {
    return;
  }

  const parsedConfig = parseTsconfigLikeJson(currentConfig);

  if (!parsedConfig.compilerOptions || !("baseUrl" in parsedConfig.compilerOptions)) {
    return;
  }

  delete parsedConfig.compilerOptions.baseUrl;

  await writeFile(tsconfigPath, `${JSON.stringify(parsedConfig, null, 2)}\n`, "utf8");
}
