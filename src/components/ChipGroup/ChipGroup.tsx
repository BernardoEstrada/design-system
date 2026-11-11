import type { ReactNode } from "react";
import { cx } from "../../utils/cx";

export interface ChipOption {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  /** Small trailing text, e.g. a count. */
  meta?: ReactNode;
  disabled?: boolean;
}

type ChipVariant = "primary" | "secondary" | "accent" | "neutral";
type ChipSize = "xs" | "sm" | "md";

interface ChipGroupProps {
  options: ChipOption[];
  /** Selected values. */
  value: string[];
  onChange: (value: string[]) => void;
  /** Single-select: clicking a chip selects only it (clicking it again clears it unless `required`). */
  single?: boolean;
  /** With `single`, keep one chip selected at all times. */
  required?: boolean;
  variant?: ChipVariant;
  size?: ChipSize;
  /** Accessible name for the group. */
  "aria-label"?: string;
  className?: string;
}

const selectedClasses: Record<ChipVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  accent: "btn-accent",
  neutral: "btn-neutral",
};

const sizeClasses: Record<ChipSize, string> = { xs: "btn-xs", sm: "btn-sm", md: "" };

/** A wrap of toggleable pill buttons for picking one or several values (filters, bundles, tags). */
export function ChipGroup({
  options,
  value,
  onChange,
  single = false,
  required = false,
  variant = "primary",
  size = "sm",
  className,
  ...aria
}: ChipGroupProps) {
  const selected = new Set(value);
  const toggle = (v: string) => {
    if (single) {
      if (selected.has(v)) {
        if (!required) onChange([]);
      } else onChange([v]);
      return;
    }
    onChange(selected.has(v) ? value.filter((x) => x !== v) : [...value, v]);
  };
  return (
    <div role="group" className={cx("flex flex-wrap gap-2", className)} {...aria}>
      {options.map((o) => {
        const on = selected.has(o.value);
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            disabled={o.disabled}
            onClick={() => toggle(o.value)}
            className={cx("btn rounded-full", sizeClasses[size], on ? selectedClasses[variant] : "btn-outline")}
          >
            {o.icon}
            {o.label}
            {o.meta !== undefined && <span className="opacity-70 font-normal">{o.meta}</span>}
          </button>
        );
      })}
    </div>
  );
}
