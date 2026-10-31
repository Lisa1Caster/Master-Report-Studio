import { SeoReport, BrandingConfig } from '../types/report';
import { DEFAULT_BRANDING, DEMO_SAMPLE_REPORT } from '../data/templates';

const REPORTS_KEY = 'retool_reports_list_v1';
const BRANDING_KEY = 'retool_branding_v1';
const DRAFT_KEY = 'retool_report_draft_v1';

export function getStoredReports(): SeoReport[] {
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    if (!raw) {
      // Seed with demo report so the user sees a real-world example out of the box
      const initial = [DEMO_SAMPLE_REPORT];
      localStorage.setItem(REPORTS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read reports from localStorage', err);
    return [DEMO_SAMPLE_REPORT];
  }
}

export function saveStoredReport(report: SeoReport): SeoReport[] {
  try {
    const current = getStoredReports();
    const existingIndex = current.findIndex((r) => r.id === report.id);
    let updated: SeoReport[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = { ...report, updatedAt: new Date().toISOString() };
    } else {
      updated = [{ ...report, updatedAt: new Date().toISOString() }, ...current];
    }
    localStorage.setItem(REPORTS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save report to localStorage', err);
    return [];
  }
}

export function deleteStoredReport(id: string): SeoReport[] {
  try {
    const current = getStoredReports();
    const filtered = current.filter((r) => r.id !== id);
    localStorage.setItem(REPORTS_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (err) {
    console.error('Failed to delete report from localStorage', err);
    return [];
  }
}

export function duplicateStoredReport(id: string): SeoReport | null {
  try {
    const current = getStoredReports();
    const source = current.find((r) => r.id === id);
    if (!source) return null;

    const copy: SeoReport = {
      ...source,
      id: 'report-' + Date.now(),
      title: `${source.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      clientInfo: {
        ...source.clientInfo,
        reportDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      },
    };

    saveStoredReport(copy);
    return copy;
  } catch (err) {
    console.error('Failed to duplicate report', err);
    return null;
  }
}

export function getStoredBranding(): BrandingConfig {
  try {
    const raw = localStorage.getItem(BRANDING_KEY);
    if (!raw) return DEFAULT_BRANDING;
    return { ...DEFAULT_BRANDING, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_BRANDING;
  }
}

export function saveStoredBranding(branding: BrandingConfig): void {
  try {
    localStorage.setItem(BRANDING_KEY, JSON.stringify(branding));
  } catch (err) {
    console.error('Failed to save branding', err);
  }
}

export function getStoredDraft(): Partial<SeoReport> | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredDraft(draft: Partial<SeoReport>): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch (err) {
    console.error('Failed to save draft', err);
  }
}

export function clearStoredDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (err) {
    console.error('Failed to clear draft', err);
  }
}
