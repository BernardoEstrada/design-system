export enum Appearance {
  LIGHT = "light",
  DARK = "dark",
  SYSTEM = "system",
}

type ThemeId = string;

export type Theme = {
  [Appearance.LIGHT]?: ThemeId;
  [Appearance.DARK]?: ThemeId;
};

export enum Themes {
  NAVIGATOR = "navigator",
  COMMAND = "command",
  VS_DARK = "vsdark",
  MONOKAI = "monokai",
  EDITOR_NORD = "editor-nord",
  GITHUB_LIGHT = "githublight",
  TERMINAL = "terminal",
  CRT1990 = "crt1990",
  WIN95 = "win95",
  MAC_CLASSIC = "macclassic",
  NEOBRUTALISM = "neobrutalism",
  NEOBRUTALISM_YELLOW = "neobrutalism-yellow",
  DAISYUI = "daisyui",
  CUPCAKE = "cupcake",
  BUMBLEBEE = "bumblebee",
  EMERALD = "emerald",
  CORPORATE = "corporate",
  SYNTHWAVE = "synthwave",
  RETRO = "retro",
  CYBERPUNK = "cyberpunk",
  VALENTINE = "valentine",
  HALLOWEEN = "halloween",
  GARDEN = "garden",
  FOREST = "forest",
  AQULOFI = "aqulofi",
  PASTEL = "pastel",
  FANTASY = "fantasy",
  WIREFRAME = "wireframe",
  BLACK = "black",
  LUXURY = "luxury",
  DRACULA = "dracula",
  CMYK = "cmyk",
  AUTUMN = "autumn",
  BUSINESS = "business",
  ACID = "acid",
  LEMONADE = "lemonade",
  NIGHT = "night",
  COFFEE = "coffee",
  WINTER = "winter",
  DIM = "dim",
  NORD = "nord",
  SUNSET = "sunset",
  CARAMELLATTE = "caramellatte",
  ABYSS = "abyss",
  SILK = "silk",
}

export const ThemeCategory = ["app", "editor", "daisyui"] as const;

export type ThemeCategory = (typeof ThemeCategory)[number];

export const CategorizedThemes: Record<
  ThemeCategory,
  Partial<Record<Themes, Theme & { name?: string }>>
> = {
  app: {
    [Themes.NAVIGATOR]: { light: "navigator-light", dark: "navigator-dark" },
    [Themes.COMMAND]: { light: "command-light", dark: "command-dark" },
    [Themes.NEOBRUTALISM]: {
      dark: "neobrutalism-dark",
      light: "neobrutalism-light",
    },
    [Themes.NEOBRUTALISM_YELLOW]: {
      dark: "neobrutalism-yellow-dark",
      light: "neobrutalism-yellow-light",
    },
  },
  editor: {
    [Themes.VS_DARK]: { dark: "vsdark", name: "VS Dark" },
    [Themes.MONOKAI]: { dark: "monokai" },
    [Themes.EDITOR_NORD]: { dark: "editor-nord", name: "Nord" },
    [Themes.GITHUB_LIGHT]: { light: "githublight", name: "GitHub Light" },
    [Themes.TERMINAL]: { dark: "terminal" },
    [Themes.CRT1990]: { dark: "crt1990", name: "CRT 1990" },
    [Themes.WIN95]: { light: "win95", name: "Win 95" },
    [Themes.MAC_CLASSIC]: { light: "macclassic", name: "Mac Classic" },
  },
  daisyui: {
    [Themes.DAISYUI]: { light: "light", dark: "dark" },
    [Themes.CUPCAKE]: { light: "cupcake" },
    [Themes.BUMBLEBEE]: { light: "bumblebee" },
    [Themes.EMERALD]: { light: "emerald" },
    [Themes.CORPORATE]: { light: "corporate" },
    [Themes.SYNTHWAVE]: { dark: "synthwave" },
    [Themes.RETRO]: { light: "retro" },
    [Themes.CYBERPUNK]: { light: "cyberpunk" },
    [Themes.VALENTINE]: { light: "valentine" },
    [Themes.HALLOWEEN]: { dark: "halloween" },
    [Themes.GARDEN]: { light: "garden" },
    [Themes.FOREST]: { dark: "forest" },
    [Themes.AQULOFI]: { light: "aqulofi" },
    [Themes.PASTEL]: { light: "pastel" },
    [Themes.FANTASY]: { light: "fantasy" },
    [Themes.WIREFRAME]: { light: "wireframe" },
    [Themes.BLACK]: { dark: "black" },
    [Themes.LUXURY]: { dark: "luxury" },
    [Themes.DRACULA]: { dark: "dracula" },
    [Themes.CMYK]: { light: "cmyk" },
    [Themes.AUTUMN]: { light: "autumn" },
    [Themes.BUSINESS]: { dark: "business" },
    [Themes.ACID]: { light: "acid" },
    [Themes.LEMONADE]: { light: "lemonade" },
    [Themes.NIGHT]: { dark: "night" },
    [Themes.COFFEE]: { dark: "coffee" },
    [Themes.WINTER]: { light: "winter" },
    [Themes.DIM]: { dark: "dim" },
    [Themes.NORD]: { light: "nord" },
    [Themes.SUNSET]: { dark: "sunset" },
    [Themes.CARAMELLATTE]: { light: "caramellatte", name: "Caramel Latte" },
    [Themes.ABYSS]: { dark: "abyss" },
    [Themes.SILK]: { light: "silk" },
  },
} as const;

export const UncategorizedThemes: Record<Themes, Theme> = ThemeCategory.reduce(
  (acc, category) => ({ ...acc, ...CategorizedThemes[category] }),
  {} as Record<Themes, Theme>,
);

export const UncategorizedThemesWithDetails: Record<
  Themes,
  Theme & { category: ThemeCategory }
> = Object.entries(CategorizedThemes).reduce(
  (acc, [category, themes]) => {
    const reducedThemes = Object.entries(themes).reduce(
      (acc2, [themeId, details]) => ({
        ...acc2,
        [themeId]: { ...details, category },
      }),
      {},
    );
    return { ...acc, ...reducedThemes };
  },
  {} as Record<Themes, Theme & { category: ThemeCategory }>,
);

export const DEFAULT_THEME = Themes.NAVIGATOR;
export const DEFAULT_THEME_CATEGORY: ThemeCategory = "app";

export const THEME_CATEGORY_LABELS: Record<ThemeCategory, string> = {
  app: "App",
  editor: "Editor",
  daisyui: "DaisyUI",
};

export function getThemesInCategory(
  category: ThemeCategory,
): Record<Themes, Theme & { name?: string }> {
  return CategorizedThemes[category] as Record<
    Themes,
    Theme & { name?: string }
  >;
}

export function getThemeCategory(themeName: Themes | string): ThemeCategory {
  return (
    UncategorizedThemesWithDetails[themeName as Themes]?.category ??
    DEFAULT_THEME_CATEGORY
  );
}

export interface ComputedThemeResult {
  themeId?: ThemeId;
  appearance: Appearance;
  theme: Themes;
  availableAppearances: Appearance[];
  updated?: boolean;
}

export function getAvailableAppearances(
  themeName: Themes | string,
): Appearance[] {
  const theme = UncategorizedThemes[themeName as Themes];
  return [Appearance.LIGHT, Appearance.DARK].filter((mode) =>
    Boolean(theme?.[mode as keyof Theme]),
  );
}

export function getToolbarAppearances(
  availableAppearances: Appearance[],
): Appearance[] {
  const modes = [Appearance.LIGHT, Appearance.DARK].filter((mode) =>
    availableAppearances.includes(mode),
  );
  return modes.length === 2 ? [Appearance.SYSTEM, ...modes] : modes;
}

export function applyTheme(
  theme: Themes | string,
  appearance: Appearance = Appearance.SYSTEM,
): ComputedThemeResult {
  const computedAppearance =
    appearance === Appearance.SYSTEM ? getPreferredAppearance() : appearance;
  const computedTheme = getTheme(theme, computedAppearance);
  let updated = false;
  if (computedTheme.themeId && typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", computedTheme.themeId);
    updated = true;
  }
  return { ...computedTheme, updated };
}

function getTheme(
  themeName: Themes | string,
  appearance: Exclude<Appearance, Appearance.SYSTEM>,
): ComputedThemeResult {
  const theme = UncategorizedThemes[themeName as Themes];
  if (!theme) console.warn(`Theme ${themeName} not found`);
  const availableAppearances = getAvailableAppearances(themeName);
  if (!availableAppearances.includes(appearance)) {
    console.warn(
      `Appearance ${appearance} is not available for theme ${themeName}, using ${availableAppearances[0]} instead`,
    );
    appearance = availableAppearances[0] as Exclude<
      Appearance,
      Appearance.SYSTEM
    >;
  }
  const themeId = theme?.[appearance];
  return {
    themeId,
    appearance,
    theme: themeName as Themes,
    availableAppearances,
  } as const;
}

const getPreferredAppearance = (): Exclude<Appearance, Appearance.SYSTEM> =>
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? Appearance.DARK
    : Appearance.LIGHT;
