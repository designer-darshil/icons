import React from 'react';
import { Link } from 'react-router-dom';
import { WorkspaceShell } from '@/components/layout/WorkspaceShell';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Layers, ArrowLeft, Cpu, Compass, Mail } from 'lucide-react';

export const AboutRoute: React.FC = () => {
  useDocumentTitle(
    'About & Architecture — GRIDFRAME',
    'Learn about GRIDFRAME: a precision vector icon workstation built for modern product designers and software engineers.'
  );

  return (
    <WorkspaceShell>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <Link
          to="/icons"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-text-tertiary hover:text-text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO WORKSPACE</span>
        </Link>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-[11px] font-mono tracking-widest text-text-tertiary uppercase">ARCHIVE SPECIFICATION</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mb-4">
          About GRIDFRAME
        </h1>
        <p className="text-xs font-mono text-text-tertiary mb-8 pb-6 border-b border-border-default">
          GRIDFRAME V2.4 • PRECISION ICON WORKSTATION
        </p>

        <div className="space-y-8 text-sm text-text-secondary leading-relaxed font-sans">
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-text-primary flex items-center gap-2 font-mono uppercase tracking-wider text-xs">
              <Compass className="w-4 h-4 text-accent" />
              Engineering Philosophy
            </h2>
            <p>
              GRIDFRAME is designed as an industrial-grade workstation for vector icon exploration, inspection, customization, and deployment. Unlike generic clipart directories, every glyph in the archive adheres to strict 24×24 pixel-grid alignment, uniform optical stroke weight, and deterministic geometric constraints.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-text-primary flex items-center gap-2 font-mono uppercase tracking-wider text-xs">
              <Cpu className="w-4 h-4 text-accent" />
              Local-First Performance
            </h2>
            <p>
              Search ranking, fuzzy phonetic indexing, category filtering, live SVG transformation, and multi-format exports execute 100% in-browser on client threads. Zero network round-trips are required during search or customization, ensuring instantaneous sub-millisecond feedback.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-text-primary flex items-center gap-2 font-mono uppercase tracking-wider text-xs">
              <Layers className="w-4 h-4 text-accent" />
              Source Attribution & Credits
            </h2>
            <p>
              The baseline vector library is powered by the exceptional open-source work of <strong className="text-text-primary">Iconoir</strong>. GRIDFRAME augments the canonical collection with advanced search indexing, multi-variant pairing (regular, filled, duotone), customizable stroke metrics, and export tooling.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-text-primary flex items-center gap-2 font-mono uppercase tracking-wider text-xs">
              <Mail className="w-4 h-4 text-accent" />
              Contact & Inquiries
            </h2>
            <p>
              For enterprise integration queries, vector bug reports, or feature requests, reach out at <code className="px-1.5 py-0.5 rounded bg-bg-secondary text-text-primary font-mono text-xs">team@gridframe.dev</code> or open an issue on our GitHub repository.
            </p>
          </section>
        </div>
      </div>
    </WorkspaceShell>
  );
};

export default AboutRoute;
