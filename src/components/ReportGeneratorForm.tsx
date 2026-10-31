import React, { useState, useEffect } from 'react';
import {
  ClientInfo,
  SeoPerformanceData,
  CompletedTask,
  CustomMetric,
  SeoReport,
  BrandingConfig,
} from '../types/report';
import { DEMO_SAMPLE_REPORT } from '../data/templates';
import {
  Sparkles,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Layers,
  Save,
  RotateCcw,
  Zap,
} from 'lucide-react';

interface ReportGeneratorFormProps {
  initialReport?: SeoReport | null;
  branding: BrandingConfig;
  onGenerate: (reportData: {
    clientInfo: ClientInfo;
    performanceData: SeoPerformanceData;
    workCompleted: CompletedTask[];
    challenges: string;
    nextMonthStrategyInput: string;
  }) => Promise<void>;
  onSaveDraft: (draft: Partial<SeoReport>) => void;
  isLoading: boolean;
}

const COMMON_SEO_TASKS = [
  { name: 'Technical SEO Optimization', category: 'Technical SEO' },
  { name: 'On-Page SEO Optimization', category: 'On-Page SEO' },
  { name: 'Keyword Research & Mapping', category: 'Keyword Research' },
  { name: 'Content Optimization & Refresh', category: 'Content' },
  { name: 'Guest Post Publishing', category: 'Link Building' },
  { name: 'Editorial Link Building Outreach', category: 'Link Building' },
  { name: 'Internal Linking Architecture', category: 'On-Page SEO' },
  { name: 'Google Business Profile Optimization', category: 'Local SEO' },
  { name: 'Competitor SERP Gap Analysis', category: 'Strategy' },
  { name: 'Core Web Vitals & Speed Fixes', category: 'Technical SEO' },
  { name: 'Schema Structured Data Implementation', category: 'Technical SEO' },
];

const CHALLENGE_PRESETS = [
  'Google Core Algorithm update created temporary rank fluctuations in informational queries.',
  'Competitor launched aggressive link building campaign targeting high-value commercial terms.',
  'Technical indexing delays encountered on newly migrated URL taxonomy.',
  'Drop in impressions on older legacy articles requiring content refresh and entity depth.',
  'Mobile Core Web Vitals LCP metric briefly degraded following plugin update.',
];

const STRATEGY_PRESETS = [
  'Publish 3 topical pillar articles targeting long-tail commercial queries.',
  'Secure 4-6 contextual guest editorial backlinks from DR 50+ industry blogs.',
  'Optimize internal anchor text flow from blog guides into service conversion pages.',
  'Implement Product and FAQ schema across top 10 commercial landing pages.',
  'A/B test lead capture forms and hero CTAs to increase organic conversion rate.',
];

export const ReportGeneratorForm: React.FC<ReportGeneratorFormProps> = ({
  initialReport,
  branding,
  onGenerate,
  onSaveDraft,
  isLoading,
}) => {
  // Client Info State
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    clientName: initialReport?.clientInfo.clientName || '',
    businessName: initialReport?.clientInfo.businessName || '',
    websiteUrl: initialReport?.clientInfo.websiteUrl || '',
    clientEmail: initialReport?.clientInfo.clientEmail || '',
    agencyName: initialReport?.clientInfo.agencyName || branding.agencyName,
    reportingPeriod: initialReport?.clientInfo.reportingPeriod || getCurrentMonthName(),
    reportDate: initialReport?.clientInfo.reportDate || getTodayFormatted(),
  });

  // Performance Data State
  const [perfData, setPerfData] = useState<SeoPerformanceData>({
    organicTrafficPrevious: initialReport?.performanceData.organicTrafficPrevious ?? '',
    organicTrafficCurrent: initialReport?.performanceData.organicTrafficCurrent ?? '',
    organicTrafficChangePct: initialReport?.performanceData.organicTrafficChangePct ?? '',
    totalRankingKeywords: initialReport?.performanceData.totalRankingKeywords ?? '',
    keywordsTop3: initialReport?.performanceData.keywordsTop3 ?? '',
    keywordsTop10: initialReport?.performanceData.keywordsTop10 ?? '',
    keywordsTop100: initialReport?.performanceData.keywordsTop100 ?? '',
    backlinksAcquired: initialReport?.performanceData.backlinksAcquired ?? '',
    referringDomains: initialReport?.performanceData.referringDomains ?? '',
    domainAuthority: initialReport?.performanceData.domainAuthority ?? '',
    organicConversions: initialReport?.performanceData.organicConversions ?? '',
    organicRevenue: initialReport?.performanceData.organicRevenue ?? '',
    customMetrics: initialReport?.performanceData.customMetrics || [],
  });

  // Work Completed State
  const [workCompleted, setWorkCompleted] = useState<CompletedTask[]>(
    initialReport?.workCompleted || []
  );

  // New task inline form
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('On-Page SEO');
  const [newTaskDetails, setNewTaskDetails] = useState('');

  // Challenges & Strategy
  const [challenges, setChallenges] = useState(initialReport?.challenges || '');
  const [nextMonthStrategy, setNextMonthStrategy] = useState(
    initialReport?.nextMonthStrategyInput || ''
  );

  // Validation errors
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [draftSavedAlert, setDraftSavedAlert] = useState(false);

  // Auto-calculate traffic change % whenever previous & current traffic change
  useEffect(() => {
    const prev = Number(perfData.organicTrafficPrevious);
    const curr = Number(perfData.organicTrafficCurrent);
    if (!isNaN(prev) && !isNaN(curr) && prev > 0 && curr > 0) {
      const pct = Math.round(((curr - prev) / prev) * 1000) / 10;
      setPerfData((prevData) => ({ ...prevData, organicTrafficChangePct: pct }));
    }
  }, [perfData.organicTrafficPrevious, perfData.organicTrafficCurrent]);

  function getCurrentMonthName() {
    return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  function getTodayFormatted() {
    return new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  const handleAddCommonTask = (taskName: string, category: string) => {
    if (workCompleted.some((t) => t.taskName === taskName)) return;
    const newTask: CompletedTask = {
      id: 'task-' + Date.now() + Math.random().toString(36).substring(2, 5),
      taskName,
      category,
      details: 'Executed as part of current monthly SEO sprint.',
      status: 'completed',
    };
    setWorkCompleted([...workCompleted, newTask]);
  };

  const handleAddCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;
    const newTask: CompletedTask = {
      id: 'task-' + Date.now(),
      taskName: newTaskName.trim(),
      category: newTaskCategory,
      details: newTaskDetails.trim() || undefined,
      status: 'completed',
    };
    setWorkCompleted([...workCompleted, newTask]);
    setNewTaskName('');
    setNewTaskDetails('');
  };

  const handleRemoveTask = (id: string) => {
    setWorkCompleted(workCompleted.filter((t) => t.id !== id));
  };

  const handleAddCustomMetric = () => {
    const newMetric: CustomMetric = {
      id: 'metric-' + Date.now(),
      name: 'Core Web Vitals',
      value: '95% Pass',
      change: '+5%',
    };
    setPerfData({
      ...perfData,
      customMetrics: [...(perfData.customMetrics || []), newMetric],
    });
  };

  const handleRemoveCustomMetric = (id: string) => {
    setPerfData({
      ...perfData,
      customMetrics: (perfData.customMetrics || []).filter((m) => m.id !== id),
    });
  };

  const handleLoadSampleData = () => {
    setClientInfo({
      ...DEMO_SAMPLE_REPORT.clientInfo,
      agencyName: branding.agencyName,
      reportDate: getTodayFormatted(),
    });
    setPerfData({
      ...DEMO_SAMPLE_REPORT.performanceData,
    });
    setWorkCompleted([...DEMO_SAMPLE_REPORT.workCompleted]);
    setChallenges(DEMO_SAMPLE_REPORT.challenges);
    setNextMonthStrategy(DEMO_SAMPLE_REPORT.nextMonthStrategyInput);
    setValidationErrors({});
  };

  const handleResetForm = () => {
    if (!confirm('Are you sure you want to clear this report form?')) return;
    setClientInfo({
      clientName: '',
      businessName: '',
      websiteUrl: '',
      clientEmail: '',
      agencyName: branding.agencyName,
      reportingPeriod: getCurrentMonthName(),
      reportDate: getTodayFormatted(),
    });
    setPerfData({
      organicTrafficPrevious: '',
      organicTrafficCurrent: '',
      organicTrafficChangePct: '',
      totalRankingKeywords: '',
      keywordsTop3: '',
      keywordsTop10: '',
      keywordsTop100: '',
      backlinksAcquired: '',
      referringDomains: '',
      domainAuthority: '',
      organicConversions: '',
      organicRevenue: '',
      customMetrics: [],
    });
    setWorkCompleted([]);
    setChallenges('');
    setNextMonthStrategy('');
    setValidationErrors({});
  };

  const validate = (): boolean => {
    const errors: { [key: string]: string } = {};
    if (!clientInfo.clientName.trim()) {
      errors.clientName = 'Client Name is required';
    }
    if (!clientInfo.businessName.trim()) {
      errors.businessName = 'Business Name is required';
    }
    if (!clientInfo.websiteUrl.trim()) {
      errors.websiteUrl = 'Website URL is required';
    }
    if (!clientInfo.reportingPeriod.trim()) {
      errors.reportingPeriod = 'Reporting Period is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    await onGenerate({
      clientInfo,
      performanceData: perfData,
      workCompleted,
      challenges,
      nextMonthStrategyInput: nextMonthStrategy,
    });
  };

  const handleSaveDraftClick = () => {
    onSaveDraft({
      clientInfo,
      performanceData: perfData,
      workCompleted,
      challenges,
      nextMonthStrategyInput: nextMonthStrategy,
      status: 'draft',
      title: `${clientInfo.businessName || 'Untitled'} - ${clientInfo.reportingPeriod || 'Draft'}`,
    });
    setDraftSavedAlert(true);
    setTimeout(() => setDraftSavedAlert(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-purple-200 text-xs font-semibold mb-3 border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>AI-Powered SEO Client Report Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Create Professional SEO Client Report
          </h2>
          <p className="text-sm text-purple-100/90 leading-relaxed">
            Enter your monthly organic metrics, completed deliverables, and observations.
            Gemini 3.8 Flash transforms raw data into an executive-grade narrative report for your clients.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 relative z-10">
          <button
            type="button"
            onClick={handleLoadSampleData}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors border border-white/20 flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Load Sample Data</span>
          </button>
          <button
            type="button"
            onClick={handleResetForm}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-medium transition-colors border border-white/10 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Form</span>
          </button>
        </div>
      </div>

      {draftSavedAlert && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>Report draft saved locally to your browser archive!</span>
        </div>
      )}

      {Object.keys(validationErrors).length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Please resolve required fields before generating:</p>
            <ul className="list-disc list-inside mt-1 text-xs space-y-0.5 text-rose-700">
              {Object.values(validationErrors).map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: Client Information */}
        <section className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-100">
            <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center">
              1
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">Client Information</h3>
              <p className="text-xs text-slate-500">Target business and reporting period details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Client Contact Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Sarah Jenkins"
                value={clientInfo.clientName}
                onChange={(e) => setClientInfo({ ...clientInfo, clientName: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 ${
                  validationErrors.clientName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Business / Company Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Acme Cloud Solutions"
                value={clientInfo.businessName}
                onChange={(e) => setClientInfo({ ...clientInfo, businessName: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 ${
                  validationErrors.businessName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Website URL <span className="text-rose-500">*</span>
              </label>
              <input
                type="url"
                placeholder="https://example.com"
                value={clientInfo.websiteUrl}
                onChange={(e) => setClientInfo({ ...clientInfo, websiteUrl: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 ${
                  validationErrors.websiteUrl ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Client Email <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                type="email"
                placeholder="sarah@example.com"
                value={clientInfo.clientEmail}
                onChange={(e) => setClientInfo({ ...clientInfo, clientEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                SEO Agency / Consultant Name
              </label>
              <input
                type="text"
                value={clientInfo.agencyName}
                onChange={(e) => setClientInfo({ ...clientInfo, agencyName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reporting Period <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. October 2026"
                  value={clientInfo.reportingPeriod}
                  onChange={(e) => setClientInfo({ ...clientInfo, reportingPeriod: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Report Date
                </label>
                <input
                  type="text"
                  value={clientInfo.reportDate}
                  onChange={(e) => setClientInfo({ ...clientInfo, reportDate: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: SEO Performance Data */}
        <section className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center">
                2
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900">SEO Performance Data</h3>
                <p className="text-xs text-slate-500">
                  Enter tracked metric values. Unentered metrics will be clearly noted rather than assumed.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddCustomMetric}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Metric</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Organic Traffic Prev */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Organic Traffic — Previous Period
              </label>
              <input
                type="number"
                placeholder="e.g. 24500"
                value={perfData.organicTrafficPrevious === '' ? '' : perfData.organicTrafficPrevious ?? ''}
                onChange={(e) =>
                  setPerfData({
                    ...perfData,
                    organicTrafficPrevious: e.target.value === '' ? '' : Number(e.target.value),
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Organic Traffic Current */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Organic Traffic — Current Period
              </label>
              <input
                type="number"
                placeholder="e.g. 31200"
                value={perfData.organicTrafficCurrent === '' ? '' : perfData.organicTrafficCurrent ?? ''}
                onChange={(e) =>
                  setPerfData({
                    ...perfData,
                    organicTrafficCurrent: e.target.value === '' ? '' : Number(e.target.value),
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Traffic Change % (Auto-calculated with manual edit support) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Traffic Change %</span>
                <span className="text-[10px] text-indigo-600 font-normal">Auto-calculated</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 27.3"
                  value={perfData.organicTrafficChangePct === '' ? '' : perfData.organicTrafficChangePct ?? ''}
                  onChange={(e) =>
                    setPerfData({
                      ...perfData,
                      organicTrafficChangePct: e.target.value === '' ? '' : Number(e.target.value),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm pr-12 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-semibold"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">
                  %
                </span>
              </div>
            </div>

            {/* Total Keywords */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Total Ranking Keywords
              </label>
              <input
                type="number"
                placeholder="e.g. 1840"
                value={perfData.totalRankingKeywords === '' ? '' : perfData.totalRankingKeywords ?? ''}
                onChange={(e) =>
                  setPerfData({
                    ...perfData,
                    totalRankingKeywords: e.target.value === '' ? '' : Number(e.target.value),
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Keywords in Top 3 */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Keywords in Top 3
              </label>
              <input
                type="number"
                placeholder="e.g. 42"
                value={perfData.keywordsTop3 === '' ? '' : perfData.keywordsTop3 ?? ''}
                onChange={(e) =>
                  setPerfData({
                    ...perfData,
                    keywordsTop3: e.target.value === '' ? '' : Number(e.target.value),
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Keywords in Top 10 */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Keywords in Top 10 (Page 1)
              </label>
              <input
                type="number"
                placeholder="e.g. 168"
                value={perfData.keywordsTop10 === '' ? '' : perfData.keywordsTop10 ?? ''}
                onChange={(e) =>
                  setPerfData({
                    ...perfData,
                    keywordsTop10: e.target.value === '' ? '' : Number(e.target.value),
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Keywords in Top 100 */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Keywords in Top 100
              </label>
              <input
                type="number"
                placeholder="e.g. 980"
                value={perfData.keywordsTop100 === '' ? '' : perfData.keywordsTop100 ?? ''}
                onChange={(e) =>
                  setPerfData({
                    ...perfData,
                    keywordsTop100: e.target.value === '' ? '' : Number(e.target.value),
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Backlinks Acquired */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Backlinks Acquired
              </label>
              <input
                type="number"
                placeholder="e.g. 34"
                value={perfData.backlinksAcquired === '' ? '' : perfData.backlinksAcquired ?? ''}
                onChange={(e) =>
                  setPerfData({
                    ...perfData,
                    backlinksAcquired: e.target.value === '' ? '' : Number(e.target.value),
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Referring Domains */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Referring Domains
              </label>
              <input
                type="number"
                placeholder="e.g. 215"
                value={perfData.referringDomains === '' ? '' : perfData.referringDomains ?? ''}
                onChange={(e) =>
                  setPerfData({
                    ...perfData,
                    referringDomains: e.target.value === '' ? '' : Number(e.target.value),
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Domain Authority / DR */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Domain Authority (DA) or DR (1-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="e.g. 58"
                value={perfData.domainAuthority === '' ? '' : perfData.domainAuthority ?? ''}
                onChange={(e) =>
                  setPerfData({
                    ...perfData,
                    domainAuthority: e.target.value === '' ? '' : Number(e.target.value),
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Organic Conversions */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Organic Conversions / Leads
              </label>
              <input
                type="number"
                placeholder="e.g. 482"
                value={perfData.organicConversions === '' ? '' : perfData.organicConversions ?? ''}
                onChange={(e) =>
                  setPerfData({
                    ...perfData,
                    organicConversions: e.target.value === '' ? '' : Number(e.target.value),
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Organic Revenue (optional) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Organic Revenue ($) <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">
                  $
                </span>
                <input
                  type="number"
                  placeholder="e.g. 38600"
                  value={perfData.organicRevenue === '' ? '' : perfData.organicRevenue ?? ''}
                  onChange={(e) =>
                    setPerfData({
                      ...perfData,
                      organicRevenue: e.target.value === '' ? '' : Number(e.target.value),
                    })
                  }
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Custom SEO Metrics List */}
          {perfData.customMetrics && perfData.customMetrics.length > 0 && (
            <div className="mt-5 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Custom Tracked Metrics
              </h4>
              <div className="space-y-2">
                {perfData.customMetrics.map((cm, idx) => (
                  <div key={cm.id} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <input
                      type="text"
                      placeholder="Metric Name (e.g. Average CTR)"
                      value={cm.name}
                      onChange={(e) => {
                        const copy = [...(perfData.customMetrics || [])];
                        copy[idx].name = e.target.value;
                        setPerfData({ ...perfData, customMetrics: copy });
                      }}
                      className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white flex-1"
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g. 4.2%)"
                      value={cm.value}
                      onChange={(e) => {
                        const copy = [...(perfData.customMetrics || [])];
                        copy[idx].value = e.target.value;
                        setPerfData({ ...perfData, customMetrics: copy });
                      }}
                      className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white w-28"
                    />
                    <input
                      type="text"
                      placeholder="Change (e.g. +0.8%)"
                      value={cm.change || ''}
                      onChange={(e) => {
                        const copy = [...(perfData.customMetrics || [])];
                        copy[idx].change = e.target.value;
                        setPerfData({ ...perfData, customMetrics: copy });
                      }}
                      className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white w-28"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomMetric(cm.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* SECTION 3: SEO Work Completed */}
        <section className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100">
            <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center">
              3
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">SEO Work Completed</h3>
              <p className="text-xs text-slate-500">
                Click common deliverables to quickly add them, or write your own custom tasks.
              </p>
            </div>
          </div>

          {/* Quick-add chips */}
          <div className="mb-5">
            <span className="text-xs font-semibold text-slate-600 mb-2 block">
              Quick-Add Common Deliverables:
            </span>
            <div className="flex flex-wrap gap-2">
              {COMMON_SEO_TASKS.map((t, idx) => {
                const isAdded = workCompleted.some((item) => item.taskName === t.name);
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAdded}
                    onClick={() => handleAddCommonTask(t.name, t.category)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1 ${
                      isAdded
                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                        : 'bg-white hover:bg-purple-50 text-slate-700 border-slate-200 hover:border-purple-300'
                    }`}
                  >
                    <Plus className="w-3 h-3" />
                    <span>{t.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Task Adder */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 mb-5">
            <span className="text-xs font-bold text-slate-800 mb-2 block">
              Add Custom Completed Task:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <input
                type="text"
                placeholder="Task title (e.g. Canonical tag consolidation)"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                className="sm:col-span-5 px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
              />
              <select
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value)}
                className="sm:col-span-3 px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
              >
                <option value="Technical SEO">Technical SEO</option>
                <option value="On-Page SEO">On-Page SEO</option>
                <option value="Keyword Research">Keyword Research</option>
                <option value="Content">Content</option>
                <option value="Link Building">Link Building</option>
                <option value="Local SEO">Local SEO</option>
                <option value="Strategy">Strategy</option>
              </select>
              <input
                type="text"
                placeholder="Details or impact (optional)"
                value={newTaskDetails}
                onChange={(e) => setNewTaskDetails(e.target.value)}
                className="sm:col-span-3 px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
              />
              <button
                type="button"
                onClick={handleAddCustomTask}
                className="sm:col-span-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* List of completed tasks */}
          <div className="space-y-2">
            {workCompleted.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">
                No deliverables added yet. Click one of the quick-add buttons above or type a custom task.
              </p>
            ) : (
              workCompleted.map((task, idx) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{task.taskName}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-purple-50 text-purple-700 font-semibold border border-purple-200/50">
                          {task.category}
                        </span>
                      </div>
                      {task.details && (
                        <p className="text-[11px] text-slate-500 mt-0.5">{task.details}</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveTask(task.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* SECTION 4: SEO Challenges */}
        <section className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-2.5 pb-4 mb-3 border-b border-slate-100">
            <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center">
              4
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">SEO Challenges & Observations</h3>
              <p className="text-xs text-slate-500">
                Describe ranking drops, technical bugs, algorithmic updates, or competitor challenges.
              </p>
            </div>
          </div>

          <div className="mb-3 flex flex-wrap gap-1.5">
            <span className="text-xs text-slate-500 font-medium mr-1 self-center">Quick inserts:</span>
            {CHALLENGE_PRESETS.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setChallenges((prev) => (prev ? `${prev}\n- ${p}` : `- ${p}`))}
                className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                + {p.slice(0, 32)}...
              </button>
            ))}
          </div>

          <textarea
            rows={4}
            placeholder="e.g. Core algorithm test during late October caused short-term volatility in informational search queries. Technical fixes were deployed to safeguard commercial intent landing pages."
            value={challenges}
            onChange={(e) => setChallenges(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </section>

        {/* SECTION 5: Next Month SEO Strategy */}
        <section className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-2.5 pb-4 mb-3 border-b border-slate-100">
            <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center">
              5
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">Next Month SEO Strategy</h3>
              <p className="text-xs text-slate-500">
                Planned SEO activities and strategic priorities for the next reporting period.
              </p>
            </div>
          </div>

          <div className="mb-3 flex flex-wrap gap-1.5">
            <span className="text-xs text-slate-500 font-medium mr-1 self-center">Quick inserts:</span>
            {STRATEGY_PRESETS.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() =>
                  setNextMonthStrategy((prev) => (prev ? `${prev}\n- ${p}` : `- ${p}`))
                }
                className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                + {p.slice(0, 32)}...
              </button>
            ))}
          </div>

          <textarea
            rows={4}
            placeholder="e.g. 1. Publish 3 competitive alternative pages.\n2. Scale high-authority link outreach to secure 4 contextual links.\n3. Conduct internal linking audit to funnel link equity to priority conversion pages."
            value={nextMonthStrategy}
            onChange={(e) => setNextMonthStrategy(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </section>

        {/* Bottom Actions Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4 z-20">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveDraftClick}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <Save className="w-4 h-4 text-slate-500" />
              <span>Save Draft Locally</span>
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm text-white shadow-md transition-all hover:opacity-95 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ backgroundColor: branding.primaryColor || '#4f46e5' }}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analyzing & Generating Report with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate SEO Report</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
