import React from 'react';
import { TemplatePreset } from '../types/report';
import { REPORT_TEMPLATES } from '../data/templates';
import {
  FileText,
  TrendingUp,
  MapPin,
  ShoppingBag,
  Building2,
  Wrench,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface TemplatesViewProps {
  onSelectTemplate: (template: TemplatePreset) => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({ onSelectTemplate }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5" />;
      case 'MapPin':
        return <MapPin className="w-5 h-5" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5" />;
      case 'Building2':
        return <Building2 className="w-5 h-5" />;
      case 'Wrench':
        return <Wrench className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          SEO Report Presets & Industry Templates
        </h2>
        <p className="text-xs text-slate-500">
          Kickstart your monthly client deliverables with structured workflows tailored for different business models.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {REPORT_TEMPLATES.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-purple-300 transition-all p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  {getIcon(tpl.iconName)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{tpl.name}</h3>
                  <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-sm">
                    Recommended Preset
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {tpl.description}
              </p>

              <div className="mb-4">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Pre-Populated Deliverables:
                </span>
                <div className="space-y-1.5">
                  {tpl.defaultTasks.map((task, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{task}</span>
                    </div>
                  ))}
                </div>
              </div>

              {tpl.defaultStrategy && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 mb-4">
                  <span className="font-semibold text-slate-800 block mb-0.5">Strategic Direction:</span>
                  <span>{tpl.defaultStrategy}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => onSelectTemplate(tpl)}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Use This Template</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
