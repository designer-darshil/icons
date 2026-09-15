import type { UIContextSpec, UIContextKey } from '@/types/intelligence';

export const UI_CONTEXT_SPECS: Record<UIContextKey, UIContextSpec> = {
  button: {
    key: 'button',
    title: 'Action Button',
    description: 'Inline leading/trailing action trigger with micro-typography.',
    recommendedSize: 16,
  },
  toolbar: {
    key: 'toolbar',
    title: 'Editor Toolbar',
    description: 'Compact 16px tool button within dense productivity toolbars.',
    recommendedSize: 16,
  },
  navigation: {
    key: 'navigation',
    title: 'Sidebar Navigation',
    description: 'Primary sidebar item with active, hover, and collapsed states.',
    recommendedSize: 18,
  },
  input: {
    key: 'input',
    title: 'Form Input Field',
    description: 'Leading input icon indicator and trailing status validation.',
    recommendedSize: 16,
  },
  table: {
    key: 'table',
    title: 'Data Table Row',
    description: 'Row-level quick action triggers and inline status cells.',
    recommendedSize: 14,
  },
  dropdown: {
    key: 'dropdown',
    title: 'Dropdown Menu',
    description: 'Hierarchical popover menu item with keyboard shortcut.',
    recommendedSize: 16,
  },
  'empty-state': {
    key: 'empty-state',
    title: 'Empty State Callout',
    description: 'Central featured visual anchor in zero-data empty states.',
    recommendedSize: 48,
  },
  notification: {
    key: 'notification',
    title: 'Notification Toast',
    description: 'Alert and message banner status indicator.',
    recommendedSize: 20,
  },
  'card-header': {
    key: 'card-header',
    title: 'Card Header',
    description: 'Dashboard metric and widget title emblem.',
    recommendedSize: 20,
  },
  badge: {
    key: 'badge',
    title: 'Pill Status Badge',
    description: 'Micro tag indicator in dense metadata rows.',
    recommendedSize: 12,
  },
};
