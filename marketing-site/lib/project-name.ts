const WINDOWS_RESERVED_NAMES = new Set([
  "con",
  "prn",
  "aux",
  "nul",
  "com1",
  "com2",
  "com3",
  "com4",
  "com5",
  "com6",
  "com7",
  "com8",
  "com9",
  "lpt1",
  "lpt2",
  "lpt3",
  "lpt4",
  "lpt5",
  "lpt6",
  "lpt7",
  "lpt8",
  "lpt9",
]);

const PROJECT_NAME_PATTERN = /^(?!.*--)[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_PROJECT_NAME_LENGTH = 64;

export type ProjectNameValidationResult = {
  valid: boolean;
  normalized: string;
  error?: string;
};

export function validateProjectName(value: string): ProjectNameValidationResult {
  const normalized = value.trim();

  if (normalized.length === 0) {
    return {
      valid: false,
      normalized,
      error: "Project name is required.",
    };
  }

  if (normalized.length > MAX_PROJECT_NAME_LENGTH) {
    return {
      valid: false,
      normalized,
      error: `Use ${MAX_PROJECT_NAME_LENGTH} characters or fewer.`,
    };
  }

  if (normalized.startsWith(".")) {
    return {
      valid: false,
      normalized,
      error: "Cannot start with a period.",
    };
  }

  if (normalized.endsWith(".") || normalized.endsWith(" ")) {
    return {
      valid: false,
      normalized,
      error: "Cannot end with a period or space.",
    };
  }

  if (WINDOWS_RESERVED_NAMES.has(normalized.toLowerCase())) {
    return {
      valid: false,
      normalized,
      error: "Reserved by Windows.",
    };
  }

  if (!PROJECT_NAME_PATTERN.test(normalized)) {
    return {
      valid: false,
      normalized,
      error: "Use lowercase letters, numbers, and single hyphens only.",
    };
  }

  return { valid: true, normalized };
}
