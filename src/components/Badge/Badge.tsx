import type { HTMLAttributes } from "react";

type BadgeVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "neutral"
  | "ghost"
  | "outline";
type BadgeSize = "xs" | "sm" | "md" | "lg";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: "badge-primary",
  secondary: "badge-secondary",
  accent: "badge-accent",
  success: "badge-success",
  error: "badge-error",
  warning: "badge-warning",
  info: "badge-info",
  neutral: "badge-neutral",
  ghost: "badge-ghost",
  outline: "badge-outline",
};

const sizeClasses: Record<Exclude<BadgeSize, "md">, string> = {
  xs: "badge-xs",
  sm: "badge-sm",
  lg: "badge-lg",
};

export function Badge({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: BadgeProps) {
  const variantClass = variantClasses[variant];
  const sizeClass = size !== "md" ? sizeClasses[size] : "";
  const classes = ["badge", variantClass, sizeClass, className]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
