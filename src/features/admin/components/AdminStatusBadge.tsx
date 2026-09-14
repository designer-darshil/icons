import React from 'react';

export type StatusType = 'published' | 'draft' | 'archived' | 'active' | 'suspended' | 'success' | 'warning' | 'info' | 'error';

interface AdminStatusBadgeProps {
  status: StatusType | string;
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const AdminStatusBadge: React.FC<AdminStatusBadgeProps> = ({ status, size = 'sm', dot = true }) => {
  const norm = (status || 'published').toLowerCase();

  let colorClasses = 'bg-surface-secondary text-text-secondary border-border-subtle';
  let label = status;

  switch (norm) {
    case 'published':
    case 'active':
    case 'success':
      colorClasses = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      label = norm === 'published' ? 'Published' : norm === 'active' ? 'Active' : 'Success';
      break;
    case 'draft':
    case 'warning':
      colorClasses = 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      label = norm === 'draft' ? 'Draft' : 'Warning';
      break;
    case 'archived':
    case 'suspended':
    case 'error':
      colorClasses = 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      label = norm === 'archived' ? 'Archived' : norm === 'suspended' ? 'Suspended' : 'Error';
      break;
    case 'info':
      colorClasses = 'bg-sky-500/10 text-sky-500 border-sky-500/20';
      label = 'Info';
      break;
  }

  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-semibold rounded-full border ${sizeClasses} ${colorClasses}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-currentColor shrink-0" style={{ backgroundColor: 'currentColor' }} />}
      {label}
    </span>
  );
};
