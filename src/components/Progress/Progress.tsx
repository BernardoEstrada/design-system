import type { ProgressHTMLAttributes } from "react";
import { cx } from "../../utils/cx";

type ProgressVariant = "primary" | "secondary" | "accent" | "success" | "warning" | "info" | "error" | "neutral";

interface ProgressProps extends ProgressHTMLAttributes<HTMLProgressElement> {
  variant?: ProgressVariant;
  /** Leave undefined for an indeterminate bar. */
  value?: number;
  max?: number;
}

const variantClasses: Record<ProgressVariant, string> = {
  primary: "progress-primary",
  secondary: "progress-secondary",
  accent: "progress-accent",
  success: "progress-success",
  warning: "progress-warning",
  info: "progress-info",
  error: "progress-error",
  neutral: "progress-neutral",
};

export function Progress({ variant = "primary", value, max = 100, className = "", ...props }: ProgressProps) {
  return (
    <progress
      className={cx("progress w-full", variantClasses[variant], className)}
      value={value}
      max={max}
      {...props}
    />
  );
}
