import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export interface ActivityEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  category: 'icons' | 'categories' | 'collections' | 'users' | 'system' | 'sync';
  status: 'success' | 'warning' | 'info';
  details?: string;
}

const ACTIVITY_STORAGE_KEY = 'gridframe_admin_activity_v1';

const INITIAL_ACTIVITIES: ActivityEvent[] = [
  {
    id: 'act-001',
    timestamp: '2026-09-14T09:40:00Z',
    actor: 'Lead Designer & Admin',
    action: 'Batch Expansion Ingested',
    target: 'Batch 1 (+250 Canonical Families)',
    category: 'sync',
    status: 'success',
    details: 'Ingested 250 canonical families (1,250 handcrafted 5-style vector assets)',
  },
  {
    id: 'act-002',
    timestamp: '2026-09-14T09:30:00Z',
    actor: 'System Automated QA',
    action: 'Geometry Validation Audit',
    target: '8,245 Variants',
    category: 'system',
    status: 'success',
    details: 'Completed comprehensive SVG bounds and topology verification with 0 errors.',
  },
  {
    id: 'act-003',
    timestamp: '2026-09-13T18:15:00Z',
    actor: 'Lead Designer & Admin',
    action: 'Category Taxonomy Updated',
    target: '44 Canonical Categories',
    category: 'categories',
    status: 'info',
    details: 'Enforced strict primary & secondary category mapping across library.',
  },
  {
    id: 'act-004',
    timestamp: '2026-09-13T14:20:00Z',
    actor: 'Vector Quality Editor',
    action: 'Curated Collection Created',
    target: 'Cloud & DevOps Suite',
    category: 'collections',
    status: 'success',
    details: 'Curated 32 cloud and infrastructure icons into featured collection.',
  },
];

interface AdminActivityContextType {
  activities: ActivityEvent[];
  logActivity: (event: Omit<ActivityEvent, 'id' | 'timestamp'>) => void;
  clearActivities: () => void;
}

const AdminActivityContext = createContext<AdminActivityContextType | undefined>(undefined);

export const AdminActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<ActivityEvent[]>(() => {
    try {
      const stored = localStorage.getItem(ACTIVITY_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return INITIAL_ACTIVITIES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activities));
    } catch (e) {
      console.warn('Failed to persist admin activities', e);
    }
  }, [activities]);

  const logActivity = useCallback((event: Omit<ActivityEvent, 'id' | 'timestamp'>) => {
    const newEvent: ActivityEvent = {
      ...event,
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => [newEvent, ...prev.slice(0, 499)]); // Keep last 500
  }, []);

  const clearActivities = useCallback(() => {
    setActivities([]);
  }, []);

  const value = useMemo(
    () => ({
      activities,
      logActivity,
      clearActivities,
    }),
    [activities, logActivity, clearActivities]
  );

  return <AdminActivityContext.Provider value={value}>{children}</AdminActivityContext.Provider>;
};

export const useAdminActivity = (): AdminActivityContextType => {
  const context = useContext(AdminActivityContext);
  if (!context) {
    throw new Error('useAdminActivity must be used within an AdminActivityProvider');
  }
  return context;
};
