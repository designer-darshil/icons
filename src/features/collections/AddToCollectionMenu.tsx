import React from 'react';
import { CollectionModal } from './CollectionModal';
import type { Icon } from '@/types/icon';

export interface AddToCollectionMenuProps {
  icon: Icon;
  isOpen: boolean;
  onClose: () => void;
}

export const AddToCollectionMenu: React.FC<AddToCollectionMenuProps> = ({
  icon,
  isOpen,
  onClose,
}) => {
  return <CollectionModal icon={icon} isOpen={isOpen} onClose={onClose} />;
};

export default AddToCollectionMenu;
