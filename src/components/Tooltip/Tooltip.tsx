import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/cx";

type TooltipPosition = "top" | "bottom" | "left" | "right";
type TooltipVariant = "neutral" | "primary" | "secondary" | "accent" | "info" | "success" | "warning" | "error";

interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
  /** Tooltip text. */
  tip: string;
  position?: TooltipPosition;
  variant?: TooltipVariant;
  /** Force the tooltip to stay visible. */
  open?: boolean;
  children: ReactNode;
}

const positionClasses: Record<TooltipPosition, string> = {
  top: "tooltip-top",
  bottom: "tooltip-bottom",
  left: "tooltip-left",
  right: "tooltip-right",
};

const variantClasses: Record<TooltipVariant, string> = {
  neutral: "",
  primary: "tooltip-primary",
  secondary: "tooltip-secondary",
  accent: "tooltip-accent",
  info: "tooltip-info",
  success: "tooltip-success",
  warning: "tooltip-warning",
  error: "tooltip-error",
};

export function Tooltip({
  tip,
  position = "top",
  variant = "neutral",
  open = false,
  className = "",
  children,
  ...props
}: TooltipProps) {
  return (
    <div
      data-tip={tip}
      className={cx("tooltip", positionClasses[position], variantClasses[variant], open && "tooltip-open", className)}
      {...props}
    >
      {children}
    </div>
  );
}
