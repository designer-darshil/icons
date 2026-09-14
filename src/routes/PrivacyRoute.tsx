import React from 'react';
import { Link } from 'react-router-dom';
import { WorkspaceShell } from '@/components/layout/WorkspaceShell';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { ShieldCheck, ArrowLeft, Lock, FileText, CheckCircle2 } from 'lucide-react';

export const PrivacyRoute: React.FC = () => {
  useDocumentTitle(
    'Privacy Policy — GRIDFRAME',
    'GRIDFRAME privacy policy and data governance practices. We respect privacy and operate on a local-first architecture.'
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
          <span className="text-[11px] font-mono tracking-widest text-text-tertiary uppercase">LEGAL & DATA GOVERNANCE</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mb-4">
          Privacy Policy
        </h1>
        <p className="text-xs font-mono text-text-tertiary mb-8 pb-6 border-b border-border-default">
          EFFECTIVE DATE: SEPTEMBER 2026 • REVISION 2.4
        </p>

        <div className="space-y-8 text-sm text-text-secondary leading-relaxed font-sans">
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-text-primary flex items-center gap-2 font-mono uppercase tracking-wider text-xs">
              <ShieldCheck className="w-4 h-4 text-accent" />
              1. Local-First Architecture
            </h2>
            <p>
              GRIDFRAME is engineered with a privacy-first, client-side execution model. All icon customizations, color selections, stroke width adjustments, rotation matrices, favorites, and custom icon sets are processed and stored locally within your browser’s localStorage.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-text-primary flex items-center gap-2 font-mono uppercase tracking-wider text-xs">
              <Lock className="w-4 h-4 text-accent" />
              2. Data Collection & Analytics
            </h2>
            <p>
              We do not track personally identifiable information (PII), keyboard input, or exported SVG payloads. We may collect aggregated, anonymized telemetry (such as total export counts or general search frequency) purely to monitor system health and optimize vector indexing performance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-text-primary flex items-center gap-2 font-mono uppercase tracking-wider text-xs">
              <FileText className="w-4 h-4 text-accent" />
              3. Cookies & Local Storage
            </h2>
            <p>
              GRIDFRAME does not use third-party advertising cookies. We use browser local storage solely to remember your chosen theme preference (dark / light), saved favorites, and user-created collections across sessions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-text-primary flex items-center gap-2 font-mono uppercase tracking-wider text-xs">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              4. Contact & Inquiries
            </h2>
            <p>
              If you have any questions regarding privacy practices or vector license compliance, reach out via our open-source archive repository or contact team@gridframe.dev.
            </p>
          </section>
        </div>
      </div>
    </WorkspaceShell>
  );
};

export default PrivacyRoute;
