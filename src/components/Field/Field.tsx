import type { ReactNode } from "react";

interface FieldProps {
  label?: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

/** Shared label / hint / error wrapper for text-like form controls. */
export function Field({ label, htmlFor, error, hint, children }: FieldProps) {
  return (
    <fieldset className="fieldset">
      {label && (
        <label className="fieldset-label" htmlFor={htmlFor}>
          {label}
        </label>
      )}
      {children}
      {error && <p className="fieldset-label text-error">{error}</p>}
      {!error && hint && <p className="fieldset-label">{hint}</p>}
    </fieldset>
  );
}
