import { useDeferredValue, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { ChevronDown, Search } from "lucide-react";
import { labIconNames } from "../../icons/lab-names";
import { lucideCanonicalNames } from "../../icons/lucide-names";
import { cx } from "../../utils/cx";
import { DynamicIcon, type IconName } from "../DynamicIcon/DynamicIcon";
import { Dropdown } from "../Dropdown/Dropdown";
import { Field } from "../Field/Field";

export type IconSource = "lucide" | "lab";

export interface IconEntry {
  /** Kebab-case name, e.g. "apple-core". Pass it to DynamicIcon. */
  name: IconName;
  source: IconSource;
  /** "apple core" for apple-core */
  words: string;
  tags: string;
}

type Tags = Record<string, string[]>;

// Search tags are ~200 KB, so they load in their own chunk when a picker mounts.
// Until then, search matches names only.
const noTags: Tags = {};
let loadedTags: Tags = noTags;
let tagsPromise: Promise<Tags> | undefined;
const loadTags = () =>
  (tagsPromise ??= import("../../icons/tags.json").then((m) => (loadedTags = m.default as Tags)));

const catalogs = new WeakMap<Tags, IconEntry[]>();

function getCatalog(tags: Tags): IconEntry[] {
  let catalog = catalogs.get(tags);
  if (!catalog) {
    catalog = [
      ...lucideCanonicalNames.map((name) => ({
        name,
        source: "lucide" as const,
        words: name.replace(/-/g, " "),
        tags: (tags[name] ?? []).join(" ").toLowerCase(),
      })),
      ...labIconNames.map((name) => ({
        name,
        source: "lab" as const,
        words: name.replace(/-/g, " "),
        tags: "",
      })),
    ].sort((a, b) => a.name.localeCompare(b.name));
    catalogs.set(tags, catalog);
  }
  return catalog;
}

/** Wait for the search tags to load, so `searchIcons` also matches tags. */
export async function preloadIconTags(): Promise<void> {
  await loadTags();
}

/** Lower is better; undefined means no match. */
function score(entry: IconEntry, query: string, terms: string[]): number | undefined {
  const compact = entry.name.replace(/-/g, "");
  if (!terms.every((t) => entry.words.includes(t) || compact.includes(t) || entry.tags.includes(t))) {
    return undefined;
  }
  const q = query.replace(/[\s-]+/g, "");
  if (compact === q) return 0;
  if (compact.startsWith(q)) return 1;
  if (terms.every((t) => entry.words.includes(t) || compact.includes(t))) return 2;
  return 3; // matched through tags only
}

/**
 * Search Lucide and Lab icons by name and, once loaded, Lucide tags
 * (see `preloadIconTags`).
 */
export function searchIcons(query: string, sources: IconSource[] = ["lucide", "lab"]): IconEntry[] {
  const all = getCatalog(loadedTags).filter((e) => sources.includes(e.source));
  const q = query.trim().toLowerCase();
  if (!q) return all;
  const terms = q.split(/[\s-]+/).filter(Boolean);
  return all
    .map((entry) => ({ entry, s: score(entry, q, terms) }))
    .filter((r): r is { entry: IconEntry; s: number } => r.s !== undefined)
    .sort((a, b) => a.s - b.s || a.entry.name.localeCompare(b.entry.name))
    .map((r) => r.entry);
}

// Same-size placeholder while an icon chunk loads, so the grid doesn't jump.
const CellPlaceholder = () => <span className="bg-base-content/10 size-5 rounded" aria-hidden />;

// ─── Panel ──────────────────────────────────────────────────────────────────

interface PanelProps {
  value: string | null;
  onSelect: (name: string | null) => void;
  sources: IconSource[];
  clearable: boolean;
  maxResults: number;
  loadMore: boolean;
  columns: number;
  /** Focus the search box when this becomes true. */
  autoFocus: boolean;
}

function IconPickerPanel({
  value,
  onSelect,
  sources,
  clearable,
  maxResults,
  loadMore,
  columns,
  autoFocus,
}: PanelProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<IconSource | "all">("all");
  const deferredQuery = useDeferredValue(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const cellRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  // Re-run the search once tags arrive.
  const [tagsVersion, setTagsVersion] = useState(loadedTags === noTags ? 0 : 1);
  useEffect(() => {
    if (tagsVersion) return;
    let ignore = false;
    loadTags().then(() => {
      if (!ignore) setTagsVersion(1);
    });
    return () => {
      ignore = true;
    };
  }, [tagsVersion]);

  // Joined into a string so a new `sources` array each render doesn't re-run the search.
  const sourcesKey = (filter === "all" ? sources : [filter]).join(",");
  const results = useMemo(
    () => searchIcons(deferredQuery, sourcesKey.split(",") as IconSource[]),
    [deferredQuery, sourcesKey, tagsVersion],
  );
  // The visible count resets whenever the search or icon set changes.
  const searchKey = `${deferredQuery}|${sourcesKey}`;
  const [page, setPage] = useState({ key: searchKey, limit: maxResults });
  const limit = page.key === searchKey ? page.limit : maxResults;
  const shown = results.slice(0, limit);
  const hasMore = results.length > shown.length;

  // After "Load more", move focus to the first new icon (the button may disappear).
  const focusAfterLoad = useRef<number | null>(null);
  useEffect(() => {
    if (focusAfterLoad.current === null) return;
    cellRefs.current[focusAfterLoad.current]?.focus();
    focusAfterLoad.current = null;
  }, [limit]);
  const showMore = () => {
    focusAfterLoad.current = shown.length;
    setPage({ key: searchKey, limit: limit + maxResults });
  };

  const focusCell = (i: number) => cellRefs.current[Math.max(0, Math.min(i, shown.length - 1))]?.focus();

  const onInputKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" && shown.length) {
      e.preventDefault();
      focusCell(0);
    } else if (e.key === "Enter" && shown.length) {
      e.preventDefault();
      onSelect(shown[0].name);
    }
  };

  const onCellKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const moves: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: columns, ArrowUp: -columns };
    const step = moves[e.key];
    if (step === undefined) return;
    e.preventDefault();
    if (i + step < 0) inputRef.current?.focus();
    else focusCell(i + step);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="input input-sm w-full">
        <Search className="size-4 opacity-60" aria-hidden />
        <input
          ref={inputRef}
          type="search"
          placeholder="Search icons…"
          aria-label="Search icons"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onInputKey}
        />
      </label>

      {sources.length > 1 && (
        <div className="join" role="group" aria-label="Icon set">
          {(["all", ...sources] as const).map((s) => (
            <button
              key={s}
              type="button"
              className={cx("btn btn-xs join-item", filter === s && "btn-active")}
              aria-pressed={filter === s}
              onClick={() => setFilter(s)}
            >
              {s === "all" ? "All" : s === "lucide" ? "Lucide" : "Lab"}
            </button>
          ))}
        </div>
      )}

      {shown.length ? (
        <div
          className="grid max-h-64 gap-1 overflow-y-auto"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {shown.map(({ name }, i) => (
            <button
              key={name}
              ref={(el) => {
                cellRefs.current[i] = el;
              }}
              type="button"
              title={name}
              aria-label={name}
              aria-pressed={name === value}
              className={cx("btn btn-square btn-sm", name === value ? "btn-primary" : "btn-ghost")}
              onClick={() => onSelect(name)}
              onKeyDown={(e) => onCellKey(e, i)}
            >
              <DynamicIcon name={name} className="size-5" aria-hidden fallback={CellPlaceholder} />
            </button>
          ))}
          {loadMore && hasMore && (
            <button type="button" className="btn btn-ghost btn-sm col-span-full mt-1" onClick={showMore}>
              Load {Math.min(maxResults, results.length - shown.length)} more
            </button>
          )}
        </div>
      ) : (
        <p className="py-6 text-center text-sm opacity-70">No icons match “{query}”.</p>
      )}

      <div className="flex items-center justify-between gap-2 text-xs opacity-70">
        <span aria-live="polite">
          {hasMore
            ? `Showing ${shown.length} of ${results.length}.${loadMore ? "" : " Keep typing to narrow."}`
            : `${results.length} icon${results.length === 1 ? "" : "s"}`}
        </span>
        {clearable && value && (
          <button type="button" className="btn btn-ghost btn-xs" onClick={() => onSelect(null)}>
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Picker ─────────────────────────────────────────────────────────────────

interface IconPickerProps {
  /** Selected icon's kebab-case name, e.g. "apple-core". Render it with DynamicIcon. */
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (name: string | null) => void;
  /** Which icon sets to offer. Default: both. */
  sources?: IconSource[];
  label?: string;
  hint?: string;
  error?: string;
  placeholder?: string;
  clearable?: boolean;
  /** Render the search panel directly instead of behind a button. */
  inline?: boolean;
  /** Icons rendered at a time; also the "Load more" page size. Default 160. */
  maxResults?: number;
  /** Show a "Load more" button below the results. When false, the rest are only reachable by searching. Default true. */
  loadMore?: boolean;
  columns?: number;
  className?: string;
}

export function IconPicker({
  value: valueProp,
  defaultValue = null,
  onChange,
  sources = ["lucide", "lab"],
  label,
  hint,
  error,
  placeholder = "Choose an icon",
  clearable = true,
  inline = false,
  maxResults = 160,
  loadMore = true,
  columns = 8,
  className = "",
}: IconPickerProps) {
  const [internal, setInternal] = useState<string | null>(defaultValue);
  const [open, setOpen] = useState(false);
  const value = valueProp === undefined ? internal : valueProp;

  const select = (name: string | null) => {
    if (valueProp === undefined) setInternal(name);
    onChange?.(name);
    setOpen(false);
  };

  const panelProps = { value, onSelect: select, sources, clearable, maxResults, loadMore, columns };

  return (
    <Field label={label} error={error} hint={hint}>
      {inline ? (
        <div className={cx("card bg-base-100 border-base-300 w-80 border p-3", className)}>
          <IconPickerPanel {...panelProps} autoFocus={false} />
        </div>
      ) : (
        <Dropdown
          open={open}
          onOpenChange={setOpen}
          triggerVariant="outline"
          triggerClassName={cx("justify-between font-normal", error && "border-error")}
          className={className}
          trigger={
            <>
              <span className="flex items-center gap-2">
                {value && <DynamicIcon name={value as IconName} className="size-4" aria-hidden />}
                <span className={value ? undefined : "opacity-60"}>{value ?? placeholder}</span>
              </span>
              <ChevronDown className="size-4 opacity-60" aria-hidden />
            </>
          }
        >
          <div className="card bg-base-100 w-80 p-3 shadow-lg">
            <IconPickerPanel {...panelProps} autoFocus={open} />
          </div>
        </Dropdown>
      )}
    </Field>
  );
}
