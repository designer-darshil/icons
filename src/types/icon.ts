export type CanonicalIconVariant =
  | "light"
  | "regular"
  | "filled"
  | "duotone"
  | "duotone-line";

export type IconStyle =
  | CanonicalIconVariant
  | "linear"
  | "outline"
  | "bold"
  | "two-tone"
  | "broken"
  | "mono"
  | "thin";

export type IconCategory =
  | "Navigation"
  | "Arrows"
  | "Communication"
  | "Commerce"
  | "Development"
  | "Design"
  | "Files"
  | "Finance"
  | "Media"
  | "Security"
  | "Social"
  | "Users"
  | "Weather"
  | "Maps"
  | "Devices"
  | "Home"
  | "Accessibility"
  | "Editor"
  | "Buildings"
  | "Time"
  | "Food"
  | "Health"
  | "Transportation"
  | "Shapes"
  | "System"
  | string;

export type GridDensity = "compact" | "comfortable" | "spacious";

export type SvgCapability = {
  color: boolean;
  size: boolean;
  strokeWidth: boolean;
  lineCap: boolean;
  lineJoin: boolean;
  background: boolean;
  rotation: boolean;
  flip: boolean;
};

export type IconSource = {
  id: string;
  name: string;
  version: string;
  sourcePath: string;
  license: string;
};

export type VariantQualityStatus = 'validated' | 'warning' | 'manual-review' | 'invalid';

export interface VariantQualityReport {
  variantStyle: CanonicalIconVariant;
  status: VariantQualityStatus;
  score: number; // 0 to 100
  isTopologySafe: boolean;
  issues: string[];
  opticalDelta?: {
    centerDelta: { dx: number; dy: number };
    occupiedAreaDeltaPct: number;
    boundingDelta: { dw: number; dh: number };
  };
}

export type IconVariant = {
  id: string;
  style: IconStyle;
  label: string;
  svg: string; // Inner SVG markup or paths
  viewBox: string; // Standard "0 0 24 24"
  capabilities?: SvgCapability;
  supportsStroke: boolean;
  supportsColor: boolean;
  defaultStrokeWidth?: number;
  qualityStatus?: VariantQualityStatus;
  qualityReport?: VariantQualityReport;
};

export type KeyshapeType = "circle" | "square" | "vertical" | "horizontal" | "custom";

export type OpticalBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type StrokeWeightTier = "light" | "regular" | "medium" | "bold";

export interface OpticalMetrics {
  bounds: OpticalBounds;
  keyshape: KeyshapeType;
  opticalSize: number;
  visualWeight: StrokeWeightTier;
  isCentered: boolean;
  centerScore: number; // 0 to 100 score of optical balance
  centerOffset: { x: number; y: number };
  occupiedAreaPercentage: number;
  densityScore: number;
  safeZoneCompliant: boolean;
  minInternalGap?: number;
  baseline: number;
  centerX: number;
}

export type IconMetadata = {
  viewBox?: string;
  opticalBounds?: OpticalBounds;
  opticalMetrics?: OpticalMetrics;
  baseline?: number; // Canonical visual baseline (typically y = 20 on 24x24 canvas)
  centerX?: number; // Canonical center axis (typically x = 12 on 24x24 canvas)
  strokeWidth?: number; // Canonical stroke width in px (1, 1.5, 2, 2.5)
  strokeLinecap?: "butt" | "round" | "square" | string;
  strokeLinejoin?: "miter" | "round" | "bevel" | string;
  keyshape?: KeyshapeType;
  overlapSafeZone?: number; // Default 1.5px optical cutout clearance
  unicode?: string;
  version?: string;
  author?: string;
  license?: string;
  source?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type IconFamily = {
  id: string;
  name: string;
  baseIconSlug: string;
  members: string[]; // icon slugs in this family
  categories: string[];
  description?: string;
};

export type Icon = {
  id: string;
  name: string;
  slug: string;
  familyId?: string;
  family?: string;
  baseIcon?: string;
  modifier?: string;
  category: string;
  subcategory?: string;
  tags: string[];
  keywords: string[];
  defaultVariantId?: string;
  useCases?: string[];
  aliases?: string[];
  legacySlugs?: string[];
  style: IconStyle;
  variants: IconVariant[];
  svg: string;
  viewBox: string;
  capabilities?: SvgCapability;
  popularityScore?: number;
  popularity?: number;
  catalogRank?: number;
  updatedAt?: string;
  relatedIconIds: string[];
  source?: IconSource;
  metadata?: IconMetadata;
  opticalMetrics?: OpticalMetrics;
  qualityScore?: number; // 0 to 100 overall health score
  variantReports?: Partial<Record<CanonicalIconVariant, VariantQualityReport>>;
};

export type IconCustomization = {
  color: string;
  background?: string;
  size: number;
  strokeWidth?: number;
  strokeLinecap?: "butt" | "round" | "square";
  strokeLinejoin?: "miter" | "round" | "bevel";
  rotation: number;
  flipX: boolean;
  flipY: boolean;
};

export interface IconRepository {
  getAll(): Promise<Icon[]>;
  getBySlug(slug: string): Promise<Icon | undefined>;
  getById(id: string): Promise<Icon | undefined>;
  getByIds(ids: string[]): Promise<Icon[]>;
  search(query: string, options?: { category?: string; style?: IconStyle }): Promise<Icon[]>;
  getByCategory(category: string): Promise<Icon[]>;
  getByStyle(style: IconStyle): Promise<Icon[]>;
  getRelated(iconId: string): Promise<Icon[]>;
  getCategories(): Promise<string[]>;
  getStyles(): Promise<string[]>;
}
