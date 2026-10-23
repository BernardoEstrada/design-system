import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cx, idFromLabel } from "../../utils/cx";
import { Field } from "../Field/Field";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, className = "", id, ...props },
  ref,
) {
  const textareaId = idFromLabel(id, label);
  return (
    <Field label={label} htmlFor={textareaId} error={error} hint={hint}>
      <textarea
        ref={ref}
        id={textareaId}
        className={cx("textarea", error && "textarea-error", className)}
        aria-invalid={error ? true : undefined}
        {...props}
      />
    </Field>
  );
});
