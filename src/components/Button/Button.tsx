import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "accent" | "ghost" | "outline" | "neutral";
type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  wide?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  wide = false,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  const variantClass = variant !== "neutral" ? `btn-${variant}` : "";
  const sizeClass = size !== "md" ? `btn-${size}` : "";
  const classes = ["btn", variantClass, sizeClass, wide ? "btn-wide" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading && <span className="loading loading-spinner" />}
      {children}
    </button>
  );
}
