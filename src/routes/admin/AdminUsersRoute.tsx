import React, { useState } from 'react';
import { useAdminAuth } from '@/features/admin/auth/AdminAuthContext';
import type { AdminUser, AdminRole } from '@/features/admin/auth/types';
import { AdminTable } from '@/features/admin/components/AdminTable';
import { AdminStatusBadge } from '@/features/admin/components/AdminStatusBadge';
import { AdminCard } from '@/features/admin/components/AdminCard';
import { AdminModal } from '@/features/admin/components/AdminModal';
import { AdminSelect } from '@/features/admin/components/AdminFormControls';

export const AdminUsersRoute: React.FC = () => {
  const { users, updateUserRole, updateUserStatus } = useAdminAuth();
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [targetRole, setTargetRole] = useState<AdminRole>('admin');

  const handleOpenEditRole = (user: AdminUser) => {
    setEditingUser(user);
    setTargetRole(user.role);
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateUserRole(editingUser.id, targetRole);
      setEditingUser(null);
    }
  };

  const handleToggleStatus = (user: AdminUser) => {
    updateUserStatus(user.id, user.status === 'active' ? 'suspended' : 'active');
  };

  const columns = [
    {
      key: 'name',
      header: 'Admin User',
      render: (u: AdminUser) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-action-primary/20 border border-action-primary/30 flex items-center justify-center text-action-primary font-mono text-xs font-bold shrink-0">
            {u.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="font-semibold text-text-primary block">{u.name}</span>
            <span className="text-[11px] font-mono text-text-tertiary block">{u.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      width: '120px',
      render: (u: AdminUser) => (
        <span
          className={`inline-block font-mono text-[11px] uppercase font-semibold px-2 py-0.5 rounded border ${
            u.role === 'admin'
              ? 'bg-action-primary/10 text-action-primary border-action-primary/20'
              : u.role === 'editor'
              ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
              : 'bg-bg-secondary text-text-secondary border-border-subtle'
          }`}
        >
          {u.role}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '120px',
      render: (u: AdminUser) => <AdminStatusBadge status={u.status} size="sm" />,
    },
    {
      key: 'lastActive',
      header: 'Last Active',
      width: '130px',
      render: (u: AdminUser) => <span className="font-mono text-[11px] text-text-tertiary">{u.lastActive}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '140px',
      align: 'right' as const,
      render: (u: AdminUser) => (
        <div className="flex items-center justify-end gap-1.5 font-mono text-xs">
          <button
            type="button"
            onClick={() => handleOpenEditRole(u)}
            className="px-2 py-1 bg-bg-surface hover:bg-bg-secondary border border-border-subtle rounded text-text-secondary hover:text-text-primary transition-colors"
          >
            Role
          </button>
          <button
            type="button"
            onClick={() => handleToggleStatus(u)}
            className={`px-2 py-1 border rounded transition-colors ${
              u.status === 'active'
                ? 'text-rose-500 border-rose-500/30 hover:bg-rose-500/10'
                : 'text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10'
            }`}
          >
            {u.status === 'active' ? 'Suspend' : 'Activate'}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-3 border-b border-border-subtle">
        <h2 className="text-xl font-bold font-mono tracking-tight text-text-primary">Team & Access Control</h2>
        <p className="text-xs text-text-tertiary mt-0.5">
          Manage administrator permissions, editorial roles, and account access status.
        </p>
      </div>

      {/* Table */}
      <AdminTable columns={columns} data={users} keyExtractor={(item) => item.id} />

      {/* Permissions Matrix Card */}
      <AdminCard title="Role Permissions Matrix" subtitle="Strict role boundary capabilities in CMS">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-border-subtle bg-bg-secondary/40 text-text-tertiary uppercase text-[10px]">
                <th className="py-2.5 px-3">Permission Area</th>
                <th className="py-2.5 px-3 text-center">Admin</th>
                <th className="py-2.5 px-3 text-center">Editor</th>
                <th className="py-2.5 px-3 text-center">Viewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-text-secondary">
              <tr>
                <td className="py-2.5 px-3 font-medium text-text-primary">Icon Metadata & Tag Editing</td>
                <td className="py-2.5 px-3 text-center text-emerald-500">✓ Full</td>
                <td className="py-2.5 px-3 text-center text-emerald-500">✓ Full</td>
                <td className="py-2.5 px-3 text-center text-text-tertiary">Read-only</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-text-primary">Publish / Archive / Delete Icons</td>
                <td className="py-2.5 px-3 text-center text-emerald-500">✓ Full</td>
                <td className="py-2.5 px-3 text-center text-emerald-500">✓ Full</td>
                <td className="py-2.5 px-3 text-center text-text-tertiary">✕ Denied</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-text-primary">Taxonomy & Category Creation</td>
                <td className="py-2.5 px-3 text-center text-emerald-500">✓ Full</td>
                <td className="py-2.5 px-3 text-center text-text-tertiary">Read-only</td>
                <td className="py-2.5 px-3 text-center text-text-tertiary">Read-only</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-text-primary">Upstream Iconoir Sync Execution</td>
                <td className="py-2.5 px-3 text-center text-emerald-500">✓ Full</td>
                <td className="py-2.5 px-3 text-center text-text-tertiary">✕ Denied</td>
                <td className="py-2.5 px-3 text-center text-text-tertiary">✕ Denied</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-text-primary">User Management & Role Assignment</td>
                <td className="py-2.5 px-3 text-center text-emerald-500">✓ Full</td>
                <td className="py-2.5 px-3 text-center text-text-tertiary">✕ Denied</td>
                <td className="py-2.5 px-3 text-center text-text-tertiary">✕ Denied</td>
              </tr>
            </tbody>
          </table>
        </div>
      </AdminCard>

      {/* Role Edit Modal */}
      <AdminModal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title={`Change Role: ${editingUser?.name}`}
        footer={
          <>
            <button
              type="button"
              onClick={() => setEditingUser(null)}
              className="px-3 py-1.5 bg-bg-surface border border-border-subtle rounded text-xs font-mono text-text-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveRole}
              className="px-3.5 py-1.5 bg-action-primary text-text-inverse rounded text-xs font-mono font-semibold"
            >
              Update Role
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveRole} className="space-y-3 py-2">
          <AdminSelect
            label="Assigned Access Role"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value as AdminRole)}
            options={[
              { value: 'admin', label: 'Admin (Full Management & Sync)' },
              { value: 'editor', label: 'Editor (Icon & Collection Management)' },
              { value: 'viewer', label: 'Viewer (Read-Only Inspection)' },
            ]}
          />
        </form>
      </AdminModal>
    </div>
  );
};
