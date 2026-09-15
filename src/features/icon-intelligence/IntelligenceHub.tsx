import React, { useState } from 'react';
import type { Icon } from '@/types/icon';
import { GRIDFRAME_ICONS } from '@/data/icons/gridframe-catalog';
import { IconDnaCard } from './components/IconDnaCard';
import { IconSimilarityPanel } from './components/IconSimilarityPanel';
import { IconConsistencyChecker } from './components/IconConsistencyChecker';
import { IconSetHealthCard } from './components/IconSetHealthCard';
import { MissingIconDetector } from './components/MissingIconDetector';
import { IconStateMatrix } from './components/IconStateMatrix';
import { IconPairingPanel } from './components/IconPairingPanel';
import { IconContextPreview } from './components/IconContextPreview';
import { IconStressTestView } from './components/IconStressTestView';
import { IconAccessibilityGuide } from './components/IconAccessibilityGuide';
import { IconSetBuilder } from './components/IconSetBuilder';
import { IconSetDiffViewer } from './components/IconSetDiffViewer';
import { IconTimeMachine } from './components/IconTimeMachine';
import { IconRelationshipGraphView } from './components/IconRelationshipGraphView';
import { IconRouletteView } from './components/IconRouletteView';
import { IconUsageRecommendationsView } from './components/IconUsageRecommendationsView';
import { IconPreviewSvg } from '@/components/icons/IconPreviewSvg';
import { cn } from '@/lib/cn';

export type IntelligenceTab =
  | 'dna'
  | 'similarity'
  | 'consistency'
  | 'health'
  | 'missing'
  | 'states'
  | 'pairing'
  | 'context'
  | 'stress'
  | 'a11y'
  | 'builder'
  | 'diff'
  | 'timemachine'
  | 'graph'
  | 'roulette'
  | 'recommendations';

export interface IntelligenceHubProps {
  initialIcon?: Icon;
  initialTab?: IntelligenceTab;
  className?: string;
}

export const IntelligenceHub: React.FC<IntelligenceHubProps> = ({
  initialIcon,
  initialTab = 'dna',
  className,
}) => {
  const [selectedIcon, setSelectedIcon] = useState<Icon>(initialIcon || GRIDFRAME_ICONS[0]);
  const [activeTab, setActiveTab] = useState<IntelligenceTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Filtered candidate icons for icon picker
  const filteredCandidates = GRIDFRAME_ICONS.filter(
    (i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.slug.includes(searchQuery.toLowerCase())
  ).slice(0, 24);

  const TABS: { id: IntelligenceTab; label: string; group: string }[] = [
    { id: 'dna', label: '1. Icon DNA', group: 'Visual Analysis' },
    { id: 'similarity', label: '2. Find Similar', group: 'Visual Analysis' },
    { id: 'consistency', label: '3. Consistency', group: 'Quality & Sets' },
    { id: 'health', label: '4. Set Health', group: 'Quality & Sets' },
    { id: 'missing', label: '5. Missing Icons', group: 'Quality & Sets' },
    { id: 'states', label: '6. State Matrix', group: 'Semantic Relationships' },
    { id: 'pairing', label: '7. Pairing', group: 'Semantic Relationships' },
    { id: 'graph', label: '8. Relation Graph', group: 'Semantic Relationships' },
    { id: 'context', label: '9. UI Context', group: 'Testing & Specs' },
    { id: 'stress', label: '10. Stress Test', group: 'Testing & Specs' },
    { id: 'a11y', label: '11. Accessibility', group: 'Testing & Specs' },
    { id: 'recommendations', label: '12. Usage Guide', group: 'Testing & Specs' },
    { id: 'builder', label: '13. Set Builder', group: 'Workflows & Discovery' },
    { id: 'diff', label: '14. Set Diff', group: 'Workflows & Discovery' },
    { id: 'roulette', label: '15. Roulette', group: 'Workflows & Discovery' },
    { id: 'timemachine', label: '16. Time Machine', group: 'Workflows & Discovery' },
  ];

  return (
    <div className={cn('w-full max-w-[1600px] mx-auto px-4 sm:px-8 py-8 space-y-8', className)}>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-default pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            <span className="text-[11px] font-mono tracking-widest text-text-tertiary uppercase font-bold">
              GRIDFRAME INTELLIGENCE SUITE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-black text-text-primary uppercase tracking-tight">
            ICON SYSTEM INTELLIGENCE
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 font-sans">
            Multi-dimensional visual heuristics, optical calibration, semantic graph relationships, and set engineering.
          </p>
        </div>

        {/* Selected Icon Picker Anchor */}
        <div className="relative shrink-0">
          <div
            onClick={() => setIsPickerOpen(!isPickerOpen)}
            className="flex items-center gap-3 p-2.5 rounded-sm border border-border-strong bg-bg-secondary hover:border-accent cursor-pointer transition-colors"
          >
            <div className="w-8 h-8 rounded-xs border border-border-subtle bg-bg-primary flex items-center justify-center">
              <IconPreviewSvg svgContent={selectedIcon.svg} className="w-4 h-4 text-accent" />
            </div>
            <div className="text-left space-y-0.5">
              <p className="text-xs font-mono font-bold text-text-primary truncate max-w-[120px]">{selectedIcon.name}</p>
              <p className="text-[9px] font-mono text-text-tertiary uppercase">Target Icon ▾</p>
            </div>
          </div>

          {/* Icon Picker Popover */}
          {isPickerOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 p-3 rounded-sm border border-border-strong bg-bg-secondary shadow-dropdown z-50 space-y-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 2,200 catalog icons..."
                className="w-full px-2.5 py-1.5 rounded-xs border border-border-default bg-bg-primary text-xs font-mono text-text-primary focus:outline-none focus:border-accent"
              />
              <div className="grid grid-cols-6 gap-1 max-h-48 overflow-y-auto p-1 border border-border-subtle rounded-xs bg-bg-primary">
                {filteredCandidates.map((i) => (
                  <button
                    key={i.id}
                    type="button"
                    onClick={() => {
                      setSelectedIcon(i);
                      setIsPickerOpen(false);
                    }}
                    title={i.name}
                    className="p-1.5 rounded-xs hover:bg-bg-secondary hover:text-accent flex items-center justify-center cursor-pointer"
                  >
                    <IconPreviewSvg svgContent={i.svg} className="w-4 h-4 text-text-primary" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Suite Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="space-y-4">
          <div className="p-3.5 rounded-sm border border-border-default bg-bg-secondary/60 space-y-2">
            <h3 className="text-[10px] font-mono uppercase text-text-tertiary tracking-wider font-bold">
              16 Intelligence Tools
            </h3>
            <div className="space-y-1">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 rounded-xs text-xs font-mono transition-colors text-left cursor-pointer',
                    activeTab === t.id
                      ? 'bg-accent text-accent-fg font-bold shadow-2xs'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                  )}
                >
                  <span>{t.label}</span>
                  <span className="text-[9px] opacity-70">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Tool Stage */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'dna' && <IconDnaCard icon={selectedIcon} />}
          {activeTab === 'similarity' && (
            <IconSimilarityPanel
              targetIcon={selectedIcon}
              catalogIcons={GRIDFRAME_ICONS}
              onSelectIcon={(i) => setSelectedIcon(i)}
            />
          )}
          {activeTab === 'consistency' && (
            <IconConsistencyChecker icons={GRIDFRAME_ICONS.slice(0, 15)} />
          )}
          {activeTab === 'health' && (
            <IconSetHealthCard icons={GRIDFRAME_ICONS.slice(0, 20)} />
          )}
          {activeTab === 'missing' && (
            <MissingIconDetector
              currentIcons={GRIDFRAME_ICONS.slice(0, 6)}
              catalogIcons={GRIDFRAME_ICONS}
            />
          )}
          {activeTab === 'states' && (
            <IconStateMatrix
              rootIcon={selectedIcon}
              catalogIcons={GRIDFRAME_ICONS}
              onSelectStateIcon={(i) => setSelectedIcon(i)}
            />
          )}
          {activeTab === 'pairing' && (
            <IconPairingPanel
              icon={selectedIcon}
              catalogIcons={GRIDFRAME_ICONS}
              onSelectPair={(i) => setSelectedIcon(i)}
            />
          )}
          {activeTab === 'graph' && (
            <IconRelationshipGraphView
              rootIcon={selectedIcon}
              catalogIcons={GRIDFRAME_ICONS}
              onSelectNode={(i) => setSelectedIcon(i)}
            />
          )}
          {activeTab === 'context' && <IconContextPreview icon={selectedIcon} />}
          {activeTab === 'stress' && <IconStressTestView icon={selectedIcon} />}
          {activeTab === 'a11y' && <IconAccessibilityGuide icon={selectedIcon} />}
          {activeTab === 'recommendations' && <IconUsageRecommendationsView icon={selectedIcon} />}
          {activeTab === 'builder' && <IconSetBuilder catalogIcons={GRIDFRAME_ICONS} />}
          {activeTab === 'diff' && (
            <IconSetDiffViewer
              setA={GRIDFRAME_ICONS.slice(0, 12)}
              setB={GRIDFRAME_ICONS.slice(5, 22)}
              setAName="Baseline Release Set"
              setBName="Curated Target Set"
            />
          )}
          {activeTab === 'roulette' && (
            <IconRouletteView
              catalogIcons={GRIDFRAME_ICONS}
              onOpenIcon={(i) => setSelectedIcon(i)}
            />
          )}
          {activeTab === 'timemachine' && <IconTimeMachine icon={selectedIcon} />}
        </div>
      </div>
    </div>
  );
};

export default IntelligenceHub;
