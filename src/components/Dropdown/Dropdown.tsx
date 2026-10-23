import { useEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "../../utils/cx";
import { Button } from "../Button/Button";

type DropdownPosition = "bottom" | "top" | "left" | "right";
type DropdownAlign = "start" | "center" | "end";

export interface DropdownItem {
  label: ReactNode;
  onSelect?: () => void;
  icon?: ReactNode;
  disabled?: boolean;
}

interface DropdownProps {
  /** Content of the trigger button. */
  trigger: ReactNode;
  triggerVariant?: "primary" | "secondary" | "accent" | "ghost" | "outline" | "neutral";
  items?: DropdownItem[];
  /** Custom menu content; used instead of `items`. */
  children?: ReactNode;
  position?: DropdownPosition;
  align?: DropdownAlign;
  className?: string;
}

const positionClasses: Record<DropdownPosition, string> = {
  bottom: "dropdown-bottom",
  top: "dropdown-top",
  left: "dropdown-left",
  right: "dropdown-right",
};

const alignClasses: Record<DropdownAlign, string> = {
  start: "dropdown-start",
  center: "dropdown-center",
  end: "dropdown-end",
};

export function Dropdown({
  trigger,
  triggerVariant = "neutral",
  items,
  children,
  position = "bottom",
  align = "start",
  className = "",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={root}
      className={cx(
        "dropdown",
        positionClasses[position],
        alignClasses[align],
        open ? "dropdown-open" : "dropdown-close",
        className,
      )}
    >
      <Button
        type="button"
        variant={triggerVariant}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {trigger}
      </Button>
      <div className="dropdown-content z-10 mt-1">
        {children ?? (
          <ul role="menu" className="menu bg-base-100 rounded-box w-52 p-2 shadow-sm">
            {items?.map((item, i) => (
              <li key={i} className={item.disabled ? "menu-disabled" : undefined}>
                <button
                  type="button"
                  role="menuitem"
                  disabled={item.disabled}
                  onClick={() => {
                    item.onSelect?.();
                    setOpen(false);
                  }}
                >
                  {item.icon}
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
