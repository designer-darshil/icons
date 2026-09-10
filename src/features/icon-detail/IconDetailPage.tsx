import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import type { Icon } from "@/types/icon";
import { useSelectedIcon } from "@/hooks/useSelectedIcon";
import { useIconCustomizer } from "@/features/customizer/useIconCustomizer";
import { IconDetailHeader } from "./IconDetailHeader";
import { IconPreviewCanvas } from "./IconPreviewCanvas";
import { VariantSwitcher } from "./VariantSwitcher";
import { IconNavigation } from "./IconNavigation";
import { IconMetadata } from "./IconMetadata";
import { RelatedIcons } from "./RelatedIcons";
import { IconCustomizer } from "@/features/customizer/IconCustomizer";
import { ExportPanel } from "@/features/export/ExportPanel";
import { AddToCollectionMenu } from "@/features/collections/AddToCollectionMenu";
import { Button } from "@/components/ui/Button";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/cn";

export interface IconDetailPageProps {
  initialIcon: Icon;
  iconList?: Icon[];
  onClose?: () => void;
  isModal?: boolean;
  onSelectIcon?: (icon: Icon) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (icon: Icon) => void;
  className?: string;
}

export const IconDetailPage: React.FC<IconDetailPageProps> = ({
  initialIcon,
  iconList = [],
  onClose,
  isModal = true,
  onSelectIcon,
  isFavorite = false,
  onToggleFavorite,
  className,
}) => {
  const [isAddToCollectionOpen, setIsAddToCollectionOpen] = React.useState(false);
  const {
    icon,
    selectIcon,
    variantIndex,
    setVariantIndex,
    activeVariant,
    prevIcon,
    nextIcon,
    currentIndex,
    totalCount,
    relatedIcons,
    goToPrev,
    goToNext,
  } = useSelectedIcon(initialIcon, iconList);

  const activeIcon = icon || initialIcon;
  const currentVariant = activeVariant || activeIcon.variants[0] || {
    id: activeIcon.id,
    style: activeIcon.style,
    label: "Linear",
    svg: activeIcon.svg,
    viewBox: activeIcon.viewBox,
    supportsStroke: true,
    supportsColor: true,
  };

  // Customizer hook
  const {
    customization,
    updateProperty,
    resetCustomization,
    rotate90,
    toggleFlipX,
    toggleFlipY,
    hasModifications,
  } = useIconCustomizer(currentVariant);

  // Sync selection if parent changes initialIcon
  React.useEffect(() => {
    selectIcon(initialIcon);
  }, [initialIcon, selectIcon]);

  const handleSelectRelated = useCallback(
    (related: Icon) => {
      selectIcon(related);
      onSelectIcon?.(related);
    },
    [selectIcon, onSelectIcon]
  );

  return (
    <div className={cn("space-y-5", className)}>
      {/* Top Navigation between filtered items */}
      <IconNavigation
        prevIcon={prevIcon}
        nextIcon={nextIcon}
        currentIndex={currentIndex}
        totalCount={totalCount}
        onPrev={goToPrev}
        onNext={goToNext}
      />

      {/* Header with Title & Action Controls */}
      <IconDetailHeader
        icon={activeIcon}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite ? () => onToggleFavorite(activeIcon) : undefined}
        onAddToCollection={() => setIsAddToCollectionOpen(true)}
        onClose={onClose}
        isModal={isModal}
      />

      {/* Large Vector Preview Canvas with Live Customization */}
      <IconPreviewCanvas
        icon={activeIcon}
        activeVariant={currentVariant}
        customization={customization}
        canvasBg={customization.background}
        onCanvasBgChange={(bg) => updateProperty("background", bg)}
      />

      {/* Multi-Style Variant Switcher */}
      <VariantSwitcher
        variants={activeIcon.variants}
        selectedIndex={variantIndex}
        onSelectVariant={setVariantIndex}
      />

      {/* Live Vector Customizer Studio */}
      <IconCustomizer
        activeVariant={currentVariant}
        customization={customization}
        onUpdate={updateProperty}
        onReset={resetCustomization}
        onRotate90={rotate90}
        onToggleFlipX={toggleFlipX}
        onToggleFlipY={toggleFlipY}
        hasModifications={hasModifications}
      />

      {/* Production Multi-Format Export Engine */}
      <ExportPanel
        icon={activeIcon}
        variant={currentVariant}
        customization={customization}
      />

      {/* Metadata Panel */}
      <IconMetadata icon={activeIcon} />

      {/* Related Icons Section */}
      <RelatedIcons
        relatedIcons={relatedIcons}
        onSelectIcon={handleSelectRelated}
      />

      {/* Deep Link to Standalone Route (if modal) */}
      {isModal && (
        <div className="pt-2 border-t border-border-subtle">
          <Link to={`/icons/${activeIcon.slug}`}>
            <Button variant="ghost" size="sm" className="w-full justify-between text-xs text-text-muted hover:text-text-primary">
              <span>Open Standalone Detail Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      )}

      {/* Add To Collection Modal */}
      <AddToCollectionMenu
        icon={activeIcon}
        isOpen={isAddToCollectionOpen}
        onClose={() => setIsAddToCollectionOpen(false)}
      />
    </div>
  );
};
