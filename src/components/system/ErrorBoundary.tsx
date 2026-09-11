import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertTriangle, RotateCcw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error captured by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xs border border-border-default bg-bg-secondary/40 my-8 max-w-lg mx-auto space-y-5 shadow-dropdown font-mono"
        >
          <div className="w-12 h-12 rounded-xs bg-bg-elevated text-accent flex items-center justify-center border border-border-default">
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div className="space-y-1.5 font-sans">
            <h2 className="text-base font-bold text-text-primary">
              Something went wrong
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed max-w-sm">
              An unexpected error occurred while rendering this workspace component.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={this.handleReset}
              className="text-xs gap-1.5 font-mono"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </Button>
            <a href="/icons">
              <Button
                variant="primary"
                size="sm"
                className="text-xs gap-1.5 font-mono"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Archive</span>
              </Button>
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

