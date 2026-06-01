# Neo Brutalism Themes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four "friendly neo-brutalism" themes (`neobrutalism`, `neobrutalism-dark`, `neobrutalism-yellow`, `neobrutalism-yellow-dark`) to the design system, using pill-shaped components, 3px hard borders, and 4px hard offset shadows.

**Architecture:** Each theme lives in one new file `src/themes/neobrutalism.css` (four `[data-theme]` blocks). Color tokens follow DaisyUI v5 `--color-*` format; two new custom vars (`--brutal-shadow-color`, `--brutal-shadow`) drive the brutalism effect. A single `html[data-theme^="neobrutalism"]` block in `src/styles/overrides.css` applies the shadow and resets the global button/field/badge overrides that would otherwise clobber our borders.

**Tech Stack:** CSS custom properties (DaisyUI v5 format), TailwindCSS v4, DaisyUI v5, TypeScript (enum only)

---

## File Map

| File | Action | What it does |
|---|---|---|
| `src/themes/neobrutalism.css` | **Create** | All 4 theme blocks — color tokens + brutal vars + radius/border |
| `src/index.css` | **Edit** | Add `@import "./themes/neobrutalism.css"` after editor themes |
| `src/themes/index.ts` | **Edit** | Add 4 enum values |
| `src/styles/overrides.css` | **Edit** | Add `html[data-theme^="neobrutalism"]` block at end of file |

---

## ⚠️ Override Interaction Warning

`src/styles/overrides.css` already has global rules that apply to **all** `[data-theme]` values. These will clobber neo-brutalism's borders and shadows unless explicitly reset:

- `html[data-theme] .btn { box-shadow: none; }` — resets shadow on every button
- `html[data-theme] .btn-primary { border: 0 !important; }` — kills the 3px border
- `html[data-theme] .btn-outline`, `.btn-ghost` — use `--btn-outline-*`/`--btn-ghost-*` vars not defined in neo-brutalism themes
- `html[data-theme] .input, .select` — use `--field-bg`/`--field-border` vars not defined here
- `html[data-theme] .badge-*` — set `border-color: transparent !important`
- `html[data-theme] .modal-box` — use `--modal-bg`/`--modal-blur`/`--modal-shadow` vars not defined here

The neo-brutalism override block must use `html[data-theme^="neobrutalism"]` selectors (matching the global block's specificity) and `!important` where needed to win.

---

## Task 1: Create the theme CSS file

**Files:**
- Create: `src/themes/neobrutalism.css`

- [ ] **Step 1: Create the file with all four theme blocks**

```css
/* ─── Neo Brutalism Light ──────────────────────────────────────────────────── */

[data-theme="neobrutalism"] {
  color-scheme: light;
  --color-base-100: #fff8f0;
  --color-base-200: #fde8d0;
  --color-base-300: #f9d4b0;
  --color-base-content: #111111;
  --color-primary: #facc15;
  --color-primary-content: #111111;
  --color-secondary: #f472b6;
  --color-secondary-content: #111111;
  --color-accent: #60a5fa;
  --color-accent-content: #111111;
  --color-neutral: #1a1a1a;
  --color-neutral-content: #fff8f0;
  --color-info: oklch(60% 0.16 222);
  --color-info-content: #111111;
  --color-success: oklch(64% 0.18 152);
  --color-success-content: #111111;
  --color-warning: oklch(72% 0.18 82);
  --color-warning-content: #111111;
  --color-error: oklch(64% 0.24 24);
  --color-error-content: #fff8f0;
  --radius-selector: 2rem;
  --radius-field: 2rem;
  --radius-box: 1rem;
  --border: 3px;
  --depth: 0;
  --noise: 0;
  --brutal-shadow-color: #111111;
  --brutal-shadow: 4px 4px 0 var(--brutal-shadow-color);
}

/* ─── Neo Brutalism Dark ───────────────────────────────────────────────────── */

[data-theme="neobrutalism-dark"] {
  color-scheme: dark;
  --color-base-100: #111111;
  --color-base-200: #1a1a1a;
  --color-base-300: #222222;
  --color-base-content: #f5f0e8;
  --color-primary: #facc15;
  --color-primary-content: #111111;
  --color-secondary: #f472b6;
  --color-secondary-content: #111111;
  --color-accent: #34d399;
  --color-accent-content: #111111;
  --color-neutral: #2a2a2a;
  --color-neutral-content: #f5f0e8;
  --color-info: oklch(60% 0.16 222);
  --color-info-content: #111111;
  --color-success: oklch(64% 0.18 152);
  --color-success-content: #111111;
  --color-warning: oklch(72% 0.18 82);
  --color-warning-content: #111111;
  --color-error: oklch(64% 0.24 24);
  --color-error-content: #f5f0e8;
  --radius-selector: 2rem;
  --radius-field: 2rem;
  --radius-box: 1rem;
  --border: 3px;
  --depth: 0;
  --noise: 0;
  --brutal-shadow-color: #facc15;
  --brutal-shadow: 4px 4px 0 var(--brutal-shadow-color);
}

/* ─── Neo Brutalism Yellow ─────────────────────────────────────────────────── */

[data-theme="neobrutalism-yellow"] {
  color-scheme: light;
  --color-base-100: #facc15;
  --color-base-200: #f5c000;
  --color-base-300: #ebb800;
  --color-base-content: #111111;
  --color-primary: #f472b6;
  --color-primary-content: #111111;
  --color-secondary: #111111;
  --color-secondary-content: #facc15;
  --color-accent: #fff8f0;
  --color-accent-content: #111111;
  --color-neutral: #1a1a1a;
  --color-neutral-content: #facc15;
  --color-info: oklch(60% 0.16 222);
  --color-info-content: #111111;
  --color-success: oklch(64% 0.18 152);
  --color-success-content: #111111;
  --color-warning: oklch(72% 0.18 82);
  --color-warning-content: #111111;
  --color-error: oklch(64% 0.24 24);
  --color-error-content: #facc15;
  --radius-selector: 2rem;
  --radius-field: 2rem;
  --radius-box: 1rem;
  --border: 3px;
  --depth: 0;
  --noise: 0;
  --brutal-shadow-color: #111111;
  --brutal-shadow: 4px 4px 0 var(--brutal-shadow-color);
}

/* ─── Neo Brutalism Yellow Dark ────────────────────────────────────────────── */

[data-theme="neobrutalism-yellow-dark"] {
  color-scheme: dark;
  --color-base-100: #1c1a00;
  --color-base-200: #2a2600;
  --color-base-300: #383200;
  --color-base-content: #fef3c7;
  --color-primary: #facc15;
  --color-primary-content: #111111;
  --color-secondary: #f472b6;
  --color-secondary-content: #111111;
  --color-accent: #34d399;
  --color-accent-content: #111111;
  --color-neutral: #2a2600;
  --color-neutral-content: #fef3c7;
  --color-info: oklch(60% 0.16 222);
  --color-info-content: #111111;
  --color-success: oklch(64% 0.18 152);
  --color-success-content: #111111;
  --color-warning: oklch(72% 0.18 82);
  --color-warning-content: #111111;
  --color-error: oklch(64% 0.24 24);
  --color-error-content: #fef3c7;
  --radius-selector: 2rem;
  --radius-field: 2rem;
  --radius-box: 1rem;
  --border: 3px;
  --depth: 0;
  --noise: 0;
  --brutal-shadow-color: #facc15;
  --brutal-shadow: 4px 4px 0 var(--brutal-shadow-color);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/themes/neobrutalism.css
git commit -m "feat: add neobrutalism theme CSS — four theme token blocks"
```

---

## Task 2: Wire up the import and TypeScript enum

**Files:**
- Modify: `src/index.css`
- Modify: `src/themes/index.ts`

- [ ] **Step 1: Add the import to `src/index.css`**

In `src/index.css`, add the import after the last editor theme line (`@import "./themes/macclassic.css";`):

```css
@import "./themes/macclassic.css";
@import "./themes/neobrutalism.css";
```

- [ ] **Step 2: Add the four enum values to `src/themes/index.ts`**

Open `src/themes/index.ts`. Add four entries to the `Themes` enum after the `WIN95` and `MACCLASSIC` entries:

```typescript
export enum Themes {
  // App themes (from wendid)
  NAVIGATOR = "navigator",
  NAVIGATOR_LIGHT = "navigator-light",
  COMMAND = "command",
  COMMAND_LIGHT = "command-light",

  // Editor themes (from BernardoEstrada.github.io)
  VSDARK = "vsdark",
  MONOKAI = "monokai",
  NORD = "nord",
  GITHUBLIGHT = "githublight",
  TERMINAL = "terminal",
  CRT1990 = "crt1990",
  WIN95 = "win95",
  MACCLASSIC = "macclassic",

  // Neo Brutalism themes
  NEOBRUTALISM = "neobrutalism",
  NEOBRUTALISM_DARK = "neobrutalism-dark",
  NEOBRUTALISM_YELLOW = "neobrutalism-yellow",
  NEOBRUTALISM_YELLOW_DARK = "neobrutalism-yellow-dark",

  // DaisyUI built-ins (available when daisyui themes are enabled)
  LIGHT = "light",
  DARK = "dark",
}
```

- [ ] **Step 3: Type-check**

```bash
yarn typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/index.css src/themes/index.ts
git commit -m "feat: register neobrutalism themes in index.css and Themes enum"
```

---

## Task 3: Add neo-brutalism override block to overrides.css

**Files:**
- Modify: `src/styles/overrides.css`

This block must come **at the end** of the file so it wins over the global `html[data-theme]` rules above it.

- [ ] **Step 1: Append the override block to `src/styles/overrides.css`**

Add the following at the very end of the file:

```css
/* ─── Neo Brutalism — shared across all four themes ─────────────────────── */

html[data-theme^="neobrutalism"] .btn {
  box-shadow: var(--brutal-shadow) !important;
}
html[data-theme^="neobrutalism"] .btn:hover {
  translate: 1px 1px;
  box-shadow: 3px 3px 0 var(--brutal-shadow-color) !important;
}

html[data-theme^="neobrutalism"] .btn-primary {
  background: var(--color-primary) !important;
  border: 3px solid var(--brutal-shadow-color) !important;
  color: var(--color-primary-content) !important;
  filter: none !important;
}
html[data-theme^="neobrutalism"] .btn-primary:hover {
  filter: brightness(0.92) !important;
}

html[data-theme^="neobrutalism"] .btn-outline {
  border-color: var(--brutal-shadow-color) !important;
  color: var(--color-base-content) !important;
}
html[data-theme^="neobrutalism"] .btn-outline:hover {
  background: var(--color-base-200) !important;
  border-color: var(--brutal-shadow-color) !important;
  color: var(--color-base-content) !important;
}

html[data-theme^="neobrutalism"] .btn-ghost {
  color: var(--color-base-content) !important;
}
html[data-theme^="neobrutalism"] .btn-ghost:hover {
  background: var(--color-base-200) !important;
  color: var(--color-base-content) !important;
}

html[data-theme^="neobrutalism"] .input,
html[data-theme^="neobrutalism"] .select,
html[data-theme^="neobrutalism"] .textarea {
  background: var(--color-base-100) !important;
  border-color: var(--brutal-shadow-color) !important;
  box-shadow: var(--brutal-shadow) !important;
}
html[data-theme^="neobrutalism"] .input:focus,
html[data-theme^="neobrutalism"] .select:focus,
html[data-theme^="neobrutalism"] .textarea:focus {
  border-color: var(--brutal-shadow-color) !important;
  box-shadow: var(--brutal-shadow) !important;
  outline: none;
}

html[data-theme^="neobrutalism"] .card {
  box-shadow: var(--brutal-shadow) !important;
  border: 3px solid var(--brutal-shadow-color) !important;
}

html[data-theme^="neobrutalism"] .badge {
  border-color: var(--brutal-shadow-color) !important;
  box-shadow: 2px 2px 0 var(--brutal-shadow-color) !important;
}
html[data-theme^="neobrutalism"] .badge-success,
html[data-theme^="neobrutalism"] .badge-error,
html[data-theme^="neobrutalism"] .badge-warning,
html[data-theme^="neobrutalism"] .badge-secondary {
  border-color: var(--brutal-shadow-color) !important;
}

html[data-theme^="neobrutalism"] .modal-box {
  background: var(--color-base-100) !important;
  backdrop-filter: none !important;
  border: 3px solid var(--brutal-shadow-color) !important;
  box-shadow: var(--brutal-shadow) !important;
}
```

- [ ] **Step 2: Lint**

```bash
yarn lint
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/styles/overrides.css
git commit -m "feat: add neobrutalism override block — shadows, borders, button/field/badge resets"
```

---

## Task 4: Verify in Storybook

**Files:** (none changed — visual verification only)

- [ ] **Step 1: Start Storybook**

```bash
yarn dev
```

Open the Storybook URL (usually `http://localhost:6006`).

- [ ] **Step 2: Check each theme in the toolbar**

Switch to each of the four new themes using the theme toolbar. For each theme verify:

| Component | Expected |
|---|---|
| Buttons (primary, outline, ghost) | Pill-shaped, 3px border, 4px hard offset shadow |
| Hover on button | Shifts 1px right/down, shadow shrinks to 3px |
| Input / Select | Pill-shaped, 3px border, 4px hard offset shadow |
| Card | Rounded (1rem), 3px border, 4px hard offset shadow |
| Badge | Pill-shaped, 3px border, 2px shadow |
| Modal (if any story has one) | 1rem radius, 3px border, brutal shadow, no blur |
| `neobrutalism` | Cream background, black borders, yellow primary |
| `neobrutalism-dark` | Black background, yellow borders/shadows, yellow primary |
| `neobrutalism-yellow` | Yellow background, black borders, pink primary |
| `neobrutalism-yellow-dark` | Very dark yellow background, yellow borders/shadows |

- [ ] **Step 3: Fix any issues found, commit fixes if needed**

If any component looks wrong, adjust the relevant CSS in `src/styles/overrides.css` and re-verify.

---

## Done

All four themes are live in Storybook. The `Themes` enum exposes them for consuming apps. Any app importing `@berni/design-system/styles` gets the themes automatically.
