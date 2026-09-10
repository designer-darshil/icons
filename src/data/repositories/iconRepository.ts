/**
 * Primary Icon Repository
 * Exposes the Tabler Icon dataset through standard IconRepository interface.
 */

import { TablerIconRepository, tablerRepository } from './tablerRepository';
import type { IconRepository } from '@/types/icon';

export const iconRepository: IconRepository = tablerRepository;
export { TablerIconRepository };
export default iconRepository;
