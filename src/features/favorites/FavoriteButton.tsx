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
        isFavorite && 'text-accent bg-accent/10 border-accent/20 hover:bg-accent/20',
        className
      )}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      title={isFavorite ? 'Favorited' : 'Add to favorites'}
    >
      <Heart
        className={cn(
          'w-4 h-4 transition-transform duration-200',
          isFavorite ? 'fill-accent text-accent scale-110' : 'text-text-tertiary'
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
