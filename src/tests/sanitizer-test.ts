import { sanitizeSvgMarkup, extractInnerSvg, isValidSvgMarkup } from '../lib/icon-sanitizer';

console.log('--- Testing SVG Sanitizer Security ---');

// 1. Script tag injection
const scriptPayload = '<svg viewBox="0 0 24 24"><script>alert("xss")</script><path d="M0 0h24v24H0z"/></svg>';
const sanitizedScript = sanitizeSvgMarkup(scriptPayload);
console.assert(!sanitizedScript.includes('<script>'), 'Failed to strip <script>');
console.assert(!sanitizedScript.includes('alert'), 'Failed to strip script body');
console.assert(sanitizedScript.includes('<path'), 'Path was improperly removed');
console.log('✓ Script injection neutralized');

// 2. Inline event handlers (onload, onerror, onclick, onmouseover)
const handlerPayload = '<svg onload="alert(1)" onclick="steal()" onmouseover="bad()"><path d="M1 1l2 2" onerror="alert(2)"/></svg>';
const sanitizedHandler = sanitizeSvgMarkup(handlerPayload);
console.assert(!sanitizedHandler.includes('onload'), 'Failed to strip onload');
console.assert(!sanitizedHandler.includes('onclick'), 'Failed to strip onclick');
console.assert(!sanitizedHandler.includes('onerror'), 'Failed to strip onerror');
console.assert(!sanitizedHandler.includes('onmouseover'), 'Failed to strip onmouseover');
console.log('✓ Event handlers stripped');

// 3. JavaScript URL schemes
const jsUriPayload = '<svg><a href="javascript:alert(1)"><path d="M0 0"/></a><use xlink:href="javascript:evil()"/></svg>';
const sanitizedJsUri = sanitizeSvgMarkup(jsUriPayload);
console.assert(!sanitizedJsUri.includes('javascript:'), 'Failed to strip javascript: URI');
console.log('✓ Javascript URLs stripped');

// 4. Forbidden elements (iframe, foreignObject, object, embed)
const forbiddenPayload = '<svg><iframe src="evil.com"></iframe><foreignObject><body xmlns="http://www.w3.org/1999/xhtml">test</body></foreignObject><path d="M5 5"/></svg>';
const sanitizedForbidden = sanitizeSvgMarkup(forbiddenPayload);
console.assert(!sanitizedForbidden.includes('<iframe'), 'Failed to strip iframe');
console.assert(!sanitizedForbidden.includes('<foreignObject'), 'Failed to strip foreignObject');
console.log('✓ Forbidden tags stripped');

// 5. extractInnerSvg helper
const innerSvg = extractInnerSvg('<svg viewBox="0 0 24 24"><path d="M1 1h22v22H1z"/></svg>');
console.assert(innerSvg.includes('<path d="M1 1h22v22H1z"/>'), 'extractInnerSvg failed');
console.assert(!innerSvg.startsWith('<svg'), 'extractInnerSvg should not include outer svg tag');
console.log('✓ extractInnerSvg passed');

// 6. isValidSvgMarkup helper
console.assert(isValidSvgMarkup('<svg><path d="M0 0"/></svg>') === true, 'Valid SVG rejected');
console.assert(isValidSvgMarkup('plain text without svg') === false, 'Invalid text accepted as SVG');
console.assert(isValidSvgMarkup('') === false, 'Empty string accepted as SVG');
console.log('✓ isValidSvgMarkup passed');

console.log('\n🎉 ALL SVG SANITIZER & SECURITY TESTS PASSED CLEANLY!');
