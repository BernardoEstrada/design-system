import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  actions?: ReactNode;
  compact?: boolean;
}

export function Card({ title, actions, compact = false, className = "", children, ...props }: CardProps) {
  return (
    <div className={["card bg-base-100 shadow", compact ? "card-compact" : "", className].filter(Boolean).join(" ")} {...props}>
      <div className="card-body">
        {title && <h2 className="card-title">{title}</h2>}
        {children}
        {actions && <div className="card-actions justify-end">{actions}</div>}
      </div>
    </div>
  );
}
