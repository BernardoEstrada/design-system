import type { HTMLAttributes } from "react";
import { cx } from "../../utils/cx";

type LoadingType = "spinner" | "dots" | "ring" | "ball" | "bars" | "infinity";
type LoadingSize = "xs" | "sm" | "md" | "lg" | "xl";

interface LoadingProps extends HTMLAttributes<HTMLSpanElement> {
  type?: LoadingType;
  size?: LoadingSize;
  /** Accessible label read by screen readers. */
  label?: string;
}

const typeClasses: Record<LoadingType, string> = {
  spinner: "loading-spinner",
  dots: "loading-dots",
  ring: "loading-ring",
  ball: "loading-ball",
  bars: "loading-bars",
  infinity: "loading-infinity",
};

const sizeClasses: Record<LoadingSize, string> = {
  xs: "loading-xs",
  sm: "loading-sm",
  md: "loading-md",
  lg: "loading-lg",
  xl: "loading-xl",
};

export function Loading({ type = "spinner", size = "md", label = "Loading", className = "", ...props }: LoadingProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cx("loading", typeClasses[type], sizeClasses[size], className)}
      {...props}
    />
  );
}
