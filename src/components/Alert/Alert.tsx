import type { HTMLAttributes, ReactNode } from "react";
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "lucide-react";
import { cx } from "../../utils/cx";

export type AlertVariant = "info" | "success" | "warning" | "error";
type AlertStyle = "solid" | "soft" | "outline" | "dash";

interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "style"> {
  variant?: AlertVariant;
  appearance?: AlertStyle;
  title?: ReactNode;
  /** Replace the default icon, or pass `null` to hide it. */
  icon?: ReactNode | null;
  actions?: ReactNode;
  /** Shows a close button when set. */
  onClose?: () => void;
}

const variantClasses: Record<AlertVariant, string> = {
  info: "alert-info",
  success: "alert-success",
  warning: "alert-warning",
  error: "alert-error",
};

const appearanceClasses: Record<AlertStyle, string> = {
  solid: "",
  soft: "alert-soft",
  outline: "alert-outline",
  dash: "alert-dash",
};

const defaultIcons: Record<AlertVariant, ReactNode> = {
  info: <Info className="size-5 shrink-0" aria-hidden />,
  success: <CircleCheck className="size-5 shrink-0" aria-hidden />,
  warning: <TriangleAlert className="size-5 shrink-0" aria-hidden />,
  error: <CircleAlert className="size-5 shrink-0" aria-hidden />,
};

export function Alert({
  variant = "info",
  appearance = "solid",
  title,
  icon,
  actions,
  onClose,
  className = "",
  children,
  ...props
}: AlertProps) {
  const shownIcon = icon === undefined ? defaultIcons[variant] : icon;
  return (
    <div
      role={variant === "error" || variant === "warning" ? "alert" : "status"}
      className={cx("alert", variantClasses[variant], appearanceClasses[appearance], className)}
      {...props}
    >
      {shownIcon}
      <div>
        {title && <h3 className="font-bold">{title}</h3>}
        {children && <div className={title ? "text-sm" : undefined}>{children}</div>}
      </div>
      {(actions || onClose) && (
        <div className="flex items-center gap-2">
          {actions}
          {onClose && (
            <button
              type="button"
              className="btn btn-ghost btn-sm btn-circle"
              // Inherit the alert text color; app themes otherwise tint ghost buttons gray.
              style={{ color: "inherit" }}
              aria-label="Close"
              onClick={onClose}
            >
              <X className="size-4" aria-hidden />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
