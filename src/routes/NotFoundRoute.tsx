import React from 'react';
import { GridframeErrorState } from '@/components/error/GridframeErrorState';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export const NotFoundRoute: React.FC = () => {
  useDocumentTitle('404 — Page Not Found', 'This Gridframe view does not exist.');

  return (
    <GridframeErrorState
      type="404"
      code="404"
      title="Page not found."
      description="This Gridframe view doesn't exist."
      homePath="/icons"
      homeLabel="Browse icons"
    />
  );
};

export default NotFoundRoute;
