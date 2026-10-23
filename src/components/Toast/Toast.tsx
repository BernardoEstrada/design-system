import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cx } from "../../utils/cx";
import { Alert, type AlertVariant } from "../Alert/Alert";

type ToastVertical = "top" | "middle" | "bottom";
type ToastHorizontal = "start" | "center" | "end";

export interface ToastOptions {
  title?: ReactNode;
  message?: ReactNode;
  variant?: AlertVariant;
  /** Milliseconds before auto-dismiss. 0 keeps it open until closed. Default 4000. */
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: number;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const verticalClasses: Record<ToastVertical, string> = {
  top: "toast-top",
  middle: "toast-middle",
  bottom: "toast-bottom",
};

const horizontalClasses: Record<ToastHorizontal, string> = {
  start: "toast-start",
  center: "toast-center",
  end: "toast-end",
};

interface ToastProviderProps {
  children: ReactNode;
  vertical?: ToastVertical;
  horizontal?: ToastHorizontal;
}

/** Wrap your app once, then call `useToast().toast({...})` anywhere below it. */
export function ToastProvider({ children, vertical = "bottom", horizontal = "end" }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((ts) => ts.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ duration = 4000, ...options }: ToastOptions) => {
      const id = nextId.current++;
      setToasts((ts) => [...ts, { id, duration, ...options }]);
      if (duration > 0) timers.current.set(id, setTimeout(() => dismiss(id), duration));
      return id;
    },
    [dismiss],
  );

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toasts.length > 0 && (
        <div className={cx("toast z-50", verticalClasses[vertical], horizontalClasses[horizontal])}>
          {toasts.map((t) => (
            <Alert key={t.id} variant={t.variant} title={t.title} onClose={() => dismiss(t.id)}>
              {t.message}
            </Alert>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
