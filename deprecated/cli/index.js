#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

// ASCII Art
const LOGO = `
                                     
                                     
███  ██ ██████ ██  ██ ▄█████ ███  ██ 
██ ▀▄██ ██▄▄    ████  ██     ██ ▀▄██ 
██   ██ ██▄▄▄▄ ██  ██ ▀█████ ██   ██ 
                                     
`;

// Colors
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  red: "\x1b[31m",
};

// Helper functions
const log = (message, color = "reset") => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const logStep = (step, message) => {
  log(
    `\n${colors.bright}[${step}/5]${colors.reset} ${colors.cyan}${message}${colors.reset}`
  );
};

const logSuccess = (message) => {
  log(`${colors.green}✓${colors.reset} ${message}`);
};

const logError = (message) => {
  log(`${colors.red}✗${colors.reset} ${message}`, "red");
};

const logInfo = (message) => {
  log(`${colors.blue}ℹ${colors.reset} ${message}`, "dim");
};

const execCommand = (command, cwd = process.cwd()) => {
  try {
    execSync(command, { cwd, stdio: "inherit" });
    return true;
  } catch {
    return false;
  }
};

const question = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${colors.cyan}?${colors.reset} ${query} `, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

const checkCommand = (command) => {
  try {
    execSync(`${command} --version`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
};

// Main setup function
async function setup() {
  console.clear();
  log(LOGO, "cyan");
  log("Welcome to Nexcn! 🚀", "bright");
  log("A modern Next.js 16 starter with everything you need.\n", "dim");

  // Step 1: Get project name
  logStep(1, "Project Setup");
  const projectName = await question("What is your project name? (my-app)");
  const finalProjectName = projectName.trim() || "my-app";
  const projectPath = path.join(process.cwd(), finalProjectName);

  if (fs.existsSync(projectPath)) {
    logError(`Directory "${finalProjectName}" already exists!`);
    process.exit(1);
  }

  logInfo(`Creating project at: ${projectPath}`);

  // Step 2: Check prerequisites
  logStep(2, "Checking Prerequisites");

  const hasNode = checkCommand("node");
  const hasGit = checkCommand("git");
  const hasPnpm = checkCommand("pnpm");

  if (!hasNode) {
    logError(
      "Node.js is not installed. Please install Node.js 20+ from nodejs.org"
    );
    process.exit(1);
  }
  logSuccess("Node.js detected");

  if (!hasGit) {
    logError("Git is not installed. Please install Git from git-scm.com");
    process.exit(1);
  }
  logSuccess("Git detected");

  if (!hasPnpm) {
    log("pnpm not found. Installing pnpm globally...", "yellow");
    if (!execCommand("npm install -g pnpm")) {
      logError("Failed to install pnpm");
      process.exit(1);
    }
  }
  logSuccess("pnpm detected");

  // Step 3: Clone repository
  logStep(3, "Downloading Nexcn");
  logInfo("Cloning from GitHub...");

  const cloneSuccess = execCommand(
    `git clone https://github.com/mohamed-g-shoaib/nexcn.git "${finalProjectName}"`
  );

  if (!cloneSuccess) {
    logError("Failed to clone repository");
    process.exit(1);
  }
  logSuccess("Project downloaded");

  // Remove .git directory
  const gitDir = path.join(projectPath, ".git");
  if (fs.existsSync(gitDir)) {
    fs.rmSync(gitDir, { recursive: true, force: true });
  }

  // Remove CLI folder (users don't need it)
  const cliDir = path.join(projectPath, "cli");
  if (fs.existsSync(cliDir)) {
    fs.rmSync(cliDir, { recursive: true, force: true });
  }

  // Remove publishing-related files
  const filesToRemove = ["CHANGELOG.md", ".npmignore"];

  filesToRemove.forEach((file) => {
    const filePath = path.join(projectPath, file);
    if (fs.existsSync(filePath)) {
      fs.rmSync(filePath, { force: true });
    }
  });

  logSuccess("Cleaned up unnecessary files");
  logSuccess("Initialized fresh git repository");

  // Step 4: Install dependencies
  logStep(4, "Installing Dependencies");
  logInfo("This may take a few minutes...");

  const installSuccess = execCommand("pnpm install", projectPath);

  if (!installSuccess) {
    logError("Failed to install dependencies");
    process.exit(1);
  }
  logSuccess("Dependencies installed");

  // Step 5: Initialize git
  logStep(5, "Finalizing Setup");
  execCommand("git init", projectPath);
  execCommand("git add .", projectPath);
  execCommand('git commit -m "Initial commit from Nexcn"', projectPath);
  logSuccess("Git repository initialized");

  // Success message
  console.log("\n" + "=".repeat(50));
  log("\n🎉 Success! Your project is ready!\n", "green");
  log("Next steps:", "bright");
  log(`  ${colors.cyan}cd ${finalProjectName}${colors.reset}`);
  log(`  ${colors.cyan}pnpm dev${colors.reset}\n`);

  log("Then open http://localhost:3000 in your browser.\n", "dim");

  log("📚 Documentation:", "bright");
  log("  • Getting Started: ./docs/01-getting-started.md");
  log("  • Project Structure: ./docs/02-project-structure.md");
  log("  • Full docs: ./docs/\n");

  log("🌟 Star nexcn on GitHub:", "bright");
  log("  https://github.com/mohamed-g-shoaib/nexcn\n");

  console.log("=".repeat(50) + "\n");
}

// Run setup
setup().catch((error) => {
  logError(`\nSetup failed: ${error.message}`);
  process.exit(1);
});
