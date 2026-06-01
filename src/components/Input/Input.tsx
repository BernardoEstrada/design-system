import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, className = "", id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <fieldset className="fieldset">
      {label && <label className="fieldset-label" htmlFor={inputId}>{label}</label>}
      <input
        id={inputId}
        className={["input", error ? "input-error" : "", className].filter(Boolean).join(" ")}
        {...props}
      />
      {error && <p className="fieldset-label text-error">{error}</p>}
      {!error && hint && <p className="fieldset-label">{hint}</p>}
    </fieldset>
  );
}
