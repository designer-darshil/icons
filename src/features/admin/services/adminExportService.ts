import type { AdminIcon, CuratedCollection } from '../context/AdminCatalogContext';
import type { CanonicalCategoryDefinition } from '@/data/category-registry';

export interface AdminBackupPayload {
  version: string;
  exportedAt: string;
  icons: AdminIcon[];
  categories: CanonicalCategoryDefinition[];
  collections: CuratedCollection[];
}

export function downloadCatalogBackupJson(
  icons: AdminIcon[],
  categories: CanonicalCategoryDefinition[],
  collections: CuratedCollection[]
) {
  const payload: AdminBackupPayload = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    icons,
    categories,
    collections,
  };

  const jsonStr = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `gridframe-catalog-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
