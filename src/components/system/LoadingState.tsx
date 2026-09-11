import React from 'react';
import { AppLoader } from './AppLoader';

export interface LoadingStateProps {
  label?: string;
  sublabel?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  label = 'Loading archive...',
  sublabel,
  className,
}) => {
  return (
    <AppLoader
      label={label}
      sublabel={sublabel}
      className={className}
    />
  );
};

