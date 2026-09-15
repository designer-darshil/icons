import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { Icon, IconVariant } from '@/types/icon';
import { GRIDFRAME_ICONS } from '@/data/icons/gridframe-catalog';
import { OFFICIAL_CATEGORIES, type CanonicalCategoryDefinition } from '@/data/category-registry';
import { useAdminActivity } from './AdminActivityContext';
import { useAdminAuth } from '../auth/AdminAuthContext';

export interface AdminIcon extends Icon {
  status?: 'published' | 'draft' | 'archived';
  updatedAt?: string;
  sourceLibrary?: string;
  draftSvg?: string;
}

export interface CuratedCollection {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconSlugs: string[];
  isPublished: boolean;
  updatedAt: string;
  coverIconSlug?: string;
}

const CATALOG_OVERRIDE_KEY = 'gridframe_admin_catalog_overrides_v1';
const CATEGORIES_KEY = 'gridframe_admin_categories_v1';
const COLLECTIONS_KEY = 'gridframe_admin_collections_v1';
const CUSTOM_ICONS_KEY = 'gridframe_admin_custom_icons_v1';

const DEFAULT_COLLECTIONS: CuratedCollection[] = [
  {
    id: 'col-001',
    name: 'Cloud & Infrastructure Suite',
    slug: 'cloud-infrastructure',
    description: 'Essential icons for cloud providers, server architectures, databases, and DevOps workflows.',
    iconSlugs: ['cloud-server', 'cloud-storage', 'cloud-lock', 'cloud-sync', 'server-rack', 'database-table', 'terminal-window', 'api-connection'],
    isPublished: true,
    updatedAt: '2026-09-14T09:40:00Z',
    coverIconSlug: 'cloud-server',
  },
  {
    id: 'col-002',
    name: 'Security & Identity Shield',
    slug: 'security-identity',
    description: 'High-security UI symbols, biometric authentication, firewall locks, and access control.',
    iconSlugs: ['shield-lock', 'shield-alert', 'fingerprint-scan', 'key-round', 'two-factor-auth', 'permission-admin', 'user-badge-verified'],
    isPublished: true,
    updatedAt: '2026-09-14T09:35:00Z',
    coverIconSlug: 'shield-lock',
  },
  {
    id: 'col-003',
    name: 'Modern E-Commerce',
    slug: 'modern-ecommerce',
    description: 'Shopping carts, payment verification, product tags, fast shipping, and receipts.',
    iconSlugs: ['shopping-bag-add', 'shopping-cart-add', 'delivery-truck-fast', 'receipt-item', 'price-tag-discount', 'wallet-money', 'credit-card-chip'],
    isPublished: true,
    updatedAt: '2026-09-14T09:30:00Z',
    coverIconSlug: 'shopping-cart-add',
  },
  {
    id: 'col-004',
    name: 'Design System Essentials',
    slug: 'design-system-essentials',
    description: 'Precision vector node tools, color palettes, spacing guides, and responsive layout cursors.',
    iconSlugs: ['cursor-pointer', 'pen-tool', 'bezier-curve', 'artboard', 'frame-selection', 'color-picker', 'grid-canvas', 'spacing-horizontal'],
    isPublished: true,
    updatedAt: '2026-09-14T09:25:00Z',
    coverIconSlug: 'pen-tool',
  },
];

interface AdminCatalogContextType {
  icons: AdminIcon[];
  categories: CanonicalCategoryDefinition[];
  collections: CuratedCollection[];
  isLoading: boolean;
  getIconBySlug: (slug: string) => AdminIcon | undefined;
  createIcon: (icon: AdminIcon) => { success: boolean; error?: string };
  updateIcon: (slug: string, updates: Partial<AdminIcon>) => void;
  bulkUpdateStatus: (slugs: string[], status: 'published' | 'draft' | 'archived') => void;
  bulkUpdateCategory: (slugs: string[], categorySlug: string) => void;
  deleteIcon: (slug: string) => { success: boolean; warnings?: string[] };
  addVariant: (slug: string, variant: IconVariant) => { success: boolean; error?: string };
  updateVariantSvg: (slug: string, variantStyle: string, newSvg: string, newViewBox?: string, changeSummary?: string) => void;
  deleteVariant: (slug: string, variantStyle: string) => { success: boolean; error?: string };
  publishIcon: (slug: string) => void;
  unpublishIcon: (slug: string) => void;
  createCategory: (cat: CanonicalCategoryDefinition) => void;
  updateCategory: (slug: string, updates: Partial<CanonicalCategoryDefinition>) => void;
  deleteCategory: (slug: string) => { success: boolean; error?: string };
  createCollection: (col: Omit<CuratedCollection, 'id' | 'updatedAt'>) => void;
  updateCollection: (id: string, updates: Partial<CuratedCollection>) => void;
  deleteCollection: (id: string) => void;
  resetAllOverrides: () => void;
}

const AdminCatalogContext = createContext<AdminCatalogContextType | undefined>(undefined);

export const AdminCatalogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logActivity } = useAdminActivity();
  const { user } = useAdminAuth();
  const [isLoading] = useState(false);

  // Initialize icons with custom uploads + override cache
  const [icons, setIcons] = useState<AdminIcon[]>(() => {
    try {
      const overridesRaw = localStorage.getItem(CATALOG_OVERRIDE_KEY);
      const overrides: Record<string, Partial<AdminIcon>> = overridesRaw ? JSON.parse(overridesRaw) : {};

      const customIconsRaw = localStorage.getItem(CUSTOM_ICONS_KEY);
      const customIcons: AdminIcon[] = customIconsRaw ? JSON.parse(customIconsRaw) : [];

      const baseList = GRIDFRAME_ICONS.map((baseIcon) => {
        const custom = overrides[baseIcon.slug] || {};
        return {
          ...baseIcon,
          status: (custom.status || 'published') as 'published' | 'draft' | 'archived',
          updatedAt: custom.updatedAt || '2026-09-14',
          sourceLibrary: custom.sourceLibrary || 'Iconoir (Canonical)',
          ...custom,
        };
      });

      return [...customIcons, ...baseList];
    } catch {
      return GRIDFRAME_ICONS.map((baseIcon) => ({
        ...baseIcon,
        status: 'published' as const,
        updatedAt: '2026-09-14',
        sourceLibrary: 'Iconoir (Canonical)',
      }));
    }
  });

  // Initialize categories
  const [categories, setCategories] = useState<CanonicalCategoryDefinition[]>(() => {
    try {
      const stored = localStorage.getItem(CATEGORIES_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return OFFICIAL_CATEGORIES;
  });

  // Initialize collections
  const [collections, setCollections] = useState<CuratedCollection[]>(() => {
    try {
      const stored = localStorage.getItem(COLLECTIONS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return DEFAULT_COLLECTIONS;
  });

  // Sync overrides & custom icons to localStorage
  const saveIconOverrides = useCallback((currentIcons: AdminIcon[]) => {
    try {
      const overrides: Record<string, Partial<AdminIcon>> = {};
      const customIcons: AdminIcon[] = [];

      for (const icon of currentIcons) {
        // Track custom uploaded icons
        if (icon.sourceLibrary && icon.sourceLibrary.includes('Custom')) {
          customIcons.push(icon);
        } else if (icon.status !== 'published' || icon.updatedAt !== '2026-09-14' || icon.draftSvg || icon.variants) {
          overrides[icon.slug] = {
            name: icon.name,
            category: icon.category,
            primaryCategory: icon.primaryCategory,
            secondaryCategories: icon.secondaryCategories,
            tags: icon.tags,
            keywords: icon.keywords,
            aliases: icon.aliases,
            useCases: icon.useCases,
            status: icon.status,
            updatedAt: icon.updatedAt,
            variants: icon.variants,
            svg: icon.svg,
            viewBox: icon.viewBox,
            draftSvg: icon.draftSvg,
          };
        }
      }
      localStorage.setItem(CATALOG_OVERRIDE_KEY, JSON.stringify(overrides));
      localStorage.setItem(CUSTOM_ICONS_KEY, JSON.stringify(customIcons));
    } catch (e) {
      console.warn('Failed to save catalog overrides', e);
    }
  }, []);

  const getIconBySlug = useCallback(
    (slug: string): AdminIcon | undefined => {
      return icons.find((i) => i.slug === slug || i.id === slug);
    },
    [icons]
  );

  const createIcon = useCallback(
    (newIcon: AdminIcon): { success: boolean; error?: string } => {
      const exists = icons.some((i) => i.slug === newIcon.slug || i.id === newIcon.id);
      if (exists) {
        return { success: false, error: `An icon with slug "${newIcon.slug}" already exists.` };
      }

      setIcons((prev) => {
        const next = [newIcon, ...prev];
        saveIconOverrides(next);
        return next;
      });

      logActivity({
        actor: user?.name || 'Admin',
        action: 'New SVG Icon Created',
        target: newIcon.name,
        category: 'icons',
        status: 'success',
        details: `Created new concept [${newIcon.slug}] (Status: ${newIcon.status || 'draft'})`,
      });

      return { success: true };
    },
    [icons, saveIconOverrides, logActivity, user]
  );

  const updateIcon = useCallback(
    (slug: string, updates: Partial<AdminIcon>) => {
      setIcons((prev) => {
        const next = prev.map((icon) => {
          if (icon.slug === slug) {
            const updated = {
              ...icon,
              ...updates,
              updatedAt: new Date().toISOString().split('T')[0],
            };
            return updated;
          }
          return icon;
        });
        saveIconOverrides(next);
        return next;
      });

      logActivity({
        actor: user?.name || 'Admin',
        action: 'Icon Metadata Updated',
        target: slug,
        category: 'icons',
        status: 'success',
        details: `Updated fields: ${Object.keys(updates).join(', ')}`,
      });
    },
    [saveIconOverrides, logActivity, user]
  );

  const addVariant = useCallback(
    (slug: string, variant: IconVariant): { success: boolean; error?: string } => {
      let errorMsg: string | undefined;

      setIcons((prev) => {
        const next = prev.map((icon) => {
          if (icon.slug === slug) {
            const existingVariants = icon.variants || [];
            if (existingVariants.some((v) => v.style === variant.style)) {
              errorMsg = `Variant style "${variant.style}" already exists for this icon.`;
              return icon;
            }
            return {
              ...icon,
              variants: [...existingVariants, variant],
              updatedAt: new Date().toISOString().split('T')[0],
            };
          }
          return icon;
        });
        if (!errorMsg) saveIconOverrides(next);
        return next;
      });

      if (errorMsg) return { success: false, error: errorMsg };

      logActivity({
        actor: user?.name || 'Admin',
        action: 'Icon Variant Added',
        target: slug,
        category: 'icons',
        status: 'success',
        details: `Added authentic [${variant.style}] variant to [${slug}]`,
      });

      return { success: true };
    },
    [saveIconOverrides, logActivity, user]
  );

  const updateVariantSvg = useCallback(
    (slug: string, variantStyle: string, newSvg: string, newViewBox: string = '0 0 24 24', changeSummary?: string) => {
      setIcons((prev) => {
        const next = prev.map((icon) => {
          if (icon.slug === slug) {
            const updatedVariants = (icon.variants || []).map((v) => {
              if (v.style === variantStyle) {
                return {
                  ...v,
                  svg: newSvg,
                  viewBox: newViewBox,
                };
              }
              return v;
            });

            const isRegular = variantStyle === 'regular' || icon.style === variantStyle;
            return {
              ...icon,
              svg: isRegular ? newSvg : icon.svg,
              viewBox: isRegular ? newViewBox : icon.viewBox,
              variants: updatedVariants,
              updatedAt: new Date().toISOString().split('T')[0],
            };
          }
          return icon;
        });
        saveIconOverrides(next);
        return next;
      });

      logActivity({
        actor: user?.name || 'Admin',
        action: 'SVG Source Modified',
        target: `${slug} (${variantStyle})`,
        category: 'icons',
        status: 'success',
        details: changeSummary || `Updated SVG source paths for ${variantStyle} variant.`,
      });
    },
    [saveIconOverrides, logActivity, user]
  );

  const deleteVariant = useCallback(
    (slug: string, variantStyle: string): { success: boolean; error?: string } => {
      if (variantStyle === 'regular') {
        return { success: false, error: 'Cannot delete the canonical Regular variant.' };
      }

      setIcons((prev) => {
        const next = prev.map((icon) => {
          if (icon.slug === slug) {
            return {
              ...icon,
              variants: (icon.variants || []).filter((v) => v.style !== variantStyle),
              updatedAt: new Date().toISOString().split('T')[0],
            };
          }
          return icon;
        });
        saveIconOverrides(next);
        return next;
      });

      logActivity({
        actor: user?.name || 'Admin',
        action: 'Variant Removed',
        target: `${slug} (${variantStyle})`,
        category: 'icons',
        status: 'warning',
        details: `Deleted variant ${variantStyle} from [${slug}]`,
      });

      return { success: true };
    },
    [saveIconOverrides, logActivity, user]
  );

  const publishIcon = useCallback(
    (slug: string) => {
      updateIcon(slug, { status: 'published' });
      logActivity({
        actor: user?.name || 'Admin',
        action: 'Icon Published to Live Catalog',
        target: slug,
        category: 'icons',
        status: 'success',
        details: `Published icon [${slug}] to public catalog.`,
      });
    },
    [updateIcon, logActivity, user]
  );

  const unpublishIcon = useCallback(
    (slug: string) => {
      updateIcon(slug, { status: 'draft' });
      logActivity({
        actor: user?.name || 'Admin',
        action: 'Icon Reverted to Draft',
        target: slug,
        category: 'icons',
        status: 'info',
        details: `Unpublished icon [${slug}], marked as draft.`,
      });
    },
    [updateIcon, logActivity, user]
  );

  const bulkUpdateStatus = useCallback(
    (slugs: string[], status: 'published' | 'draft' | 'archived') => {
      const slugSet = new Set(slugs);
      setIcons((prev) => {
        const next = prev.map((icon) => {
          if (slugSet.has(icon.slug)) {
            return {
              ...icon,
              status,
              updatedAt: new Date().toISOString().split('T')[0],
            };
          }
          return icon;
        });
        saveIconOverrides(next);
        return next;
      });

      logActivity({
        actor: user?.name || 'Admin',
        action: `Bulk Status Changed to ${status}`,
        target: `${slugs.length} icons`,
        category: 'icons',
        status: 'info',
        details: `Updated icons: ${slugs.slice(0, 5).join(', ')}${slugs.length > 5 ? '...' : ''}`,
      });
    },
    [saveIconOverrides, logActivity, user]
  );

  const bulkUpdateCategory = useCallback(
    (slugs: string[], categorySlug: string) => {
      const targetCat = categories.find((c) => c.slug === categorySlug);
      const categoryName = targetCat ? targetCat.name : categorySlug;
      const slugSet = new Set(slugs);

      setIcons((prev) => {
        const next = prev.map((icon) => {
          if (slugSet.has(icon.slug)) {
            return {
              ...icon,
              category: categoryName,
              primaryCategory: categorySlug,
              updatedAt: new Date().toISOString().split('T')[0],
            };
          }
          return icon;
        });
        saveIconOverrides(next);
        return next;
      });

      logActivity({
        actor: user?.name || 'Admin',
        action: `Bulk Reassigned Category to ${categoryName}`,
        target: `${slugs.length} icons`,
        category: 'icons',
        status: 'info',
        details: `Reassigned icons to [${categorySlug}]`,
      });
    },
    [categories, saveIconOverrides, logActivity, user]
  );

  const deleteIcon = useCallback(
    (slug: string): { success: boolean; warnings?: string[] } => {
      const warnings: string[] = [];

      // Check collections referencing this icon
      const matchingCols = collections.filter((c) => c.iconSlugs.includes(slug));
      if (matchingCols.length > 0) {
        warnings.push(`Referenced in ${matchingCols.length} collection(s): ${matchingCols.map((c) => c.name).join(', ')}`);
      }

      setIcons((prev) => {
        const next = prev.filter((i) => i.slug !== slug);
        saveIconOverrides(next);
        return next;
      });

      logActivity({
        actor: user?.name || 'Admin',
        action: 'Icon Deleted / Removed',
        target: slug,
        category: 'icons',
        status: 'warning',
        details: `Deleted icon concept [${slug}]`,
      });

      return { success: true, warnings: warnings.length > 0 ? warnings : undefined };
    },
    [collections, saveIconOverrides, logActivity, user]
  );

  const createCategory = useCallback(
    (cat: CanonicalCategoryDefinition) => {
      setCategories((prev) => {
        const updated = [...prev, cat];
        try {
          localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated));
        } catch (e) {
          console.warn(e);
        }
        return updated;
      });

      logActivity({
        actor: user?.name || 'Admin',
        action: 'Category Created',
        target: cat.name,
        category: 'categories',
        status: 'success',
        details: `Created new category [${cat.slug}]`,
      });
    },
    [logActivity, user]
  );

  const updateCategory = useCallback(
    (slug: string, updates: Partial<CanonicalCategoryDefinition>) => {
      setCategories((prev) => {
        const updated = prev.map((c) => (c.slug === slug ? { ...c, ...updates } : c));
        try {
          localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated));
        } catch (e) {
          console.warn(e);
        }
        return updated;
      });

      logActivity({
        actor: user?.name || 'Admin',
        action: 'Category Updated',
        target: slug,
        category: 'categories',
        status: 'info',
        details: `Updated category metadata [${slug}]`,
      });
    },
    [logActivity, user]
  );

  const deleteCategory = useCallback(
    (slug: string): { success: boolean; error?: string } => {
      const isAssigned = icons.some((i) => i.primaryCategory === slug);
      if (isAssigned) {
        return { success: false, error: 'Cannot delete a category with active assigned icons. Reassign icons first.' };
      }

      setCategories((prev) => {
        const updated = prev.filter((c) => c.slug !== slug);
        try {
          localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated));
        } catch (e) {
          console.warn(e);
        }
        return updated;
      });

      logActivity({
        actor: user?.name || 'Admin',
        action: 'Category Deleted',
        target: slug,
        category: 'categories',
        status: 'warning',
        details: `Deleted category definition [${slug}]`,
      });

      return { success: true };
    },
    [icons, logActivity, user]
  );

  const createCollection = useCallback(
    (col: Omit<CuratedCollection, 'id' | 'updatedAt'>) => {
      const newCol: CuratedCollection = {
        ...col,
        id: `col-${Date.now().toString(36)}`,
        updatedAt: new Date().toISOString(),
      };
      setCollections((prev) => {
        const updated = [newCol, ...prev];
        try {
          localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(updated));
        } catch (e) {
          console.warn(e);
        }
        return updated;
      });

      logActivity({
        actor: user?.name || 'Admin',
        action: 'Collection Created',
        target: col.name,
        category: 'collections',
        status: 'success',
        details: `Created new curated collection with ${col.iconSlugs.length} icons`,
      });
    },
    [logActivity, user]
  );

  const updateCollection = useCallback(
    (id: string, updates: Partial<CuratedCollection>) => {
      setCollections((prev) => {
        const updated = prev.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
        try {
          localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(updated));
        } catch (e) {
          console.warn(e);
        }
        return updated;
      });

      logActivity({
        actor: user?.name || 'Admin',
        action: 'Collection Updated',
        target: id,
        category: 'collections',
        status: 'info',
        details: `Updated collection ID [${id}]`,
      });
    },
    [logActivity, user]
  );

  const deleteCollection = useCallback(
    (id: string) => {
      setCollections((prev) => {
        const updated = prev.filter((c) => c.id !== id);
        try {
          localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(updated));
        } catch (e) {
          console.warn(e);
        }
        return updated;
      });

      logActivity({
        actor: user?.name || 'Admin',
        action: 'Collection Deleted',
        target: id,
        category: 'collections',
        status: 'warning',
        details: `Deleted collection ID [${id}]`,
      });
    },
    [logActivity, user]
  );

  const resetAllOverrides = useCallback(() => {
    localStorage.removeItem(CATALOG_OVERRIDE_KEY);
    localStorage.removeItem(CATEGORIES_KEY);
    localStorage.removeItem(COLLECTIONS_KEY);
    localStorage.removeItem(CUSTOM_ICONS_KEY);

    setIcons(
      GRIDFRAME_ICONS.map((baseIcon) => ({
        ...baseIcon,
        status: 'published' as const,
        updatedAt: '2026-09-14',
        sourceLibrary: 'Iconoir (Canonical)',
      }))
    );
    setCategories(OFFICIAL_CATEGORIES);
    setCollections(DEFAULT_COLLECTIONS);

    logActivity({
      actor: user?.name || 'Admin',
      action: 'Overrides Reset to Factory',
      target: 'Catalog Store',
      category: 'system',
      status: 'warning',
      details: 'Cleared all local storage overrides and reloaded canonical disk catalog.',
    });
  }, [logActivity, user]);

  const value = useMemo(
    () => ({
      icons,
      categories,
      collections,
      isLoading,
      getIconBySlug,
      createIcon,
      updateIcon,
      bulkUpdateStatus,
      bulkUpdateCategory,
      deleteIcon,
      addVariant,
      updateVariantSvg,
      deleteVariant,
      publishIcon,
      unpublishIcon,
      createCategory,
      updateCategory,
      deleteCategory,
      createCollection,
      updateCollection,
      deleteCollection,
      resetAllOverrides,
    }),
    [
      icons,
      categories,
      collections,
      isLoading,
      getIconBySlug,
      createIcon,
      updateIcon,
      bulkUpdateStatus,
      bulkUpdateCategory,
      deleteIcon,
      addVariant,
      updateVariantSvg,
      deleteVariant,
      publishIcon,
      unpublishIcon,
      createCategory,
      updateCategory,
      deleteCategory,
      createCollection,
      updateCollection,
      deleteCollection,
      resetAllOverrides,
    ]
  );

  return <AdminCatalogContext.Provider value={value}>{children}</AdminCatalogContext.Provider>;
};

export const useAdminCatalog = (): AdminCatalogContextType => {
  const context = useContext(AdminCatalogContext);
  if (!context) {
    throw new Error('useAdminCatalog must be used within an AdminCatalogProvider');
  }
  return context;
};
