import React, { useState } from 'react';
import type { Icon } from '@/types/icon';
import { generateA11yGuidance } from '@/lib/icon-intelligence/accessibility';
import type { IconA11yRole } from '@/types/intelligence';
import { cn } from '@/lib/cn';

export interface IconAccessibilityGuideProps {
  icon: Icon;
  className?: string;
}

export const IconAccessibilityGuide: React.FC<IconAccessibilityGuideProps> = ({ icon, className }) => {
  const [selectedRole, setSelectedRole] = useState<IconA11yRole>('Action');
  const [snippetType, setSnippetType] = useState<'react' | 'html'>('react');
  const [copied, setCopied] = useState(false);

  const guidance = generateA11yGuidance(icon, selectedRole);
  const roles: IconA11yRole[] = ['Action', 'Meaningful', 'Decorative', 'Status', 'Navigation'];

  const handleCopy = () => {
    const code = snippetType === 'react' ? guidance.codeSnippet.react : guidance.codeSnippet.html;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('p-5 rounded-sm border border-border-default bg-bg-secondary/40 space-y-4', className)}>
      <div className="flex items-center justify-between border-b border-border-subtle/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary">
            ACCESSIBILITY (A11Y) USAGE GUIDE
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-3xs bg-bg-elevated border border-border-default text-text-tertiary">
          WCAG 2.1 AA Guidance
        </span>
      </div>

      {/* Role Switcher */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {roles.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setSelectedRole(r)}
            className={cn(
              'px-2.5 py-1 rounded-xs text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer border',
              selectedRole === r
                ? 'bg-accent text-accent-fg border-accent font-bold shadow-2xs'
                : 'bg-bg-primary text-text-tertiary border-border-default hover:text-text-primary'
            )}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="p-4 rounded-xs border border-border-default bg-bg-elevated/70 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono font-bold text-text-primary">{guidance.title}</h4>
          <span className="text-[10px] font-mono text-accent uppercase font-semibold">
            {guidance.ariaRule}
          </span>
        </div>
        <p className="text-xs text-text-secondary font-sans leading-relaxed">
          {guidance.description}
        </p>

        {/* Code Snippet */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSnippetType('react')}
                className={cn('text-[10px] font-mono px-2 py-0.5 rounded-3xs cursor-pointer', snippetType === 'react' ? 'bg-bg-primary font-bold text-text-primary' : 'text-text-tertiary')}
              >
                React (JSX)
              </button>
              <button
                type="button"
                onClick={() => setSnippetType('html')}
                className={cn('text-[10px] font-mono px-2 py-0.5 rounded-3xs cursor-pointer', snippetType === 'html' ? 'bg-bg-primary font-bold text-text-primary' : 'text-text-tertiary')}
              >
                HTML / SVG
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="text-[10px] font-mono text-accent hover:underline cursor-pointer"
            >
              {copied ? '✓ Copied' : 'Copy Code'}
            </button>
          </div>

          <pre className="p-3 rounded-xs bg-bg-primary border border-border-subtle text-[11px] font-mono text-text-primary overflow-x-auto whitespace-pre leading-relaxed">
            {snippetType === 'react' ? guidance.codeSnippet.react : guidance.codeSnippet.html}
          </pre>
        </div>

        {/* Actionable Rules */}
        <ul className="space-y-1 pt-1 text-xs text-text-secondary font-sans">
          {guidance.recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-accent font-bold">✓</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
