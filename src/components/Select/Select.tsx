import { forwardRef, type SelectHTMLAttributes } from "react";
import { cx, idFromLabel } from "../../utils/cx";
import { Field } from "../Field/Field";

type SelectSize = "xs" | "sm" | "md" | "lg";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  error?: string;
  hint?: string;
  size?: SelectSize;
  /** Shorthand for simple lists. Pass <option> children instead for full control. */
  options?: SelectOption[];
  placeholder?: string;
}

const sizeClasses: Record<SelectSize, string> = {
  xs: "select-xs",
  sm: "select-sm",
  md: "",
  lg: "select-lg",
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, hint, size = "md", options, placeholder, className = "", id, children, ...props },
  ref,
) {
  const selectId = idFromLabel(id, label);
  return (
    <Field label={label} htmlFor={selectId} error={error} hint={hint}>
      <select
        ref={ref}
        id={selectId}
        className={cx("select", sizeClasses[size], error && "select-error", className)}
        aria-invalid={error ? true : undefined}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options?.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </option>
        ))}
        {children}
      </select>
    </Field>
  );
});
