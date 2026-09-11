/**
 * GRIDFRAME V2 — SVG Geometry Normalization & Affine Transformation Engine
 * 
 * Provides robust 2D affine matrix transformations, full SVG path tokenizer/parser,
 * shape-to-path conversion, bounding box calculation, stroke padding, and viewBox
 * normalization into the canonical 24×24 Gridframe canvas (viewBox="0 0 24 24").
 */

export interface Point2D {
  x: number;
  y: number;
}

export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

/**
 * 2D Affine Matrix [a, b, c, d, e, f] representing:
 * | a  c  e |
 * | b  d  f |
 * | 0  0  1 |
 */
export type Matrix2D = [number, number, number, number, number, number];

export const IDENTITY_MATRIX: Matrix2D = [1, 0, 0, 1, 0, 0];

export function multiplyMatrices(m1: Matrix2D, m2: Matrix2D): Matrix2D {
  const [a1, b1, c1, d1, e1, f1] = m1;
  const [a2, b2, c2, d2, e2, f2] = m2;

  return [
    a1 * a2 + c1 * b2,
    b1 * a2 + d1 * b2,
    a1 * c2 + c1 * d2,
    b1 * c2 + d1 * d2,
    a1 * e2 + c1 * f2 + e1,
    b1 * e2 + d1 * f2 + f1,
  ];
}

export function createTranslationMatrix(tx: number, ty: number): Matrix2D {
  return [1, 0, 0, 1, tx, ty];
}

export function createScaleMatrix(sx: number, sy: number = sx): Matrix2D {
  return [sx, 0, 0, sy, 0, 0];
}

export function createRotationMatrix(angleDeg: number, cx: number = 0, cy: number = 0): Matrix2D {
  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  if (cx === 0 && cy === 0) {
    return [cos, sin, -sin, cos, 0, 0];
  }

  const t1 = createTranslationMatrix(cx, cy);
  const r: Matrix2D = [cos, sin, -sin, cos, 0, 0];
  const t2 = createTranslationMatrix(-cx, -cy);

  return multiplyMatrices(t1, multiplyMatrices(r, t2));
}

export function applyMatrixToPoint(m: Matrix2D, p: Point2D): Point2D {
  return {
    x: m[0] * p.x + m[2] * p.y + m[4],
    y: m[1] * p.x + m[3] * p.y + m[5],
  };
}

/**
 * Parses an SVG transform attribute string (e.g. "translate(10, 20) rotate(45) scale(0.5)")
 * into a single combined 2D affine matrix.
 */
export function parseTransformString(transformStr: string): Matrix2D {
  if (!transformStr || typeof transformStr !== 'string') {
    return [...IDENTITY_MATRIX];
  }

  let currentMatrix = [...IDENTITY_MATRIX] as Matrix2D;
  const transformRegex = /([a-zA-Z]+)\s*\(([^)]+)\)/g;
  let match: RegExpExecArray | null;

  while ((match = transformRegex.exec(transformStr)) !== null) {
    const type = match[1].toLowerCase();
    const args = match[2]
      .trim()
      .split(/[\s,]+/)
      .map((n) => parseFloat(n))
      .filter((n) => !isNaN(n));

    let m: Matrix2D = [...IDENTITY_MATRIX];

    switch (type) {
      case 'translate': {
        const tx = args[0] || 0;
        const ty = args.length > 1 ? args[1] : 0;
        m = createTranslationMatrix(tx, ty);
        break;
      }
      case 'scale': {
        const sx = args[0] !== undefined ? args[0] : 1;
        const sy = args.length > 1 ? args[1] : sx;
        m = createScaleMatrix(sx, sy);
        break;
      }
      case 'rotate': {
        const angle = args[0] || 0;
        const cx = args[1] || 0;
        const cy = args[2] || 0;
        m = createRotationMatrix(angle, cx, cy);
        break;
      }
      case 'skewx': {
        const angle = (args[0] || 0) * (Math.PI / 180);
        m = [1, 0, Math.tan(angle), 1, 0, 0];
        break;
      }
      case 'skewy': {
        const angle = (args[0] || 0) * (Math.PI / 180);
        m = [1, Math.tan(angle), 0, 1, 0, 0];
        break;
      }
      case 'matrix': {
        if (args.length >= 6) {
          m = [args[0], args[1], args[2], args[3], args[4], args[5]];
        }
        break;
      }
    }

    currentMatrix = multiplyMatrices(currentMatrix, m);
  }

  return currentMatrix;
}

export interface PathSegment {
  type: string; // 'M' | 'L' | 'C' | 'S' | 'Q' | 'T' | 'A' | 'Z'
  values: number[];
}

/**
 * Parses SVG path data string into an array of absolute PathSegments.
 */
export function parseSvgPath(d: string): PathSegment[] {
  if (!d || typeof d !== 'string') return [];

  const segments: PathSegment[] = [];
  const commandRegex = /([a-df-z])([^a-df-z]*)/gi;
  let match: RegExpExecArray | null;

  let currX = 0;
  let currY = 0;
  let startX = 0;
  let startY = 0;

  while ((match = commandRegex.exec(d)) !== null) {
    const rawCmd = match[1];
    const isRelative = rawCmd === rawCmd.toLowerCase();
    const cmd = rawCmd.toUpperCase();
    const argsStr = match[2].trim();

    const numbers: number[] = [];
    const numRegex = /[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?/g;
    let numMatch: RegExpExecArray | null;
    while ((numMatch = numRegex.exec(argsStr)) !== null) {
      numbers.push(parseFloat(numMatch[0]));
    }

    let i = 0;
    switch (cmd) {
      case 'M': {
        while (i < numbers.length) {
          const x = isRelative ? currX + numbers[i] : numbers[i];
          const y = isRelative ? currY + numbers[i + 1] : numbers[i + 1];
          const segmentType = i === 0 ? 'M' : 'L';
          segments.push({ type: segmentType, values: [x, y] });
          currX = x;
          currY = y;
          if (i === 0) {
            startX = x;
            startY = y;
          }
          i += 2;
        }
        break;
      }
      case 'L': {
        while (i < numbers.length) {
          const x = isRelative ? currX + numbers[i] : numbers[i];
          const y = isRelative ? currY + numbers[i + 1] : numbers[i + 1];
          segments.push({ type: 'L', values: [x, y] });
          currX = x;
          currY = y;
          i += 2;
        }
        break;
      }
      case 'H': {
        while (i < numbers.length) {
          const x = isRelative ? currX + numbers[i] : numbers[i];
          segments.push({ type: 'L', values: [x, currY] });
          currX = x;
          i += 1;
        }
        break;
      }
      case 'V': {
        while (i < numbers.length) {
          const y = isRelative ? currY + numbers[i] : numbers[i];
          segments.push({ type: 'L', values: [currX, y] });
          currY = y;
          i += 1;
        }
        break;
      }
      case 'C': {
        while (i + 5 < numbers.length) {
          const x1 = isRelative ? currX + numbers[i] : numbers[i];
          const y1 = isRelative ? currY + numbers[i + 1] : numbers[i + 1];
          const x2 = isRelative ? currX + numbers[i + 2] : numbers[i + 2];
          const y2 = isRelative ? currY + numbers[i + 3] : numbers[i + 3];
          const x = isRelative ? currX + numbers[i + 4] : numbers[i + 4];
          const y = isRelative ? currY + numbers[i + 5] : numbers[i + 5];

          segments.push({ type: 'C', values: [x1, y1, x2, y2, x, y] });
          currX = x;
          currY = y;
          i += 6;
        }
        break;
      }
      case 'S': {
        while (i + 3 < numbers.length) {
          const x2 = isRelative ? currX + numbers[i] : numbers[i];
          const y2 = isRelative ? currY + numbers[i + 1] : numbers[i + 1];
          const x = isRelative ? currX + numbers[i + 2] : numbers[i + 2];
          const y = isRelative ? currY + numbers[i + 3] : numbers[i + 3];

          segments.push({ type: 'S', values: [x2, y2, x, y] });
          currX = x;
          currY = y;
          i += 4;
        }
        break;
      }
      case 'Q': {
        while (i + 3 < numbers.length) {
          const x1 = isRelative ? currX + numbers[i] : numbers[i];
          const y1 = isRelative ? currY + numbers[i + 1] : numbers[i + 1];
          const x = isRelative ? currX + numbers[i + 2] : numbers[i + 2];
          const y = isRelative ? currY + numbers[i + 3] : numbers[i + 3];

          segments.push({ type: 'Q', values: [x1, y1, x, y] });
          currX = x;
          currY = y;
          i += 4;
        }
        break;
      }
      case 'T': {
        while (i + 1 < numbers.length) {
          const x = isRelative ? currX + numbers[i] : numbers[i];
          const y = isRelative ? currY + numbers[i + 1] : numbers[i + 1];

          segments.push({ type: 'T', values: [x, y] });
          currX = x;
          currY = y;
          i += 2;
        }
        break;
      }
      case 'A': {
        while (i + 6 < numbers.length) {
          const rx = numbers[i];
          const ry = numbers[i + 1];
          const xAxisRotation = numbers[i + 2];
          const largeArcFlag = numbers[i + 3];
          const sweepFlag = numbers[i + 4];
          const x = isRelative ? currX + numbers[i + 5] : numbers[i + 5];
          const y = isRelative ? currY + numbers[i + 6] : numbers[i + 6];

          segments.push({
            type: 'A',
            values: [rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y],
          });
          currX = x;
          currY = y;
          i += 7;
        }
        break;
      }
      case 'Z': {
        segments.push({ type: 'Z', values: [] });
        currX = startX;
        currY = startY;
        break;
      }
    }
  }

  return segments;
}

/**
 * Transforms an array of PathSegments using a 2D affine matrix.
 */
export function transformPathSegments(segments: PathSegment[], m: Matrix2D): PathSegment[] {
  const [a, b, c, d, e, f] = m;
  const det = a * d - b * c;
  const scaleX = Math.sqrt(a * a + b * b);
  const scaleY = Math.sqrt(c * c + d * d);
  const angleDeltaDeg = (Math.atan2(b, a) * 180) / Math.PI;

  return segments.map((seg) => {
    switch (seg.type) {
      case 'M':
      case 'L':
      case 'T': {
        const [x, y] = seg.values;
        const nx = a * x + c * y + e;
        const ny = b * x + d * y + f;
        return { type: seg.type, values: [nx, ny] };
      }
      case 'C': {
        const [x1, y1, x2, y2, x, y] = seg.values;
        return {
          type: 'C',
          values: [
            a * x1 + c * y1 + e,
            b * x1 + d * y1 + f,
            a * x2 + c * y2 + e,
            b * x2 + d * y2 + f,
            a * x + c * y + e,
            b * x + d * y + f,
          ],
        };
      }
      case 'S':
      case 'Q': {
        const [x1, y1, x, y] = seg.values;
        return {
          type: seg.type,
          values: [
            a * x1 + c * y1 + e,
            b * x1 + d * y1 + f,
            a * x + c * y + e,
            b * x + d * y + f,
          ],
        };
      }
      case 'A': {
        const [rx, ry, rot, largeArc, sweep, x, y] = seg.values;
        const nRx = rx * scaleX;
        const nRy = ry * scaleY;
        const nRot = (rot + angleDeltaDeg) % 360;
        const nSweep = det < 0 ? (sweep === 0 ? 1 : 0) : sweep;
        const nx = a * x + c * y + e;
        const ny = b * x + d * y + f;

        return {
          type: 'A',
          values: [nRx, nRy, nRot, largeArc, nSweep, nx, ny],
        };
      }
      case 'Z':
      default:
        return { type: seg.type, values: [] };
    }
  });
}

function formatNum(n: number, precision: number = 3): string {
  const rounded = Number(n.toFixed(precision));
  return String(rounded);
}

/**
 * Serializes PathSegments back into SVG path string `d`.
 */
export function serializePathSegments(segments: PathSegment[], precision: number = 3): string {
  return segments
    .map((seg) => {
      if (seg.type === 'Z') return 'Z';
      const formattedVals = seg.values.map((v) => formatNum(v, precision));
      return `${seg.type}${formattedVals.join(' ')}`;
    })
    .join(' ')
    .trim();
}

/**
 * Calculates accurate bounding box for an array of path segments.
 */
export function calculatePathBoundingBox(segments: PathSegment[]): BoundingBox {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  const updateBounds = (x: number, y: number) => {
    if (Number.isFinite(x) && Number.isFinite(y)) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  };

  let currX = 0;
  let currY = 0;

  for (const seg of segments) {
    switch (seg.type) {
      case 'M':
      case 'L':
      case 'T':
        updateBounds(seg.values[0], seg.values[1]);
        currX = seg.values[0];
        currY = seg.values[1];
        break;
      case 'C':
        updateBounds(seg.values[0], seg.values[1]);
        updateBounds(seg.values[2], seg.values[3]);
        updateBounds(seg.values[4], seg.values[5]);
        currX = seg.values[4];
        currY = seg.values[5];
        break;
      case 'S':
      case 'Q':
        updateBounds(seg.values[0], seg.values[1]);
        updateBounds(seg.values[2], seg.values[3]);
        currX = seg.values[2];
        currY = seg.values[3];
        break;
      case 'A': {
        const [rx, ry, _rot, _largeArc, _sweep, endX, endY] = seg.values;
        updateBounds(endX, endY);
        const minChordX = Math.min(currX, endX);
        const maxChordX = Math.max(currX, endX);
        const minChordY = Math.min(currY, endY);
        const maxChordY = Math.max(currY, endY);

        if (Math.abs(maxChordX - minChordX - 2 * rx) < 0.2) {
          updateBounds(minChordX, minChordY - ry);
          updateBounds(maxChordX, maxChordY + ry);
        }
        if (Math.abs(maxChordY - minChordY - 2 * ry) < 0.2) {
          updateBounds(minChordX - rx, minChordY);
          updateBounds(maxChordX + rx, maxChordY);
        }
        currX = endX;
        currY = endY;
        break;
      }
    }
  }

  if (minX === Infinity) {
    return { minX: 0, minY: 0, maxX: 24, maxY: 24, width: 24, height: 24, centerX: 12, centerY: 12 };
  }

  const width = Math.max(0, maxX - minX);
  const height = Math.max(0, maxY - minY);

  return {
    minX,
    minY,
    maxX,
    maxY,
    width,
    height,
    centerX: minX + width / 2,
    centerY: minY + height / 2,
  };
}

/**
 * Converts SVG primitive shapes (<circle>, <rect>, <line>, <polyline>, <polygon>, <ellipse>)
 * into standard <path> data string.
 */
export function convertShapeToPathData(tagName: string, attrs: Record<string, string>): string | null {
  const t = tagName.toLowerCase();

  switch (t) {
    case 'rect': {
      const x = parseFloat(attrs.x || '0');
      const y = parseFloat(attrs.y || '0');
      const width = parseFloat(attrs.width || '0');
      const height = parseFloat(attrs.height || '0');
      const rx = parseFloat(attrs.rx || attrs.ry || '0');
      const ry = parseFloat(attrs.ry || attrs.rx || '0');

      if (width <= 0 || height <= 0) return null;

      if (rx === 0 && ry === 0) {
        return `M${x} ${y} H${x + width} V${y + height} H${x} Z`;
      }

      const effectiveRx = Math.min(rx, width / 2);
      const effectiveRy = Math.min(ry, height / 2);

      return `M${x + effectiveRx} ${y} ` +
        `H${x + width - effectiveRx} ` +
        `A${effectiveRx} ${effectiveRy} 0 0 1 ${x + width} ${y + effectiveRy} ` +
        `V${y + height - effectiveRy} ` +
        `A${effectiveRx} ${effectiveRy} 0 0 1 ${x + width - effectiveRx} ${y + height} ` +
        `H${x + effectiveRx} ` +
        `A${effectiveRx} ${effectiveRy} 0 0 1 ${x} ${y + height - effectiveRy} ` +
        `V${y + effectiveRy} ` +
        `A${effectiveRx} ${effectiveRy} 0 0 1 ${x + effectiveRx} ${y} Z`;
    }

    case 'circle': {
      const cx = parseFloat(attrs.cx || '0');
      const cy = parseFloat(attrs.cy || '0');
      const r = parseFloat(attrs.r || '0');
      if (r <= 0) return null;
      return `M${cx - r} ${cy} A${r} ${r} 0 1 0 ${cx + r} ${cy} A${r} ${r} 0 1 0 ${cx - r} ${cy} Z`;
    }

    case 'ellipse': {
      const cx = parseFloat(attrs.cx || '0');
      const cy = parseFloat(attrs.cy || '0');
      const rx = parseFloat(attrs.rx || '0');
      const ry = parseFloat(attrs.ry || '0');
      if (rx <= 0 || ry <= 0) return null;
      return `M${cx - rx} ${cy} A${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z`;
    }

    case 'line': {
      const x1 = parseFloat(attrs.x1 || '0');
      const y1 = parseFloat(attrs.y1 || '0');
      const x2 = parseFloat(attrs.x2 || '0');
      const y2 = parseFloat(attrs.y2 || '0');
      return `M${x1} ${y1} L${x2} ${y2}`;
    }

    case 'polyline': {
      const points = (attrs.points || '').trim().split(/[\s,]+/).map(parseFloat);
      if (points.length < 2) return null;
      let d = `M${points[0]} ${points[1]}`;
      for (let i = 2; i < points.length; i += 2) {
        if (i + 1 < points.length) {
          d += ` L${points[i]} ${points[i + 1]}`;
        }
      }
      return d;
    }

    case 'polygon': {
      const points = (attrs.points || '').trim().split(/[\s,]+/).map(parseFloat);
      if (points.length < 2) return null;
      let d = `M${points[0]} ${points[1]}`;
      for (let i = 2; i < points.length; i += 2) {
        if (i + 1 < points.length) {
          d += ` L${points[i]} ${points[i + 1]}`;
        }
      }
      return d + ' Z';
    }

    default:
      return null;
  }
}

/**
 * Normalizes full raw SVG markup into canonical Gridframe 24×24 geometry.
 * 
 * - Parses viewBox & intrinsic dimensions
 * - Extracts and transforms all child paths & shapes
 * - Handles group transforms & matrix resolutions
 * - Converts non-24x24 coordinate systems (e.g. 256x256 Phosphor, 20x20 Heroicons)
 *   to exact 24x24 coordinate space.
 * - Produces pristine inner SVG markup ready for viewBox="0 0 24 24".
 */
export function normalizeSvgGeometry(rawSvg: string): {
  normalizedInnerSvg: string;
  viewBox: string;
  bounds: BoundingBox;
} {
  // 1. Extract viewBox from raw SVG
  const vbMatch = rawSvg.match(/viewBox\s*=\s*["']([^"']+)["']/i);
  let vbMinX = 0;
  let vbMinY = 0;
  let vbWidth = 24;
  let vbHeight = 24;

  if (vbMatch) {
    const parts = vbMatch[1].trim().split(/[\s,]+/).map(parseFloat);
    if (parts.length >= 4 && parts[2] > 0 && parts[3] > 0) {
      vbMinX = parts[0];
      vbMinY = parts[1];
      vbWidth = parts[2];
      vbHeight = parts[3];
    }
  } else {
    const widthMatch = rawSvg.match(/width\s*=\s*["'](\d+)["']/i);
    const heightMatch = rawSvg.match(/height\s*=\s*["'](\d+)["']/i);
    if (widthMatch && heightMatch) {
      vbWidth = parseFloat(widthMatch[1]) || 24;
      vbHeight = parseFloat(heightMatch[1]) || 24;
    }
  }

  // Calculate coordinate mapping matrix to 24x24 canvas
  let baseMatrix: Matrix2D = [...IDENTITY_MATRIX];

  if (vbWidth !== 24 || vbHeight !== 24 || vbMinX !== 0 || vbMinY !== 0) {
    const scaleX = 24 / vbWidth;
    const scaleY = 24 / vbHeight;
    const transX = -vbMinX * scaleX;
    const transY = -vbMinY * scaleY;
    baseMatrix = [scaleX, 0, 0, scaleY, transX, transY];
  }

  // 2. Parse all elements (paths, shapes, groups)
  interface ProcessedElement {
    tagName: string;
    d: string;
    extraAttrs: Record<string, string>;
  }

  const processedElements: ProcessedElement[] = [];

  // Helper to extract attributes from attribute string
  function parseAttributes(attrStr: string): Record<string, string> {
    const attrs: Record<string, string> = {};
    const attrRegex = /([a-zA-Z0-9_-]+)\s*=\s*["']([^"']*)["']/g;
    let aMatch: RegExpExecArray | null;
    while ((aMatch = attrRegex.exec(attrStr)) !== null) {
      attrs[aMatch[1].toLowerCase()] = aMatch[2];
    }
    return attrs;
  }

  // Extract all paths/shapes with their local & inherited transforms
  const tagRegex = /<(path|circle|rect|line|polyline|polygon|ellipse|g)\b([^>]*?)(\/>|>[\s\S]*?<\/\1>)/gi;
  let tagMatch: RegExpExecArray | null;

  while ((tagMatch = tagRegex.exec(rawSvg)) !== null) {
    const tagName = tagMatch[1].toLowerCase();
    const attrStr = tagMatch[2];
    const attrs = parseAttributes(attrStr);

    if (tagName === 'g') continue; // groups will have children captured or can be flattened

    // Ignore Tabler's invisible 24x24 bounding box path (M0 0h24v24H0z)
    if (attrs.d && /M\s*0\s+0\s*h\s*24\s*v\s*24\s*H\s*0\s*z/i.test(attrs.d)) {
      continue;
    }

    let rawD = attrs.d || convertShapeToPathData(tagName, attrs);
    if (!rawD) continue;

    // Resolve local transform on the element
    const localTransform = attrs.transform ? parseTransformString(attrs.transform) : IDENTITY_MATRIX;
    const combinedMatrix = multiplyMatrices(baseMatrix, localTransform);

    // Transform path segments
    const segments = parseSvgPath(rawD);
    const transformedSegments = transformPathSegments(segments, combinedMatrix);
    const normalizedD = serializePathSegments(transformedSegments);

    const extraAttrs: Record<string, string> = {};
    if (attrs.opacity) extraAttrs['opacity'] = attrs.opacity;
    if (attrs['fill-rule']) extraAttrs['fill-rule'] = attrs['fill-rule'];
    if (attrs['clip-rule']) extraAttrs['clip-rule'] = attrs['clip-rule'];

    processedElements.push({
      tagName: 'path',
      d: normalizedD,
      extraAttrs,
    });
  }

  // 3. Calculate global bounding box of all normalized geometry
  let allSegments: PathSegment[] = [];
  for (const el of processedElements) {
    allSegments = allSegments.concat(parseSvgPath(el.d));
  }
  const bounds = calculatePathBoundingBox(allSegments);

  // 4. Build output inner SVG string
  const outputInnerSvg = processedElements
    .map((el) => {
      const extraStr = Object.entries(el.extraAttrs)
        .map(([k, v]) => ` ${k}="${v}"`)
        .join('');
      return `<path d="${el.d}"${extraStr} />`;
    })
    .join('\n  ');

  return {
    normalizedInnerSvg: outputInnerSvg,
    viewBox: '0 0 24 24',
    bounds,
  };
}
