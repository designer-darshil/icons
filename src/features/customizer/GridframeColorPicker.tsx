import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { GRIDFRAME_PALETTE } from "@/types/customization";
import { cn } from "@/lib/cn";

export interface GridframeColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  disabled?: boolean;
  className?: string;
}

/* ───────── Color Math Utilities ───────── */

function hexToHsv(hex: string): { h: number; s: number; v: number } {
  const rgb = hexToRgb(hex);
  if (!rgb) return { h: 0, s: 0, v: 100 };
  const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + 6) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  const s = max === 0 ? 0 : (d / max) * 100;
  const v = max * 100;
  return { h, s, v };
}

function hsvToHex(h: number, s: number, v: number): string {
  const sn = s / 100, vn = v / 100;
  const c = vn * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = vn - c;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return null;
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

function isValidHex(v: string): boolean {
  return /^#[0-9a-f]{6}$/i.test(v);
}

function resolveColor(color: string): string {
  if (color === "currentColor") return "#F6F3EC";
  if (isValidHex(color)) return color;
  return "#F6F3EC";
}

/* ───────── Saturation/Value Field ───────── */

const SaturationField: React.FC<{
  hue: number;
  saturation: number;
  value: number;
  onChange: (s: number, v: number) => void;
}> = ({ hue, saturation, value, onChange }) => {
  const fieldRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const updateFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const rect = fieldRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
      onChange(x * 100, (1 - y) * 100);
    },
    [onChange]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      draggingRef.current = true;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      updateFromPointer(e.clientX, e.clientY);
    },
    [updateFromPointer]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingRef.current) return;
      e.preventDefault();
      updateFromPointer(e.clientX, e.clientY);
    },
    [updateFromPointer]
  );

  const handlePointerUp = useCallback(() => {
    draggingRef.current = false;
  }, []);

  const hueColor = hsvToHex(hue, 100, 100);

  return (
    <div
      ref={fieldRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="relative w-full h-[140px] rounded-lg cursor-crosshair touch-none select-none overflow-hidden border border-border-subtle"
      style={{ backgroundColor: hueColor }}
    >
      {/* White-to-transparent horizontal gradient */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #fff, transparent)" }} />
      {/* Transparent-to-black vertical gradient */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent, #000)" }} />

      {/* Picker Thumb */}
      <div
        className="absolute w-3.5 h-3.5 rounded-full border-2 border-white shadow-md pointer-events-none"
        style={{
          left: `${saturation}%`,
          top: `${100 - value}%`,
          transform: "translate(-50%, -50%)",
          boxShadow: "0 0 0 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)",
        }}
      />
    </div>
  );
};

/* ───────── Hue Slider ───────── */

const HueSlider: React.FC<{
  hue: number;
  onChange: (hue: number) => void;
}> = ({ hue, onChange }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const updateFromPointer = useCallback(
    (clientX: number) => {
      const rect = trackRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      onChange(x * 360);
    },
    [onChange]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      draggingRef.current = true;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      updateFromPointer(e.clientX);
    },
    [updateFromPointer]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingRef.current) return;
      e.preventDefault();
      updateFromPointer(e.clientX);
    },
    [updateFromPointer]
  );

  const handlePointerUp = useCallback(() => {
    draggingRef.current = false;
  }, []);

  return (
    <div
      ref={trackRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="relative w-full h-3 rounded-full cursor-pointer touch-none select-none"
      style={{
        background: "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
      }}
    >
      <div
        className="absolute top-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md pointer-events-none"
        style={{
          left: `${(hue / 360) * 100}%`,
          transform: "translate(-50%, -50%)",
          backgroundColor: hsvToHex(hue, 100, 100),
          boxShadow: "0 0 0 1px rgba(0,0,0,0.2), 0 1px 3px rgba(0,0,0,0.2)",
        }}
      />
    </div>
  );
};

/* ───────── Main Color Picker ───────── */

export const GridframeColorPicker: React.FC<GridframeColorPickerProps> = ({
  color,
  onChange,
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hexInput, setHexInput] = useState("");
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const popoverRef = useRef<HTMLDivElement>(null);

  const resolvedHex = resolveColor(color);
  const hsv = useMemo(() => hexToHsv(resolvedHex), [resolvedHex]);
  const [hue, setHue] = useState(hsv.h);
  const [sat, setSat] = useState(hsv.s);
  const [val, setVal] = useState(hsv.v);

  // Sync internal HSV when external color changes (e.g. from palette)
  useEffect(() => {
    const newHsv = hexToHsv(resolveColor(color));
    setHue(newHsv.h);
    setSat(newHsv.s);
    setVal(newHsv.v);
    setHexInput(resolveColor(color));
  }, [color]);

  // Sync hex input display
  useEffect(() => {
    setHexInput(resolvedHex);
  }, [resolvedHex]);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const handleSatValChange = useCallback(
    (s: number, v: number) => {
      setSat(s);
      setVal(v);
      const newHex = hsvToHex(hue, s, v);
      onChange(newHex);
    },
    [hue, onChange]
  );

  const handleHueChange = useCallback(
    (h: number) => {
      setHue(h);
      const newHex = hsvToHex(h, sat, val);
      onChange(newHex);
    },
    [sat, val, onChange]
  );

  const handleHexCommit = useCallback(() => {
    const cleaned = hexInput.startsWith("#") ? hexInput : `#${hexInput}`;
    if (isValidHex(cleaned)) {
      onChange(cleaned);
      // Add to recent
      setRecentColors((prev) => {
        const filtered = prev.filter((c) => c.toLowerCase() !== cleaned.toLowerCase());
        return [cleaned, ...filtered].slice(0, 5);
      });
    }
  }, [hexInput, onChange]);

  const handlePaletteSelect = useCallback(
    (value: string) => {
      onChange(value);
      if (value !== "currentColor") {
        setRecentColors((prev) => {
          const filtered = prev.filter((c) => c.toLowerCase() !== value.toLowerCase());
          return [value, ...filtered].slice(0, 5);
        });
      }
    },
    [onChange]
  );

  const isCurrentColor = color === "currentColor";
  const displayColor = isCurrentColor ? "var(--color-text-primary)" : color;

  return (
    <div className={cn("relative", className)} ref={popoverRef}>
      {/* Collapsed Trigger: Swatch + Hex Label */}
      {/* Collapsed Trigger: Swatch + Hex Label */}
      <button
        type="button"
        disabled={disabled}
        aria-label={`Select icon color, currently ${isCurrentColor ? "currentColor" : color}`}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center gap-3 px-2.5 py-2 rounded-lg border transition-all cursor-pointer touch-manipulation",
          isOpen
            ? "border-border-strong bg-bg-secondary shadow-xs"
            : "border-border-subtle hover:border-border-default bg-transparent",
          disabled && "opacity-40 cursor-not-allowed"
        )}
      >
        <div
          className="w-7 h-7 rounded-md border border-border-default shrink-0 shadow-inner"
          style={{ backgroundColor: displayColor }}
        />
        <span className="text-xs font-mono text-text-secondary truncate">
          {isCurrentColor ? "currentColor" : color}
        </span>
      </button>

      {/* Expanded Popover */}
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-bg-elevated border border-border-default rounded-xl shadow-lg p-3.5 space-y-3 animate-fade-in">
          {/* Saturation/Value Field */}
          <SaturationField hue={hue} saturation={sat} value={val} onChange={handleSatValChange} />

          {/* Hue Slider */}
          <HueSlider hue={hue} onChange={handleHueChange} />

          {/* HEX Input */}
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-md border border-border-default shrink-0"
              style={{ backgroundColor: resolvedHex }}
            />
            <input
              type="text"
              aria-label="Hex color value"
              value={hexInput}
              onChange={(e) => setHexInput(e.target.value)}
              onBlur={handleHexCommit}
              onKeyDown={(e) => e.key === "Enter" && handleHexCommit()}
              maxLength={7}
              placeholder="#000000"
              className="flex-1 h-8 px-2 text-xs font-mono bg-bg-secondary border border-border-default rounded-md text-text-primary focus:border-accent outline-none transition-colors"
            />
          </div>

          {/* Gridframe Curated Palette */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider font-medium block">
              Gridframe Palette
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {GRIDFRAME_PALETTE.map((p) => {
                const isSelected =
                  color === p.value ||
                  (color !== "currentColor" && p.value !== "currentColor" && color.toLowerCase() === p.value.toLowerCase());
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => handlePaletteSelect(p.value)}
                    aria-label={`Color ${p.label}`}
                    title={p.label}
                    className={cn(
                      "w-6 h-6 rounded-md border transition-all cursor-pointer shrink-0 touch-manipulation",
                      isSelected
                        ? "ring-2 ring-accent ring-offset-1 ring-offset-bg-elevated border-accent scale-110"
                        : "border-border-subtle hover:scale-105 hover:border-border-default"
                    )}
                    style={{
                      backgroundColor:
                        p.value === "currentColor" ? "var(--color-text-primary)" : p.value,
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Recent Colors */}
          {recentColors.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider font-medium block">
                Recent
              </span>
              <div className="flex items-center gap-1.5">
                {recentColors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handlePaletteSelect(c)}
                    aria-label={`Recent color ${c}`}
                    title={c}
                    className={cn(
                      "w-5 h-5 rounded border transition-all cursor-pointer shrink-0 touch-manipulation",
                      color.toLowerCase() === c.toLowerCase()
                        ? "border-accent ring-1 ring-accent"
                        : "border-border-subtle hover:border-border-default"
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GridframeColorPicker;
