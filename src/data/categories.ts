import categoryCounts from './icons/categories.json';

export interface CategoryMetadata {
  id: string;
  name: string;
  description: string;
  count: number;
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  System: 'Core system controls, toggles, indicators, and configuration markers',
  Editor: 'Text formatting, code blocks, cursors, drafting, and typography tools',
  Devices: 'Computers, smartphones, hardware, peripherals, and electronics',
  Design: 'Color pickers, layers, vector tools, artboards, and layout assets',
  Arrows: 'Directional indicators, chevrons, expanding, and flow arrows',
  Maps: 'Location pins, compasses, navigation markers, and route paths',
  Media: 'Audio, video, cameras, volume, and playback controls',
  Social: 'Brands, network platforms, communication, and sharing badges',
  Files: 'Documents, directories, archives, clipboards, and folders',
  Commerce: 'Shopping carts, price tags, checkout flows, and retail icons',
  Development: 'Code syntax, brackets, git branches, terminals, and databases',
  Health: 'Medical symbols, hearts, fitness markers, and emergency signs',
  Finance: 'Currencies, credit cards, bank notes, charts, and payment tokens',
  Communication: 'Mail, chat bubbles, messages, phone triggers, and signals',
  Weather: 'Sun, clouds, precipitation, wind, astronomy, and moon phases',
  Shapes: 'Polygons, geometric stars, badges, circular badges, and frames',
  Transportation: 'Vehicles, cars, trains, aircraft, ships, and transit systems',
  Food: 'Cuisine, beverages, fruits, dining tools, and culinary symbols',
  Buildings: 'Architecture, landmarks, offices, factories, and warehouses',
  Interface: 'General UI controls, interactive widgets, and layout elements',
  Text: 'Alphabet characters, typography glyphs, and font symbols',
  Home: 'Furniture, domestic appliances, living spaces, and comfort items',
  Nature: 'Flora, fauna, plants, leaves, and ecological indicators',
  Users: 'User avatars, profiles, teams, crowds, and human representations',
};

export const ICON_CATEGORIES: CategoryMetadata[] = Object.entries(categoryCounts)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([name, count]) => ({
    id: name.toLowerCase(),
    name,
    description: CATEGORY_DESCRIPTIONS[name] || `${name} icons for digital interfaces and applications`,
    count,
  }));

