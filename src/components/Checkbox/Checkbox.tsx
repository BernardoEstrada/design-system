import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../utils/cx";

type CheckboxVariant = "primary" | "secondary" | "accent" | "success" | "warning" | "info" | "error" | "neutral";
type CheckboxSize = "xs" | "sm" | "md" | "lg";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: ReactNode;
  variant?: CheckboxVariant;
  size?: CheckboxSize;
}

const variantClasses: Record<CheckboxVariant, string> = {
  primary: "checkbox-primary",
  secondary: "checkbox-secondary",
  accent: "checkbox-accent",
  success: "checkbox-success",
  warning: "checkbox-warning",
  info: "checkbox-info",
  error: "checkbox-error",
  neutral: "checkbox-neutral",
};

const sizeClasses: Record<CheckboxSize, string> = {
  xs: "checkbox-xs",
  sm: "checkbox-sm",
  md: "",
  lg: "checkbox-lg",
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, variant = "primary", size = "md", className = "", ...props },
  ref,
) {
  const input = (
    <input
      ref={ref}
      type="checkbox"
      className={cx("checkbox", variantClasses[variant], sizeClasses[size], className)}
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
