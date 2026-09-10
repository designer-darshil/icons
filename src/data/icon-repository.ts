import { TablerIconRepository, tablerRepository } from './repositories/tablerRepository';
import type { IconRepository } from '@/types/icon';

export const LocalIconRepository = TablerIconRepository;
export const iconRepository: IconRepository = tablerRepository;
export default iconRepository;

