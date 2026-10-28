import { useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { Ban, Check } from "lucide-react";
import { cx } from "../../utils/cx";
import { Dropdown } from "../Dropdown/Dropdown";
import { Field } from "../Field/Field";

export interface ColorPreset {
  /** Any CSS color, e.g. "#ef4444" or "var(--color-primary)". */
  value: string;
  label: string;
}

export const defaultColorPresets: ColorPreset[] = [
  { value: "#ef4444", label: "Red" },
  { value: "#f97316", label: "Orange" },
  { value: "#f59e0b", label: "Amber" },
  { value: "#eab308", label: "Yellow" },
  { value: "#84cc16", label: "Lime" },
  { value: "#22c55e", label: "Green" },
  { value: "#14b8a6", label: "Teal" },
  { value: "#06b6d4", label: "Cyan" },
  { value: "#3b82f6", label: "Blue" },
  { value: "#6366f1", label: "Indigo" },
  { value: "#8b5cf6", label: "Violet" },
  { value: "#ec4899", label: "Pink" },
  { value: "#64748b", label: "Slate" },
];

/**
 * - `long`: every preset visible, plus the color wheel
 * - `sm`: a swatch button that opens the presets in a popover
 * - `md`: a field-style button (swatch + value) that opens the presets and a hex input
 */
export type ColorPickerSize = "long" | "sm" | "md";

interface ColorPickerProps {
  /** A CSS color, or null for none. */
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (color: string | null) => void;
  /** Preset colors. Strings use the color itself as the label. */
  presets?: Array<ColorPreset | string>;
  /** Offer the color wheel (and, in `md`, a hex input) for colors outside the presets. Default true. */
  allowCustom?: boolean;
  /** Offer a "none" option, which sets the value to null. Default false. */
  allowNone?: boolean;
  size?: ColorPickerSize;
  /** Popover alignment for `sm` and `md`. Use "end" when the picker sits at the right edge. Default "start". */
  align?: "start" | "center" | "end";
  /** Which side the popover opens on for `sm` and `md`. Default "bottom". */
  position?: "bottom" | "top";
  label?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  /** Accessible name when there's no visible label. Default "Color". */
  "aria-label"?: string;
  className?: string;
}

const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;
const normalizeHex = (s: string) => {
  const h = s.trim().replace(/^#/, "").toLowerCase();
  return `#${h.length === 3 ? [...h].map((c) => c + c).join("") : h}`;
};

// A conic gradient reads as a color wheel at swatch size.
const wheelStyle: CSSProperties = {
  background: "conic-gradient(#ef4444, #eab308, #22c55e, #06b6d4, #3b82f6, #8b5cf6, #ec4899, #ef4444)",
};

function Swatch({
  color,
  label,
  selected,
  onSelect,
  tabIndex,
  onKeyDown,
}: {
  color: string | null;
  label: string;
  selected: boolean;
  onSelect: () => void;
  tabIndex: number;
  onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={label}
      title={label}
      tabIndex={tabIndex}
      data-swatch
      onClick={onSelect}
      onKeyDown={onKeyDown}
      className={cx(
        "border-base-content/20 relative grid size-7 shrink-0 cursor-pointer place-items-center rounded-full border",
        "focus-visible:outline-base-content focus-visible:outline-2 focus-visible:outline-offset-2",
        selected && "ring-base-content ring-offset-base-100 ring-2 ring-offset-2",
        color === null && "bg-base-100",
      )}
      style={color === null ? undefined : { backgroundColor: color }}
    >
      {color === null ? (
        <Ban className="text-base-content/60 size-4" aria-hidden />
      ) : (
        selected && <Check className="size-4 text-white drop-shadow-[0_0_1.5px_rgb(0_0_0/0.9)]" aria-hidden />
      )}
    </button>
  );
}

interface SwatchesProps {
  value: string | null;
  presets: ColorPreset[];
  allowCustom: boolean;
  allowNone: boolean;
  onPick: (color: string | null, done: boolean) => void;
  showHexInput: boolean;
  className?: string;
  ariaLabel: string;
}

/** The swatch row/grid shared by every size. */
function Swatches({ value, presets, allowCustom, allowNone, onPick, showHexInput, className, ariaLabel }: SwatchesProps) {
  const groupRef = useRef<HTMLDivElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const hexId = useId();
  const [hex, setHex] = useState("");

  const options: Array<{ color: string | null; label: string }> = [
    ...(allowNone ? [{ color: null, label: "None" }] : []),
    ...presets.map((p) => ({ color: p.value, label: p.label })),
  ];
  const isPreset = value !== null && presets.some((p) => p.value.toLowerCase() === value.toLowerCase());
  const isCustom = value !== null && !isPreset;
  const selectedIndex = options.findIndex(
    (o) => (o.color === null ? value === null : value !== null && o.color.toLowerCase() === value.toLowerCase()),
  );

  // Arrow keys move focus between swatches (roving tabindex); Enter/Space selects.
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const items = [...(groupRef.current?.querySelectorAll<HTMLButtonElement>("[data-swatch]") ?? [])];
    const i = items.indexOf(e.currentTarget);
    items[(i + step + items.length) % items.length]?.focus();
  };

  const openWheel = () => {
    const input = colorInputRef.current;
    if (!input) return;
    try {
      input.showPicker();
    } catch {
      input.click();
    }
  };

  const applyHex = () => {
    if (HEX.test(hex)) {
      onPick(normalizeHex(hex), true);
      setHex("");
    }
  };

  return (
    <div className={cx("flex flex-col gap-3", className)}>
      <div ref={groupRef} role="radiogroup" aria-label={ariaLabel} className="flex flex-wrap items-center gap-2">
        {options.map((o, i) => (
          <Swatch
            key={o.color ?? "none"}
            color={o.color}
            label={o.label}
            selected={i === selectedIndex}
            tabIndex={i === Math.max(selectedIndex, 0) ? 0 : -1}
            onSelect={() => onPick(o.color, true)}
            onKeyDown={onKeyDown}
          />
        ))}
        {allowCustom && (
          <span className="relative">
            <button
              type="button"
              aria-label={isCustom ? `Custom color ${value}` : "Custom color"}
              title="Custom color"
              aria-pressed={isCustom}
              onClick={openWheel}
              className={cx(
                "border-base-content/20 grid size-7 cursor-pointer place-items-center rounded-full border",
                "focus-visible:outline-base-content focus-visible:outline-2 focus-visible:outline-offset-2",
                isCustom && "ring-base-content ring-offset-base-100 ring-2 ring-offset-2",
              )}
              style={wheelStyle}
            >
              {isCustom && (
                <span className="border-base-100 size-3.5 rounded-full border-2" style={{ backgroundColor: value }} />
              )}
            </button>
            {/* Native color dialog, opened by the wheel. Live updates while dragging. */}
            <input
              ref={colorInputRef}
              type="color"
              tabIndex={-1}
              aria-hidden
              className="pointer-events-none absolute inset-0 size-full opacity-0"
              value={value && HEX.test(value) ? normalizeHex(value) : "#000000"}
              onChange={(e) => onPick(e.target.value, false)}
            />
          </span>
        )}
      </div>

      {showHexInput && allowCustom && (
        <label className="input input-sm w-full" htmlFor={hexId}>
          <span className="opacity-60">#</span>
          <input
            id={hexId}
            aria-label="Hex color"
            placeholder={value && HEX.test(value) ? normalizeHex(value).slice(1) : "rrggbb"}
            value={hex}
            maxLength={7}
            onChange={(e) => setHex(e.target.value)}
            onBlur={applyHex}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyHex();
              }
            }}
          />
        </label>
      )}
    </div>
  );
}

export function ColorPicker({
  value: valueProp,
  defaultValue = null,
  onChange,
  presets = defaultColorPresets,
  allowCustom = true,
  allowNone = false,
  size = "long",
  align = "start",
  position = "bottom",
  label,
  hint,
  error,
  disabled = false,
  "aria-label": ariaLabel,
  className = "",
}: ColorPickerProps) {
  const [internal, setInternal] = useState<string | null>(defaultValue);
  const [open, setOpen] = useState(false);
  const value = valueProp === undefined ? internal : valueProp;
  const name = label ?? ariaLabel ?? "Color";

  const normalized = presets.map((p) => (typeof p === "string" ? { value: p, label: p } : p));

  // `done` closes the popover: true for presets and typed hex, false while dragging in the wheel.
  const pick = (color: string | null, done: boolean) => {
    if (valueProp === undefined) setInternal(color);
    onChange?.(color);
    if (done) setOpen(false);
  };

  const swatchProps = { value, presets: normalized, allowCustom, allowNone, onPick: pick, ariaLabel: name };

  let picker;
  if (size === "long") {
    picker = (
      <fieldset disabled={disabled} className={cx("contents", disabled && "opacity-50")}>
        <Swatches {...swatchProps} showHexInput={false} className={className} />
      </fieldset>
    );
  } else {
    const swatch = (
      <span
        className={cx(
          "border-base-content/20 grid size-5 shrink-0 place-items-center rounded-full border",
          value === null && "bg-base-100",
        )}
        style={value === null ? undefined : { backgroundColor: value }}
        aria-hidden
      >
        {value === null && <Ban className="text-base-content/60 size-3" />}
      </span>
    );
    picker = (
      <Dropdown
        open={open && !disabled}
        onOpenChange={(o) => !disabled && setOpen(o)}
        triggerVariant={size === "sm" ? "ghost" : "outline"}
        align={align}
        position={position}
        triggerClassName={cx(
          size === "sm" ? "btn-sm btn-square" : "justify-start font-normal",
          error && "border-error",
          disabled && "btn-disabled",
        )}
        className={className}
        trigger={
          size === "sm" ? (
            <>
              {swatch}
              <span className="sr-only">
                {name}: {value ?? "none"}
              </span>
            </>
          ) : (
            <>
              {swatch}
              <span className={cx("font-mono text-sm", value === null && "opacity-60")}>{value ?? "None"}</span>
            </>
          )
        }
      >
        <div className="card bg-base-100 w-60 p-3 shadow-lg">
          <Swatches {...swatchProps} showHexInput={size === "md"} />
        </div>
      </Dropdown>
    );
  }

  if (!label && !hint && !error) return picker;
  return (
    <Field label={label} hint={hint} error={error}>
      {picker}
    </Field>
  );
}
