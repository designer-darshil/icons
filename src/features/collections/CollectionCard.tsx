import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CollectionWithIcons } from '@/types/collection';
import { Button } from '@/components/ui/Button';
import { Folder, MoreVertical, Edit2, Trash2, Download, ArrowRight } from 'lucide-react';
import { downloadFile } from '@/lib/export-svg';
import { transformSvgMarkup } from '@/lib/icon-transformer';
import { DEFAULT_CUSTOMIZATION } from '@/types/customization';
import { IconPreviewSvg } from '@/components/icons/IconPreviewSvg';
import { cn } from '@/lib/cn';

export interface CollectionCardProps {
  collection: CollectionWithIcons;
  onEdit: (collection: CollectionWithIcons) => void;
  onDelete: (id: string) => void;
  className?: string;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  onEdit,
  onDelete,
  className,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const { id, name, description, color = '#3B82F6', icons } = collection;

  const handleExportCollection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    if (icons.length === 0) return;

    let delay = 0;
    icons.forEach((icon) => {
      setTimeout(() => {
        const variant =
          icon.variants.find((v) => v.style === 'regular') ||
          icon.variants.find((v) => v.style === 'outline' || v.style === 'linear') ||
          icon.variants[0] || {
            id: icon.id,
            style: 'regular',
            label: 'Regular',
            svg: icon.svg,
            viewBox: icon.viewBox || '0 0 24 24',
            supportsStroke: true,
            supportsColor: true,
          };
        const svgContent = transformSvgMarkup(variant, DEFAULT_CUSTOMIZATION);
        downloadFile(svgContent, `${icon.slug}-${variant.style}.svg`, 'image/svg+xml');
      }, delay);
      delay += 100;
    });
  };

  return (
    <div
      className={cn(
        'group relative flex flex-col justify-between rounded-md border border-border-default bg-bg-primary p-4 transition-colors hover:border-border-strong hover:bg-bg-secondary',
        className
      )}
    >
      {/* Top Bar */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-7 h-7 rounded-xs text-text-inverse shrink-0"
            style={{ backgroundColor: color }}
          >
            <Folder className="w-3.5 h-3.5 fill-current" />
          </div>
          <div>
            <Link
              to={`/collections/${id}`}
              className="font-bold font-mono text-xs text-text-primary hover:underline line-clamp-1"
            >
              {name}
            </Link>
            <span className="text-[10px] font-mono text-text-tertiary">
              {icons.length} {icons.length === 1 ? 'icon' : 'icons'}
            </span>
          </div>
        </div>

        {/* Action Menu Dropdown */}
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="w-6 h-6 p-0"
            aria-label="Collection options"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </Button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }}
              />
              <div
                className="absolute right-0 top-7 z-40 w-40 rounded-md bg-bg-primary border border-border-default shadow-dropdown p-1 space-y-0.5"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onEdit(collection);
                  }}
                  className="flex items-center w-full gap-2 px-2.5 py-1 text-xs text-text-primary hover:bg-bg-secondary rounded-xs text-left"
                >
                  <Edit2 className="w-3 h-3 text-text-tertiary" />
                  <span>Edit Details</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportCollection}
                  disabled={icons.length === 0}
                  className="flex items-center w-full gap-2 px-2.5 py-1 text-xs text-text-primary hover:bg-bg-secondary rounded-xs text-left disabled:opacity-40"
                >
                  <Download className="w-3 h-3 text-text-tertiary" />
                  <span>Export All SVGs</span>
                </button>

                <div className="border-t border-border-default my-0.5" />

                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    if (window.confirm(`Delete "${name}" collection?`)) {
                      onDelete(id);
                    }
                  }}
                  className="flex items-center w-full gap-2 px-2.5 py-1 text-xs text-action-destructive hover:bg-status-error-bg rounded-xs text-left"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-[11px] text-text-tertiary line-clamp-2 mt-2 leading-relaxed">
          {description}
        </p>
      )}

      {/* 4-Slot Specimen Preview Mosaic */}
      <Link to={`/collections/${id}`} className="block mt-3">
        <div className="grid grid-cols-4 gap-1.5 p-2 rounded-sm bg-bg-secondary border border-border-subtle">
          {[0, 1, 2, 3].map((index) => {
            const icon = icons[index];
            const variant = icon?.variants[0];
            return (
              <div
                key={index}
                className="aspect-square rounded-xs bg-bg-elevated flex items-center justify-center p-1.5 text-text-primary border border-border-default"
              >
                {icon ? (
                  <IconPreviewSvg
                    variant={variant}
                    icon={icon}
                    size={16}
                    className="w-4 h-4"
                  />
                ) : (
                  <div className="w-1 h-1 rounded-full bg-border-strong" />
                )}
              </div>
            );
          })}
        </div>
      </Link>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-border-subtle text-[11px] font-mono text-text-tertiary">
        <span>{new Date(collection.updatedAt).toLocaleDateString()}</span>
        <Link
          to={`/collections/${id}`}
          className="flex items-center gap-1 font-semibold text-text-primary hover:underline"
        >
          <span>Open Set</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};
