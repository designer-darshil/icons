import { useState, useCallback, useMemo } from "react";
import type { IconVariant } from "@/types/icon";
import {
  DEFAULT_CUSTOMIZATION,
  type IconCustomization,
} from "@/types/customization";
import { isCustomized } from "@/lib/icon-transformer";

export function useIconCustomizer(activeVariant: IconVariant | null) {
  const defaultStroke = activeVariant?.defaultStrokeWidth ?? 2;

  const [customization, setCustomization] = useState<IconCustomization>(() => ({
    ...DEFAULT_CUSTOMIZATION,
    strokeWidth: defaultStroke,
  }));

  const updateProperty = useCallback(
    <K extends keyof IconCustomization>(key: K, value: IconCustomization[K]) => {
      setCustomization((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const resetCustomization = useCallback(() => {
    setCustomization({
      ...DEFAULT_CUSTOMIZATION,
      strokeWidth: activeVariant?.defaultStrokeWidth ?? 2,
    });
  }, [activeVariant]);

  const rotate90 = useCallback(() => {
    setCustomization((prev) => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360,
    }));
  }, []);

  const toggleFlipX = useCallback(() => {
    setCustomization((prev) => ({
      ...prev,
      flipX: !prev.flipX,
    }));
  }, []);

  const toggleFlipY = useCallback(() => {
    setCustomization((prev) => ({
      ...prev,
      flipY: !prev.flipY,
    }));
  }, []);

  const hasModifications = useMemo(() => {
    return isCustomized(customization, defaultStroke);
  }, [customization, defaultStroke]);

  return {
    customization,
    setCustomization,
    updateProperty,
    resetCustomization,
    rotate90,
    toggleFlipX,
    toggleFlipY,
    hasModifications,
    supportsStroke: activeVariant?.supportsStroke ?? true,
    supportsColor: activeVariant?.supportsColor ?? true,
  };
}
