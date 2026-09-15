import React from 'react';
import { useParams } from 'react-router-dom';
import { IntelligenceHub, IntelligenceTab } from '@/features/icon-intelligence/IntelligenceHub';
import { WorkspaceShell } from '@/components/layout/WorkspaceShell';
import { GRIDFRAME_ICONS } from '@/data/icons/gridframe-catalog';

export const IntelligenceRoute: React.FC = () => {
  const { tool, slug } = useParams<{ tool?: string; slug?: string }>();

  const initialIcon = slug ? GRIDFRAME_ICONS.find((i) => i.slug === slug || i.id === slug) : undefined;
  const initialTab = (tool as IntelligenceTab) || 'dna';

  return (
    <WorkspaceShell>
      <IntelligenceHub initialIcon={initialIcon} initialTab={initialTab} />
    </WorkspaceShell>
  );
};

export default IntelligenceRoute;
