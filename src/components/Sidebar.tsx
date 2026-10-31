import React from 'react';
import {
  LayoutDashboard,
  FilePlus,
  Files,
  Sparkles,
  Palette,
  CheckCircle2,
  FileText,
  HelpCircle,
  Menu,
  X,
} from 'lucide-react';
import { BrandingConfig } from '../types/report';

export type ActiveTab = 'dashboard' | 'generator' | 'preview' | 'saved' | 'templates' | 'branding' | 'help';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  branding: BrandingConfig;
  savedReportsCount: number;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  branding,
  savedReportsCount,
  isOpenMobile,
  setIsOpenMobile,
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'generator' as ActiveTab,
      label: 'New SEO Report',
      icon: FilePlus,
      badge: 'AI',
    },
    {
      id: 'saved' as ActiveTab,
      label: 'Report Archive',
      icon: Files,
      badge: savedReportsCount > 0 ? savedReportsCount.toString() : null,
    },
    {
      id: 'templates' as ActiveTab,
      label: 'Templates & Presets',
      icon: FileText,
      badge: '5',
    },
    {
      id: 'branding' as ActiveTab,
      label: 'White-Label Branding',
      icon: Palette,
      badge: null,
    },
    {
      id: 'help' as ActiveTab,
      label: 'Reporting Guide',
      icon: HelpCircle,
      badge: null,
    },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: branding.primaryColor || '#4f46e5' }}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-sm tracking-tight leading-none">
                  Retool Master
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded-sm bg-purple-50 text-purple-700 border border-purple-200/60">
                  PRO
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-1 font-medium">SEO Report Studio</p>
            </div>
          </div>

          <button
            onClick={() => setIsOpenMobile(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick CTA */}
        <div className="p-4">
          <button
            onClick={() => handleNavClick('generator')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-semibold text-sm text-white shadow-sm transition-all hover:opacity-95 active:scale-[0.98]"
            style={{ backgroundColor: branding.primaryColor || '#4f46e5' }}
          >
            <FilePlus className="w-4 h-4" />
            <span>Create New Report</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-purple-50/80 text-purple-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-purple-600' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      item.badge === 'AI'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Agency Active Footer Profile */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            {branding.logoUrl ? (
              <img
                src={branding.logoUrl}
                alt={branding.agencyName}
                className="w-8 h-8 rounded-lg object-contain bg-white border border-slate-200 p-0.5"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center uppercase">
                {branding.agencyName ? branding.agencyName.slice(0, 2) : 'AG'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {branding.agencyName || 'Your Agency'}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                <CheckCircle2 className="w-3 h-3" />
                <span>Gemini 3.8 AI Ready</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
