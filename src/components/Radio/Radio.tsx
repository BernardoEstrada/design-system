import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../utils/cx";

type RadioVariant = "primary" | "secondary" | "accent" | "success" | "warning" | "info" | "error" | "neutral";
type RadioSize = "xs" | "sm" | "md" | "lg";

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: ReactNode;
  variant?: RadioVariant;
  size?: RadioSize;
}

const variantClasses: Record<RadioVariant, string> = {
  primary: "radio-primary",
  secondary: "radio-secondary",
  accent: "radio-accent",
  success: "radio-success",
  warning: "radio-warning",
  info: "radio-info",
  error: "radio-error",
  neutral: "radio-neutral",
};

const sizeClasses: Record<RadioSize, string> = {
  xs: "radio-xs",
  sm: "radio-sm",
  md: "",
  lg: "radio-lg",
};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, variant = "primary", size = "md", className = "", ...props },
  ref,
) {
  const input = (
    <input
      ref={ref}
      type="radio"
      className={cx("radio", variantClasses[variant], sizeClasses[size], className)}
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
