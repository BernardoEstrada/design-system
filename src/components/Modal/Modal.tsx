import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cx } from "../../utils/cx";

type ModalPosition = "middle" | "top" | "bottom";

interface ModalProps {
  open: boolean;
  /** Called on Esc, backdrop click, or the close button. */
  onClose: () => void;
  title?: ReactNode;
  actions?: ReactNode;
  position?: ModalPosition;
  /** Hide the corner close button. */
  hideCloseButton?: boolean;
  /** Ignore backdrop clicks (Esc still closes). */
  persistent?: boolean;
  className?: string;
  children?: ReactNode;
}

const positionClasses: Record<ModalPosition, string> = {
  middle: "modal-middle",
  top: "modal-top",
  bottom: "modal-bottom",
};

/** Controlled modal built on the native <dialog>, so focus trapping and Esc come for free. */
export function Modal({
  open,
  onClose,
  title,
  actions,
  position = "middle",
  hideCloseButton = false,
  persistent = false,
  className = "",
  children,
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={cx("modal", positionClasses[position])}
      aria-labelledby={title ? titleId : undefined}
      onCancel={(e) => {
        // Keep React state as the source of truth instead of letting the dialog close itself.
        e.preventDefault();
        onClose();
      }}
    >
      <div className={cx("modal-box", className)}>
        {!hideCloseButton && (
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            aria-label="Close"
            onClick={onClose}
          >
            <X className="size-4" aria-hidden />
          </button>
        )}
        {title && (
          <h3 id={titleId} className="text-lg font-bold">
            {title}
          </h3>
        )}
        {children && <div className={title ? "py-4" : undefined}>{children}</div>}
        {actions && <div className="modal-action">{actions}</div>}
      </div>
      <div className="modal-backdrop" onClick={persistent ? undefined : onClose} aria-hidden />
    </dialog>
  );
}
