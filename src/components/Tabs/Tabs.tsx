import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cx } from "../../utils/cx";

type TabsVariant = "box" | "border" | "lift" | "plain";
type TabsSize = "xs" | "sm" | "md" | "lg";

export interface TabItem {
  id: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  items: TabItem[];
  /** Controlled active tab id. */
  value?: string;
  /** Initial tab id when uncontrolled. Defaults to the first tab. */
  defaultValue?: string;
  onChange?: (id: string) => void;
  variant?: TabsVariant;
  size?: TabsSize;
  className?: string;
}

const variantClasses: Record<TabsVariant, string> = {
  box: "tabs-box",
  border: "tabs-border",
  lift: "tabs-lift",
  plain: "",
};

const sizeClasses: Record<TabsSize, string> = {
  xs: "tabs-xs",
  sm: "tabs-sm",
  md: "",
  lg: "tabs-lg",
};

export function Tabs({
  items,
  value,
  defaultValue,
  onChange,
  variant = "border",
  size = "md",
  className = "",
}: TabsProps) {
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.id);
  const active = value ?? internal;
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const select = (id: string) => {
    if (value === undefined) setInternal(id);
    onChange?.(id);
  };

  // Arrow keys move between enabled tabs, following the WAI-ARIA tabs pattern.
  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    for (let i = 1; i <= items.length; i++) {
      const next = (index + step * i + items.length) % items.length;
      if (!items[next].disabled) {
        select(items[next].id);
        tabRefs.current[next]?.focus();
        return;
      }
    }
  };

  const activeItem = items.find((t) => t.id === active);

  return (
    <div className={className}>
      <div role="tablist" className={cx("tabs", variantClasses[variant], sizeClasses[size])}>
        {items.map((item, i) => {
          const selected = item.id === active;
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              disabled={item.disabled}
              className={cx("tab", selected && "tab-active", item.disabled && "tab-disabled")}
              onClick={() => select(item.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {activeItem && (
        <div
          role="tabpanel"
          id={`${baseId}-panel-${activeItem.id}`}
          aria-labelledby={`${baseId}-tab-${activeItem.id}`}
          className="pt-4"
        >
          {activeItem.content}
        </div>
      )}
    </div>
  );
}
