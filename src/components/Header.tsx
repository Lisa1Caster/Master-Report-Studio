import React from 'react';
import { Menu, Sparkles, Eye, Download, ShieldCheck } from 'lucide-react';
import { ActiveTab } from './Sidebar';
import { SeoReport } from '../types/report';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentReport: SeoReport | null;
  onOpenMobile: () => void;
  onLoadDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentReport,
  onOpenMobile,
  onLoadDemo,
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Agency Reporting Dashboard';
      case 'generator':
        return 'SEO Client Report Generator';
      case 'preview':
        return currentReport ? `Report: ${currentReport.clientInfo.businessName}` : 'Report Preview';
      case 'saved':
        return 'Saved Client Reports';
      case 'templates':
        return 'SEO Report Presets & Templates';
      case 'branding':
        return 'White-Label Branding Settings';
      case 'help':
        return 'SEO Reporting Best Practices';
      default:
        return 'Retool Master Report Studio';
    }
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {getTabTitle()}
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block">
            Retool Master Report Studio &bull; Professional Client Deliverables
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {activeTab !== 'preview' && currentReport && currentReport.generatedContent && (
          <button
            onClick={() => setActiveTab('preview')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Active Report</span>
            <span>Preview</span>
          </button>
        )}

        {activeTab === 'dashboard' && (
          <button
            onClick={onLoadDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors border border-purple-200/50"
            title="Load demo report with real metrics and tasks to test preview and PDF export"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Demo Report</span>
          </button>
        )}

        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
          <span>Server-Side AI Protected</span>
        </div>
      </div>
    </header>
  );
};
