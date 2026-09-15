import type { Icon } from '@/types/icon';
import type { A11yUsageGuidance, IconA11yRole } from '@/types/intelligence';

/**
 * Generates structured accessibility guidance and code snippets for a given icon.
 */
export function generateA11yGuidance(icon: Icon, selectedRole: IconA11yRole = 'Action'): A11yUsageGuidance {
  const iconName = icon.name;
  const iconSlug = icon.slug;

  const GUIDANCE_MAP: Record<IconA11yRole, Omit<A11yUsageGuidance, 'role'>> = {
    Decorative: {
      title: 'Decorative Supporting Icon',
      description: 'The icon accompanies visible adjacent text and provides no independent information.',
      ariaRule: 'Always set aria-hidden="true" to prevent redundant announcement by screen readers.',
      codeSnippet: {
        html: `<span class="flex items-center gap-2">\n  <svg aria-hidden="true" focusable="false" class="w-4 h-4">...</svg>\n  <span>${iconName}</span>\n</span>`,
        react: `<div className="flex items-center gap-2">\n  <IconPreviewSvg aria-hidden="true" focusable={false} className="w-4 h-4" />\n  <span>${iconName}</span>\n</div>`,
      },
      recommendations: [
        'Ensure adjacent text fully conveys the intended meaning.',
        'Use aria-hidden="true" on the SVG element.',
        'Set focusable="false" for legacy SVG focus prevention.',
      ],
    },
    Meaningful: {
      title: 'Meaningful Standalone Indicator',
      description: 'The icon conveys critical status or context without visible companion text.',
      ariaRule: 'Must provide role="img" and a concise, descriptive aria-label.',
      codeSnippet: {
        html: `<svg role="img" aria-label="${iconName} indicator" class="w-5 h-5">\n  <title>${iconName}</title>\n  ...\n</svg>`,
        react: `<IconPreviewSvg\n  role="img"\n  aria-label="${iconName} indicator"\n  className="w-5 h-5"\n/>`,
      },
      recommendations: [
        `Provide an unambiguous aria-label (e.g. "${iconName} status").`,
        'Ensure high optical contrast (minimum 3:1 contrast against adjacent background).',
        'Include an SVG <title> element inside the markup where possible.',
      ],
    },
    Action: {
      title: 'Interactive Icon-Only Action Button',
      description: 'The icon functions as the sole visual trigger inside a button or link.',
      ariaRule: 'The parent button must expose an accessible name via aria-label or title.',
      codeSnippet: {
        html: `<button type="button" aria-label="${iconName}">\n  <svg aria-hidden="true" focusable="false" class="w-4 h-4">...</svg>\n</button>`,
        react: `<button\n  type="button"\n  aria-label="${iconName}"\n  className="p-2 rounded hover:bg-bg-secondary"\n>\n  <IconPreviewSvg aria-hidden="true" className="w-4 h-4" />\n</button>`,
      },
      recommendations: [
        `Give the interactive button an explicit aria-label="${iconName}".`,
        'Hide the internal SVG with aria-hidden="true" so the button label is read once.',
        'Ensure a minimum touch target of 40×40px or 44×44px on mobile viewports.',
        'Provide visible focus rings on :focus-visible.',
      ],
    },
    Status: {
      title: 'Dynamic Status / State Badge',
      description: 'The icon communicates changing real-time state (e.g. synced, error, pending).',
      ariaRule: 'Wrap in an aria-live region or append screen-reader status text.',
      codeSnippet: {
        html: `<div role="status" aria-live="polite" class="flex items-center gap-1.5">\n  <svg aria-hidden="true" class="w-4 h-4 text-accent">...</svg>\n  <span class="sr-only">${iconName}: </span>\n  <span>Active</span>\n</div>`,
        react: `<div role="status" aria-live="polite" className="flex items-center gap-1.5">\n  <IconPreviewSvg aria-hidden="true" className="w-4 h-4 text-accent" />\n  <span className="sr-only">${iconName}: </span>\n  <span>Active</span>\n</div>`,
      },
      recommendations: [
        'Use aria-live="polite" so screen readers announce dynamic state transitions.',
        'Include hidden sr-only text clarifying state changes.',
        'Do not rely on color alone to convey error or success.',
      ],
    },
    Navigation: {
      title: 'Hierarchical Navigation Link',
      description: 'The icon appears inside sidebar menus, tabs, or breadcrumb links.',
      ariaRule: 'The link text should be accessible, and the current active page should be marked with aria-current="page".',
      codeSnippet: {
        html: `<a href="/${iconSlug}" aria-current="page" class="flex items-center gap-3">\n  <svg aria-hidden="true" class="w-5 h-5">...</svg>\n  <span>${iconName}</span>\n</a>`,
        react: `<NavLink to="/${iconSlug}" className="flex items-center gap-3">\n  <IconPreviewSvg aria-hidden="true" className="w-5 h-5" />\n  <span>${iconName}</span>\n</NavLink>`,
      },
      recommendations: [
        'Ensure active route links include aria-current="page".',
        'Hide the decorative navigation icon with aria-hidden="true".',
        'Maintain consistent tab order across navigation items.',
      ],
    },
  };

  return {
    role: selectedRole,
    ...GUIDANCE_MAP[selectedRole],
  };
}
