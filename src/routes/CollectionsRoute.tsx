import React from 'react';
import { useParams } from 'react-router-dom';
import { WorkspaceShell } from '@/components/layout/WorkspaceShell';
import { CollectionList } from '@/features/collections/CollectionList';
import { CollectionDetailPage } from '@/features/collections/CollectionDetailPage';

export const CollectionsRoute: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (id) {
    return <CollectionDetailPage />;
  }

  return (
    <WorkspaceShell>
      <CollectionList />
    </WorkspaceShell>
  );
};
export default CollectionsRoute;
