import React, { useState, useEffect } from 'react';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ReportGeneratorForm } from './components/ReportGeneratorForm';
import { ReportPreview } from './components/ReportPreview';
import { SavedReportsView } from './components/SavedReportsView';
import { TemplatesView } from './components/TemplatesView';
import { WhiteLabelSettings } from './components/WhiteLabelSettings';
import { HelpView } from './components/HelpView';
import {
  SeoReport,
  BrandingConfig,
  TemplatePreset,
  ClientInfo,
  SeoPerformanceData,
  CompletedTask,
} from './types/report';
import {
  getStoredReports,
  saveStoredReport,
  deleteStoredReport,
  duplicateStoredReport,
  getStoredBranding,
  saveStoredBranding,
  saveStoredDraft,
} from './utils/storage';
import { DEMO_SAMPLE_REPORT } from './data/templates';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [reports, setReports] = useState<SeoReport[]>([]);
  const [branding, setBranding] = useState<BrandingConfig>(getStoredBranding());
  const [currentReport, setCurrentReport] = useState<SeoReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Initialize reports from storage on mount
  useEffect(() => {
    const loaded = getStoredReports();
    setReports(loaded);
    if (loaded.length > 0) {
      setCurrentReport(loaded[0]);
    }
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Generate Report via Server-side Gemini API
  const handleGenerateReport = async (formData: {
    clientInfo: ClientInfo;
    performanceData: SeoPerformanceData;
    workCompleted: CompletedTask[];
    challenges: string;
    nextMonthStrategyInput: string;
  }) => {
    try {
      setIsGenerating(true);

      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      const generatedContent = data.report;

      const newReport: SeoReport = {
        id: currentReport && currentReport.status === 'draft' ? currentReport.id : 'report-' + Date.now(),
        title: `${formData.clientInfo.businessName} - ${formData.clientInfo.reportingPeriod}`,
        createdAt: currentReport ? currentReport.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'generated',
        clientInfo: formData.clientInfo,
        performanceData: formData.performanceData,
        workCompleted: formData.workCompleted,
        challenges: formData.challenges,
        nextMonthStrategyInput: formData.nextMonthStrategyInput,
        branding: branding,
        generatedContent: generatedContent,
      };

      const updatedList = saveStoredReport(newReport);
      setReports(updatedList);
      setCurrentReport(newReport);
      setActiveTab('preview');
      showNotification('success', 'SEO Client Report generated successfully with Gemini AI!');
    } catch (err: any) {
      console.error('Error in handleGenerateReport:', err);
      showNotification('error', err.message || 'Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Save Draft
  const handleSaveDraft = (draftData: Partial<SeoReport>) => {
    const draftReport: SeoReport = {
      id: currentReport?.id || 'report-' + Date.now(),
      title: draftData.title || `${draftData.clientInfo?.businessName || 'Draft'} - ${draftData.clientInfo?.reportingPeriod || 'Current'}`,
      createdAt: currentReport?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
      clientInfo: draftData.clientInfo as ClientInfo,
      performanceData: draftData.performanceData as SeoPerformanceData,
      workCompleted: draftData.workCompleted || [],
      challenges: draftData.challenges || '',
      nextMonthStrategyInput: draftData.nextMonthStrategyInput || '',
      branding: branding,
      generatedContent: currentReport?.generatedContent,
    };

    const updated = saveStoredReport(draftReport);
    setReports(updated);
    setCurrentReport(draftReport);
    saveStoredDraft(draftReport);
    showNotification('success', 'Draft saved to local storage archive.');
  };

  // Load Demo Report
  const handleLoadDemo = () => {
    setCurrentReport(DEMO_SAMPLE_REPORT);
    setActiveTab('preview');
    showNotification('success', 'Demo sample SEO report loaded for instant preview & PDF export.');
  };

  // Create New Empty Report
  const handleNewReport = () => {
    setCurrentReport(null);
    setActiveTab('generator');
  };

  // Use Preset Template
  const handleUseTemplate = (template: TemplatePreset) => {
    const newTasks: CompletedTask[] = template.defaultTasks.map((taskName, idx) => ({
      id: 'task-' + Date.now() + '-' + idx,
      taskName,
      category: 'SEO Strategy',
      details: 'Scheduled deliverable from ' + template.name,
      status: 'completed',
    }));

    const templateReport: SeoReport = {
      id: 'report-' + Date.now(),
      title: `New Report (${template.name})`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
      clientInfo: {
        clientName: '',
        businessName: '',
        websiteUrl: '',
        clientEmail: '',
        agencyName: branding.agencyName,
        reportingPeriod: new Date().toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        }),
        reportDate: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
      },
      performanceData: {
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
      },
      workCompleted: newTasks,
      challenges: template.defaultChallenges || '',
      nextMonthStrategyInput: template.defaultStrategy || '',
      branding: branding,
    };

    setCurrentReport(templateReport);
    setActiveTab('generator');
    showNotification('success', `Loaded "${template.name}" template deliverables.`);
  };

  // Duplicate Report
  const handleDuplicateReport = (id: string) => {
    const duplicated = duplicateStoredReport(id);
    if (duplicated) {
      setReports(getStoredReports());
      setCurrentReport(duplicated);
      setActiveTab('generator');
      showNotification('success', 'Report duplicated! Ready for current month edits.');
    }
  };

  // Delete Report
  const handleDeleteReport = (id: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return;
    const remaining = deleteStoredReport(id);
    setReports(remaining);
    if (currentReport?.id === id) {
      setCurrentReport(remaining.length > 0 ? remaining[0] : null);
    }
    showNotification('success', 'Report removed from archive.');
  };

  // Save Branding
  const handleSaveBranding = (newBranding: BrandingConfig) => {
    saveStoredBranding(newBranding);
    setBranding(newBranding);
    showNotification('success', 'White-label branding settings updated.');
  };

  // Select Report from Table / List
  const handleSelectReport = (report: SeoReport) => {
    setCurrentReport(report);
    if (report.status === 'generated' && report.generatedContent) {
      setActiveTab('preview');
    } else {
      setActiveTab('generator');
    }
  };

  // Update report from inline edits
  const handleUpdateReport = (updated: SeoReport) => {
    const list = saveStoredReport(updated);
    setReports(list);
    setCurrentReport(updated);
    showNotification('success', 'Report updates saved.');
  };

  // Import Reports from JSON backup
  const handleImportReports = (imported: SeoReport[]) => {
    imported.forEach((r) => saveStoredReport(r));
    setReports(getStoredReports());
    if (imported.length > 0) {
      setCurrentReport(imported[0]);
    }
    showNotification('success', `Imported ${imported.length} reports successfully.`);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 flex">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-lg border text-xs font-semibold flex items-center gap-2 transition-all duration-300 ${
            notification.type === 'success'
              ? 'bg-slate-900 text-white border-slate-800'
              : 'bg-rose-900 text-white border-rose-800'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        branding={branding}
        savedReportsCount={reports.length}
        isOpenMobile={isMobileMenuOpen}
        setIsOpenMobile={setIsMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentReport={currentReport}
          onOpenMobile={() => setIsMobileMenuOpen(true)}
          onLoadDemo={handleLoadDemo}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              reports={reports}
              onSelectReport={handleSelectReport}
              onNewReport={handleNewReport}
              onUseTemplate={handleUseTemplate}
              onDuplicateReport={handleDuplicateReport}
              onDeleteReport={handleDeleteReport}
              onLoadDemo={handleLoadDemo}
            />
          )}

          {activeTab === 'generator' && (
            <ReportGeneratorForm
              initialReport={currentReport}
              branding={branding}
              onGenerate={handleGenerateReport}
              onSaveDraft={handleSaveDraft}
              isLoading={isGenerating}
            />
          )}

          {activeTab === 'preview' && (
            currentReport ? (
              <ReportPreview
                report={currentReport}
                branding={branding}
                onUpdateReport={handleUpdateReport}
                onDuplicate={handleDuplicateReport}
                onBackToEdit={() => setActiveTab('generator')}
              />
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
                <p className="text-sm font-semibold text-slate-700">No active report selected.</p>
                <button
                  onClick={handleNewReport}
                  className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                >
                  Create a Report
                </button>
              </div>
            )
          )}

          {activeTab === 'saved' && (
            <SavedReportsView
              reports={reports}
              onSelectReport={handleSelectReport}
              onNewReport={handleNewReport}
              onDuplicateReport={handleDuplicateReport}
              onDeleteReport={handleDeleteReport}
              onImportReports={handleImportReports}
            />
          )}

          {activeTab === 'templates' && (
            <TemplatesView onSelectTemplate={handleUseTemplate} />
          )}

          {activeTab === 'branding' && (
            <WhiteLabelSettings
              branding={branding}
              onSaveBranding={handleSaveBranding}
            />
          )}

          {activeTab === 'help' && <HelpView />}
        </main>
      </div>
    </div>
  );
}
