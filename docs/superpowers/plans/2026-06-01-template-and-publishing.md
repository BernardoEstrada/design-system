# Template & Publishing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add lucide-react to the design system, create a reusable frontend app template with GitHub Actions, build a `create-webapp` CLI scaffolder, and wire up GitHub Packages publishing for both packages.

**Architecture:** The design system gains lucide-react as a runtime dep and re-exports it. The template at `templates/react-app/` is a standalone Vite+React app that imports the design system's pre-built CSS and JS — it brings its own TailwindCSS to generate utilities for template-specific code (the design system's pre-built CSS only scans its own source files). The `create-webapp/` CLI uses `degit` to copy the template subdirectory into a new project directory.

**Tech Stack:** React 18, React Router v7, Vite 6, TailwindCSS v4 (`@tailwindcss/vite`), DaisyUI v5, lucide-react, degit, GitHub Actions, GitHub Packages (npm.pkg.github.com)

---

## File Map

**Modified in design system root:**
- `package.json` — rename to `@bernardoestrada/design-system`, add lucide-react dep, add publishConfig
- `src/index.ts` — add `export * from 'lucide-react'`
- `.github/workflows/release.yml` — new: auto-publish both packages on tag push

**New — template:**
- `templates/react-app/package.json`
- `templates/react-app/vite.config.ts`
- `templates/react-app/tsconfig.json`
- `templates/react-app/index.html`
- `templates/react-app/.gitignore`
- `templates/react-app/.npmrc.example`
- `templates/react-app/eslint.config.js`
- `templates/react-app/src/index.css`
- `templates/react-app/src/main.tsx`
- `templates/react-app/src/App.tsx`
- `templates/react-app/src/routes/index.tsx`
- `templates/react-app/src/routes/Home.tsx`
- `templates/react-app/src/components/Layout.tsx`
- `templates/react-app/.github/workflows/pr.yml`
- `templates/react-app/.github/workflows/deploy.yml`

**New — scaffolder:**
- `create-webapp/package.json`
- `create-webapp/bin/create-webapp.js`

---

## Task 1: Rename package, add lucide-react, add publishConfig

**Files:**
- Modify: `package.json`
- Modify: `src/index.ts`

- [ ] **Step 1: Update `package.json`**

  Replace the `"name"` field and add `lucide-react` as a runtime dependency and `publishConfig`. The full updated file:

  ```json
  {
    "name": "@bernardoestrada/design-system",
    "version": "0.1.0",
    "type": "module",
    "main": "./dist/index.cjs",
    "module": "./dist/index.js",
    "types": "./dist/index.d.ts",
    "exports": {
      ".": {
        "import": "./dist/index.js",
        "require": "./dist/index.cjs",
        "types": "./dist/index.d.ts"
      },
      "./styles": "./dist/index.css"
    },
    "files": ["dist"],
    "publishConfig": {
      "registry": "https://npm.pkg.github.com",
      "access": "public"
    },
    "scripts": {
      "dev": "storybook dev -p 6006",
      "build": "tsc -b && vite build",
      "build-storybook": "storybook build",
      "lint": "eslint .",
      "typecheck": "tsc --noEmit",
      "preview": "vite preview"
    },
    "peerDependencies": {
      "react": ">=18",
      "react-dom": ">=18"
    },
    "dependencies": {
      "lucide-react": "^0.511.0"
    },
    "devDependencies": {
      "@storybook/addon-themes": "^10.4.1",
      "@storybook/react": "^10.4.1",
      "@storybook/react-vite": "^10.4.1",
      "@tailwindcss/vite": "^4.1.0",
      "@types/react": "^18.3.3",
      "@types/react-dom": "^18.3.0",
      "@vitejs/plugin-react": "^4.3.1",
      "daisyui": "^5.0.0",
      "eslint": "^9.9.0",
      "react": "^18.3.1",
      "react-dom": "^18.3.1",
      "storybook": "^10.4.1",
      "tailwindcss": "^4.1.0",
      "typescript": "^5.6.3",
      "vite": "^6.0.0",
      "vite-plugin-dts": "^4.0.0"
    }
  }
  ```

- [ ] **Step 2: Install lucide-react**

  ```bash
  cd /Users/berni/Repos/design-system
  yarn add lucide-react
  ```

  Expected: yarn.lock updated, `node_modules/lucide-react/` present.

- [ ] **Step 3: Re-export lucide-react from `src/index.ts`**

  Add one line at the end of the file:

  ```ts
  import "./index.css";

  export { Button } from "./components/Button/Button";
  export { Badge } from "./components/Badge/Badge";
  export { Input } from "./components/Input/Input";
  export { Card } from "./components/Card/Card";

  export { Themes, DEFAULT_DARK, DEFAULT_LIGHT, applyTheme } from "./themes/index";
  export * from "lucide-react";
  ```

- [ ] **Step 4: Rebuild and verify**

  ```bash
  yarn build 2>&1 | tail -10
  ```

  Expected output contains:
  ```
  dist/index.css   ~50 kB
  dist/index.js    ~X kB
  dist/index.cjs   ~X kB
  ✓ built in
  ```

  Then verify types are exported:
  ```bash
  grep -l "lucide" dist/index.d.ts || grep "lucide" dist/index.js | head -2
  ```

  Expected: lucide-react symbols appear in the output.

- [ ] **Step 5: Commit**

  ```bash
  git add package.json src/index.ts yarn.lock
  git commit -m "feat: add lucide-react, rename to @bernardoestrada/design-system, add publishConfig"
  ```

---

## Task 2: Template — project config files

**Files:** All new under `templates/react-app/`

- [ ] **Step 1: Create `templates/react-app/package.json`**

  ```json
  {
    "name": "my-app",
    "version": "0.1.0",
    "type": "module",
    "scripts": {
      "dev": "vite",
      "build": "tsc -b && vite build",
      "preview": "vite preview",
      "lint": "eslint .",
      "typecheck": "tsc --noEmit"
    },
    "dependencies": {
      "@bernardoestrada/design-system": "^0.1.0",
      "react": "^18.3.1",
      "react-dom": "^18.3.1",
      "react-router-dom": "^7.0.0"
    },
    "devDependencies": {
      "@tailwindcss/vite": "^4.1.0",
      "@types/react": "^18.3.3",
      "@types/react-dom": "^18.3.0",
      "@typescript-eslint/eslint-plugin": "^8.0.0",
      "@typescript-eslint/parser": "^8.0.0",
      "@vitejs/plugin-react": "^4.3.1",
      "eslint": "^9.9.0",
      "tailwindcss": "^4.1.0",
      "typescript": "^5.6.3",
      "vite": "^6.0.0"
    }
  }
  ```

  Note: `tailwindcss` and `@tailwindcss/vite` are in devDeps because the template runs its own TW compiler to generate utilities for template-specific code. The design system's pre-built CSS only includes utilities used in the design system's own source files.

- [ ] **Step 2: Create `templates/react-app/vite.config.ts`**

  ```ts
  import { defineConfig } from "vite";
  import react from "@vitejs/plugin-react";
  import tailwindcss from "@tailwindcss/vite";

  export default defineConfig({
    plugins: [tailwindcss(), react()],
    base: process.env.BASE_URL ?? "/",
  });
  ```

  The `base` is set via the `BASE_URL` env var in CI (e.g. `/my-repo-name/`) so asset paths resolve correctly on GitHub Pages. Defaults to `/` for local dev.

- [ ] **Step 3: Create `templates/react-app/tsconfig.json`**

  ```json
  {
    "compilerOptions": {
      "target": "ES2020",
      "useDefineForClassFields": true,
      "lib": ["ES2020", "DOM", "DOM.Iterable"],
      "module": "ESNext",
      "skipLibCheck": true,
      "moduleResolution": "bundler",
      "allowImportingTsExtensions": true,
      "isolatedModules": true,
      "moduleDetection": "force",
      "noEmit": true,
      "jsx": "react-jsx",
      "strict": true,
      "noUnusedLocals": true,
      "noUnusedParameters": true,
      "noFallthroughCasesInSwitch": true
    },
    "include": ["src"]
  }
  ```

- [ ] **Step 4: Create `templates/react-app/index.html`**

  ```html
  <!DOCTYPE html>
  <html lang="en" data-theme="navigator">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>My App</title>
    </head>
    <body>
      <div id="root"></div>
      <script type="module" src="/src/main.tsx"></script>
    </body>
  </html>
  ```

  `data-theme="navigator"` on the `<html>` tag sets the initial theme before React hydrates, preventing a flash of unstyled content.

- [ ] **Step 5: Create `templates/react-app/.gitignore`**

  ```
  node_modules/
  dist/
  .npmrc
  *.local
  ```

  `.npmrc` is gitignored because it contains the GitHub PAT. The committed `.npmrc.example` is the template.

- [ ] **Step 6: Create `templates/react-app/.npmrc.example`**

  ```
  @bernardoestrada:registry=https://npm.pkg.github.com
  //npm.pkg.github.com/:_authToken=YOUR_GITHUB_PAT_HERE
  ```

- [ ] **Step 7: Create `templates/react-app/eslint.config.js`**

  ```js
  import js from "@eslint/js";
  import tseslint from "typescript-eslint";

  export default tseslint.config(
    { ignores: ["dist"] },
    {
      extends: [js.configs.recommended, ...tseslint.configs.recommended],
      files: ["**/*.{ts,tsx}"],
      rules: {
        "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      },
    }
  );
  ```

- [ ] **Step 8: Commit**

  ```bash
  git add templates/
  git commit -m "feat: add react-app template config files"
  ```

---

## Task 3: Template — app source

**Files:** All new under `templates/react-app/src/`

- [ ] **Step 1: Create `templates/react-app/src/index.css`**

  ```css
  @import "@bernardoestrada/design-system/styles";
  @import "tailwindcss/utilities";
  ```

  Line 1 imports the design system's pre-built CSS: TailwindCSS base/reset, DaisyUI component classes, all 10 themes, and component overrides.
  Line 2 adds TailwindCSS utilities scanned from this app's own source files (so utilities like `flex`, `gap-4`, `container` used in template code are included).

- [ ] **Step 2: Create `templates/react-app/src/main.tsx`**

  ```tsx
  import { StrictMode } from "react";
  import { createRoot } from "react-dom/client";
  import "./index.css";
  import { App } from "./App";

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  ```

- [ ] **Step 3: Create `templates/react-app/src/App.tsx`**

  ```tsx
  import { RouterProvider } from "react-router-dom";
  import { router } from "./routes";

  export function App() {
    return <RouterProvider router={router} />;
  }
  ```

- [ ] **Step 4: Create `templates/react-app/src/routes/index.tsx`**

  ```tsx
  import { createBrowserRouter } from "react-router-dom";
  import { Layout } from "../components/Layout";
  import { Home } from "./Home";

  export const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [{ index: true, element: <Home /> }],
    },
  ]);
  ```

- [ ] **Step 5: Create `templates/react-app/src/routes/Home.tsx`**

  ```tsx
  import { Button, Badge, Input, Card } from "@bernardoestrada/design-system";

  export function Home() {
    return (
      <div className="flex flex-col gap-10 max-w-2xl">
        <section>
          <h2 className="text-2xl font-bold mb-4">Buttons</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="accent">Accent</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="outline">Outline</Button>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Badges</h2>
          <div className="flex flex-wrap gap-2">
            <Badge variant="primary">primary</Badge>
            <Badge variant="secondary">secondary</Badge>
            <Badge variant="success">success</Badge>
            <Badge variant="error">error</Badge>
            <Badge variant="warning">warning</Badge>
            <Badge variant="info">info</Badge>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Input</h2>
          <Input label="Email" placeholder="you@example.com" type="email" />
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Card</h2>
          <Card
            title="Example Card"
            actions={<Button size="sm">Action</Button>}
          >
            A sample card from the design system. Delete this page and start
            building once the design system is wired up correctly.
          </Card>
        </section>
      </div>
    );
  }
  ```

- [ ] **Step 6: Create `templates/react-app/src/components/Layout.tsx`**

  ```tsx
  import { useState } from "react";
  import { Outlet } from "react-router-dom";
  import { Themes, applyTheme } from "@bernardoestrada/design-system";

  const THEME_OPTIONS = [
    Themes.NAVIGATOR,
    Themes.NAVIGATOR_LIGHT,
    Themes.COMMAND,
    Themes.COMMAND_LIGHT,
    Themes.VSDARK,
    Themes.MONOKAI,
    Themes.NORD,
    Themes.GITHUBLIGHT,
    Themes.TERMINAL,
    Themes.CRT1990,
    Themes.WIN95,
    Themes.MACCLASSIC,
  ];

  export function Layout() {
    const [theme, setTheme] = useState<string>(Themes.NAVIGATOR);

    function handleThemeChange(e: React.ChangeEvent<HTMLSelectElement>) {
      const t = e.target.value;
      setTheme(t);
      applyTheme(t);
    }

    return (
      <div className="min-h-screen">
        <div className="navbar bg-base-100 border-b border-base-300">
          <div className="flex-1">
            <a className="btn btn-ghost text-xl font-bold">My App</a>
          </div>
          <div className="flex-none">
            <select
              className="select select-sm"
              value={theme}
              onChange={handleThemeChange}
              aria-label="Theme"
            >
              {THEME_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
        <main className="container mx-auto p-6">
          <Outlet />
        </main>
      </div>
    );
  }
  ```

- [ ] **Step 7: Commit**

  ```bash
  git add templates/
  git commit -m "feat: add react-app template source files"
  ```

---

## Task 4: Template — GitHub Actions workflows

**Files:** New under `templates/react-app/.github/workflows/`

- [ ] **Step 1: Create `templates/react-app/.github/workflows/pr.yml`**

  ```yaml
  name: PR Checks

  on:
    pull_request:
      branches: [main]

  jobs:
    check:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4

        - uses: actions/setup-node@v4
          with:
            node-version: 20
            cache: yarn
            registry-url: https://npm.pkg.github.com
            scope: "@bernardoestrada"

        - name: Install dependencies
          run: yarn install --frozen-lockfile
          env:
            NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

        - name: Type check
          run: yarn typecheck

        - name: Lint
          run: yarn lint
  ```

  `GITHUB_TOKEN` is used to authenticate with GitHub Packages. For repos under the same GitHub account (`BernardoEstrada`), `GITHUB_TOKEN` can install packages published by that account. If this fails in a newly created repo, store a PAT with `read:packages` scope as a `GH_PACKAGES_TOKEN` repo secret and change `${{ secrets.GITHUB_TOKEN }}` to `${{ secrets.GH_PACKAGES_TOKEN }}`.

- [ ] **Step 2: Create `templates/react-app/.github/workflows/deploy.yml`**

  ```yaml
  name: Deploy to GitHub Pages

  on:
    push:
      branches: [main]

  permissions:
    contents: read
    pages: write
    id-token: write

  concurrency:
    group: pages
    cancel-in-progress: true

  jobs:
    build:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4

        - uses: actions/setup-node@v4
          with:
            node-version: 20
            cache: yarn
            registry-url: https://npm.pkg.github.com
            scope: "@bernardoestrada"

        - name: Install dependencies
          run: yarn install --frozen-lockfile
          env:
            NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

        - name: Build
          run: yarn build
          env:
            BASE_URL: /${{ github.event.repository.name }}/

        - uses: actions/upload-pages-artifact@v3
          with:
            path: dist

    deploy:
      needs: build
      runs-on: ubuntu-latest
      environment:
        name: github-pages
        url: ${{ steps.deployment.outputs.page_url }}
      steps:
        - id: deployment
          uses: actions/deploy-pages@v4
  ```

  `BASE_URL` is set to `/<repo-name>/` automatically from `github.event.repository.name` — no manual configuration needed when copying the template to a new repo.

- [ ] **Step 3: Commit**

  ```bash
  git add templates/
  git commit -m "feat: add GitHub Actions PR checks and Pages deploy to template"
  ```

---

## Task 5: create-webapp CLI scaffolder

**Files:** New under `create-webapp/`

- [ ] **Step 1: Create `create-webapp/package.json`**

  ```json
  {
    "name": "@bernardoestrada/create-webapp",
    "version": "0.1.0",
    "description": "Scaffold a new frontend app from the @bernardoestrada/design-system template",
    "license": "MIT",
    "bin": {
      "create-webapp": "./bin/create-webapp.js"
    },
    "publishConfig": {
      "registry": "https://npm.pkg.github.com",
      "access": "public"
    },
    "dependencies": {
      "degit": "^2.8.4"
    },
    "engines": {
      "node": ">=18"
    }
  }
  ```

  No `"type": "module"` — this stays CommonJS so we can use `require()` without worrying about `import.meta.url` for `__dirname`.

- [ ] **Step 2: Create `create-webapp/bin/create-webapp.js`**

  ```js
  #!/usr/bin/env node

  const { execSync } = require("child_process");
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
        'Error: Invalid project name. Use letters, numbers, hyphens, and underscores only.'
      );
      process.exit(1);
    }

    if (existsSync(projectName)) {
      console.error(`Error: Directory "${projectName}" already exists.`);
      process.exit(1);
    }

    console.log(`\nScaffolding ${projectName}...\n`);

    try {
      execSync(
        `npx degit BernardoEstrada/design-system/templates/react-app "${projectName}" --force`,
        { stdio: "inherit" }
      );
    } catch {
      console.error("\nFailed to clone template. Check your internet connection.");
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
  ```

- [ ] **Step 3: Make the script executable**

  ```bash
  chmod +x create-webapp/bin/create-webapp.js
  ```

- [ ] **Step 4: Install degit in create-webapp**

  ```bash
  cd /Users/berni/Repos/design-system/create-webapp
  npm install
  ```

  This creates `create-webapp/node_modules/` and `create-webapp/package-lock.json`. Add `node_modules/` to the root `.gitignore` (already there), but add a `create-webapp/.gitignore`:

  ```
  node_modules/
  ```

- [ ] **Step 5: Smoke-test the CLI locally**

  ```bash
  cd /tmp
  node /Users/berni/Repos/design-system/create-webapp/bin/create-webapp.js test-scaffold
  ls test-scaffold/
  cat test-scaffold/package.json | grep '"name"'
  rm -rf test-scaffold
  ```

  Expected:
  ```
  .github  .gitignore  .npmrc.example  eslint.config.js  index.html  package.json  src  tsconfig.json  vite.config.ts
  "name": "test-scaffold",
  ```

- [ ] **Step 6: Commit**

  ```bash
  cd /Users/berni/Repos/design-system
  git add create-webapp/
  git commit -m "feat: add create-webapp CLI scaffolder"
  ```

---

## Task 6: Release workflow for automated publishing

**Files:** New `/.github/workflows/release.yml`

- [ ] **Step 1: Create `.github/workflows/release.yml`**

  ```yaml
  name: Publish to GitHub Packages

  on:
    push:
      tags:
        - "v*"

  jobs:
    publish:
      runs-on: ubuntu-latest
      permissions:
        contents: read
        packages: write

      steps:
        - uses: actions/checkout@v4

        - uses: actions/setup-node@v4
          with:
            node-version: 20
            registry-url: https://npm.pkg.github.com

        - name: Install dependencies
          run: yarn install --frozen-lockfile

        - name: Build design system
          run: yarn build

        - name: Publish @bernardoestrada/design-system
          run: yarn publish --non-interactive --new-version ${GITHUB_REF_NAME#v}
          env:
            NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

        - name: Publish @bernardoestrada/create-webapp
          run: npm publish
          working-directory: create-webapp
          env:
            NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  ```

  `${GITHUB_REF_NAME#v}` strips the `v` prefix from the tag (e.g. `v0.2.0` → `0.2.0`) for the yarn publish version arg. The `create-webapp` package uses `npm publish` (not yarn) because it has a `package-lock.json` from the `npm install` in Task 5.

- [ ] **Step 2: Commit**

  ```bash
  git add .github/workflows/release.yml
  git commit -m "ci: add release workflow to publish packages to GitHub Packages"
  ```

---

## Publishing setup (one-time, manual steps — not automated)

These steps are done once on the developer's machine and are not part of the automated workflow.

- [ ] **Step 1: Create a GitHub PAT for publishing**

  Go to: github.com → Settings → Developer settings → Personal access tokens → Fine-grained tokens (or Tokens classic)

  Required scopes: `write:packages`, `read:packages`, `delete:packages`

  Copy the token.

- [ ] **Step 2: Add token to global `~/.npmrc`**

  ```bash
  echo "//npm.pkg.github.com/:_authToken=ghp_YOUR_TOKEN_HERE" >> ~/.npmrc
  ```

  This file is never committed (it's in your home directory).

- [ ] **Step 3: First publish of both packages**

  ```bash
  # Design system
  cd /Users/berni/Repos/design-system
  yarn publish --new-version 0.1.0

  # Scaffolder
  cd create-webapp
  npm publish
  ```

- [ ] **Step 4: After first publish — verify on GitHub**

  Go to: github.com/BernardoEstrada → Packages

  Both `@bernardoestrada/design-system` and `@bernardoestrada/create-webapp` should appear.

- [ ] **Step 5: Test the scaffolder end-to-end**

  ```bash
  # Add token to shell profile so yarn can find it
  echo 'export GITHUB_TOKEN=ghp_YOUR_TOKEN_HERE' >> ~/.zshrc
  source ~/.zshrc

  # Scaffold a test project
  cd /tmp
  yarn create @bernardoestrada/webapp my-test-app
  cd my-test-app
  cp .npmrc.example .npmrc
  # .npmrc already works if GITHUB_TOKEN is set in the shell
  yarn
  yarn dev
  ```

  Expected: browser opens at `localhost:5173` showing the component showcase with a working theme switcher.

---

## Self-review against spec

- Part 1 (lucide-react): ✅ Task 1 adds it as runtime dep + re-exports it
- Part 2 (template): ✅ Tasks 2–4 cover all files, Actions workflows, BASE_URL, .npmrc.example
- Part 3 (create-webapp): ✅ Task 5 — prompts for name, degit clone, package.json rename, next steps printed
- Part 4 (publishConfig): ✅ Task 1 (design system) and Task 5 (create-webapp) both add publishConfig; Task 6 adds release.yml; manual publish steps documented
- Layout theme switcher: ✅ Task 3 Step 6 — select with all 12 theme options, calls applyTheme
- Home demo page: ✅ Task 3 Step 5 — Button, Badge, Input, Card all rendered
- `BASE_URL` for GH Pages: ✅ Task 4 Step 2 deploy.yml sets `BASE_URL=/<repo>/` automatically from `github.event.repository.name`
- GH Actions `GITHUB_TOKEN` cross-repo note: ✅ Task 4 Step 1 documents the fallback (GH_PACKAGES_TOKEN secret)
