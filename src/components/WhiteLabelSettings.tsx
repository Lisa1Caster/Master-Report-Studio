import React, { useState } from 'react';
import { BrandingConfig } from '../types/report';
import {
  Palette,
  Upload,
  Check,
  Building,
  Mail,
  Phone,
  Globe,
  Sparkles,
  Save,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';

interface WhiteLabelSettingsProps {
  branding: BrandingConfig;
  onSaveBranding: (updated: BrandingConfig) => void;
}

const COLOR_PRESETS = [
  { name: 'Retool Indigo', hex: '#4f46e5' },
  { name: 'Deep Violet', hex: '#7c3aed' },
  { name: 'Royal Cobalt', hex: '#2563eb' },
  { name: 'Emerald Pro', hex: '#059669' },
  { name: 'Teal Cyan', hex: '#0d9488' },
  { name: 'Slate Executive', hex: '#334155' },
  { name: 'Crimson Bold', hex: '#dc2626' },
  { name: 'Amber Gold', hex: '#d97706' },
];

export const WhiteLabelSettings: React.FC<WhiteLabelSettingsProps> = ({
  branding,
  onSaveBranding,
}) => {
  const [formData, setFormData] = useState<BrandingConfig>({ ...branding });
  const [isSaved, setIsSaved] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Logo file size must be less than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData({ ...formData, logoUrl: base64 });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setFormData({ ...formData, logoUrl: undefined });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveBranding(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
            style={{ backgroundColor: formData.primaryColor || '#4f46e5' }}
          >
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">White-Label Agency Branding</h2>
            <p className="text-xs text-slate-500">
              Customize client-facing reports with your agency logo, primary color, and contact details.
            </p>
          </div>
        </div>
      </div>

      {isSaved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Branding preferences saved successfully! All generated reports and PDFs will use these styles.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* SECTION 1: Identity & Logo */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-600" />
            Agency Identity & Logo
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Agency / Company Name
              </label>
              <input
                type="text"
                value={formData.agencyName}
                onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Agency Tagline
              </label>
              <input
                type="text"
                placeholder="e.g. Data-Driven Organic Growth"
                value={formData.tagline || ''}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Agency Logo (Appears on report header and exported PDF)
            </label>
            <div className="flex flex-wrap items-center gap-4">
              {formData.logoUrl ? (
                <div className="relative">
                  <img
                    src={formData.logoUrl}
                    alt="Agency Logo"
                    className="w-20 h-20 rounded-xl object-contain bg-slate-50 border border-slate-200 p-2"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="mt-1.5 text-xs text-rose-600 font-semibold hover:underline block text-center"
                  >
                    Remove Logo
                  </button>
                </div>
              ) : (
                <div
                  className="w-20 h-20 rounded-xl flex items-center justify-center text-white font-extrabold text-2xl shadow-xs"
                  style={{ backgroundColor: formData.primaryColor }}
                >
                  {formData.agencyName ? formData.agencyName.slice(0, 2).toUpperCase() : 'AG'}
                </div>
              )}

              <div className="space-y-1">
                <label className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer inline-flex items-center gap-2 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Logo Image (PNG, JPG, SVG)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-slate-400">
                  Recommended size: 400x120px transparent PNG or SVG. Max 2MB.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Color Palette */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Palette className="w-4 h-4 text-indigo-600" />
            Primary Brand Accent Color
          </h3>

          <p className="text-xs text-slate-500 mb-4">
            This color accents report headings, performance indicators, chart bars, and PDF cover elements.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {COLOR_PRESETS.map((color) => {
              const isSelected = formData.primaryColor.toLowerCase() === color.hex.toLowerCase();
              return (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => setFormData({ ...formData, primaryColor: color.hex })}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                    isSelected
                      ? 'border-slate-900 bg-slate-50 shadow-2xs font-bold text-slate-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded-full shrink-0 shadow-2xs"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-xs">{color.name}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <span className="text-xs text-slate-600 font-medium">Custom Hex Code:</span>
            <input
              type="text"
              value={formData.primaryColor}
              onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono w-28 uppercase"
            />
          </div>
        </div>

        {/* SECTION 3: Contact Details & Report Footer */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Mail className="w-4 h-4 text-indigo-600" />
            Contact Info & Report Footer
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                placeholder="+1 (555) 000-0000"
                value={formData.contactPhone || ''}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Website URL
              </label>
              <input
                type="url"
                value={formData.contactWebsite || ''}
                onChange={(e) => setFormData({ ...formData, contactWebsite: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Prepared By (Title or Lead Name)
              </label>
              <input
                type="text"
                placeholder="e.g. Lead Technical SEO Strategist"
                value={formData.preparedBy || ''}
                onChange={(e) => setFormData({ ...formData, preparedBy: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Report Footer / Legal Disclaimer
            </label>
            <textarea
              rows={2}
              value={formData.reportFooter}
              onChange={(e) => setFormData({ ...formData, reportFooter: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
            Live Header & Footer Preview
          </span>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                {formData.logoUrl ? (
                  <img
                    src={formData.logoUrl}
                    alt="Logo"
                    className="w-10 h-10 rounded-lg object-contain border border-slate-200 p-1"
                  />
                ) : (
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: formData.primaryColor }}
                  >
                    {formData.agencyName ? formData.agencyName.slice(0, 2).toUpperCase() : 'AG'}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{formData.agencyName}</h4>
                  <p className="text-xs text-slate-500">{formData.tagline}</p>
                </div>
              </div>

              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-purple-50 text-purple-700 border border-purple-200/50">
                SEO Report
              </span>
            </div>

            <div className="pt-3 text-[11px] text-slate-400 flex items-center justify-between">
              <span>{formData.reportFooter}</span>
              <span>{formData.contactEmail}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl font-bold text-sm text-white shadow-xs hover:opacity-95 flex items-center gap-2"
            style={{ backgroundColor: formData.primaryColor || '#4f46e5' }}
          >
            <Save className="w-4 h-4" />
            <span>Save Branding Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
