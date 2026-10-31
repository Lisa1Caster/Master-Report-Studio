import React from 'react';
import {
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  TrendingUp,
  FileCheck,
  ShieldCheck,
  Users,
  Target,
  Download,
} from 'lucide-react';

export const HelpView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">SEO Reporting Best Practices</h2>
            <p className="text-xs text-slate-500">
              How top SEO consultants and agencies craft client reports that retain clients and demonstrate ROI.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Practice 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-2 mb-2 text-indigo-700 font-bold text-sm">
            <Target className="w-4 h-4" />
            <span>1. Lead with Bottom-Line Business Outcomes</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Non-technical clients don't just care about crawl errors or canonical tags—they care about
            qualified organic visits, leads, and pipeline revenue. In the Executive Summary, highlight
            organic traffic growth and conversions before diving into technical minutiae.
          </p>
        </div>

        {/* Practice 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-2 mb-2 text-purple-700 font-bold text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>2. Explain &ldquo;Why&rdquo; Movements Happened</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            When rankings jump or drop, explain the contextual factors: seasonal search demand, Google Core Updates,
            or the direct effect of your published content sprints and technical fixes. Retool Master Report Studio
            integrates this directly into the narrative.
          </p>
        </div>

        {/* Practice 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-2 mb-2 text-emerald-700 font-bold text-sm">
            <FileCheck className="w-4 h-4" />
            <span>3. Show Sprints Completed & Momentum</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Clients pay retainers for continuous momentum. Documenting 4-6 specific technical and on-page
            deliverables per month clearly visualizes your agency&rsquo;s active work, making monthly retainer renewals
            a no-brainer.
          </p>
        </div>

        {/* Practice 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-2 mb-2 text-amber-700 font-bold text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>4. Be Transparent with Missing Data</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Never hallucinate or guess numbers. If conversion tracking or previous period baselines are missing,
            our reporting engine transparently flags it with constructive recommendations on integrating Google
            Analytics 4 and Search Console.
          </p>
        </div>
      </div>

      {/* PDF Export Advice */}
      <div className="bg-purple-50/60 p-6 rounded-2xl border border-purple-100">
        <h3 className="text-sm font-bold text-purple-950 mb-2 flex items-center gap-2">
          <Download className="w-4 h-4 text-purple-700" />
          Sending Reports to Clients (PDF & Copy Options)
        </h3>
        <p className="text-xs text-slate-700 leading-relaxed mb-3">
          Once your report is generated, you can download an A4-optimized PDF directly using the <strong>Download PDF</strong> button.
          Alternatively, click <strong>Print</strong> to open your system print dialog and select &ldquo;Save as PDF&rdquo; for ultra-sharp vector rendering.
          You can also click <strong>Copy Text</strong> to paste the executive summary and recommendations into an email or Slack update.
        </p>
        <div className="flex items-center gap-2 text-xs font-semibold text-purple-800">
          <CheckCircle2 className="w-4 h-4 text-purple-600" />
          <span>Supports White-Label logo, custom primary brand colors, and agency footer.</span>
        </div>
      </div>
    </div>
  );
};
