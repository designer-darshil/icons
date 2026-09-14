import { Component, type ReactNode, type ErrorInfo } from 'react';
import { GridframeErrorState } from './GridframeErrorState';
import { telemetry } from '@/lib/monitoring';

export interface GridframeErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((props: { error: Error | null; resetErrorBoundary: () => void }) => ReactNode);
  onReset?: () => void;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  compact?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class GridframeErrorBoundary extends Component<GridframeErrorBoundaryProps, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });

    // 1. Safe telemetry logging
    telemetry.logError('runtime_exception', error.message, { stack: error.stack });

    // 2. Call optional consumer error handler
    this.props.onError?.(error, errorInfo);
  }

  public resetErrorBoundary = (): void => {
    this.props.onReset?.();
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  public render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback, compact } = this.props;

    if (hasError) {
      if (typeof fallback === 'function') {
        return fallback({
          error,
          resetErrorBoundary: this.resetErrorBoundary,
        });
      }

      if (fallback) {
        return fallback;
      }

      return (
        <GridframeErrorState
          type="500"
          code="500"
          title="Something went wrong."
          description="Gridframe couldn't load this view correctly."
          error={error}
          onRetry={this.resetErrorBoundary}
          retryLabel="Try again"
          compact={compact}
        />
      );
    }

    return children;
  }
}

export default GridframeErrorBoundary;
