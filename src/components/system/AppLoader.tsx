import React from 'react';
import { GridframeLoader, GridframeLoaderProps } from './GridframeLoader';

export type AppLoaderProps = GridframeLoaderProps;

export const AppLoader: React.FC<AppLoaderProps> = (props) => {
  return <GridframeLoader {...props} />;
};

export const RouteLoader: React.FC<Omit<AppLoaderProps, 'variant'>> = (props) => {
  return (
    <GridframeLoader
      variant="route"
      label="LOADING ROUTE"
      sublabel="Calibrating interface view..."
      {...props}
    />
  );
};

export const InlineLoader: React.FC<Omit<AppLoaderProps, 'variant'>> = (props) => {
  return (
    <GridframeLoader
      variant="inline"
      label="LOADING DATA"
      sublabel="Syncing metrics..."
      {...props}
    />
  );
};

export { GridframeLoader };
export default AppLoader;
