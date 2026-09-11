/**
 * Primary Canonical Icon Repository
 * Exposes the official Iconoir catalog through standard IconRepository interface.
 */

import { IconoirRepository, iconoirRepository } from './iconoirRepository';
import type { IconRepository } from '@/types/icon';

export const iconRepository: IconRepository = iconoirRepository;
export { IconoirRepository };
export default iconRepository;
