#!/usr/bin/env node

const degit = require("degit");
const { createInterface } = require("readline");
const { existsSync, readFileSync, writeFileSync } = require("fs");
const path = require("path");

async function prompt(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    })
  );
}

async function main() {
  let projectName = process.argv[2];

  if (!projectName) {
    projectName = await prompt("Project name: ");
  }

  if (!projectName || !/^[a-zA-Z0-9_-]+$/.test(projectName)) {
    console.error(
      "Error: Invalid project name. Use letters, numbers, hyphens, and underscores only."
    );
    process.exit(1);
  }

  if (existsSync(projectName)) {
    console.error(`Error: Directory "${projectName}" already exists.`);
    process.exit(1);
  }

  console.log(`\nScaffolding ${projectName}...\n`);

  try {
    const emitter = degit("BernardoEstrada/design-system/templates/react-app", {
      cache: false,
      force: true,
      verbose: false,
    });
    await emitter.clone(projectName);
  } catch (err) {
    console.error("\nFailed to clone template:", err.message);
    console.error("Check your internet connection and try again.");
    process.exit(1);
  }

  // Update package name in the cloned project
  const pkgPath = path.join(projectName, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  pkg.name = projectName;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

  console.log(`
✓ Created ${projectName}/

Next steps:
  cd ${projectName}
  cp .npmrc.example .npmrc
  # Edit .npmrc — replace YOUR_GITHUB_PAT_HERE with a token from:
  # github.com → Settings → Developer settings → Personal access tokens
  # Required scopes: read:packages
  yarn
  yarn dev
`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
