import React, { useCallback } from 'react';
import { useRouteError, isRouteErrorResponse, useNavigate, useLocation } from 'react-router-dom';
import { GridframeErrorState } from './GridframeErrorState';

export interface GridframeRouteErrorProps {
  compact?: boolean;
}

export const GridframeRouteError: React.FC<GridframeRouteErrorProps> = ({ compact = false }) => {
  const error = useRouteError();
  const navigate = useNavigate();
  const location = useLocation();

  // Robust error diagnosis
  const is404 = isRouteErrorResponse(error) && error.status === 404;
  const is500 = isRouteErrorResponse(error) && error.status >= 500;

  const statusCode = isRouteErrorResponse(error) ? error.status : '500';
  const errorTitle = is404
    ? 'Page not found.'
    : isRouteErrorResponse(error)
    ? `HTTP ${error.status}: ${error.statusText || 'Route Error'}`
    : 'Something went wrong.';

  const errorDescription = is404
    ? "This Gridframe view doesn't exist."
    : is500
    ? "We couldn't load this view correctly."
    : "Gridframe encountered an unexpected route failure while processing this page.";

  // Safe retry handler
  const handleRetry = useCallback(() => {
    // Attempt re-navigation or refresh to clear stale state while preserving location
    if (typeof window !== 'undefined') {
      window.location.reload();
    } else {
      navigate(location.pathname + location.search, { replace: true });
    }
  }, [navigate, location]);

  return (
    <GridframeErrorState
      type={is404 ? '404' : '500'}
      code={statusCode}
      title={errorTitle}
      description={errorDescription}
      error={error}
      onRetry={is404 ? undefined : handleRetry}
      retryLabel="Try again"
      homePath="/icons"
      homeLabel={is404 ? 'Browse icons' : 'Back to icons'}
      compact={compact}
    />
  );
};

export default GridframeRouteError;
