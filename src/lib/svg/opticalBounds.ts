/**
 * Optical Bounds, Centering, and Visual Weight Analysis for GRIDFRAME
 * Calibrates geometry against canonical reference keyshapes.
 */

import type { OpticalBounds, KeyshapeType, OpticalMetrics, StrokeWeightTier } from '@/types/icon';

export interface OpticalAnalysisResult extends OpticalMetrics {
  aspectRatio: number;
}

/**
 * Evaluates visual weight tier based on occupied area and path node count.
 */
function calculateVisualWeightTier(
  occupiedAreaPct: number,
  elementCount: number
): StrokeWeightTier {
  if (occupiedAreaPct > 68 || elementCount > 10) return 'bold';
  if (occupiedAreaPct > 52 || elementCount > 6) return 'medium';
  if (occupiedAreaPct < 22 && elementCount < 3) return 'light';
  return 'regular';
}

/**
 * Parses coordinates and elements from SVG markup to calculate full optical and geometric metrics.
 */
export function analyzeIconOpticalSystem(
  innerSvg: string,
  _defaultStrokeWidth: number = 2
): OpticalAnalysisResult {
  let minX = 24;
  let minY = 24;
  let maxX = 0;
  let maxY = 0;
  let hasValidCoords = false;

  // Extract all numbers that look like coordinates
  const coordRegex = /([0-9]+(?:\.[0-9]+)?)/g;
  const matches = innerSvg.match(coordRegex);

  const parsedPoints: { x: number; y: number }[] = [];

  if (matches && matches.length > 0) {
    const nums = matches.map(Number).filter((n) => !isNaN(n) && n >= 0 && n <= 24);
    if (nums.length >= 4) {
      for (let i = 0; i < nums.length - 1; i += 2) {
        const x = nums[i];
        const y = nums[i + 1];
        if (x >= 0 && x <= 24 && y >= 0 && y <= 24) {
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
          parsedPoints.push({ x, y });
          hasValidCoords = true;
        }
      }
    }
  }

  // Fallback if no clean coords parsed
  if (!hasValidCoords || minX >= maxX || minY >= maxY) {
    minX = 2;
    minY = 2;
    maxX = 22;
    maxY = 22;
  }

  const width = Math.max(1, maxX - minX);
  const height = Math.max(1, maxY - minY);
  const centerX = minX + width / 2;
  const centerY = minY + height / 2;
  const aspectRatio = width / (height || 1);

  // Determine keyshape conforming to KeyshapeType ('circle' | 'square' | 'vertical' | 'horizontal' | 'custom')
  let keyshape: KeyshapeType = 'custom';
  if (Math.abs(width - height) < 1.5) {
    if (innerSvg.includes('circle') || innerSvg.includes('r=')) {
      keyshape = 'circle';
    } else {
      keyshape = 'square';
    }
  } else if (width > height * 1.2) {
    keyshape = 'horizontal';
  } else if (height > width * 1.2) {
    keyshape = 'vertical';
  }

  // Center offset from canonical (12, 12)
  const offsetX = Math.round((centerX - 12) * 100) / 100;
  const offsetY = Math.round((centerY - 12) * 100) / 100;
  const totalOffsetDist = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

  // Score from 0 to 100 (100 = perfectly centered at 12, 12)
  const centerScore = Math.max(0, Math.min(100, Math.round(100 - totalOffsetDist * 25)));
  const isCentered = totalOffsetDist <= 0.85;

  // Safe zone compliance: must remain strictly within [1, 23] on 24x24 canvas
  const safeZoneCompliant = minX >= 0.8 && minY >= 0.8 && maxX <= 23.2 && maxY <= 23.2;

  // Occupied Area Percentage of 24x24 canvas (576 sq px)
  const occupiedArea = width * height;
  const occupiedAreaPercentage = Math.round((occupiedArea / 576) * 1000) / 10;

  // Element & Path Node density
  const elementCount = (innerSvg.match(/<(path|circle|rect|line|polyline|polygon|ellipse)/gi) || []).length;
  const densityScore = Math.min(10, Math.max(1, Math.round((elementCount * 1.5 + (parsedPoints.length / 8)) * 10) / 10));

  // Estimate min internal gap between distinct elements if multiple parsed
  let minInternalGap = 2.0;
  if (elementCount > 1 && parsedPoints.length >= 8) {
    let minGapFound = 24;
    for (let i = 0; i < parsedPoints.length - 2; i += 2) {
      for (let j = i + 2; j < parsedPoints.length; j += 2) {
        const dx = parsedPoints[i].x - parsedPoints[j].x;
        const dy = parsedPoints[i].y - parsedPoints[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0.4 && dist < minGapFound) {
          minGapFound = dist;
        }
      }
    }
    if (minGapFound < 24) {
      minInternalGap = Math.round(minGapFound * 10) / 10;
    }
  }

  const visualWeight = calculateVisualWeightTier(occupiedAreaPercentage, elementCount);
  const opticalSize = Math.round(Math.max(width, height) * 100) / 100;

  return {
    bounds: {
      x: Math.round(minX * 100) / 100,
      y: Math.round(minY * 100) / 100,
      width: Math.round(width * 100) / 100,
      height: Math.round(height * 100) / 100,
    },
    keyshape,
    opticalSize,
    visualWeight,
    isCentered,
    centerScore,
    centerOffset: { x: offsetX, y: offsetY },
    occupiedAreaPercentage,
    densityScore,
    safeZoneCompliant,
    minInternalGap,
    baseline: Math.round(maxY * 100) / 100,
    centerX: Math.round(centerX * 100) / 100,
    aspectRatio: Math.round(aspectRatio * 100) / 100,
  };
}

export type { OpticalBounds, KeyshapeType, OpticalMetrics, StrokeWeightTier };
