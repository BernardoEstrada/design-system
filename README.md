# @bernardoestrada/design-system

React component library and theme collection built on **Tailwind CSS v4** and **DaisyUI v5**, with Lucide, Lucide Lab and react-icons bundled in.

- 18 components (forms, feedback, overlays, navigation, icon picker)
- 40+ themes: custom app and editor themes plus every DaisyUI built-in, each with light/dark variants where available
- Icons under their own entry points, so the root import stays small

Browse everything in Storybook: `yarn dev`.

## Install

The package is published to **GitHub Packages**, which needs a token even for public packages.

1. Create a GitHub personal access token with the `read:packages` scope.
2. Add an `.npmrc` to your app (or `~/.npmrc`):

   ```ini
   @bernardoestrada:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
   ```

3. Install:

   ```bash
   yarn add @bernardoestrada/design-system
   ```

React 18 or newer is a peer dependency.

### Or start a new app

```bash
npx @bernardoestrada/create-webapp my-app
```

This scaffolds a Vite + React + React Router app from [`templates/react-app`](templates/react-app) with the design system, theme switching and GitHub Actions already set up.

## Usage

Load the styles once, in CSS or in JS:

```css
@import "@bernardoestrada/design-system/styles";
```

```tsx
import "@bernardoestrada/design-system/styles";
```

Then use components:

```tsx
import { Button, Input, Modal, useToast } from "@bernardoestrada/design-system";
```

### Themes

Themes are applied with the `data-theme` attribute. `applyTheme` picks the light or dark variant for you:

```tsx
import { applyTheme, Appearance, Themes } from "@bernardoestrada/design-system";

applyTheme(Themes.NAVIGATOR, Appearance.SYSTEM); // follows the OS setting
applyTheme(Themes.NEOBRUTALISM, Appearance.DARK);
```

| Group | Themes |
|---|---|
| App | `navigator`, `command`, `neobrutalism`, `neobrutalism-yellow` (light + dark each) |
| Editor | `vsdark`, `monokai`, `editor-nord`, `githublight`, `terminal`, `crt1990`, `win95`, `macclassic` |
| DaisyUI | every built-in theme (`cupcake`, `synthwave`, `dracula`, `nord`, …) |

## Components

| Group | Components |
|---|---|
| Actions & display | `Button`, `Badge`, `Card` |
| Forms | `Input`, `Select`, `Textarea`, `Checkbox`, `Radio`, `Toggle`, `IconPicker`* |
| Feedback | `Alert`, `Loading`, `Progress`, `ToastProvider` + `useToast` |
| Overlays & navigation | `Modal`, `Dropdown`, `Tabs`, `Tooltip` |

\* `IconPicker` has its own entry point; see below.

Form controls forward refs, so they work with form libraries such as react-hook-form.

```tsx
<ToastProvider>
  <App />
</ToastProvider>;

// anywhere inside
const { toast } = useToast();
toast({ title: "Saved", message: "Your changes are live.", variant: "success" });
```

## Icons

Icons aren't exported from the package root. Import them from `/icons`:

```tsx
// Lucide (default) and Lucide Lab, as React components
import { Pizza, AppleCore } from "@bernardoestrada/design-system/icons";

// react-icons: one path per pack, same names as react-icons (fa, fa6, md, si, tb, …)
import { FaBeer } from "@bernardoestrada/design-system/icons/fa";

// react-icons helpers
import { IconContext } from "@bernardoestrada/design-system/icons/react-icons";
```

Icon libraries stay external, so your bundler only includes the icons you import.

### Icons by name

When the icon is only known at runtime (stored in a database, chosen by a user), use `DynamicIcon`. It takes kebab-case names and loads each icon on demand. It has the same API as Lucide's [`DynamicIcon`](https://lucide.dev/guide/react/advanced/dynamic-icon-component), and also covers Lab icons.

```tsx
import { DynamicIcon } from "@bernardoestrada/design-system/icons/dynamic";

<DynamicIcon name="camera" />
<DynamicIcon name="apple-core" size={32} />
```

Prefer static imports when you know the icon at build time.

### Icon picker

A searchable picker for Lucide and Lab icons. Search matches icon names and Lucide's tags (so "delete" finds trash icons). The value is a name you can pass to `DynamicIcon`.

```tsx
import { IconPicker } from "@bernardoestrada/design-system/icon-picker";
import { DynamicIcon, type IconName } from "@bernardoestrada/design-system/icons/dynamic";

const [icon, setIcon] = useState<string | null>("rocket");

<IconPicker label="Project icon" value={icon} onChange={setIcon} />
{icon && <DynamicIcon name={icon as IconName} />}
```

Useful props: `sources={["lab"]}` to limit the icon sets, `inline` to render the panel without a button, `clearable`, `maxResults` (icons per page), `loadMore={false}` to drop the "Load more" button.

## Entry points

| Import | Contents |
|---|---|
| `@bernardoestrada/design-system` | Components, themes |
| `@bernardoestrada/design-system/styles` | Compiled CSS (Tailwind, DaisyUI, themes) |
| `@bernardoestrada/design-system/icons` | Lucide + Lucide Lab components |
| `@bernardoestrada/design-system/icons/dynamic` | `DynamicIcon`, `iconNames` |
| `@bernardoestrada/design-system/icons/<pack>` | A react-icons pack (`fa`, `md`, `si`, …) |
| `@bernardoestrada/design-system/icon-picker` | `IconPicker`, `searchIcons` |

## Development

```bash
yarn              # install
yarn dev          # Storybook on :6006
yarn build        # build the library into dist/
yarn typecheck
yarn lint
```

### Icons

`src/icons/` is generated; don't edit it by hand.

```bash
yarn icons                  # regenerate from the installed packages (also runs on build)
yarn icons:update --check   # show newer versions of the icon packages
yarn icons:update           # upgrade them, regenerate, and list added/removed icons
```

`icons:update` upgrades `lucide-react`, `@lucide/lab` and `react-icons`, and keeps `lucide-static` (source of the search tags) on the same version as `lucide-react`. If it reports removed icons, release the update as a breaking change: apps may import those icons or have their names stored.

### Adding a theme

1. Create `src/themes/mytheme.css` with a `[data-theme="mytheme"]` block of DaisyUI CSS variables.
2. Import it in `src/index.css`.
3. Add it to the `Themes` enum and `CategorizedThemes` in `src/themes/index.ts`.

### Releasing

Push a version tag. GitHub Actions builds and publishes this package and `@bernardoestrada/create-webapp`, using the tag as the version for both.

```bash
git tag -a v0.5.0 -m "v0.5.0"
git push origin v0.5.0
```

While on 0.x, bump the minor version for breaking changes and keep the app template's dependency range (`templates/react-app/package.json`) in step.

## License

MIT
