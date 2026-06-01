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
