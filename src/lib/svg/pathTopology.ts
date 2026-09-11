/**
 * GRIDFRAME V2 — SVG Path Topology & Safety Analyzer
 * 
 * Inspects SVG geometry elements and paths to determine openness, closure,
 * compound contours, counters/holes, and topology classification.
 * Prevents degenerate polygon construction when generating Filled and Duotone variants.
 */

export type TopologyType = 'pure-stroke' | 'closed-shapes' | 'mixed' | 'complex';

export interface SvgElementInfo {
  type: 'path' | 'circle' | 'rect' | 'ellipse' | 'line' | 'polyline' | 'polygon';
  rawElement: string;
  isClosed: boolean;
  d?: string;
  points?: string;
  bounds?: { minX: number; minY: number; maxX: number; maxY: number };
}

export interface PathTopologyAnalysis {
  topology: TopologyType;
  totalElements: number;
  closedElements: number;
  openElements: number;
  isFillSafe: boolean;
  hasOpenStrokes: boolean;
  hasClosedContainers: boolean;
  closedElementsSvg: string[];
  openElementsSvg: string[];
  issues: string[];
}

/**
 * Checks if a path `d` string represents a closed path.
 * A path is considered closed if it contains 'z' or 'Z', or if its start and end coordinates match closely.
 */
export function isPathClosed(d: string): boolean {
  if (!d || typeof d !== 'string') return false;
  const clean = d.trim();
  
  // Direct 'z' or 'Z' command check
  if (/[zZ]/.test(clean)) return true;

  // Check start and end coordinate proximity from path tokens
  const commands = clean.match(/([a-df-z])\s*([^a-df-z]*)/gi);
  if (!commands || commands.length < 2) return false;

  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;

  for (const cmdStr of commands) {
    const type = cmdStr[0];
    const isRelative = type === type.toLowerCase();
    const upperType = type.toUpperCase();
    const nums = (cmdStr.slice(1).match(/[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?/g) || []).map(Number);

    if (upperType === 'M') {
      if (nums.length >= 2) {
        if (isRelative) {
          startX = currentX + nums[0];
          startY = currentY + nums[1];
        } else {
          startX = nums[0];
          startY = nums[1];
        }
        currentX = startX;
        currentY = startY;
      }
    } else if (upperType === 'L' || upperType === 'T') {
      for (let i = 0; i < nums.length; i += 2) {
        if (i + 1 < nums.length) {
          currentX = isRelative ? currentX + nums[i] : nums[i];
          currentY = isRelative ? currentY + nums[i + 1] : nums[i + 1];
        }
      }
    } else if (upperType === 'H') {
      for (const n of nums) {
        currentX = isRelative ? currentX + n : n;
      }
    } else if (upperType === 'V') {
      for (const n of nums) {
        currentY = isRelative ? currentY + n : n;
      }
    } else if (upperType === 'C') {
      for (let i = 0; i < nums.length; i += 6) {
        if (i + 5 < nums.length) {
          currentX = isRelative ? currentX + nums[i + 4] : nums[i + 4];
          currentY = isRelative ? currentY + nums[i + 5] : nums[i + 5];
        }
      }
    } else if (upperType === 'S' || upperType === 'Q') {
      for (let i = 0; i < nums.length; i += 4) {
        if (i + 3 < nums.length) {
          currentX = isRelative ? currentX + nums[i + 2] : nums[i + 2];
          currentY = isRelative ? currentY + nums[i + 3] : nums[i + 3];
        }
      }
    } else if (upperType === 'A') {
      for (let i = 0; i < nums.length; i += 7) {
        if (i + 6 < nums.length) {
          currentX = isRelative ? currentX + nums[i + 5] : nums[i + 5];
          currentY = isRelative ? currentY + nums[i + 6] : nums[i + 6];
        }
      }
    } else if (upperType === 'Z') {
      return true;
    }
  }

  // End point matches start point within 0.1px tolerance
  const dist = Math.hypot(currentX - startX, currentY - startY);
  return dist < 0.1;
}

/**
 * Parses SVG inner content into individual element definitions and classifies their topology.
 */
export function analyzePathTopology(innerSvg: string): PathTopologyAnalysis {
  const issues: string[] = [];
  const elementRegex = /<(path|circle|rect|ellipse|line|polyline|polygon)\b([^>]*)\/?>/gi;
  let match: RegExpExecArray | null;

  const elements: SvgElementInfo[] = [];
  const closedElementsSvg: string[] = [];
  const openElementsSvg: string[] = [];

  while ((match = elementRegex.exec(innerSvg)) !== null) {
    const rawElement = match[0];
    const tag = match[1].toLowerCase() as SvgElementInfo['type'];
    const attrs = match[2];

    // Check for NaN coordinates or invalid numbers
    if (/NaN|undefined|null/i.test(attrs)) {
      issues.push(`Invalid coordinates (NaN/undefined) in <${tag}> element`);
    }

    let isClosed = false;

    if (tag === 'circle' || tag === 'rect' || tag === 'ellipse' || tag === 'polygon') {
      isClosed = true;
    } else if (tag === 'line') {
      isClosed = false;
    } else if (tag === 'polyline') {
      const pointsMatch = attrs.match(/points="([^"]+)"/i);
      if (pointsMatch) {
        const pts = pointsMatch[1].trim().split(/[\s,]+/).map(Number);
        if (pts.length >= 4) {
          const firstX = pts[0];
          const firstY = pts[1];
          const lastX = pts[pts.length - 2];
          const lastY = pts[pts.length - 1];
          isClosed = Math.hypot(lastX - firstX, lastY - firstY) < 0.1;
        }
      }
    } else if (tag === 'path') {
      const dMatch = attrs.match(/\bd="([^"]+)"/i);
      if (dMatch) {
        const d = dMatch[1];
        if (!d.trim()) {
          issues.push('Zero-length path detected');
        } else {
          isClosed = isPathClosed(d);
        }
      } else {
        issues.push('Path missing d attribute');
      }
    }

    elements.push({
      type: tag,
      rawElement,
      isClosed,
    });

    if (isClosed) {
      closedElementsSvg.push(rawElement);
    } else {
      openElementsSvg.push(rawElement);
    }
  }

  const totalElements = elements.length;
  const closedElements = closedElementsSvg.length;
  const openElements = openElementsSvg.length;

  let topology: TopologyType = 'mixed';
  if (totalElements === 0) {
    topology = 'pure-stroke';
    issues.push('No vector elements found in SVG');
  } else if (openElements === 0) {
    topology = 'closed-shapes';
  } else if (closedElements === 0) {
    topology = 'pure-stroke';
  } else {
    topology = 'mixed';
  }

  const isFillSafe = closedElements > 0 && openElements === 0;

  return {
    topology,
    totalElements,
    closedElements,
    openElements,
    isFillSafe,
    hasOpenStrokes: openElements > 0,
    hasClosedContainers: closedElements > 0,
    closedElementsSvg,
    openElementsSvg,
    issues,
  };
}
