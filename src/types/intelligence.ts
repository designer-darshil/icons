import type { Icon, IconStyle } from './icon';

export interface IconIntelligenceFeatureFlags {
  enableIconDna: boolean;
  enableSimilarity: boolean;
  enableConsistencyChecker: boolean;
  enableSetHealth: boolean;
  enableMissingDetector: boolean;
  enableStateRecommender: boolean;
  enablePairingIntelligence: boolean;
  enableContextPreview: boolean;
  enableStressTest: boolean;
  enableAccessibilityGuide: boolean;
  enableSetBuilder: boolean;
  enableSetDiff: boolean;
  enableTimeMachine: boolean;
  enableRelationshipGraph: boolean;
  enableIconRoulette: boolean;
  enableUsageRecommendations: boolean;
}

export const DEFAULT_INTELLIGENCE_FLAGS: IconIntelligenceFeatureFlags = {
  enableIconDna: true,
  enableSimilarity: true,
  enableConsistencyChecker: true,
  enableSetHealth: true,
  enableMissingDetector: true,
  enableStateRecommender: true,
  enablePairingIntelligence: true,
  enableContextPreview: true,
  enableStressTest: true,
  enableAccessibilityGuide: true,
  enableSetBuilder: true,
  enableSetDiff: true,
  enableTimeMachine: true,
  enableRelationshipGraph: true,
  enableIconRoulette: true,
  enableUsageRecommendations: true,
};

// Feature 1: Icon DNA
export interface IconDnaProfile {
  weight: number;      // 1-5 scale (Light -> Heavy)
  roundness: number;   // 1-5 scale (Angular -> Highly Rounded)
  density: number;     // 1-5 scale (Airy -> Dense)
  symmetry: number;    // 1-5 scale (Asymmetrical -> Symmetrical)
  complexity: number;  // 1-5 scale (Minimal -> Complex)
  visualBalance: number; // 1-5 scale (Centered balance)
  aspectRatio: number; // width / height
  pathCount: number;
  curveCount: number;
  straightLineCount: number;
  cornerTreatment: 'sharp' | 'rounded' | 'mixed';
  apparentOpticalSize: 'compact' | 'standard' | 'spacious';
  heuristicSummary: string;
}

// Feature 2: Similarity
export interface SimilarIconResult {
  icon: Icon;
  similarityScore: number; // 0 to 100
  matchTier: 'Most similar' | 'Related' | 'Loosely similar';
  matchedFactors: string[];
}

// Feature 3: Consistency
export interface ConsistencyMetric {
  name: string;
  status: 'consistent' | 'warning' | 'outlier';
  score: number; // 0-100
  detail: string;
  outlierIconIds: string[];
}

export interface SetConsistencyReport {
  overallScore: number; // 0-100
  status: 'Consistent' | 'Warning' | 'Outlier';
  metrics: {
    strokeConsistency: ConsistencyMetric;
    visualWeight: ConsistencyMetric;
    cornerTreatment: ConsistencyMetric;
    opticalSize: ConsistencyMetric;
    densityDistribution: ConsistencyMetric;
    variantMixing: ConsistencyMetric;
  };
  summary: string;
  outlierIcons: { iconId: string; reasons: string[] }[];
}

// Feature 4: Set Health Score
export interface SetHealthScoreBreakdown {
  visualConsistencyScore: number; // 0-100
  semanticCoverageScore: number;   // 0-100
  duplicateScore: number;          // 0-100
  missingStateScore: number;       // 0-100
  variantConsistencyScore: number; // 0-100
  namingConsistencyScore: number;  // 0-100
  categoryBalanceScore: number;    // 0-100
}

export interface SetHealthReport {
  overallHealth: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  iconCount: number;
  breakdown: SetHealthScoreBreakdown;
  outliers: { iconId: string; reason: string }[];
  duplicates: { sourceId: string; duplicateId: string; concept: string }[];
  missingCommonStates: { iconId: string; missingState: string }[];
  actionableTips: string[];
}

// Feature 5: Missing Icon Detector
export interface MissingIconSuggestion {
  concept: string;
  tier: 'Recommended' | 'Possible' | 'Optional';
  reason: string;
  matchingCatalogIcons: Icon[];
}

export interface MissingIconsReport {
  detectedCategoryPatterns: string[];
  totalSuggested: number;
  suggestions: MissingIconSuggestion[];
}

// Feature 6: State Recommender
export type SemanticStateKey = 'default' | 'success' | 'error' | 'warning' | 'loading' | 'active' | 'disabled' | 'add' | 'remove' | 'edit';

export interface SemanticStateOption {
  stateKey: SemanticStateKey;
  label: string;
  icon: Icon | null;
  conceptMatch: string;
  isAvailableInCatalog: boolean;
}

export interface IconStateMatrixReport {
  rootIcon: Icon;
  conceptFamily: string;
  states: SemanticStateOption[];
}

// Feature 7: Pairing Intelligence
export interface IconPairing {
  type: 'Direct pair' | 'Semantic companion' | 'Alternative';
  relationLabel: string;
  pairedIcon: Icon;
  confidence: number;
}

export interface IconPairingReport {
  icon: Icon;
  pairings: IconPairing[];
}

// Feature 8: Context Preview
export type UIContextKey =
  | 'button'
  | 'toolbar'
  | 'navigation'
  | 'input'
  | 'table'
  | 'dropdown'
  | 'empty-state'
  | 'notification'
  | 'card-header'
  | 'badge';

export interface UIContextSpec {
  key: UIContextKey;
  title: string;
  description: string;
  recommendedSize: number;
}

// Feature 9: Pixel Size Stress Test
export type StressTestSize = 12 | 14 | 16 | 18 | 20 | 24 | 32 | 48 | 64;

export interface SizeEvaluation {
  size: StressTestSize;
  status: 'Good' | 'Caution' | 'Weak';
  legibilityScore: number; // 0-100
  apparentDensity: 'Crisp' | 'Optimal' | 'Crowded' | 'Sparse';
  notes: string;
}

export interface IconStressTestReport {
  icon: Icon;
  evaluations: SizeEvaluation[];
  recommendedMinSize: StressTestSize;
  recommendedMaxSize: StressTestSize;
}

// Feature 10: Accessibility Guide
export type IconA11yRole = 'Decorative' | 'Meaningful' | 'Action' | 'Status' | 'Navigation';

export interface A11yUsageGuidance {
  role: IconA11yRole;
  title: string;
  description: string;
  codeSnippet: {
    html: string;
    react: string;
  };
  ariaRule: string;
  recommendations: string[];
}

// Feature 11: Set Builder
export type ProductPresetType =
  | 'SaaS'
  | 'E-commerce'
  | 'Finance'
  | 'Dashboard'
  | 'Developer Tool'
  | 'Mobile App'
  | 'Media / Content'
  | 'Health & Wellness';

export interface SetBuilderCategoryGroup {
  groupName: string;
  requiredConcepts: string[];
  recommendedIcons: Icon[];
}

export interface SetBuilderPreset {
  id: string;
  productType: ProductPresetType;
  description: string;
  groups: SetBuilderCategoryGroup[];
}

// Feature 12: Set Diff
export interface IconSetDiffResult {
  added: Icon[];
  removed: Icon[];
  replaced: { original: Icon; replacement: Icon; similarityScore: number }[];
  visualDifferences: {
    icon: Icon;
    issue: string;
  }[];
  summary: {
    addedCount: number;
    removedCount: number;
    replacedCount: number;
    outlierCount: number;
  };
}

// Feature 13: Time Machine
export interface IconVersionSnapshot {
  version: string;
  timestamp: string;
  author: string;
  changeSummary: string;
  svg: string;
  category: string;
  style: IconStyle;
  variantCount: number;
}

export interface IconTimeMachineHistory {
  iconId: string;
  currentVersion: string;
  history: IconVersionSnapshot[];
}

// Feature 14: Relationship Graph
export interface GraphNode {
  id: string;
  name: string;
  slug: string;
  category: string;
  style: IconStyle;
  isPrimary?: boolean;
}

export interface GraphEdge {
  source: string;
  target: string;
  relationType: 'family' | 'pair' | 'state' | 'semantic' | 'category' | 'similarity';
  label: string;
  strength: number; // 0 to 1
}

export interface IconRelationshipGraphData {
  rootIcon: Icon;
  nodes: GraphNode[];
  edges: GraphEdge[];
  isExpanded: boolean;
}

// Feature 15: Icon Roulette
export interface RouletteCandidate {
  icon: Icon;
  reason: string;
  surprisingFact: string;
}

// Feature 16: Usage Recommendations
export interface IconUsageGuideline {
  icon: Icon;
  recommendedSizes: string;
  optimalStrokeWidth: number;
  bestUseCases: string[];
  avoidUseCases: string[];
  opticalPlacementNotes: string;
  dnaNotes: string;
}
