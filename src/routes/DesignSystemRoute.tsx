import React, { useState } from 'react';
import { WorkspaceShell } from '@/components/layout/WorkspaceShell';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Slider } from '@/components/ui/Slider';
import { useToast } from '@/components/ui/Toast';
import { SpecimenCard } from '@/features/icon-explorer/SpecimenCard';
import { GRIDFRAME_ICONS } from '@/data/icons/gridframe-catalog';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import {
  Sparkles,
  Search,
  SlidersHorizontal,
  Copy,
  ArrowRight,
  Layers,
  Square,
  Circle,
  Eye,
  CheckCircle2,
  XCircle,
  Info,
} from 'lucide-react';
import type { Icon } from '@/types/icon';

const SAMPLE_ICONS: Icon[] = GRIDFRAME_ICONS.slice(0, 4);

export const DesignSystemRoute: React.FC = () => {
  useDocumentTitle('Design System QA', 'GRIDFRAME Design System Tokens, Typography, Spacing, and Component Foundations.');
  const { success, error, info } = useToast();

  const [activeTab, setActiveTab] = useState<'tokens' | 'components' | 'icon-system' | 'motion'>('tokens');
  const [sliderVal, setSliderVal] = useState(2);
  const [inputValue, setInputValue] = useState('');
  const [motionTriggered, setMotionTriggered] = useState(false);

  return (
    <WorkspaceShell>
      <div className="space-y-12 pb-16">
        {/* Header Section */}
        <section className="border-b border-border-subtle pb-6 space-y-2">
          <div className="flex items-center gap-2 text-text-tertiary text-[11px] font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>GRIDFRAME / SPECIFICATION & QA</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
            Design System Guidelines
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary max-w-2xl font-mono leading-relaxed">
            Source of truth for tokens, spacing, typography, motion, surfaces, and canonical 24×24 icon geometry.
          </p>

          {/* QA Sub-Navigation Tabs */}
          <div className="flex items-center gap-2 pt-4 border-t border-border-subtle">
            {(
              [
                { id: 'tokens', label: '01 / Tokens & Foundations' },
                { id: 'components', label: '02 / UI Components' },
                { id: 'icon-system', label: '03 / 24×24 Icon Geometry' },
                { id: 'motion', label: '04 / Motion & Timing' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xs text-xs font-mono transition-colors ${
                  activeTab === tab.id
                    ? 'bg-bg-elevated text-text-primary font-bold border border-border-strong shadow-xs'
                    : 'text-text-tertiary hover:text-text-secondary border border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* TAB 1: TOKENS & FOUNDATIONS */}
        {activeTab === 'tokens' && (
          <div className="space-y-12">
            {/* Color Palette Specification */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold font-mono tracking-tight text-text-primary uppercase flex items-center gap-2">
                <Layers className="w-4 h-4 text-accent" />
                <span>Warm Editorial Palette & Brand Accent Matrix</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { name: 'Brand Accent (Orange)', token: '--color-accent', dark: '#FF5A36', light: '#FF5A36', role: 'Active navigation, primary CTAs, emphasis' },
                  { name: 'Secondary Accent (Yellow)', token: '--color-accent-secondary', dark: '#F4C95D', light: '#F4C95D', role: 'Editorial highlights, featured badges' },
                  { name: 'Background Primary', token: '--color-background-primary', dark: '#11110F', light: '#F4F1EA', role: 'Warm neutral canvas foundation' },
                  { name: 'Background Secondary', token: '--color-background-secondary', dark: '#1A1916', light: '#E9E4D9', role: 'Card & toolbar surface' },
                  { name: 'Background Elevated', token: '--color-background-elevated', dark: '#24221E', light: '#FFFDF8', role: 'Modals, popovers, dropdowns' },
                  { name: 'Text Primary', token: '--color-text-primary', dark: '#F7F3EA', light: '#161616', role: 'Headings and dominant labels' },
                  { name: 'Text Secondary', token: '--color-text-secondary', dark: '#C6C0B5', light: '#51504A', role: 'Icon names and descriptions' },
                  { name: 'Text Tertiary', token: '--color-text-tertiary', dark: '#969087', light: '#76736C', role: 'Metadata, tags, captions' },
                  { name: 'Border Subtle', token: '--color-border-subtle', dark: '#292722', light: '#DED9CF', role: 'Card internal dividers' },
                  { name: 'Border Default', token: '--color-border-default', dark: '#35322D', light: '#D0CBC1', role: 'Container bounding frames' },
                  { name: 'Border Strong', token: '--color-border-strong', dark: '#4A463D', light: '#AAA49A', role: 'Hover and active boundaries' },
                  { name: 'Focus Default', token: '--color-focus-default', dark: '#FF5A36', light: '#FF5A36', role: '1.5px brand focus ring' },
                ].map((c) => (
                  <div key={c.token} className="p-3 bg-bg-secondary border border-border-default rounded-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-text-primary">{c.name}</span>
                      {c.token === '--color-accent' && (
                        <div className="w-3 h-3 rounded-full bg-accent" />
                      )}
                      {c.token === '--color-accent-secondary' && (
                        <div className="w-3 h-3 rounded-full bg-accent-secondary" />
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-text-tertiary space-y-0.5">
                      <div>Token: <code className="text-text-secondary">{c.token}</code></div>
                      <div>Dark: <span className="text-text-primary font-mono">{c.dark}</span> | Light: <span className="text-text-primary font-mono">{c.light}</span></div>
                    </div>
                    <div className="text-[10px] text-text-tertiary pt-1 border-t border-border-subtle">{c.role}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Typography Scale */}
            <section className="space-y-4">
              <h2 className="type-h2 text-text-primary uppercase flex items-center gap-2">
                <span className="type-section-label text-accent font-bold">02 / Scale</span>
                <span>General Sans Typography Hierarchy</span>
              </h2>
              <div className="bg-bg-secondary border border-border-default rounded-xs p-6 sm:p-8 space-y-8">
                <div className="border-b border-border-subtle pb-6 space-y-2">
                  <span className="type-section-label text-text-tertiary">Hero — clamp(56px, 7vw, 112px) / 0.90 / -0.045em</span>
                  <div className="type-hero text-text-primary">
                    Precision Forms
                  </div>
                </div>
                <div className="border-b border-border-subtle pb-6 space-y-2">
                  <span className="type-section-label text-text-tertiary">Display — clamp(48px, 6vw, 88px) / 0.94 / -0.04em</span>
                  <div className="type-display text-text-primary">
                    Engineered Vector Geometry
                  </div>
                </div>
                <div className="border-b border-border-subtle pb-6 space-y-2">
                  <span className="type-section-label text-text-tertiary">H1 — clamp(40px, 5vw, 72px) / 0.98 / -0.035em</span>
                  <div className="type-h1 text-text-primary">
                    Monograph Architecture Catalog
                  </div>
                </div>
                <div className="border-b border-border-subtle pb-6 space-y-2">
                  <span className="type-section-label text-text-tertiary">H2 — clamp(28px, 3.2vw, 48px) / 1.08 / -0.025em</span>
                  <div className="type-h2 text-text-primary">
                    Curated Domain Chapters & Collections
                  </div>
                </div>
                <div className="border-b border-border-subtle pb-6 space-y-2">
                  <span className="type-section-label text-text-tertiary">H3 — clamp(20px, 2vw, 28px) / 1.20 / -0.02em</span>
                  <div className="type-h3 text-text-primary">
                    Navigation & Wayfinding Family Systems
                  </div>
                </div>
                <div className="border-b border-border-subtle pb-6 space-y-2">
                  <span className="type-section-label text-text-tertiary">Body Lead — 18–20px / 1.50</span>
                  <div className="type-body-lead text-text-secondary leading-relaxed">
                    An open vector monograph of geometric interface glyphs. Unified on a 24×24 pixel canvas and deduplicated by canonical concept identity.
                  </div>
                </div>
                <div className="border-b border-border-subtle pb-6 space-y-2">
                  <span className="type-section-label text-text-tertiary">Body — 16px / 1.60</span>
                  <div className="type-body text-text-secondary leading-relaxed">
                    Every icon adheres to a canonical 24×24 pixel coordinate canvas with disciplined stroke optical weights and universal export.
                  </div>
                </div>
                <div className="border-b border-border-subtle pb-6 space-y-2">
                  <span className="type-section-label text-text-tertiary">Section Label — 11px / Mono / Uppercase Tracking</span>
                  <div className="type-section-label text-accent">
                    01 / CANONICAL CONCEPT MODEL
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="type-section-label text-text-tertiary">Metadata & Code — 11–12px / JetBrains Mono</span>
                  <div className="type-metadata text-text-secondary bg-bg-elevated p-3 rounded-xs border border-border-default">
                    import &#123; ArrowRight &#125; from &#39;@gridframe/react&#39;; // 24x24 px
                  </div>
                </div>
              </div>
            </section>

            {/* Spacing & Radius Scale */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold font-mono tracking-tight text-text-primary uppercase">
                4px Base Spacing Scale & Radius System
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {[
                  { name: '4px (1)', val: '4px', role: 'Micro gap' },
                  { name: '8px (2)', val: '8px', role: 'Control gap' },
                  { name: '12px (3)', val: '12px', role: 'Group gap' },
                  { name: '16px (4)', val: '16px', role: 'Internal pad' },
                  { name: '24px (6)', val: '24px', role: 'Component gap' },
                  { name: '32px (8)', val: '32px', role: 'Section gap' },
                  { name: '48px (12)', val: '48px', role: 'Major transition' },
                ].map((s) => (
                  <div key={s.name} className="p-3 bg-bg-secondary border border-border-default rounded-xs space-y-2 text-center">
                    <div className="h-6 bg-bg-elevated border border-border-strong flex items-center justify-center text-[10px] font-mono text-text-primary">
                      {s.val}
                    </div>
                    <span className="text-xs font-mono font-bold text-text-primary block">{s.name}</span>
                    <span className="text-[10px] text-text-tertiary block">{s.role}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: UI COMPONENTS */}
        {activeTab === 'components' && (
          <div className="space-y-12">
            {/* Buttons Showcase */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold font-mono tracking-tight text-text-primary uppercase">
                Button System
              </h2>
              <div className="p-6 bg-bg-secondary border border-border-default rounded-xs space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary" size="md">
                    <span>Primary Action</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="secondary" size="md">
                    Secondary Button
                  </Button>
                  <Button variant="outline" size="md">
                    Outline Button
                  </Button>
                  <Button variant="ghost" size="md">
                    Ghost Button
                  </Button>
                  <Button variant="destructive" size="md">
                    Destructive
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border-subtle">
                  <Button variant="secondary" size="xs">Size XS</Button>
                  <Button variant="secondary" size="sm">Size SM</Button>
                  <Button variant="secondary" size="md">Size MD</Button>
                  <Button variant="secondary" size="lg">Size LG</Button>
                  <IconButton aria-label="Copy SVG">
                    <Copy className="w-4 h-4" />
                  </IconButton>
                  <IconButton aria-label="Filter" variant="primary">
                    <SlidersHorizontal className="w-4 h-4" />
                  </IconButton>
                </div>
              </div>
            </section>

            {/* Inputs & Search */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold font-mono tracking-tight text-text-primary uppercase">
                Inputs & Search
              </h2>
              <div className="p-6 bg-bg-secondary border border-border-default rounded-xs grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-text-secondary">Standard Text Input</label>
                  <Input
                    placeholder="Enter icon keyword..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onClear={() => setInputValue('')}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-text-secondary">Search Command Trigger</label>
                  <Input
                    prefixIcon={<Search className="w-3.5 h-3.5 text-text-tertiary" />}
                    placeholder="Search 9,000+ icons (⌘K)..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onClear={() => setInputValue('')}
                  />
                </div>
              </div>
            </section>

            {/* Sliders & Controls */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold font-mono tracking-tight text-text-primary uppercase">
                Sliders & Status Badges
              </h2>
              <div className="p-6 bg-bg-secondary border border-border-default rounded-xs space-y-6">
                <div className="max-w-md space-y-2">
                  <Slider
                    label="Stroke Width"
                    valueDisplay={`${sliderVal}px`}
                    value={sliderVal}
                    min={0.5}
                    max={3.0}
                    step={0.25}
                    onChange={(e) => setSliderVal(parseFloat(e.target.value))}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border-subtle">
                  <Badge variant="default">DEFAULT BADGE</Badge>
                  <Badge variant="success">24×24 CANONICAL</Badge>
                  <Badge variant="warning">DEPRECATED</Badge>
                  <Badge variant="error">FAILED QA</Badge>
                  <Badge variant="primary">NEW SPECIMEN</Badge>
                </div>

                {/* Toast Triggers */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border-subtle">
                  <Button variant="secondary" size="sm" onClick={() => success('Copied SVG markup')}>
                    <CheckCircle2 className="w-3.5 h-3.5 text-status-success-text mr-1" />
                    Success Toast
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => error('Invalid SVG path detected')}>
                    <XCircle className="w-3.5 h-3.5 text-status-error-text mr-1" />
                    Error Toast
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => info('Updated to Tabler v3.46.0')}>
                    <Info className="w-3.5 h-3.5 text-status-info-text mr-1" />
                    Info Toast
                  </Button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TAB 3: ICON SYSTEM GEOMETRY */}
        {activeTab === 'icon-system' && (
          <div className="space-y-12">
            {/* 24x24 Canonical Grid Specification */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold font-mono tracking-tight text-text-primary uppercase flex items-center gap-2">
                <Square className="w-4 h-4 text-text-tertiary" />
                <span>24×24 Coordinate Canvas & Keyshapes</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-bg-secondary border border-border-default rounded-xs space-y-3">
                  <div className="aspect-square bg-bg-elevated border border-border-strong relative flex items-center justify-center p-6">
                    {/* Circle Keyshape Guide (20px) */}
                    <div className="absolute w-[83.3%] h-[83.3%] rounded-full border border-status-info-text/40 border-dashed" />
                    <Circle className="w-12 h-12 text-text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-text-primary block">Circle Keyshape</span>
                    <span className="text-[11px] font-mono text-text-tertiary">20px diameter (83.3% canvas)</span>
                  </div>
                </div>

                <div className="p-4 bg-bg-secondary border border-border-default rounded-xs space-y-3">
                  <div className="aspect-square bg-bg-elevated border border-border-strong relative flex items-center justify-center p-6">
                    {/* Square Keyshape Guide (18x18px) */}
                    <div className="absolute w-[75%] h-[75%] border border-status-warning-text/40 border-dashed" />
                    <Square className="w-11 h-11 text-text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-text-primary block">Square Keyshape</span>
                    <span className="text-[11px] font-mono text-text-tertiary">18×18px (75% canvas)</span>
                  </div>
                </div>

                <div className="p-4 bg-bg-secondary border border-border-default rounded-xs space-y-3">
                  <div className="aspect-square bg-bg-elevated border border-border-strong relative flex items-center justify-center p-6">
                    {/* Landscape Keyshape Guide (20x14px) */}
                    <div className="absolute w-[83.3%] h-[58.3%] border border-status-success-text/40 border-dashed" />
                    <div className="w-12 h-8 border border-text-primary rounded-2xs flex items-center justify-center text-[10px] font-mono">
                      RECT
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-text-primary block">Landscape Keyshape</span>
                    <span className="text-[11px] font-mono text-text-tertiary">20×14px (83.3% × 58.3%)</span>
                  </div>
                </div>

                <div className="p-4 bg-bg-secondary border border-border-default rounded-xs space-y-3">
                  <div className="aspect-square bg-bg-elevated border border-border-strong relative flex items-center justify-center p-6">
                    {/* Portrait Keyshape Guide (14x20px) */}
                    <div className="absolute w-[58.3%] h-[83.3%] border border-status-info-text/40 border-dashed" />
                    <div className="w-8 h-12 border border-text-primary rounded-2xs flex items-center justify-center text-[10px] font-mono">
                      VERT
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-text-primary block">Portrait Keyshape</span>
                    <span className="text-[11px] font-mono text-text-tertiary">14×20px (58.3% × 83.3%)</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Specimen Card Grid Demonstration */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold font-mono tracking-tight text-text-primary uppercase">
                Specimen Card Architectural Rigor
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SAMPLE_ICONS.map((icon) => (
                  <SpecimenCard
                    key={icon.id}
                    icon={icon}
                    onSelect={() => {}}
                    onToggleFavorite={() => {}}
                  />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* TAB 4: MOTION & TIMINGS */}
        {activeTab === 'motion' && (
          <div className="space-y-12">
            <section className="space-y-4">
              <h2 className="text-lg font-bold font-mono tracking-tight text-text-primary uppercase">
                Motion Easing & Timing Specifications
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: 'Micro Motion', duration: '120ms', ease: 'cubic-bezier(0.16, 1, 0.3, 1)', role: 'Button hover, focus shifts, card highlights' },
                  { name: 'Standard Motion', duration: '180ms', ease: 'cubic-bezier(0.16, 1, 0.3, 1)', role: 'Dropdown reveal, accordion expand' },
                  { name: 'Modal Motion', duration: '240ms', ease: 'cubic-bezier(0.16, 1, 0.3, 1)', role: 'Icon specimen dialog scale & fade' },
                  { name: 'Section Reveal', duration: '350ms', ease: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', role: 'Page transition and staggered catalog' },
                ].map((m) => (
                  <div key={m.name} className="p-4 bg-bg-secondary border border-border-default rounded-xs space-y-2">
                    <span className="text-xs font-mono font-bold text-text-primary block">{m.name}</span>
                    <div className="text-[11px] font-mono text-text-tertiary">Duration: <span className="text-text-primary">{m.duration}</span></div>
                    <div className="text-[10px] font-mono text-text-tertiary truncate">Ease: {m.ease}</div>
                    <div className="text-[10px] text-text-secondary pt-1 border-t border-border-subtle">{m.role}</div>
                  </div>
                ))}
              </div>

              {/* Interactive Motion Test Area */}
              <div className="p-6 bg-bg-secondary border border-border-default rounded-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-text-primary">Interactive Specimen Spring</span>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setMotionTriggered(true);
                      setTimeout(() => setMotionTriggered(false), 800);
                    }}
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    Trigger Specimen Pulse
                  </Button>
                </div>
                <div className="h-24 bg-bg-elevated border border-border-default rounded-xs flex items-center justify-center overflow-hidden">
                  <div
                    className={`w-12 h-12 rounded-xs bg-action-primary text-text-inverse flex items-center justify-center font-mono font-bold text-xs transition-all duration-200 ${
                      motionTriggered ? 'scale-125 rotate-6 shadow-md' : 'scale-100 rotate-0'
                    }`}
                  >
                    24×24
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </WorkspaceShell>
  );
};
export default DesignSystemRoute;
