# Neo Brutalism Themes — Design Spec

**Date:** 2026-06-01
**Reference:** https://paralivesmod.com/ (friendly neo-brutalism with pill-shaped elements)

## Overview

Four new themes implementing a "friendly neo-brutalism" aesthetic: bold borders, hard offset shadows, pill-shaped buttons and inputs, and rounded cards. Inspired by the Paralives Mods site — playful and energetic, not harsh or austere.

## Themes

| Theme name | Color scheme | Base | Shadow color |
|---|---|---|---|
| `neobrutalism` | light | Warm cream `#fff8f0` | Black `#111` |
| `neobrutalism-dark` | dark | Near-black `#111111` | Yellow `#facc15` |
| `neobrutalism-yellow` | light | Bold yellow `#facc15` | Black `#111` |
| `neobrutalism-yellow-dark` | dark | Very dark yellow-tinted `#1c1a00` | Yellow `#facc15` |

## Visual Design Decisions

| Property | Value | Rationale |
|---|---|---|
| `--radius-field` | `2rem` | Full pill on buttons and inputs |
| `--radius-selector` | `2rem` | Full pill on badges and chips |
| `--radius-box` | `1rem` | Large rounded on cards and modals |
| `--border` | `3px` | Thick enough to read brutalist, not so thick it crushes small elements |
| Shadow offset | `4px 4px 0` (no blur) | Classic brutalist hard shadow — the defining visual |
| Shadow color (light themes) | `#111` | High contrast against cream/yellow base |
| Shadow color (dark themes) | `#facc15` | Neon yellow shadow on dark creates the same punch |

## Color Palette

### `neobrutalism` (light)
- Base: `#fff8f0` (warm cream), base-200: `#fde8d0`, base-300: `#f9d4b0`
- Base-content: `#111111`
- Primary: `#facc15` (yellow), primary-content: `#111111`
- Secondary: `#f472b6` (pink), secondary-content: `#111111`
- Accent: `#60a5fa` (blue), accent-content: `#111111`
- Neutral: `#1a1a1a`, neutral-content: `#fff8f0`
- Info/success/warning/error: standard semantic colors with dark content

### `neobrutalism-dark`
- Base: `#111111`, base-200: `#1a1a1a`, base-300: `#222222`
- Base-content: `#f5f0e8`
- Primary: `#facc15` (yellow), primary-content: `#111111`
- Secondary: `#f472b6` (pink), secondary-content: `#111111`
- Accent: `#34d399` (green), accent-content: `#111111`
- Neutral: `#2a2a2a`, neutral-content: `#f5f0e8`

### `neobrutalism-yellow`
- Base: `#facc15` (bold yellow), base-200: `#f5c000`, base-300: `#ebb800`
- Base-content: `#111111`
- Primary: `#f472b6` (pink), primary-content: `#111111`
- Secondary: `#111111`, secondary-content: `#facc15`
- Accent: `#fff8f0` (cream), accent-content: `#111111`
- Neutral: `#1a1a1a`, neutral-content: `#facc15`

### `neobrutalism-yellow-dark`
- Base: `#1c1a00`, base-200: `#2a2600`, base-300: `#383200`
- Base-content: `#fef3c7`
- Primary: `#facc15` (yellow), primary-content: `#111111`
- Secondary: `#f472b6` (pink), secondary-content: `#111111`
- Accent: `#34d399` (green), accent-content: `#111111`
- Neutral: `#2a2600`, neutral-content: `#fef3c7`

## Architecture (Approach C — Hybrid)

### New files
- `src/themes/neobrutalism.css` — contains all four theme blocks
- Entry in `src/index.css` — one `@import "./themes/neobrutalism.css";`
- Entry in `src/themes/index.ts` — four new `Themes` enum values

### CSS variable additions per theme
Each theme block defines:
1. All standard DaisyUI `--color-*` vars
2. `--radius-field: 2rem`, `--radius-selector: 2rem`, `--radius-box: 1rem`
3. `--border: 3px`
4. `--depth: 0`, `--noise: 0`
5. `--brutal-shadow-color: #111` (or `#facc15` for dark themes)
6. `--brutal-shadow: 4px 4px 0 var(--brutal-shadow-color)`

### Shared overrides in `src/styles/overrides.css`
A single new block `[data-theme^="neobrutalism"]` applies the offset shadow to DaisyUI components:

```css
[data-theme^="neobrutalism"] {
  /* Buttons */
  .btn { box-shadow: var(--brutal-shadow); }
  .btn:hover { translate: 1px 1px; box-shadow: 3px 3px 0 var(--brutal-shadow-color); }

  /* Inputs / selects / textareas */
  .input, .select, .textarea { box-shadow: var(--brutal-shadow); }

  /* Cards / boxes */
  .card, .modal-box { box-shadow: var(--brutal-shadow); border: 3px solid var(--brutal-shadow-color); }

  /* Badges */
  .badge { box-shadow: 2px 2px 0 var(--brutal-shadow-color); }
}
```

The hover interaction (translate 1px 1px, reduce shadow by 1px) gives a satisfying "press" effect common in neo-brutalism UI.

### What is NOT included
- No `--glass-*` vars — these themes have no glassmorphism
- No `--modal-blur` — no backdrop blur
- No `--btn-primary-bg` gradient overrides — flat solid colors only

## Files Changed / Created

| File | Change |
|---|---|
| `src/themes/neobrutalism.css` | **Create** — all 4 theme blocks |
| `src/index.css` | **Edit** — add `@import "./themes/neobrutalism.css"` |
| `src/themes/index.ts` | **Edit** — add 4 enum values |
| `src/styles/overrides.css` | **Edit** — add `[data-theme^="neobrutalism"]` block |

## Out of Scope
- Custom font (no web font import — inherits whatever the app uses)
- Storybook story — component stories already pick up new themes via the global theme switcher
