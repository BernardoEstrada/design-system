import React from "react";
import {
  CategoryIcon,
  MoonIcon,
  PaintBrushIcon,
  SunIcon,
  MobileIcon,
} from "@storybook/icons";
import { Select } from "storybook/internal/components";
import { addons, types, useGlobals } from "storybook/manager-api";
import {
  Appearance,
  DEFAULT_THEME,
  DEFAULT_THEME_CATEGORY,
  THEME_CATEGORY_LABELS,
  ThemeCategory,
  Themes,
  Theme,
  getAvailableAppearances,
  getThemeCategory,
  getThemesInCategory,
  getToolbarAppearances,
} from "../src/themes/index";

const APPEARANCE_TOOL_ID = "design-system/appearance/tool";
const THEME_GROUP_TOOL_ID = "design-system/theme-group/tool";
const THEME_TOOL_ID = "design-system/theme/tool";
const THEME_PICKER_TOOL_ID = "toolbar";
const CUSTOM_TOOL_IDS = [
  APPEARANCE_TOOL_ID,
  THEME_GROUP_TOOL_ID,
  THEME_TOOL_ID,
];

const APPEARANCE_OPTIONS: Record<
  Appearance,
  { title: string; icon: React.ReactNode }
> = {
  [Appearance.LIGHT]: { title: "Light", icon: <SunIcon /> },
  [Appearance.DARK]: { title: "Dark", icon: <MoonIcon /> },
  [Appearance.SYSTEM]: { title: "System", icon: <MobileIcon /> },
};

const AppearanceSwitcher = React.memo(function AppearanceSwitcher() {
  const [{ theme, appearance }, updateGlobals] = useGlobals();
  const currentTheme = (theme as Themes) || DEFAULT_THEME;
  const toolbarAppearances = getToolbarAppearances(
    getAvailableAppearances(currentTheme),
  );
  const currentAppearance = (appearance as Appearance) || Appearance.SYSTEM;
  const selected = toolbarAppearances.includes(currentAppearance)
    ? currentAppearance
    : toolbarAppearances[0];

  React.useEffect(() => {
    if (selected && selected !== currentAppearance) {
      updateGlobals({ appearance: selected });
    }
  }, [selected, currentAppearance, updateGlobals]);

  if (!selected) return null;

  return (
    <Select
      key={`${currentTheme}-${selected}`}
      icon={APPEARANCE_OPTIONS[selected].icon}
      ariaLabel="Appearance"
      defaultOptions={selected}
      disabled={toolbarAppearances.length === 1}
      options={toolbarAppearances.map((value) => ({
        value,
        title: APPEARANCE_OPTIONS[value].title,
        icon: APPEARANCE_OPTIONS[value].icon,
      }))}
      onSelect={(value) => updateGlobals({ appearance: value })}
    />
  );
});

const ThemeGroupSwitcher = React.memo(function ThemeGroupSwitcher() {
  const [{ theme, themeGroup }, updateGlobals] = useGlobals();
  const currentTheme = (theme as Themes) || DEFAULT_THEME;
  const selected =
    (themeGroup as ThemeCategory) ||
    getThemeCategory(currentTheme) ||
    DEFAULT_THEME_CATEGORY;

  React.useEffect(() => {
    if (selected !== themeGroup) {
      updateGlobals({ themeGroup: selected });
    }
  }, [selected, themeGroup, updateGlobals]);

  return (
    <Select
      key={selected}
      icon={<CategoryIcon />}
      ariaLabel="Theme group"
      defaultOptions={selected}
      options={ThemeCategory.map((value) => ({
        value,
        title: THEME_CATEGORY_LABELS[value],
      }))}
      onSelect={(value) => {
        const category = value as ThemeCategory;
        const themesInGroup = getThemesInCategory(category);
        const themeNamesInGroup = Object.keys(themesInGroup);
        const nextTheme = themeNamesInGroup.includes(currentTheme)
          ? currentTheme
          : themeNamesInGroup[0];
        updateGlobals({ themeGroup: category, theme: nextTheme });
      }}
    />
  );
});

const ThemeSwitcher = React.memo(function ThemeSwitcher() {
  const [{ theme, themeGroup }, updateGlobals] = useGlobals();
  const currentTheme = (theme as Themes) || DEFAULT_THEME;
  const category =
    (themeGroup as ThemeCategory) || getThemeCategory(currentTheme);
  const themesInGroup = getThemesInCategory(category);
  const themeNamesInGroup = Object.keys(themesInGroup);
  const selected = themeNamesInGroup.includes(currentTheme)
    ? currentTheme
    : themeNamesInGroup[0];

  React.useEffect(() => {
    if (selected && selected !== currentTheme) {
      updateGlobals({ theme: selected });
    }
  }, [selected, currentTheme, updateGlobals]);

  if (!selected) return null;

  const formatThemeName = (name: string) =>
    name
      .split("-")
      .map((s) => `${s.charAt(0).toLocaleUpperCase()}${s.slice(1)}`)
      .join(" ");

  const getThemeIcon = (theme: Theme) => {
    if (theme.dark && theme.light) return null;
    if (theme.dark) return <MoonIcon />;
    if (theme.light) return <SunIcon />;
    return null;
  };

  return (
    <Select
      key={`${category}-${selected}`}
      icon={<PaintBrushIcon />}
      ariaLabel="Theme"
      defaultOptions={selected}
      disabled={themeNamesInGroup.length === 1}
      options={Object.entries(themesInGroup).map(([key, value]) => ({
        value: key,
        title: value.name || formatThemeName(key),
        aside: getThemeIcon(value),
      }))}
      onSelect={(value) => updateGlobals({ theme: value })}
    />
  );
});

function placeCustomToolsBeforeThemePicker() {
  const tools = addons.getElements(types.TOOL) as Record<string, object>;
  const custom = CUSTOM_TOOL_IDS.flatMap((id) => {
    const tool = tools[id];
    return tool ? ([[id, tool]] as const) : [];
  });
  const toolbar = tools[THEME_PICKER_TOOL_ID];
  const rest = Object.entries(tools).filter(
    ([id]) => id !== THEME_PICKER_TOOL_ID && !CUSTOM_TOOL_IDS.includes(id),
  );

  for (const id of Object.keys(tools)) {
    delete tools[id];
  }
  for (const [id, tool] of rest) {
    tools[id] = tool;
  }
  for (const [id, tool] of custom) {
    tools[id] = tool;
  }
  if (toolbar) {
    tools[THEME_PICKER_TOOL_ID] = toolbar;
  }
}

const originalAdd = addons.add.bind(addons);
addons.add = ((id, addon) => {
  originalAdd(id, addon);
  placeCustomToolsBeforeThemePicker();
}) as typeof addons.add;

addons.register("design-system/appearance", () => {
  originalAdd(APPEARANCE_TOOL_ID, {
    title: "Appearance",
    type: types.TOOL as typeof types.TOOL,
    match: ({ tabId }: { tabId?: string }) => !tabId,
    render: () => <AppearanceSwitcher />,
  });
  originalAdd(THEME_GROUP_TOOL_ID, {
    title: "Theme group",
    type: types.TOOL as typeof types.TOOL,
    match: ({ tabId }: { tabId?: string }) => !tabId,
    render: () => <ThemeGroupSwitcher />,
  });
  originalAdd(THEME_TOOL_ID, {
    title: "Theme",
    type: types.TOOL as typeof types.TOOL,
    match: ({ tabId }: { tabId?: string }) => !tabId,
    render: () => <ThemeSwitcher />,
  });
  placeCustomToolsBeforeThemePicker();
});
