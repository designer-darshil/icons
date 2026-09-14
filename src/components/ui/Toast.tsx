import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toastVariants } from '@/lib/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Check, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/cn';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  action?: ToastAction;
}

export interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number, action?: ToastAction) => void;
  success: (message: string, action?: ToastAction) => void;
  error: (message: string, action?: ToastAction) => void;
  info: (message: string, action?: ToastAction) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const fallbackToast: ToastContextValue = {
  showToast: () => {},
  success: () => {},
  error: () => {},
  info: () => {},
};

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  return ctx || fallbackToast;
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const prefersReducedMotion = useReducedMotion();

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'success', duration = 3500, action?: ToastAction) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev, { id, message, type, action }]);

      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  const success = useCallback((message: string, action?: ToastAction) => showToast(message, 'success', 3500, action), [showToast]);
  const error = useCallback((message: string, action?: ToastAction) => showToast(message, 'error', 4000, action), [showToast]);
  const info = useCallback((message: string, action?: ToastAction) => showToast(message, 'info', 3500, action), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info }}>
      {children}

      {/* Floating Toast Notification Region */}
      <div
        role="status"
        aria-live="polite"
        aria-label="Notifications"
        className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              variants={prefersReducedMotion ? undefined : toastVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={cn(
                'pointer-events-auto flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-sm border shadow-modal text-xs font-mono select-none backdrop-blur-sm',
                toast.type === 'success' && 'bg-bg-elevated text-text-primary border-border-default',
                toast.type === 'error' && 'bg-bg-elevated text-status-error-text border-status-error-border',
                toast.type === 'info' && 'bg-bg-elevated text-text-primary border-border-default'
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                {toast.type === 'success' && (
                  <div className="w-4 h-4 rounded-3xs bg-accent/15 text-accent flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                )}
                {toast.type === 'error' && (
                  <div className="w-4 h-4 rounded-3xs bg-status-error-bg text-status-error flex items-center justify-center shrink-0">
                    <AlertCircle className="w-3 h-3" />
                  </div>
                )}
                {toast.type === 'info' && (
                  <div className="w-4 h-4 rounded-3xs bg-bg-secondary text-text-secondary flex items-center justify-center shrink-0">
                    <Info className="w-3 h-3" />
                  </div>
                )}
                <span className="truncate leading-tight text-[11px] text-text-primary font-sans">{toast.message}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {toast.action && (
                  <button
                    type="button"
                    onClick={() => {
                      toast.action?.onClick();
                      removeToast(toast.id);
                    }}
                    className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-bg-secondary hover:bg-bg-primary text-accent border border-border-default hover:border-accent transition-colors cursor-pointer"
                  >
                    {toast.action.label}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="p-1 text-text-tertiary hover:text-text-primary rounded-3xs transition-colors cursor-pointer"
                  aria-label="Dismiss notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
