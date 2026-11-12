import { Monitor, Moon, Sun } from "lucide-react";
import { Appearance, listThemes, type ThemeCategory, type ThemeInfo } from "../../themes";
import { cx } from "../../utils/cx";

const categoryLabels: Record<ThemeCategory, string> = { app: "App", editor: "Editor", daisyui: "daisyUI" };

interface ThemePickerProps {
  /** Selected theme family id, e.g. "navigator". */
  family: string;
  appearance: Appearance;
  onFamilyChange: (family: string) => void;
  onAppearanceChange: (appearance: Appearance) => void;
  /** Which categories to offer. Default: all. */
  categories?: readonly ThemeCategory[];
  /** Show category headings. Default true. */
  grouped?: boolean;
  className?: string;
}

/**
 * Appearance switch (system / light / dark) plus a grid of theme families, each previewed in its
 * own colours. Pair with `applyTheme(family, appearance)`; where to store the choice is up to the app.
 */
export function ThemePicker({
  family,
  appearance,
  onFamilyChange,
  onAppearanceChange,
  categories,
  grouped = true,
  className,
}: ThemePickerProps) {
  const themes = listThemes(categories);
  const groups = grouped
    ? [...new Set(themes.map((t) => t.category))].map((c) => ({ category: c, items: themes.filter((t) => t.category === c) }))
    : [{ category: null, items: themes }];

  return (
    <div className={cx("flex flex-col gap-4", className)}>
      <div className="join" role="radiogroup" aria-label="Appearance">
        {[
          { id: Appearance.SYSTEM, label: "System", Icon: Monitor },
          { id: Appearance.LIGHT, label: "Light", Icon: Sun },
          { id: Appearance.DARK, label: "Dark", Icon: Moon },
        ].map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={appearance === id}
            className={cx("btn join-item btn-sm", appearance === id && "btn-primary")}
            onClick={() => onAppearanceChange(id)}
          >
            <Icon className="size-4" aria-hidden />
            {label}
          </button>
        ))}
      </div>
      {groups.map(({ category, items }) => (
        <section key={category ?? "all"}>
          {category && <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-60">{categoryLabels[category]}</h4>}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {items.map((t) => (
              <ThemeCard key={t.id} theme={t} appearance={appearance} selected={family === t.id} onSelect={() => onFamilyChange(t.id)} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function ThemeCard({ theme, appearance, selected, onSelect }: { theme: ThemeInfo; appearance: Appearance; selected: boolean; onSelect: () => void }) {
  const preview = (appearance === Appearance.LIGHT ? theme.light ?? theme.dark : theme.dark ?? theme.light) ?? undefined;
  return (
    <button
      type="button"
      data-theme={preview}
      onClick={onSelect}
      aria-pressed={selected}
      className={cx(
        "rounded-box border-2 bg-base-100 p-3 text-left text-base-content transition",
        selected ? "border-primary" : "border-base-300 hover:border-base-content/30",
      )}
    >
      <span className="mb-2 flex gap-1">
        {["bg-primary", "bg-secondary", "bg-accent", "bg-neutral"].map((c) => (
          <span key={c} className={cx("h-4 flex-1 rounded", c)} />
        ))}
      </span>
      <span className="block text-sm font-medium">{theme.name}</span>
      <span className="block text-xs opacity-60">{theme.light && theme.dark ? "Light & dark" : theme.dark ? "Dark only" : "Light only"}</span>
    </button>
  );
}
