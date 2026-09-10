import { useState, useCallback, useMemo } from "react";
import type { Icon } from "@/types/icon";
import { getSiblingIcons, getRelatedIcons } from "@/lib/icon-relations";
import { useKeyboardShortcut } from "./useKeyboardShortcut";

export type CanvasBackground = "dots" | "dark" | "light" | "transparent" | "checkerboard";

export function useSelectedIcon(
  initialIcon: Icon | null = null,
  iconList: Icon[] = []
) {
  const [icon, setIcon] = useState<Icon | null>(initialIcon);
  const [variantIndex, setVariantIndex] = useState<number>(0);
  const [canvasBg, setCanvasBg] = useState<CanvasBackground>("dots");

  const selectIcon = useCallback((newIcon: Icon | null) => {
    setIcon(newIcon);
    setVariantIndex(0);
  }, []);

  const activeVariant = useMemo(() => {
    if (!icon) return null;
    return icon.variants[variantIndex] || icon.variants[0] || null;
  }, [icon, variantIndex]);

  const { prev, next, index, total } = useMemo(() => {
    if (!icon) return { prev: null, next: null, index: -1, total: iconList.length };
    return getSiblingIcons(icon.id, iconList.length > 0 ? iconList : undefined);
  }, [icon, iconList]);

  const relatedIcons = useMemo(() => {
    if (!icon) return [];
    return getRelatedIcons(icon, iconList.length > 0 ? iconList : undefined);
  }, [icon, iconList]);

  const goToPrev = useCallback(() => {
    if (prev) selectIcon(prev);
  }, [prev, selectIcon]);

  const goToNext = useCallback(() => {
    if (next) selectIcon(next);
  }, [next, selectIcon]);

  // Keyboard navigation shortcuts: '[' for prev, ']' for next
  useKeyboardShortcut("[", () => {
    goToPrev();
  });

  useKeyboardShortcut("]", () => {
    goToNext();
  });

  return {
    icon,
    selectIcon,
    variantIndex,
    setVariantIndex,
    activeVariant,
    canvasBg,
    setCanvasBg,
    prevIcon: prev,
    nextIcon: next,
    currentIndex: index,
    totalCount: total,
    relatedIcons,
    goToPrev,
    goToNext,
  };
}
