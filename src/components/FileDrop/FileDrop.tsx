import { useId, useRef, useState, type DragEvent, type ReactNode } from "react";
import { Upload } from "lucide-react";
import { cx } from "../../utils/cx";

interface FileDropProps {
  /** Called with the chosen files (one file unless `multiple`). */
  onFiles: (files: File[]) => void;
  /** Same syntax as <input accept>, e.g. "image/png" or ".png,.jpg". Also filters dropped files. */
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  label?: string;
  /** Main prompt inside the zone. */
  prompt?: ReactNode;
  hint?: string;
  error?: string;
  /** Replaces the prompt, e.g. a preview of the current file. */
  children?: ReactNode;
  className?: string;
}

function matchesAccept(file: File, accept?: string): boolean {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  return accept
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
    .some((rule) => {
      if (rule.startsWith(".")) return name.endsWith(rule);
      if (rule.endsWith("/*")) return file.type.startsWith(rule.slice(0, -1));
      return file.type === rule;
    });
}

/** Click-or-drop zone for files. Keyboard accessible (it is a button); rejects files that don't match `accept`. */
export function FileDrop({
  onFiles,
  accept,
  multiple = false,
  disabled = false,
  label,
  prompt,
  hint,
  error,
  children,
  className,
}: FileDropProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const [over, setOver] = useState(false);
  const [rejected, setRejected] = useState<string | null>(null);

  const take = (list: FileList | null) => {
    const files = Array.from(list ?? []);
    if (!files.length) return;
    const ok = files.filter((f) => matchesAccept(f, accept));
    if (ok.length !== files.length) setRejected(`Unsupported file type${accept ? ` (expected ${accept})` : ""}.`);
    else setRejected(null);
    if (ok.length) onFiles(multiple ? ok : ok.slice(0, 1));
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    if (!disabled) take(e.dataTransfer.files);
  };

  const message = error ?? rejected;
  return (
    <fieldset className="fieldset">
      {label && (
        <label className="fieldset-label" htmlFor={id}>
          {label}
        </label>
      )}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        aria-invalid={message ? true : undefined}
        className={cx(
          "flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-box border-2 border-dashed p-6 text-center text-sm transition-colors",
          over ? "border-primary bg-primary/10" : "border-base-300 hover:border-primary/60 hover:bg-base-200",
          message && "border-error",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
      >
        {children ?? (
          <>
            <Upload className="size-6 opacity-60" aria-hidden />
            <span>{prompt ?? (multiple ? "Drop files here or click to choose" : "Drop a file here or click to choose")}</span>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        hidden
        accept={accept}
        multiple={multiple}
        onChange={(e) => {
          take(e.target.files);
          e.target.value = "";
        }}
      />
      {message && <p className="fieldset-label text-error">{message}</p>}
      {!message && hint && <p className="fieldset-label">{hint}</p>}
    </fieldset>
  );
}
