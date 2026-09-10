import { Icon } from './icon';

export interface Collection {
  id: string;
  name: string;
  description?: string;
  iconIds: string[];
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceStorageState {
  version: number;
  favorites: string[];
  collections: Collection[];
}

export interface CollectionWithIcons extends Collection {
  icons: Icon[];
}
