import React, { useState, useMemo } from 'react';
import { useAdminActivity, type ActivityEvent } from '@/features/admin/context/AdminActivityContext';
import { AdminTable } from '@/features/admin/components/AdminTable';
import { AdminConfirmModal } from '@/features/admin/components/AdminModal';

export const AdminActivityRoute: React.FC = () => {
  const { activities, clearActivities } = useAdminActivity();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const filteredActivities = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return activities.filter((act) => {
      if (selectedCategory !== 'all' && act.category !== selectedCategory) return false;
      if (q) {
        const matchAction = act.action.toLowerCase().includes(q);
        const matchTarget = act.target.toLowerCase().includes(q);
        const matchActor = act.actor.toLowerCase().includes(q);
        const matchDetails = (act.details || '').toLowerCase().includes(q);
        if (!matchAction && !matchTarget && !matchActor && !matchDetails) return false;
      }
      return true;
    });
  }, [activities, searchQuery, selectedCategory]);

  const columns = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      width: '170px',
      render: (act: ActivityEvent) => (
        <span className="font-mono text-[11px] text-text-tertiary">
          {new Date(act.timestamp).toLocaleString([], {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </span>
      ),
    },
    {
      key: 'actor',
      header: 'Actor',
      width: '160px',
      render: (act: ActivityEvent) => (
        <span className="font-mono font-medium text-text-primary text-xs truncate block">{act.actor}</span>
      ),
    },
    {
      key: 'action',
      header: 'Action & Target',
      render: (act: ActivityEvent) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-text-primary">{act.action}</span>
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 bg-bg-secondary text-text-tertiary rounded border border-border-subtle">
              {act.category}
            </span>
          </div>
          <p className="text-[11px] text-text-secondary mt-0.5 font-mono">
            Target: <strong className="text-text-primary">{act.target}</strong>
          </p>
          {act.details && <p className="text-[11px] text-text-tertiary mt-0.5 font-sans">{act.details}</p>}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Result',
      width: '100px',
      align: 'right' as const,
      render: (act: ActivityEvent) => (
        <span
          className={`inline-block text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${
            act.status === 'success'
              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
              : act.status === 'warning'
              ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
              : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
          }`}
        >
          {act.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
        <div>
          <h2 className="text-xl font-bold font-mono tracking-tight text-text-primary">Activity & Audit Log</h2>
          <p className="text-xs text-text-tertiary mt-0.5">
            Traceable chronological event record of all library mutations, category assignments, and sync operations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsClearModalOpen(true)}
          disabled={activities.length === 0}
          className="px-3 py-1.5 bg-bg-surface hover:bg-bg-secondary border border-border-subtle rounded-md text-xs font-mono text-text-tertiary hover:text-rose-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Clear Log History
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-bg-surface border border-border-subtle rounded-lg shadow-xs">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit records..."
            className="w-full pl-8 pr-3 py-1.5 bg-bg-secondary border border-border-subtle rounded-md text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-action-primary font-sans"
          />
          <svg
            className="w-3.5 h-3.5 text-text-tertiary absolute left-2.5 top-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-auto px-3 py-1.5 bg-bg-secondary border border-border-subtle rounded-md text-xs font-mono text-text-primary focus:outline-none focus:border-action-primary"
        >
          <option value="all">All Event Categories</option>
          <option value="icons">Icons</option>
          <option value="categories">Categories</option>
          <option value="collections">Collections</option>
          <option value="users">Users</option>
          <option value="sync">Sync & Import</option>
          <option value="system">System</option>
        </select>
      </div>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={filteredActivities}
        keyExtractor={(item) => item.id}
        emptyMessage="No activity records match your search filter."
      />

      {/* Clear Confirmation Modal */}
      <AdminConfirmModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={() => {
          clearActivities();
          setIsClearModalOpen(false);
        }}
        title="Clear Activity Audit Trail"
        variant="danger"
        confirmLabel="Clear All Logs"
        message="Are you sure you want to clear the local activity log history? This action cannot be undone."
      />
    </div>
  );
};
