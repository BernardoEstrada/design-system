import type { HTMLAttributes } from "react";

type BadgeVariant = "primary" | "secondary" | "accent" | "success" | "error" | "warning" | "info" | "neutral" | "ghost" | "outline";
type BadgeSize = "xs" | "sm" | "md" | "lg";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

export function Badge({ variant = "primary", size = "md", className = "", children, ...props }: BadgeProps) {
  const variantClass = `badge-${variant}`;
  const sizeClass = size !== "md" ? `badge-${size}` : "";
  const classes = ["badge", variantClass, sizeClass, className].filter(Boolean).join(" ");
  return <span className={classes} {...props}>{children}</span>;
}
