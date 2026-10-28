import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "accent" | "ghost" | "outline" | "neutral";
type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  wide?: boolean;
  /** Equal width and height, for icon-only buttons. Give those an aria-label. */
  shape?: "square" | "circle";
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  accent: "btn-accent",
  ghost: "btn-ghost",
  outline: "btn-outline",
  neutral: "",
};

const shapeClasses = { square: "btn-square", circle: "btn-circle" } as const;

const sizeClasses: Record<Exclude<ButtonSize, "md">, string> = {
  xs: "btn-xs",
  sm: "btn-sm",
  lg: "btn-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  wide = false,
  shape,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  const variantClass = variantClasses[variant];
  const sizeClass = size !== "md" ? sizeClasses[size] : "";
  const classes = ["btn", variantClass, sizeClass, wide ? "btn-wide" : "", shape ? shapeClasses[shape] : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading && <span className="loading loading-spinner" />}
      {children}
    </button>
  );
}
