import React, { useState } from 'react';
import { useAdminCatalog } from '@/features/admin/context/AdminCatalogContext';
import { useAdminActivity } from '@/features/admin/context/AdminActivityContext';
import { AdminCard } from '@/features/admin/components/AdminCard';
import { AdminInput, AdminSelect, AdminToggle } from '@/features/admin/components/AdminFormControls';
import { AdminConfirmModal } from '@/features/admin/components/AdminModal';
import { downloadCatalogBackupJson } from '@/features/admin/services/adminExportService';

export const AdminSettingsRoute: React.FC = () => {
  const { icons, categories, collections, resetAllOverrides } = useAdminCatalog();
  const { logActivity } = useAdminActivity();

  const [activeTab, setActiveTab] = useState<'general' | 'catalog' | 'search' | 'system'>('general');
  const [siteName, setSiteName] = useState('GRIDFRAME Icon Library');
  const [defaultVariant, setDefaultVariant] = useState('regular');
  const [defaultPageSize, setDefaultPageSize] = useState('50');
  const [autoValidateSvg, setAutoValidateSvg] = useState(true);
  const [enableSynonymSearch, setEnableSynonymSearch] = useState(true);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    logActivity({
      actor: 'Admin',
      action: 'System Settings Saved',
      target: 'Configuration Store',
      category: 'system',
      status: 'success',
      details: `Saved settings for [${activeTab}] section.`,
    });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleExportBackup = () => {
    downloadCatalogBackupJson(icons, categories, collections);
  };

  const handleConfirmReset = () => {
    resetAllOverrides();
    setIsResetModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
        <div>
          <h2 className="text-xl font-bold font-mono tracking-tight text-text-primary">Admin Settings</h2>
          <p className="text-xs text-text-tertiary mt-0.5">
            Configure catalog presentation rules, search indexing behaviors, and backup systems.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveToast && (
            <span className="text-xs font-mono text-emerald-500 font-semibold animate-in fade-in">
              ✓ Settings Applied
            </span>
          )}
          <button
            type="button"
            onClick={handleSaveSettings}
            className="px-4 py-1.5 bg-action-primary hover:bg-action-primary/90 text-text-inverse font-mono text-xs font-semibold rounded-md shadow-xs transition-colors"
          >
            Save Configuration
          </button>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border-subtle pb-px text-xs font-mono">
        {[
          { id: 'general', label: 'General' },
          { id: 'catalog', label: 'Catalog Rules' },
          { id: 'search', label: 'Search & Indexing' },
          { id: 'system', label: 'System & Backups' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-t-md font-semibold transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-action-primary text-text-primary bg-bg-surface'
                : 'border-transparent text-text-tertiary hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <form onSubmit={handleSaveSettings} className="space-y-5">
        {activeTab === 'general' && (
          <AdminCard title="General System Properties" subtitle="Global branding and metadata configurations">
            <div className="space-y-4 max-w-xl">
              <AdminInput
                label="Public Website Title"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
              />
              <AdminInput
                label="Canonical Source Library"
                readOnly
                value="Iconoir (Official Upstream)"
                className="opacity-80"
                helpText="GRIDFRAME is canonically grounded on the Iconoir vector library."
              />
              <AdminInput
                label="Vector Grid Size"
                readOnly
                value="24 × 24 px"
                className="opacity-80"
                helpText="Standard vector coordinate grid specification"
              />
            </div>
          </AdminCard>
        )}

        {activeTab === 'catalog' && (
          <AdminCard title="Catalog & Variant Rules" subtitle="Default explorer behaviors and layout standards">
            <div className="space-y-4 max-w-xl">
              <AdminSelect
                label="Default Icon Variant"
                value={defaultVariant}
                onChange={(e) => setDefaultVariant(e.target.value)}
                options={[
                  { value: 'regular', label: 'Regular (2.0px Baseline)' },
                  { value: 'light', label: 'Light (1.5px Fine Line)' },
                  { value: 'filled', label: 'Filled (Solid Silhouette)' },
                  { value: 'duotone', label: 'Duotone (2-Tone)' },
                  { value: 'duotone-line', label: 'Duotone Line' },
                ]}
              />

              <AdminSelect
                label="Default Icons Per Page in Admin"
                value={defaultPageSize}
                onChange={(e) => setDefaultPageSize(e.target.value)}
                options={[
                  { value: '25', label: '25 icons' },
                  { value: '50', label: '50 icons' },
                  { value: '100', label: '100 icons' },
                  { value: '200', label: '200 icons' },
                ]}
              />

              <AdminToggle
                label="Enforce Real-Time SVG Validation"
                description="Automatically validate viewBox (0 0 24 24) and path security on every variant."
                checked={autoValidateSvg}
                onChange={setAutoValidateSvg}
              />
            </div>
          </AdminCard>
        )}

        {activeTab === 'search' && (
          <AdminCard title="Search & Query Engine" subtitle="Fuzzy matching and synonym trigger parameters">
            <div className="space-y-4 max-w-xl">
              <AdminToggle
                label="Enable Semantic Synonym Triggers"
                description="Matches alternate keywords, aliases, and category tokens during explorer searches."
                checked={enableSynonymSearch}
                onChange={setEnableSynonymSearch}
              />

              <AdminInput
                label="Search Debounce Delay (ms)"
                type="number"
                defaultValue={150}
                helpText="Debounce threshold for responsive search input without UI jank."
              />
            </div>
          </AdminCard>
        )}

        {activeTab === 'system' && (
          <div className="space-y-5">
            <AdminCard title="Catalog Backup & Export" subtitle="Download and archive complete JSON catalog definitions">
              <div className="space-y-3">
                <p className="text-xs text-text-secondary">
                  Download a full JSON backup snapshot containing all {icons.length.toLocaleString()} icon families, {categories.length} categories, and {collections.length} collections.
                </p>
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="px-3.5 py-2 bg-bg-surface hover:bg-bg-secondary border border-border-subtle rounded-md text-xs font-mono text-text-primary transition-colors flex items-center gap-2 shadow-xs"
                >
                  <span>💾</span>
                  <span>Download Catalog Backup JSON</span>
                </button>
              </div>
            </AdminCard>

            <AdminCard
              title="Factory Reset & Override Clear"
              subtitle="Revert local mutations to canonical source state"
              className="border-rose-500/20"
            >
              <div className="space-y-3">
                <p className="text-xs text-text-secondary">
                  Clears all browser localStorage overrides and reloads the canonical disk catalog.
                </p>
                <button
                  type="button"
                  onClick={() => setIsResetModalOpen(true)}
                  className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 rounded-md text-xs font-mono font-semibold transition-colors"
                >
                  Reset All Overrides to Factory
                </button>
              </div>
            </AdminCard>
          </div>
        )}
      </form>

      {/* Reset Confirmation Modal */}
      <AdminConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
        title="Reset All Local Overrides?"
        variant="danger"
        confirmLabel="Reset to Factory Defaults"
        message="This will remove all custom status flags, tag edits, and created collections saved in this browser. The canonical disk catalog will be restored."
      />
    </div>
  );
};
