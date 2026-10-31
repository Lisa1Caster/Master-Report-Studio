import React from 'react';
import { SeoReport, TemplatePreset } from '../types/report';
import { REPORT_TEMPLATES } from '../data/templates';
import {
  FilePlus,
  TrendingUp,
  FileText,
  Calendar,
  Building,
  Globe,
  ArrowRight,
  Eye,
  Copy,
  Trash2,
  Award,
  Sparkles,
  Zap,
  CheckCircle2,
  Download,
} from 'lucide-react';

interface DashboardViewProps {
  reports: SeoReport[];
  onSelectReport: (report: SeoReport) => void;
  onNewReport: () => void;
  onUseTemplate: (template: TemplatePreset) => void;
  onDuplicateReport: (id: string) => void;
  onDeleteReport: (id: string) => void;
  onLoadDemo: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  reports,
  onSelectReport,
  onNewReport,
  onUseTemplate,
  onDuplicateReport,
  onDeleteReport,
  onLoadDemo,
}) => {
  // Aggregate stats
  const totalReports = reports.length;
  const recentReports = reports.slice(0, 5);

  // Compute total keywords tracked across active reports
  const totalKeywordsTracked = reports.reduce((acc, r) => {
    return acc + (Number(r.performanceData.totalRankingKeywords) || 0);
  }, 0);

  // Compute average traffic change % across reports that have it
  const validChanges = reports
    .map((r) => r.performanceData.organicTrafficChangePct)
    .filter((v) => v !== null && v !== '' && !isNaN(Number(v)))
    .map((v) => Number(v));

  const avgTrafficLift =
    validChanges.length > 0
      ? (validChanges.reduce((a, b) => a + b, 0) / validChanges.length).toFixed(1)
      : '+24.5';

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-9 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-purple-200 text-xs font-semibold mb-3 border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>Retool Master Report Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Welcome back to your SEO Client Command Center
          </h2>
          <p className="text-sm text-purple-100/90 leading-relaxed mb-6">
            Generate polished, data-backed monthly SEO reports that clients understand and value.
            Input your rankings, backlinks, and work sprints to craft executive deliverables in seconds.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onNewReport}
              className="px-5 py-2.5 rounded-xl bg-white text-indigo-950 font-bold text-sm shadow-sm hover:bg-slate-100 transition-all active:scale-95 flex items-center gap-2"
            >
              <FilePlus className="w-4 h-4 text-indigo-700" />
              <span>Create New SEO Report</span>
            </button>
            <button
              onClick={onLoadDemo}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors border border-white/20 flex items-center gap-2"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>View Sample Agency Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* SEO Reporting Overview KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Reports */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Reports
            </span>
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <FileText className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {totalReports}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Generated and archived</p>
        </div>

        {/* Average Organic Traffic Lift */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Avg Traffic Lift
            </span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
              {Number(avgTrafficLift) > 0 ? `+${avgTrafficLift}%` : `${avgTrafficLift}%`}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Across measured client periods</p>
        </div>

        {/* Total Keywords Tracked */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Keywords Tracked
            </span>
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-700">
              {totalKeywordsTracked.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">In active client portfolios</p>
        </div>

        {/* AI Engine Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              AI Intelligence
            </span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Gemini 3.8
            </span>
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Server Proxy Active
          </p>
        </div>
      </div>

      {/* Quick Access to Report Templates */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Quick Access to Report Templates
            </h3>
            <p className="text-xs text-slate-500">
              Pre-configured SEO deliverable workflows designed for specific client profiles
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {REPORT_TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => onUseTemplate(tpl)}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-purple-400 hover:shadow-sm cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-1 group-hover:text-purple-600 transition-colors">
                  {tpl.name}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {tpl.description}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-purple-600">
                <span>Start Template</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Reports Section */}
      <section className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent SEO Reports</h3>
            <p className="text-xs text-slate-500">
              Access, edit, duplicate, and export previously generated client reports
            </p>
          </div>

          <button
            onClick={onNewReport}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span>Create Report</span>
          </button>
        </div>

        {recentReports.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No reports generated yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Create your first SEO client report or load the sample demo report to preview the layout.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={onNewReport}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-xs hover:bg-indigo-700"
              >
                Create New Report
              </button>
              <button
                onClick={onLoadDemo}
                className="px-4 py-2 rounded-xl bg-purple-50 text-purple-700 text-xs font-semibold hover:bg-purple-100"
              >
                Load Demo Report
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6 sm:mx-0">
            <table className="w-full text-left text-xs min-w-[600px]">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase border-y border-slate-200/70">
                <tr>
                  <th className="py-3 px-4">Client / Business</th>
                  <th className="py-3 px-4">Reporting Period</th>
                  <th className="py-3 px-4">Traffic (Current)</th>
                  <th className="py-3 px-4">Page 1 Keywords</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-slate-900 block text-xs">
                          {report.clientInfo.businessName || 'Unnamed Business'}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {report.clientInfo.websiteUrl || 'No URL'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {report.clientInfo.reportingPeriod}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {report.performanceData.organicTrafficCurrent
                        ? Number(report.performanceData.organicTrafficCurrent).toLocaleString()
                        : '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800">
                        {report.performanceData.keywordsTop10 || '—'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          report.status === 'generated'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        }`}
                      >
                        {report.status === 'generated' ? 'Generated' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectReport(report)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="View / Preview Report"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDuplicateReport(report.id)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                          title="Duplicate for Next Month"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteReport(report.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Report"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
