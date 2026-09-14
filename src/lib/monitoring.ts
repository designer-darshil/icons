/**
 * Production Monitoring & Telemetry Helper
 * Captures route errors, runtime exceptions, and telemetry safely without exposing raw diagnostics in production.
 */

export interface TelemetryEvent {
  type: 'route_error' | 'runtime_exception' | 'svg_render_failure' | 'catalog_anomaly';
  message: string;
  context?: Record<string, any>;
  timestamp: string;
}

class TelemetryClient {
  private buffer: TelemetryEvent[] = [];
  private readonly maxBufferSize = 50;

  public logError(type: TelemetryEvent['type'], message: string, context?: Record<string, any>) {
    const event: TelemetryEvent = {
      type,
      message: message.substring(0, 300), // sanitize length
      context,
      timestamp: new Date().toISOString(),
    };

    this.buffer.push(event);
    if (this.buffer.length > this.maxBufferSize) {
      this.buffer.shift();
    }

    if (process.env.NODE_ENV === 'development') {
      console.warn(`[GRIDFRAME Telemetry:${type}]`, message, context);
    }
  }

  public getBufferedEvents(): ReadonlyArray<TelemetryEvent> {
    return [...this.buffer];
  }

  public clearBuffer(): void {
    this.buffer = [];
  }
}

export const telemetry = new TelemetryClient();
