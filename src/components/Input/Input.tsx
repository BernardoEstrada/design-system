import { forwardRef, type InputHTMLAttributes } from "react";
import { cx, idFromLabel } from "../../utils/cx";
import { Field } from "../Field/Field";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, className = "", id, ...props },
  ref,
) {
  const inputId = idFromLabel(id, label);
  return (
    <Field label={label} htmlFor={inputId} error={error} hint={hint}>
      <input
        ref={ref}
        id={inputId}
        className={cx("input", error && "input-error", className)}
        aria-invalid={error ? true : undefined}
        {...props}
      />
    </Field>
  );
});
