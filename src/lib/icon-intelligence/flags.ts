import {
  DEFAULT_INTELLIGENCE_FLAGS,
  IconIntelligenceFeatureFlags,
} from '@/types/intelligence';

const STORAGE_KEY = 'gridframe_intelligence_flags_v2';

export function getIntelligenceFlags(): IconIntelligenceFeatureFlags {
  if (typeof window === 'undefined') {
    return DEFAULT_INTELLIGENCE_FLAGS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_INTELLIGENCE_FLAGS;
    return { ...DEFAULT_INTELLIGENCE_FLAGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_INTELLIGENCE_FLAGS;
  }
}

export function setIntelligenceFlag(
  key: keyof IconIntelligenceFeatureFlags,
  value: boolean
): IconIntelligenceFeatureFlags {
  const current = getIntelligenceFlags();
  const updated = { ...current, [key]: value };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignored
    }
  }
  return updated;
}
