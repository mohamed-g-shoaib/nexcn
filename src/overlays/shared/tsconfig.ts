import { readFile, writeFile } from "node:fs/promises";
import ts from "typescript";

function parseTsconfigLikeJson(source: string): {
  compilerOptions?: Record<string, unknown>;
} {
  const parsed = ts.parseConfigFileTextToJson("tsconfig.json", source);

  if (parsed.error) {
    throw new Error(ts.flattenDiagnosticMessageText(parsed.error.messageText, "\n"));
  }

  return parsed.config as {
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
