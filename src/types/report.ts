export interface ClientInfo {
  clientName: string;
  businessName: string;
  websiteUrl: string;
  clientEmail?: string;
  agencyName: string;
  reportingPeriod: string;
  reportDate: string;
}

export interface CustomMetric {
  id: string;
  name: string;
  value: string;
  change?: string;
  unit?: string;
}

export interface SeoPerformanceData {
  organicTrafficPrevious: number | '' | null;
  organicTrafficCurrent: number | '' | null;
  organicTrafficChangePct: number | '' | null;
  totalRankingKeywords: number | '' | null;
  keywordsTop3: number | '' | null;
  keywordsTop10: number | '' | null;
  keywordsTop100: number | '' | null;
  backlinksAcquired: number | '' | null;
  referringDomains: number | '' | null;
  domainAuthority: number | '' | null; // DA or DR
  organicConversions: number | '' | null;
  organicRevenue?: number | '' | null;
  customMetrics?: CustomMetric[];
}

export interface CompletedTask {
  id: string;
  category: string;
  taskName: string;
  details?: string;
  status?: 'completed' | 'in-progress' | 'planned';
}

export interface BrandingConfig {
  agencyName: string;
  tagline?: string;
  logoUrl?: string;
  primaryColor: string; // Hex code
  accentColor?: string;
  reportFooter: string;
  contactEmail: string;
  contactPhone?: string;
  contactWebsite?: string;
  preparedBy?: string;
}

export interface MetricHighlight {
  label: string;
  value: string;
  change?: string;
  trend: 'up' | 'down' | 'neutral';
  commentary: string;
}

export interface GeneratedReportContent {
  executiveSummary: string;
  performanceOverview: string;
  trafficAnalysis: string;
  keywordAnalysis: string;
  backlinkAnalysis: string;
  workCompletedAnalysis: string;
  challengesAndObservations: string;
  recommendations: string[];
  nextMonthStrategy: string[];
  keyWins: string[];
  keyMetricsHighlights?: MetricHighlight[];
  missingDataNotes?: string[];
}

export interface SeoReport {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'generated';
  clientInfo: ClientInfo;
  performanceData: SeoPerformanceData;
  workCompleted: CompletedTask[];
  challenges: string;
  nextMonthStrategyInput: string;
  branding: BrandingConfig;
  generatedContent?: GeneratedReportContent;
}

export interface TemplatePreset {
  id: string;
  name: string;
  description: string;
  iconName: string;
  defaultTasks: string[];
  defaultChallenges?: string;
  defaultStrategy?: string;
}
