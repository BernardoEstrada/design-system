import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
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
  /** Controlled open state. Leave undefined to let the dropdown manage it. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerClassName?: string;
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

// DaisyUI aligns popovers with descendant selectors (`.dropdown-start .dropdown-content`),
// so an outer dropdown's alignment also hits any dropdown nested inside it. Setting the
// alignment on the popover itself keeps nested dropdowns independent.
const alignStyles: Record<DropdownAlign, CSSProperties> = {
  start: { insetInlineStart: 0, insetInlineEnd: "auto", translate: "0" },
  center: { insetInlineStart: "auto", insetInlineEnd: "50%", translate: "50%" },
  end: { insetInlineStart: "auto", insetInlineEnd: 0, translate: "0" },
};

// Small gap between the trigger and the popover, on the side it opens toward.
const gapClasses: Record<DropdownPosition, string> = {
  bottom: "mt-1",
  top: "mb-1",
  left: "mr-1",
  right: "ml-1",
};

// With customizable selects (appearance: base-select), Esc that closes an open
// select list also reaches the page. It belongs to the select, not the dropdown.
// Focus is usually on the highlighted <option>, so look up its <select>.
function isOpenSelect(target: EventTarget | null): boolean {
  const select = target instanceof Element ? target.closest("select") : null;
  if (!select) return false;
  try {
    return select.matches(":open");
  } catch {
    return false; // no :open support means no customizable select, so Esc never gets here
  }
}

export function Dropdown({
  trigger,
  triggerVariant = "neutral",
  items,
  children,
  position = "bottom",
  align = "start",
  open: openProp,
  onOpenChange,
  triggerClassName,
  className = "",
}: DropdownProps) {
  const [openState, setOpenState] = useState(false);
  const open = openProp ?? openState;
  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) setOpenState(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    // Esc pressed inside the dropdown is handled by onKeyDown below, so nested
    // dropdowns close one at a time. This catches Esc with focus elsewhere.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isOpenSelect(e.target) && !root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  return (
    <div
      ref={root}
      onKeyDown={(e) => {
        // The innermost open dropdown handles Esc and marks it handled for the ones around it.
        if (e.key !== "Escape" || !open || e.defaultPrevented || isOpenSelect(e.target)) return;
        e.preventDefault();
        setOpen(false);
        root.current?.querySelector<HTMLButtonElement>(":scope > button")?.focus();
      }}
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
        className={triggerClassName}
        onClick={() => setOpen(!open)}
      >
        {trigger}
      </Button>
      <div
        className={cx("dropdown-content z-10", gapClasses[position])}
        // Left/right popovers are positioned by their side classes alone.
        style={position === "top" || position === "bottom" ? alignStyles[align] : undefined}
      >
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
