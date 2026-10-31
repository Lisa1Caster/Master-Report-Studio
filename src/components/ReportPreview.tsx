import React, { useState } from 'react';
import { SeoReport, BrandingConfig } from '../types/report';
import { ReportCharts } from './ReportCharts';
import { exportReportToPdf, triggerNativePrint } from '../utils/pdfExport';
import {
  Download,
  Printer,
  Copy,
  Edit3,
  Check,
  TrendingUp,
  TrendingDown,
  Globe,
  Calendar,
  Building,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Compass,
  ArrowRight,
  Sparkles,
  Save,
  Layers,
  FileCheck,
} from 'lucide-react';

interface ReportPreviewProps {
  report: SeoReport;
  branding: BrandingConfig;
  onUpdateReport: (updated: SeoReport) => void;
  onDuplicate: (id: string) => void;
  onBackToEdit: () => void;
}

export const ReportPreview: React.FC<ReportPreviewProps> = ({
  report,
  branding,
  onUpdateReport,
  onDuplicate,
  onBackToEdit,
}) => {
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfStatusMessage, setPdfStatusMessage] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Editable copy of generated content
  const [editableContent, setEditableContent] = useState(
    report.generatedContent || {
      executiveSummary: '',
      performanceOverview: '',
      trafficAnalysis: '',
      keywordAnalysis: '',
      backlinkAnalysis: '',
      workCompletedAnalysis: '',
      challengesAndObservations: '',
      recommendations: [],
      nextMonthStrategy: [],
      keyWins: [],
      missingDataNotes: [],
    }
  );

  const client = report.clientInfo;
  const perf = report.performanceData;
  const effectiveBranding = report.branding || branding;

  const handleDownloadPdf = async () => {
    try {
      setIsExportingPdf(true);
      setPdfStatusMessage('Initializing A4 layout...');
      const cleanBusiness = (client.businessName || 'Client').replace(/[^a-zA-Z0-9]/g, '-');
      const cleanPeriod = (client.reportingPeriod || 'Report').replace(/[^a-zA-Z0-9]/g, '-');
      const filename = `SEO-Report-${cleanBusiness}-${cleanPeriod}.pdf`;

      await exportReportToPdf('printable-seo-report', {
        filename,
        onProgress: (step) => setPdfStatusMessage(step),
      });
    } catch (err) {
      console.error('Failed to export PDF', err);
      // Fallback to native print dialog
      triggerNativePrint();
    } finally {
      setIsExportingPdf(false);
      setPdfStatusMessage('');
    }
  };

  const handleCopyText = async () => {
    if (!report.generatedContent) return;
    const g = report.generatedContent;
    const textToCopy = `
# SEO Performance Report: ${client.businessName}
Reporting Period: ${client.reportingPeriod}
Prepared by: ${effectiveBranding.agencyName}
Date: ${client.reportDate}
Website: ${client.websiteUrl}

---

## Executive Summary
${g.executiveSummary}

## Performance Overview
${g.performanceOverview}

## Organic Traffic Analysis
${g.trafficAnalysis}

## Keyword Ranking Performance
${g.keywordAnalysis}

## Backlink & Domain Authority Performance
${g.backlinkAnalysis}

## SEO Work Completed
${g.workCompletedAnalysis}

## Challenges & Observations
${g.challengesAndObservations}

## Key Strategic Recommendations
${g.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

## Next Month SEO Roadmap
${g.nextMonthStrategy.map((s, i) => `${i + 1}. ${s}`).join('\n')}

---
${effectiveBranding.reportFooter}
Contact: ${effectiveBranding.contactEmail} | ${effectiveBranding.contactWebsite || ''}
    `.trim();

    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (e) {
      console.error('Clipboard copy failed', e);
    }
  };

  const handleSaveEdits = () => {
    const updated: SeoReport = {
      ...report,
      generatedContent: editableContent,
    };
    onUpdateReport(updated);
    setIsEditing(false);
  };

  const isPositiveTraffic =
    perf.organicTrafficChangePct !== null &&
    perf.organicTrafficChangePct !== '' &&
    Number(perf.organicTrafficChangePct) >= 0;

  return (
    <div className="pb-16 max-w-5xl mx-auto">
      {/* Top Action Bar (hidden on print) */}
      <div className="no-print bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs mb-6 flex flex-wrap items-center justify-between gap-3 sticky top-20 z-20">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToEdit}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            &larr; Edit Inputs
          </button>
          <div className="h-4 w-px bg-slate-200" />
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Status:
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <CheckCircle2 className="w-3 h-3" />
            Client Ready
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
              isEditing
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Editing' : 'Edit Report Copy'}</span>
          </button>

          {isEditing && (
            <button
              onClick={handleSaveEdits}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-2xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Edits</span>
            </button>
          )}

          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            title="Copy entire report in Markdown format"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Text</span>
              </>
            )}
          </button>

          <button
            onClick={triggerNativePrint}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            title="Open browser print dialog / Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white shadow-2xs transition-all hover:opacity-95 active:scale-95 disabled:opacity-50"
            style={{ backgroundColor: effectiveBranding.primaryColor || '#4f46e5' }}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExportingPdf ? pdfStatusMessage || 'Generating PDF...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Printable Report Canvas */}
      <div
        id="printable-seo-report"
        className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-10 text-slate-800"
        style={{ minHeight: '1050px' }}
      >
        {/* Cover / Header Section */}
        <div className="border-b border-slate-200 pb-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            {/* Agency Brand Identity */}
            <div className="flex items-center gap-4">
              {effectiveBranding.logoUrl ? (
                <img
                  src={effectiveBranding.logoUrl}
                  alt={effectiveBranding.agencyName}
                  className="w-14 h-14 rounded-xl object-contain bg-slate-50 border border-slate-200 p-1.5"
                />
              ) : (
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-xs"
                  style={{ backgroundColor: effectiveBranding.primaryColor || '#4f46e5' }}
                >
                  {effectiveBranding.agencyName ? effectiveBranding.agencyName.slice(0, 2).toUpperCase() : 'AG'}
                </div>
              )}
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {effectiveBranding.agencyName || 'Agency Report Studio'}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {effectiveBranding.tagline || 'Search Engine Optimization & Organic Growth'}
                </p>
                {effectiveBranding.preparedBy && (
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Prepared by: <span className="text-slate-600 font-medium">{effectiveBranding.preparedBy}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Report Metadata Badge */}
            <div className="sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200/60 mb-1.5">
                SEO Performance Report
              </span>
              <div className="flex sm:justify-end items-center gap-1.5 text-xs text-slate-600 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Period: <strong>{client.reportingPeriod}</strong></span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Date: {client.reportDate || 'Today'}
              </p>
            </div>
          </div>

          {/* Client Target Details Strip */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/70 p-4 rounded-xl">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-600 font-semibold block">Client</span>
                <span className="text-sm font-bold text-slate-900">{client.businessName}</span>
                {client.clientName && (
                  <span className="text-xs text-slate-700 font-medium ml-1.5">({client.clientName})</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-600 font-semibold block">Website URL</span>
                <a
                  href={client.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-indigo-700 hover:underline"
                >
                  {client.websiteUrl || 'Not provided'}
                </a>
              </div>
            </div>

            {client.clientEmail && (
              <div className="hidden md:block">
                <span className="text-[11px] uppercase tracking-wider text-slate-600 font-semibold block">Contact</span>
                <span className="text-xs font-medium text-slate-700">{client.clientEmail}</span>
              </div>
            )}
          </div>
        </div>

        {/* Executive Summary */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-2.5 h-5 rounded-full"
              style={{ backgroundColor: effectiveBranding.primaryColor }}
            />
            <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">
              1. Executive Summary
            </h3>
          </div>

          {isEditing ? (
            <textarea
              value={editableContent.executiveSummary}
              onChange={(e) =>
                setEditableContent({ ...editableContent, executiveSummary: e.target.value })
              }
              rows={5}
              className="w-full text-sm leading-relaxed p-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-normal"
            />
          ) : (
            <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-100 text-sm leading-relaxed text-slate-700 whitespace-pre-line font-normal">
              {editableContent.executiveSummary || 'Executive summary will be generated here.'}
            </div>
          )}
        </section>

        {/* Key Wins Quick Cards */}
        {editableContent.keyWins && editableContent.keyWins.length > 0 && (
          <section className="mb-8">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Key Performance Highlights & Wins</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {editableContent.keyWins.map((win, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-purple-50/50 border border-purple-100/70 text-xs font-medium text-slate-800"
                >
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>{win}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Core KPI Metrics Grid */}
        <section className="mb-8 page-break-inside-avoid">
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-2.5 h-5 rounded-full"
              style={{ backgroundColor: effectiveBranding.primaryColor }}
            />
            <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">
              2. SEO Performance Data
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {/* Metric 1: Organic Traffic */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Organic Traffic
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {perf.organicTrafficCurrent
                    ? Number(perf.organicTrafficCurrent).toLocaleString()
                    : 'Active'}
                </span>
                {perf.organicTrafficChangePct !== null && perf.organicTrafficChangePct !== '' && (
                  <span
                    className={`text-xs font-bold flex items-center ${
                      isPositiveTraffic ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {isPositiveTraffic ? (
                      <TrendingUp className="w-3 h-3 mr-0.5" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-0.5" />
                    )}
                    {isPositiveTraffic ? '+' : ''}
                    {perf.organicTrafficChangePct}%
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Prev: {perf.organicTrafficPrevious ? Number(perf.organicTrafficPrevious).toLocaleString() : 'Baseline'}
              </p>
            </div>

            {/* Metric 2: Top 10 Keywords */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Keywords (Page 1)
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {perf.keywordsTop10 ? perf.keywordsTop10 : (perf.totalRankingKeywords ? `${perf.totalRankingKeywords} total` : 'Tracked')}
                </span>
                {perf.keywordsTop3 && (
                  <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-sm">
                    {perf.keywordsTop3} Top 3
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Total footprint: {perf.totalRankingKeywords ? Number(perf.totalRankingKeywords).toLocaleString() : 'Active'}
              </p>
            </div>

            {/* Metric 3: Domain Authority & Backlinks */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Domain Rating / DA
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-extrabold text-indigo-700">
                  {perf.domainAuthority ? `${perf.domainAuthority}/100` : 'Healthy'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Backlinks: {perf.backlinksAcquired ? `+${perf.backlinksAcquired}` : (perf.referringDomains ? `${perf.referringDomains} ref domains` : 'Monitored')}
              </p>
            </div>

            {/* Metric 4: Conversions or Revenue */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Organic Conversions
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {perf.organicConversions ? Number(perf.organicConversions).toLocaleString() : (perf.organicRevenue ? `$${Number(perf.organicRevenue).toLocaleString()}` : 'Tracked')}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {perf.organicRevenue ? `Pipeline: $${Number(perf.organicRevenue).toLocaleString()}` : 'Organic lead generation'}
              </p>
            </div>
          </div>

          {/* Custom Metrics if any */}
          {perf.customMetrics && perf.customMetrics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
              {perf.customMetrics.map((cm) => (
                <div key={cm.id} className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/70">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase block">{cm.name}</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-base font-bold text-slate-900">{cm.value}</span>
                    {cm.change && <span className="text-xs text-emerald-600 font-semibold">{cm.change}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* High-Resolution Performance Charts */}
          <ReportCharts data={perf} primaryColor={effectiveBranding.primaryColor} />
        </section>

        {/* Detailed Narrative Section */}
        <section className="space-y-6 mb-8 page-break-inside-avoid">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-2.5 h-5 rounded-full"
              style={{ backgroundColor: effectiveBranding.primaryColor }}
            />
            <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">
              3. In-Depth SEO Analysis
            </h3>
          </div>

          {/* Organic Traffic Analysis */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80">
            <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              Organic Traffic & User Acquisition Analysis
            </h4>
            {isEditing ? (
              <textarea
                value={editableContent.trafficAnalysis}
                onChange={(e) =>
                  setEditableContent({ ...editableContent, trafficAnalysis: e.target.value })
                }
                rows={4}
                className="w-full text-sm p-3 border border-indigo-200 rounded-xl"
              />
            ) : (
              <p className="text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                {editableContent.trafficAnalysis}
              </p>
            )}
          </div>

          {/* Keyword Ranking Performance */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80">
            <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-600" />
              Keyword Ranking & Search Visibility
            </h4>
            {isEditing ? (
              <textarea
                value={editableContent.keywordAnalysis}
                onChange={(e) =>
                  setEditableContent({ ...editableContent, keywordAnalysis: e.target.value })
                }
                rows={4}
                className="w-full text-sm p-3 border border-indigo-200 rounded-xl"
              />
            ) : (
              <p className="text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                {editableContent.keywordAnalysis}
              </p>
            )}
          </div>

          {/* Backlink & Authority */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80">
            <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              Backlink Profile & Domain Authority Equity
            </h4>
            {isEditing ? (
              <textarea
                value={editableContent.backlinkAnalysis}
                onChange={(e) =>
                  setEditableContent({ ...editableContent, backlinkAnalysis: e.target.value })
                }
                rows={3}
                className="w-full text-sm p-3 border border-indigo-200 rounded-xl"
              />
            ) : (
              <p className="text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                {editableContent.backlinkAnalysis}
              </p>
            )}
          </div>
        </section>

        {/* SEO Work Completed */}
        <section className="mb-8 page-break-inside-avoid">
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-2.5 h-5 rounded-full"
              style={{ backgroundColor: effectiveBranding.primaryColor }}
            />
            <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">
              4. Deliverables & SEO Work Completed
            </h3>
          </div>

          {/* Narrative Work Analysis */}
          {editableContent.workCompletedAnalysis && (
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 text-sm text-slate-700 leading-relaxed mb-4">
              {editableContent.workCompletedAnalysis}
            </div>
          )}

          {/* Tasks Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Task Deliverable</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Execution Details & Impact</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {report.workCompleted && report.workCompleted.length > 0 ? (
                  report.workCompleted.map((task) => (
                    <tr key={task.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {task.taskName}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {task.category || 'General SEO'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {task.details || 'Completed according to monthly optimization roadmap.'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          <CheckCircle2 className="w-3 h-3" />
                          Delivered
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-4 px-4 text-slate-500 text-center italic">
                      Continuous monitoring, crawl budget maintenance, and SERP telemetry maintained throughout this cycle.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Challenges & Observations */}
        {report.challenges && (
          <section className="mb-8 page-break-inside-avoid">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-2.5 h-5 rounded-full"
                style={{ backgroundColor: effectiveBranding.primaryColor }}
              />
              <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">
                5. Challenges, Observations & Mitigation
              </h3>
            </div>
            <div className="bg-amber-50/40 border border-amber-200/60 p-4 rounded-xl text-sm leading-relaxed text-slate-700">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="w-full">
                  <p className="font-semibold text-slate-900 text-xs mb-1">
                    Observed Market & Technical Variables:
                  </p>
                  {isEditing ? (
                    <textarea
                      value={editableContent.challengesAndObservations}
                      onChange={(e) =>
                        setEditableContent({
                          ...editableContent,
                          challengesAndObservations: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full text-sm p-2 border border-amber-300 rounded-lg mt-1"
                    />
                  ) : (
                    <p className="text-sm text-slate-700">
                      {editableContent.challengesAndObservations || report.challenges}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Recommendations */}
        <section className="mb-8 page-break-inside-avoid">
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-2.5 h-5 rounded-full"
              style={{ backgroundColor: effectiveBranding.primaryColor }}
            />
            <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">
              6. Strategic Recommendations
            </h3>
          </div>

          <div className="space-y-3">
            {editableContent.recommendations && editableContent.recommendations.length > 0 ? (
              editableContent.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-3"
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
                    style={{ backgroundColor: effectiveBranding.primaryColor }}
                  >
                    {idx + 1}
                  </span>
                  <div className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                    {rec}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 italic">No recommendations specified.</p>
            )}
          </div>
        </section>

        {/* Next Month Strategy Roadmap */}
        <section className="mb-10 page-break-inside-avoid">
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-2.5 h-5 rounded-full"
              style={{ backgroundColor: effectiveBranding.primaryColor }}
            />
            <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">
              7. Next Month SEO Strategy & Roadmap
            </h3>
          </div>

          <div className="bg-purple-50/40 border border-purple-100 rounded-2xl p-5">
            <div className="space-y-3">
              {editableContent.nextMonthStrategy && editableContent.nextMonthStrategy.length > 0 ? (
                editableContent.nextMonthStrategy.map((strat, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Compass className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                      {strat}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-600">
                  {report.nextMonthStrategyInput || 'Continuous optimization and keyword expansion sprints scheduled.'}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Missing Data Disclosure Notice (Client Friendly) */}
        {editableContent.missingDataNotes && editableContent.missingDataNotes.length > 0 && (
          <div className="mb-8 p-3.5 rounded-xl bg-slate-100/70 border border-slate-200 text-xs text-slate-600 page-break-inside-avoid">
            <p className="font-semibold text-slate-700 mb-1">Telemetry & Data Completeness Note:</p>
            <ul className="list-disc list-inside space-y-0.5">
              {editableContent.missingDataNotes.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Agency White Label Footer */}
        <div className="pt-8 border-t border-slate-200 mt-10 text-xs text-slate-500 page-break-inside-avoid">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-bold text-slate-800">
                {effectiveBranding.agencyName || 'Agency Report Studio'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {effectiveBranding.reportFooter || 'Confidential report prepared for the client.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-slate-600 font-medium text-[11px]">
              {effectiveBranding.contactEmail && (
                <span>Email: {effectiveBranding.contactEmail}</span>
              )}
              {effectiveBranding.contactPhone && (
                <span>Phone: {effectiveBranding.contactPhone}</span>
              )}
              {effectiveBranding.contactWebsite && (
                <span>Web: {effectiveBranding.contactWebsite}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
