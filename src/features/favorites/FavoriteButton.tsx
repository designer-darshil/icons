import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

export interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'outline' | 'secondary' | 'primary';
  showLabel?: boolean;
  className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFavorite,
  onToggle,
  size = 'md',
  variant = 'ghost',
  showLabel = false,
  className,
}) => {
  return (
    <Button
      type="button"
      variant={isFavorite ? 'secondary' : variant}
      size={size}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={cn(
        'transition-all duration-200',
        isFavorite && 'text-rose-500 bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20',
        className
      )}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      title={isFavorite ? 'Favorited' : 'Add to favorites'}
    >
      <Heart
        className={cn(
          'w-4 h-4 transition-transform duration-200',
          isFavorite ? 'fill-rose-500 text-rose-500 scale-110' : 'text-foreground-muted'
        )}
      />
      {showLabel && (
        <span className="ml-1.5 text-xs font-medium">
          {isFavorite ? 'Favorited' : 'Favorite'}
        </span>
      )}
    </Button>
  );
};
