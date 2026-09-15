import React, { useState } from 'react';
import type { Icon } from '@/types/icon';
import { buildPresetIconSet, getAllPresetTypes } from '@/lib/icon-intelligence/set-builder';
import type { ProductPresetType } from '@/types/intelligence';
import { IconPreviewSvg } from '@/components/icons/IconPreviewSvg';
import { cn } from '@/lib/cn';

export interface IconSetBuilderProps {
  catalogIcons: Icon[];
  onSaveAsCollection?: (name: string, icons: Icon[]) => void;
  className?: string;
}

export const IconSetBuilder: React.FC<IconSetBuilderProps> = ({
  catalogIcons,
  onSaveAsCollection,
  className,
}) => {
  const presetTypes = getAllPresetTypes();
  const [selectedType, setSelectedType] = useState<ProductPresetType>('SaaS');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const preset = buildPresetIconSet(selectedType, catalogIcons);
  const allPresetIcons = preset.groups.flatMap((g) => g.recommendedIcons);

  const handleSave = () => {
    onSaveAsCollection?.(`${selectedType} UI Icon Set`, allPresetIcons);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className={cn('p-5 rounded-sm border border-border-default bg-bg-secondary/40 space-y-5', className)}>
      <div className="flex items-center justify-between border-b border-border-subtle/80 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary">
            BUILD ME A UI ICON SET
          </h3>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-accent text-accent-fg hover:bg-accent-hover text-xs font-mono font-semibold uppercase tracking-wider cursor-pointer shadow-xs transition-colors"
        >
          {savedSuccess ? '✓ Saved to Collections' : `Save Set (${allPresetIcons.length} Icons)`}
        </button>
      </div>

      {/* Preset Selector */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {presetTypes.map((pt) => (
          <button
            key={pt}
            type="button"
            onClick={() => setSelectedType(pt)}
            className={cn(
              'px-3 py-1.5 rounded-xs text-[11px] font-mono uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer border',
              selectedType === pt
                ? 'bg-accent text-accent-fg border-accent font-bold shadow-2xs'
                : 'bg-bg-primary text-text-secondary border-border-default hover:text-text-primary hover:border-border-strong'
            )}
          >
            {pt}
          </button>
        ))}
      </div>

      <p className="text-xs text-text-secondary font-sans leading-relaxed">
        {preset.description}
      </p>

      {/* Grouped Icons */}
      <div className="space-y-4">
        {preset.groups.map((group) => (
          <div key={group.groupName} className="p-4 rounded-xs border border-border-default bg-bg-elevated/70 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold text-text-primary uppercase tracking-wider">
                {group.groupName}
              </h4>
              <span className="text-[10px] font-mono text-text-tertiary">
                {group.recommendedIcons.length} concepts matched
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {group.recommendedIcons.map((icon) => (
                <div
                  key={icon.id}
                  className="p-2.5 rounded-xs border border-border-subtle bg-bg-primary flex flex-col items-center justify-center text-center space-y-1.5 hover:border-accent transition-colors"
                >
                  <IconPreviewSvg svgContent={icon.svg} className="w-5 h-5 text-text-primary" />
                  <span className="text-[10px] font-mono text-text-secondary truncate w-full">
                    {icon.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
