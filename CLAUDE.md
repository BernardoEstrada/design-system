# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

- **React 18 + TypeScript + Vite** — component library and storybook host
- **TailwindCSS v4 + DaisyUI v5** — CSS-first config (`@plugin "daisyui"` in CSS, no JS config file needed)
- **Storybook** — component browser and theme switcher

## Commands

```bash
# Install
yarn

# Dev (Storybook)
yarn dev

# Build library for distribution
yarn build

# Build Storybook static site
yarn build-storybook

# Lint
yarn lint

# Type-check
yarn typecheck
```

## Architecture

### Theme system

Themes live in `src/themes/` — **one file per theme**. Each file is a self-contained CSS block using DaisyUI v5's CSS-variable format:

```css
[data-theme="mytheme"] {
  color-scheme: dark;
  --color-base-100: oklch(...);
  --color-primary: oklch(...);
  /* ... */
}
```

Extended themes (navigator, command) also define component-level CSS variables consumed by `src/styles/overrides.css`:

```css
/* e.g. */
--glass-bg: oklch(16% 0.028 275 / 52%);
--btn-primary-bg: linear-gradient(...);
--field-bg: oklch(...);
```

`src/index.css` is the single CSS entry point — it imports Tailwind, DaisyUI, all theme files, and overrides:

```css
@import "tailwindcss";
@plugin "daisyui" { themes: all; }   /* custom themes below plus every DaisyUI built-in */

@import "./themes/navigator.css";
@import "./themes/command.css";
@import "./themes/vsdark.css";
/* ... */
@import "./styles/overrides.css";
```

To add a new theme: create `src/themes/mytheme.css`, add the `@import` to `src/index.css`, and add the name to `src/themes/index.ts` (the `Themes` enum).

### Theme categories

| Group | Files | Format |
|---|---|---|
| **App themes** (navigator, command) | `navigator.css`, `command.css` | Full CSS vars including component-level vars (`--glass-*`, `--btn-*`, `--field-*`, `--badge-*`, `--modal-*`) |
| **Editor themes** (vsdark, monokai, etc.) | one file each | Color tokens only — only `--color-*` and `--radius-*` vars |
| **DaisyUI built-ins** | imported via `@plugin "daisyui"` | Enabled selectively via the plugin config |

### Component structure

```
src/
├── themes/           # One CSS file per theme
├── components/       # React components, one folder each (Button/, Input/, …)
│   └── Button/
│       ├── Button.tsx
│       └── Button.stories.tsx
├── styles/
│   └── overrides.css # Component-level overrides driven by CSS vars set per theme
└── index.css         # CSS entry — imports TW, daisyui, themes, overrides
```

### Storybook setup

Each story should include a theme switcher via the `data-theme` attribute on a wrapper element so all themes can be previewed without a page reload. The global Storybook decorator sets `document.documentElement.setAttribute('data-theme', ...)` based on the toolbar selection.

### Consuming the design system in another project

```bash
yarn add @bernardoestrada/design-system   # needs .npmrc pointing @bernardoestrada at npm.pkg.github.com
```

Then in the consuming app's CSS:
```css
@import "@bernardoestrada/design-system/styles";
```

And in React:
```tsx
import { Button } from "@bernardoestrada/design-system";
```

### Icons

Icons are not exported from the package root; they live under `/icons`:

```tsx
// Lucide (default) + @lucide/lab, as React components
import { Pizza, AppleCore } from "@bernardoestrada/design-system/icons";
// react-icons — same pack names as react-icons (fa, fa6, md, si, tb, …)
import { FaBeer } from "@bernardoestrada/design-system/icons/fa";
// Lucide + Lab by kebab-case name, loaded on demand (same API as lucide-react/dynamic)
import { DynamicIcon } from "@bernardoestrada/design-system/icons/dynamic";
// Searchable picker for Lucide + Lab; its value is a name for DynamicIcon
import { IconPicker } from "@bernardoestrada/design-system/icon-picker";
// react-icons helpers (IconContext, IconBase)
import { IconContext } from "@bernardoestrada/design-system/icons/react-icons";
```

`src/icons/` is **generated** by `scripts/gen-icons.mjs` (`yarn icons`; also runs on `yarn build`). Don't edit it by hand. The script wraps each `@lucide/lab` icon with `createLucideIcon`, skips lab icons that `lucide-react` already ships, writes one re-export file per react-icons pack, and extracts Lucide search tags from `lucide-static` (dev-only; keep its version in step with `lucide-react`). `lucide-react`, `@lucide/lab` and `react-icons` are kept external in the Vite build so consumers tree-shake them per icon.

## Source themes reference

- **navigator / command** — ported from `../wendid/frontend/src/styles/themes/`. Full DaisyUI v5 CSS-variable format with component-level custom properties.
- **vsdark, monokai, nord, githublight, terminal, crt1990, win95, macclassic** — ported from `../BernardoEstrada.github.io/daisyui-themes.js`. Originally DaisyUI v3 color token objects; converted to v5 CSS-variable format here.
- **DaisyUI built-ins** — `light`, `dark`, `cupcake`, etc. — available via the `@plugin "daisyui"` import.
