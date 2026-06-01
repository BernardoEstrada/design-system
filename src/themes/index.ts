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

  // DaisyUI built-ins (available when daisyui themes are enabled)
  LIGHT = "light",
  DARK = "dark",
}

export const DEFAULT_DARK = Themes.NAVIGATOR;
export const DEFAULT_LIGHT = Themes.NAVIGATOR_LIGHT;

export function applyTheme(theme: Themes | string): void {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
}
