# Template & Publishing Design

**Date:** 2026-06-01
**Scope:** Frontend app template inside the design-system repo + publishing both packages to GitHub Packages

---

## Context

The `@bernardoestrada/design-system` package (at `/design-system`) is built and tested. This spec covers three additions:

1. Adding `lucide-react` to the design system
2. A reusable frontend app template at `templates/react-app/`
3. A CLI scaffolder package at `create-webapp/` published as `@bernardoestrada/create-webapp`

The user also owns the `@berni` npm org — switching both packages there in the future is straightforward since `publishConfig` is the only thing that changes.

---

## Part 1 — lucide-react in the design system

`lucide-react` is added as a **runtime dependency** of `@bernardoestrada/design-system` (not devDependency — consuming apps need it at runtime).

It is re-exported wholesale from `src/index.ts`:

```ts
export * from 'lucide-react';
```

`react` and `react-dom` remain peer dependencies. `lucide-react` itself lists `react` as a peer, so consumers only need one copy of React in their dependency tree.

**Result:** any project that installs the design system gets icons for free — no separate `lucide-react` install needed.

---

## Part 2 — Template at `templates/react-app/`

A standalone Vite + React 18 + TypeScript **app** (not a library) living inside the design-system repo. It is the canonical starting point for new frontend projects.

### Dependencies

```
react, react-dom, react-router-dom   — runtime
@bernardoestrada/design-system       — runtime (provides TW + DaisyUI + themes + icons)

vite, @vitejs/plugin-react, typescript   — dev
eslint, @typescript-eslint/*             — dev
```

TailwindCSS and DaisyUI are **not** direct dependencies — they come bundled in the design system's `dist/index.css`.

### File structure

```
templates/react-app/
├── .github/
│   └── workflows/
│       ├── pr.yml          # typecheck + lint on every PR
│       └── deploy.yml      # build + deploy to GitHub Pages on push to main
├── src/
│   ├── routes/
│   │   ├── index.tsx       # createBrowserRouter definition
│   │   └── Home.tsx        # placeholder home page with theme demo
│   ├── components/
│   │   └── Layout.tsx      # nav shell with theme switcher dropdown
│   ├── App.tsx             # RouterProvider root
│   ├── main.tsx            # ReactDOM.createRoot entry
│   └── index.css           # single line: @import "@bernardoestrada/design-system/styles"
├── .npmrc                  # GitHub Packages registry + token placeholder
├── .npmrc.example          # committed version (token as placeholder string)
├── package.json
├── vite.config.ts
├── tsconfig.json
└── index.html
```

### GitHub Actions

**`pr.yml`** — triggers on every PR targeting `main`:
```
yarn install (using cached node_modules)
yarn typecheck
yarn lint
```

**`deploy.yml`** — triggers on push to `main`:
```
yarn install
yarn build
actions/upload-pages-artifact (dist/)
actions/deploy-pages
```

The workflow uses `GITHUB_TOKEN` for both reading GitHub Packages (to install the design system) and deploying to Pages — no manual secrets needed.

### Vite config

```ts
base: process.env.BASE_URL ?? '/'
```

The deploy workflow sets `BASE_URL=/REPO_NAME/` so assets resolve correctly on GH Pages. Locally it stays `/`.

### `.npmrc` / `.npmrc.example`

`.npmrc.example` is committed:
```
@bernardoestrada:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_PAT_HERE
```

`.npmrc` is in `.gitignore` (contains the real token). CI uses `GITHUB_TOKEN` injected by Actions automatically.

### Layout component

`Layout.tsx` provides a minimal shell — a top navbar with:
- App name/logo slot (placeholder text, easy to replace)
- A theme switcher `<select>` that calls `applyTheme()` from the design system, defaulting to the `navigator` theme

### Home route

`Home.tsx` shows a component showcase: one each of Button (all variants), Badge, Input, and Card from the design system. Serves as a visual smoke test that the design system is wired correctly.

---

## Part 3 — Scaffolder at `create-webapp/`

A small Node.js CLI package published as `@bernardoestrada/create-webapp`. Invoked via:

```bash
yarn create @bernardoestrada/webapp my-app
# or
npx @bernardoestrada/create-webapp my-app
```

(`yarn create @scope/foo` resolves to `@scope/create-foo`.)

### File structure

```
create-webapp/
├── bin/
│   └── create-webapp.js    # #!/usr/bin/env node — CLI entry, no build step
├── package.json            # name: @bernardoestrada/create-webapp, bin field
└── README.md
```

Plain JavaScript, no TypeScript, no build step. ~60–80 lines total.

### CLI behaviour

1. Read project name from `process.argv[2]`; if omitted, prompt with `readline` (`What is your project name?`)
2. Validate: name must be a valid directory name and must not already exist
3. Clone `templates/react-app/` from the design-system repo using `degit`:
   ```
   degit BernardoEstrada/design-system/templates/react-app <project-name>
   ```
4. Rewrite `"name"` in `<project-name>/package.json` to the given project name
5. Print next steps:
   ```
   ✓ Created <project-name>/

   Next steps:
     cd <project-name>
     cp .npmrc.example .npmrc
     # Set your GitHub PAT in .npmrc
     yarn
     yarn dev
   ```

### Dependencies

```json
{
  "dependencies": {
    "degit": "^2.8.0"
  }
}
```

No other runtime dependencies. `readline` and `fs` are Node built-ins.

---

## Part 4 — Publishing to GitHub Packages

### package.json changes (both packages)

Add to both `@bernardoestrada/design-system/package.json` and `create-webapp/package.json`:
```json
"publishConfig": {
  "registry": "https://npm.pkg.github.com",
  "access": "public"
}
```

Both packages are `public` on GitHub Packages. The design system source is already on public GitHub so there are no secrets to protect. Making it public means consuming project CI workflows can install it using only `GITHUB_TOKEN` (no cross-repo PAT needed — `GITHUB_TOKEN` can only read packages from its own repo when the package is `restricted`).

### Local publish setup (one-time)

1. Create a GitHub PAT at **Settings → Developer settings → Personal access tokens → Fine-grained** (or classic) with scopes: `read:packages`, `write:packages`, `delete:packages`
2. Add to `~/.npmrc` (global, not committed):
   ```
   //npm.pkg.github.com/:_authToken=ghp_YOUR_TOKEN_HERE
   ```
3. `cd design-system && yarn publish --new-version 0.1.0`
4. `cd create-webapp && yarn publish --new-version 0.1.0`

### Automated publish via GitHub Actions

A `release.yml` workflow in the design-system repo triggers on a new GitHub Release (tag push):

```yaml
on:
  push:
    tags: ['v*']

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
      - run: yarn install
      - run: yarn build
      - run: yarn publish --non-interactive
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - run: yarn publish --non-interactive
        working-directory: create-webapp
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

No manual secrets to configure — `GITHUB_TOKEN` is always available in Actions with `packages: write` permission.

### Installing the design system in a new project

In the consuming project's `.npmrc`:
```
@bernardoestrada:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Then:
```bash
yarn add @bernardoestrada/design-system
```

The `GITHUB_TOKEN` env var can be a PAT stored in the shell profile (`~/.zshrc`: `export GITHUB_TOKEN=ghp_...`) so it works transparently in all projects.

---

## Future: switching to `@berni` on npm

The user already owns the `@berni` npm org. To migrate either package:
1. Change `name` to `@berni/design-system` (or `@berni/create-webapp`)
2. Change `publishConfig.registry` to `https://registry.npmjs.org`
3. Remove `.npmrc` auth requirements from consuming projects

The template's `.npmrc` and CI workflows are the only other files that change.
