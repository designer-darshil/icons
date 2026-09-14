import React from 'react';

interface AdminCardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export const AdminCard: React.FC<AdminCardProps> = ({
  children,
  title,
  subtitle,
  action,
  className = '',
  bodyClassName = '',
}) => {
  return (
    <div className={`bg-bg-surface border border-border-subtle rounded-lg overflow-hidden shadow-xs ${className}`}>
      {(title || action) && (
        <div className="px-4 py-3.5 border-b border-border-subtle flex items-center justify-between gap-3 bg-bg-secondary/40">
          <div>
            {typeof title === 'string' ? (
              <h3 className="text-sm font-semibold text-text-primary tracking-tight">{title}</h3>
            ) : (
              title
            )}
            {subtitle && (
              <p className="text-xs text-text-tertiary mt-0.5 font-sans">{subtitle}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={`p-4 ${bodyClassName}`}>{children}</div>
    </div>
  );
};

interface MetricWidgetProps {
  label: string;
  value: string | number;
  subvalue?: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  className?: string;
}

export const AdminMetricWidget: React.FC<MetricWidgetProps> = ({
  label,
  value,
  subvalue,
  change,
  trend = 'neutral',
  icon,
  className = '',
}) => {
  return (
    <div className={`bg-bg-surface border border-border-subtle rounded-lg p-4 flex items-start justify-between gap-3 ${className}`}>
      <div className="space-y-1">
        <p className="text-xs font-mono font-medium text-text-tertiary uppercase tracking-wider">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-text-primary tracking-tight">{value}</span>
          {change && (
            <span
              className={`text-xs font-mono font-semibold ${
                trend === 'up'
                  ? 'text-emerald-500'
                  : trend === 'down'
                  ? 'text-rose-500'
                  : 'text-text-tertiary'
              }`}
            >
              {change}
            </span>
          )}
        </div>
        {subvalue && <p className="text-[11px] text-text-tertiary font-sans">{subvalue}</p>}
      </div>
      {icon && <div className="p-2.5 bg-bg-secondary border border-border-subtle rounded-md text-text-secondary shrink-0">{icon}</div>}
    </div>
  );
};
