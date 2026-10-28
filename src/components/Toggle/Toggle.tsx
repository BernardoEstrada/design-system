import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../utils/cx";

type ToggleVariant = "primary" | "secondary" | "accent" | "success" | "warning" | "info" | "error" | "neutral";
type ToggleSize = "xs" | "sm" | "md" | "lg";

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: ReactNode;
  variant?: ToggleVariant;
  size?: ToggleSize;
  /** Icon shown in the switch when on, e.g. <Check />. */
  iconOn?: ReactNode;
  /** Icon shown in the switch when off, e.g. <X />. */
  iconOff?: ReactNode;
}

const variantClasses: Record<ToggleVariant, string> = {
  primary: "toggle-primary",
  secondary: "toggle-secondary",
  accent: "toggle-accent",
  success: "toggle-success",
  warning: "toggle-warning",
  info: "toggle-info",
  error: "toggle-error",
  neutral: "toggle-neutral",
};

const sizeClasses: Record<ToggleSize, string> = {
  xs: "toggle-xs",
  sm: "toggle-sm",
  md: "",
  lg: "toggle-lg",
};

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(function Toggle(
  { label, variant = "primary", size = "md", iconOn, iconOff, className = "", ...props },
  ref,
) {
  const classes = cx("toggle", variantClasses[variant], sizeClasses[size], className);
  // With icons, DaisyUI's toggle wraps the checkbox: the 2nd child shows when off,
  // the 3rd when on. A span (not a label) so it can sit inside the outer label.
  const input =
    iconOn || iconOff ? (
      <span className={classes}>
        <input ref={ref} type="checkbox" {...props} />
        {iconOff ?? <span />}
        {iconOn ?? <span />}
      </span>
    ) : (
      <input ref={ref} type="checkbox" className={classes} {...props} />
    );
  if (!label) return input;
  return (
    <label className="label cursor-pointer gap-2">
      {input}
      <span>{label}</span>
    </label>
  );
});
