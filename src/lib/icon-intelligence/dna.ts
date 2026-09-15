import type { Icon } from '@/types/icon';
import type { IconDnaProfile } from '@/types/intelligence';

/**
 * Computes deterministic heuristic Icon DNA profile from an icon's SVG geometry and metadata.
 * All metrics are calibrated on the canonical 24x24 coordinate frame.
 */
export function calculateIconDna(icon: Icon): IconDnaProfile {
  const svg = icon.svg || '';

  // 1. Path & Element Metrics
  const pathMatches = svg.match(/<(path|line|polyline|polygon|circle|rect|ellipse)/gi) || [];
  const pathCount = Math.max(1, pathMatches.length);

  // 2. Curves vs Straight lines
  const curveCmds = (svg.match(/[CSQTAcsqta]/g) || []).length;
  const circleMatches = (svg.match(/<(circle|ellipse)/gi) || []).length;
  const rxMatches = (svg.match(/rx=/gi) || []).length;
  const totalCurves = curveCmds + circleMatches * 4 + rxMatches * 2;

  const straightCmds = (svg.match(/[MLHVZmlhvz]/g) || []).length;
  const lineMatches = (svg.match(/<(line|rect|polygon|polyline)/gi) || []).length;
  const totalStraight = straightCmds + lineMatches * 2;

  // 3. Roundness Heuristic (1-5)
  const roundnessRatio = totalCurves / Math.max(1, totalCurves + totalStraight);
  let roundness = 3;
  if (roundnessRatio > 0.65) roundness = 5;
  else if (roundnessRatio > 0.45) roundness = 4;
  else if (roundnessRatio > 0.25) roundness = 3;
  else if (roundnessRatio > 0.1) roundness = 2;
  else roundness = 1;

  // 4. Complexity Heuristic (1-5) based on path length and segment count
  const svgLength = svg.length;
  let complexity = 3;
  if (svgLength > 400 || pathCount > 5) complexity = 5;
  else if (svgLength > 260 || pathCount > 3) complexity = 4;
  else if (svgLength > 150) complexity = 3;
  else if (svgLength > 70) complexity = 2;
  else complexity = 1;

  // 5. Weight Heuristic (1-5)
  const isFilled = icon.style === 'filled' || svg.includes('fill="currentColor"');
  let weight = 3;
  if (isFilled) {
    weight = 5;
  } else {
    const strokeWidth = icon.metadata?.strokeWidth || 2;
    if (strokeWidth >= 2.5) weight = 5;
    else if (strokeWidth >= 2) weight = 3;
    else if (strokeWidth >= 1.5) weight = 2;
    else weight = 1;
  }

  // 6. Density Heuristic (1-5)
  let density = 3;
  if (isFilled || (pathCount >= 4 && svgLength > 250)) density = 5;
  else if (pathCount >= 3 || svgLength > 200) density = 4;
  else if (pathCount >= 2 || svgLength > 100) density = 3;
  else if (svgLength > 60) density = 2;
  else density = 1;

  // 7. Symmetry Heuristic (1-5)
  // Check for symmetrical coordinates/tags or center-aligned geometry
  const hasCenteredX = svg.includes('12') || svg.includes('cx="12"') || svg.includes('x="12"');
  const hasSymmetricKeywords = ['arrow', 'chevron', 'user', 'shield', 'home', 'lock', 'circle', 'square'].some((kw) =>
    icon.slug.includes(kw)
  );
  let symmetry = 3;
  if (hasCenteredX && hasSymmetricKeywords) symmetry = 5;
  else if (hasCenteredX || hasSymmetricKeywords) symmetry = 4;
  else if (svgLength < 150) symmetry = 3;
  else symmetry = 2;

  // 8. Visual Balance (1-5)
  const visualBalance = Math.min(5, Math.max(1, Math.round((symmetry + (6 - Math.abs(density - 3))) / 2)));

  // 9. Corner Treatment
  let cornerTreatment: 'sharp' | 'rounded' | 'mixed' = 'mixed';
  if (roundness >= 4) cornerTreatment = 'rounded';
  else if (roundness <= 2) cornerTreatment = 'sharp';

  // 10. Optical size
  let apparentOpticalSize: 'compact' | 'standard' | 'spacious' = 'standard';
  if (density >= 4 && complexity >= 4) apparentOpticalSize = 'spacious';
  else if (density <= 2 && complexity <= 2) apparentOpticalSize = 'compact';

  // Heuristic Summary text
  const heuristicSummary = `Calibrated as ${roundness >= 4 ? 'curvilinear' : roundness <= 2 ? 'geometric rectilinear' : 'balanced hybrid'} with ${weight >= 4 ? 'dense visual weight' : 'airy regular stroke weight'}.`;

  return {
    weight,
    roundness,
    density,
    symmetry,
    complexity,
    visualBalance,
    aspectRatio: 1.0,
    pathCount,
    curveCount: totalCurves,
    straightLineCount: totalStraight,
    cornerTreatment,
    apparentOpticalSize,
    heuristicSummary,
  };
}
