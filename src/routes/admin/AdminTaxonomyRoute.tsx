import React, { useState, useMemo } from 'react';
import { useAdminCatalog, type AdminIcon } from '@/features/admin/context/AdminCatalogContext';
import { useAdminActivity } from '@/features/admin/context/AdminActivityContext';
import { AdminTagInput, AdminSelect } from '@/features/admin/components/AdminFormControls';
import { IconPreviewSvg } from '@/components/icons/IconPreviewSvg';
import {
  Search,
  Edit,
  Save,
} from 'lucide-react';

export const AdminTaxonomyRoute: React.FC = () => {
  const { icons, categories, updateIcon } = useAdminCatalog();
  const { logActivity } = useAdminActivity();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingIconSlug, setEditingIconSlug] = useState<string | null>(null);

  // Editing state
  const [editAliases, setEditAliases] = useState<string[]>([]);
  const [editKeywords, setEditKeywords] = useState<string[]>([]);
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editCategory, setEditCategory] = useState<string>('');
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  const filteredIcons = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return icons.filter((i) => {
      if (q) {
        const matchesName = i.name.toLowerCase().includes(q);
        const matchesSlug = i.slug.toLowerCase().includes(q);
        const matchesAlias = (i.aliases || []).some((a) => a.toLowerCase().includes(q));
        if (!matchesName && !matchesSlug && !matchesAlias) return false;
      }
      if (selectedCategory !== 'all') {
        const matchesCat = i.primaryCategory === selectedCategory || i.category.toLowerCase() === selectedCategory.toLowerCase();
        if (!matchesCat) return false;
      }
      return true;
    });
  }, [icons, searchQuery, selectedCategory]);

  const handleStartEdit = (icon: AdminIcon) => {
    setEditingIconSlug(icon.slug);
    setEditAliases(icon.aliases || []);
    setEditKeywords(icon.keywords || []);
    setEditTags(icon.tags || []);
    setEditCategory(icon.primaryCategory || icon.category.toLowerCase());
  };

  const handleSaveTaxonomy = (slug: string) => {
    const targetCategory = categories.find((c) => c.slug === editCategory);
    updateIcon(slug, {
      aliases: editAliases,
      keywords: editKeywords,
      tags: editTags,
      primaryCategory: editCategory,
      category: targetCategory ? targetCategory.name : editCategory,
    });

    logActivity({
      actor: 'Admin',
      action: 'Taxonomy Updated',
      target: `/${slug}`,
      category: 'icons',
      status: 'success',
      details: `Updated aliases & semantic tags for /${slug}`,
    });
    setSavedFeedback(`✓ Saved taxonomy for /${slug}`);
    setEditingIconSlug(null);
    setTimeout(() => setSavedFeedback(null), 2500);
  };

  return (
    <div className="space-y-6 pb-12 font-mono">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-text-primary tracking-tight">
              SEMANTIC TAXONOMY EDITOR
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase">
              Search & Discovery
            </span>
          </div>
          <p className="text-xs text-text-tertiary font-sans mt-0.5">
            Manage search aliases, synonymous action roles, keywords, and taxonomy category bindings.
          </p>
        </div>

        {savedFeedback && (
          <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded animate-in fade-in">
            {savedFeedback}
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="p-3 bg-bg-surface border border-border-subtle rounded-sm flex flex-col sm:flex-row items-center gap-3 text-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 text-text-tertiary absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search icon name, slug, or alias to edit..."
            className="w-full pl-8 pr-3 py-1.5 bg-bg-primary border border-border-default rounded-xs text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          aria-label="Filter by Category"
          className="w-full sm:w-56 px-3 py-1.5 bg-bg-primary border border-border-default rounded-xs text-xs text-text-primary focus:outline-none focus:border-accent"
        >
          <option value="all">All Categories ({categories.length})</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Taxonomy Icon List */}
      <div className="space-y-3">
        {filteredIcons.slice(0, 30).map((icon) => {
          const isEditing = editingIconSlug === icon.slug;

          return (
            <div
              key={icon.slug}
              className={`p-4 rounded-sm border transition-all ${
                isEditing ? 'bg-bg-surface border-accent shadow-xs' : 'bg-bg-surface/70 border-border-subtle hover:border-border-default'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded bg-bg-primary border border-border-subtle flex items-center justify-center text-text-primary shrink-0 mt-0.5">
                    <IconPreviewSvg
                      svgContent={icon.svg}
                      viewBox={icon.viewBox || '0 0 24 24'}
                      size={22}
                      color="currentColor"
                      strokeWidth={1.5}
                    />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xs font-bold text-text-primary">{icon.name}</h3>
                      <span className="text-[10px] text-text-tertiary">/{icon.slug}</span>
                      <span className="px-1.5 py-0.2 bg-bg-primary text-text-secondary border border-border-subtle rounded text-[9px]">
                        {icon.category}
                      </span>
                    </div>

                    {!isEditing ? (
                      <div className="flex items-center gap-4 text-[11px] text-text-tertiary pt-1 flex-wrap">
                        <div>
                          <strong className="text-text-secondary">Aliases:</strong>{' '}
                          {(icon.aliases || []).length > 0 ? (icon.aliases || []).join(', ') : 'None'}
                        </div>
                        <div>
                          <strong className="text-text-secondary">Keywords:</strong>{' '}
                          {(icon.keywords || []).slice(0, 5).join(', ')}
                        </div>
                      </div>
                    ) : (
                      <div className="pt-3 space-y-3 w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <AdminSelect
                            label="Taxonomy Category"
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            options={categories.map((c) => ({ value: c.slug, label: c.name }))}
                          />
                          <AdminTagInput
                            label="Search Aliases (Synonyms)"
                            tags={editAliases}
                            onChange={setEditAliases}
                            placeholder="Type alias and press enter..."
                          />
                        </div>

                        <AdminTagInput
                          label="Keywords & Semantic Roles"
                          tags={editKeywords}
                          onChange={setEditKeywords}
                          placeholder="e.g. destructive, navigation, system..."
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="shrink-0 pt-0.5">
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={() => handleStartEdit(icon)}
                      className="px-2.5 py-1 bg-bg-surface hover:bg-bg-secondary border border-border-default rounded text-[11px] text-text-primary flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Edit className="w-3 h-3 text-accent" />
                      <span>Edit Taxonomy</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingIconSlug(null)}
                        className="px-2.5 py-1 bg-bg-primary border border-border-default rounded text-[11px] text-text-tertiary cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveTaxonomy(icon.slug)}
                        className="flex items-center gap-1 px-3 py-1 bg-accent hover:bg-accent-hover text-accent-fg font-bold text-[11px] rounded uppercase cursor-pointer"
                      >
                        <Save className="w-3 h-3" />
                        <span>Save</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
