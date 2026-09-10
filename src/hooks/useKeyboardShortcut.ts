import { useEffect } from "react";

export interface ShortcutOptions {
  key: string;
  metaKey?: boolean; // Cmd on Mac, Windows key
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  preventDefault?: boolean;
}

export function useKeyboardShortcut(
  options: ShortcutOptions | string,
  callback: (e: KeyboardEvent) => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input unless explicitly desired
      const isInput =
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        document.activeElement?.getAttribute("contenteditable") === "true";

      if (typeof options === "string") {
        if (options === "/" && isInput) return;
        if (e.key.toLowerCase() === options.toLowerCase()) {
          callback(e);
        }
        return;
      }

      const matchKey = e.key.toLowerCase() === options.key.toLowerCase();
      const matchMeta = options.metaKey === undefined || (e.metaKey || e.ctrlKey) === options.metaKey;
      const matchCtrl = options.ctrlKey === undefined || e.ctrlKey === options.ctrlKey;
      const matchAlt = options.altKey === undefined || e.altKey === options.altKey;
      const matchShift = options.shiftKey === undefined || e.shiftKey === options.shiftKey;

      if (matchKey && matchMeta && matchCtrl && matchAlt && matchShift) {
        if (options.preventDefault) {
          e.preventDefault();
        }
        callback(e);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [options, callback, enabled]);
}
