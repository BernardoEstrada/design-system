import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../utils/cx";

type ToggleVariant = "primary" | "secondary" | "accent" | "success" | "warning" | "info" | "error" | "neutral";
type ToggleSize = "xs" | "sm" | "md" | "lg";

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: ReactNode;
  variant?: ToggleVariant;
  size?: ToggleSize;
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
  { label, variant = "primary", size = "md", className = "", ...props },
  ref,
) {
  const input = (
    <input
      ref={ref}
      type="checkbox"
      className={cx("toggle", variantClasses[variant], sizeClasses[size], className)}
      {...props}
    />
  );
  if (!label) return input;
  return (
    <label className="label cursor-pointer gap-2">
      {input}
      <span>{label}</span>
    </label>
  );
});
