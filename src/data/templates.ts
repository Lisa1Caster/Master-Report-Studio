import { SeoReport, BrandingConfig, TemplatePreset } from '../types/report';

export const DEFAULT_BRANDING: BrandingConfig = {
  agencyName: 'Apex Growth SEO Labs',
  tagline: 'Enterprise Search Optimization & Digital Strategy',
  primaryColor: '#4f46e5', // Modern Indigo/Purple
  accentColor: '#3b82f6',
  reportFooter: 'Confidential Report. Prepared exclusively for the client. All rights reserved.',
  contactEmail: 'reports@apexgrowthlabs.com',
  contactPhone: '+1 (555) 234-5678',
  contactWebsite: 'https://apexgrowthlabs.com',
  preparedBy: 'Senior SEO Strategist',
};

export const REPORT_TEMPLATES: TemplatePreset[] = [
  {
    id: 'monthly-growth',
    name: 'Standard Monthly Growth Report',
    description: 'Comprehensive monthly SEO performance, ranking trends, and technical deliverables.',
    iconName: 'TrendingUp',
    defaultTasks: [
      'Technical SEO Optimization',
      'On-Page SEO Optimization',
      'Keyword Research',
      'Content Optimization',
      'Internal Linking',
    ],
    defaultChallenges: 'Minor keyword volatility following mid-month Google search quality updates.',
    defaultStrategy: 'Accelerate high-intent content expansion and build 5 targeted editorial backlinks.',
  },
  {
    id: 'local-seo',
    name: 'Local SEO & Google Business Profile',
    description: 'Tailored for local businesses, map pack rankings, citations, and local customer calls/leads.',
    iconName: 'MapPin',
    defaultTasks: [
      'Google Business Profile Optimization',
      'Local Citation Building & NAP Audit',
      'On-Page Local Landing Page Tweaks',
      'Customer Review Acquisition Campaign',
      'Local Schema Markup Implementation',
    ],
    defaultChallenges: 'High local proximity competition within the primary metropolitan boundary.',
    defaultStrategy: 'Target neighborhood-level geo landing pages and optimize Google Business Profile photo updates.',
  },
  {
    id: 'ecommerce-seo',
    name: 'E-commerce Revenue & Product SEO',
    description: 'Focuses on category architecture, commercial keyword rankings, conversion rate, and revenue.',
    iconName: 'ShoppingBag',
    defaultTasks: [
      'Product & Category Schema Markup',
      'Faceted Navigation Crawl Optimization',
      'Product Page Content Optimization',
      'Commercial Keyword Research',
      'Competitor Price & SERP Analysis',
    ],
    defaultChallenges: 'Index bloat from URL parameters and duplicate product variations.',
    defaultStrategy: 'Canonicalization audit, holiday gift guide optimization, and high-DA lifestyle backlink outreach.',
  },
  {
    id: 'saas-b2b',
    name: 'SaaS & B2B Pipeline Report',
    description: 'Geared towards demo bookings, high-ACV commercial keywords, and topical authority clusters.',
    iconName: 'Building2',
    defaultTasks: [
      'Competitor Alternative & Comparison Pages',
      'Topical Authority Pillar Content',
      'Technical Core Web Vitals Optimization',
      'Guest Post Publishing on Tech Portals',
      'Demo Page Conversion Rate Optimization',
    ],
    defaultChallenges: 'High keyword difficulty for primary enterprise software solutions.',
    defaultStrategy: 'Scale bottom-of-funnel comparison keywords and build relationship-driven link partnerships.',
  },
  {
    id: 'technical-audit',
    name: 'Technical SEO & Core Web Vitals Sprint',
    description: 'Deep dive into crawl errors, site speed, mobile rendering, and indexation hygiene.',
    iconName: 'Wrench',
    defaultTasks: [
      'Technical SEO Optimization',
      'XML Sitemap & Robots.txt Hygiene',
      'Core Web Vitals Optimization',
      'Internal Linking Architecture',
      'Redirect Chain & 404 Cleanup',
    ],
    defaultChallenges: 'JavaScript rendering delays on dynamic client-side components.',
    defaultStrategy: 'Implement edge-caching for static assets and resolve orphaned page clusters.',
  },
];

export const DEMO_SAMPLE_REPORT: SeoReport = {
  id: 'demo-report-2026',
  title: 'Acme SaaS Solutions - October 2026 SEO Performance',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  status: 'generated',
  clientInfo: {
    clientName: 'Sarah Jenkins',
    businessName: 'Acme Cloud Solutions',
    websiteUrl: 'https://acmecloud.io',
    clientEmail: 'sarah.jenkins@acmecloud.io',
    agencyName: 'Apex Growth SEO Labs',
    reportingPeriod: 'October 2026',
    reportDate: 'November 2, 2026',
  },
  performanceData: {
    organicTrafficPrevious: 24500,
    organicTrafficCurrent: 31200,
    organicTrafficChangePct: 27.3,
    totalRankingKeywords: 1840,
    keywordsTop3: 42,
    keywordsTop10: 168,
    keywordsTop100: 980,
    backlinksAcquired: 34,
    referringDomains: 215,
    domainAuthority: 58,
    organicConversions: 482,
    organicRevenue: 38600,
    customMetrics: [
      { id: '1', name: 'Average CTR', value: '3.8%', change: '+0.6%' },
      { id: '2', name: 'Core Web Vitals Pass', value: '98%', change: '+12%' },
      { id: '3', name: 'Featured Snippets', value: '18', change: '+5' },
    ],
  },
  workCompleted: [
    {
      id: 'task-1',
      category: 'Technical SEO',
      taskName: 'Technical SEO Optimization & Core Web Vitals Fix',
      details: 'Optimized Largest Contentful Paint (LCP) from 3.4s to 1.8s; eliminated 14 redirect chains.',
      status: 'completed',
    },
    {
      id: 'task-2',
      category: 'On-Page SEO',
      taskName: 'On-Page SEO & Content Refresh on Core Solutions',
      details: 'Updated title tags, meta descriptions, and semantic headers on 8 top commercial tier pages.',
      status: 'completed',
    },
    {
      id: 'task-3',
      category: 'Keyword Research',
      taskName: 'High-Intent B2B Keyword Opportunity Mapping',
      details: 'Identified 35 mid-tail commercial queries with low competition and buyer intent.',
      status: 'completed',
    },
    {
      id: 'task-4',
      category: 'Link Building',
      taskName: 'High-Authority Editorial Link Acquisition',
      details: 'Secured 6 contextual mentions on DR 65+ cloud engineering and SaaS industry publications.',
      status: 'completed',
    },
    {
      id: 'task-5',
      category: 'Content',
      taskName: 'Topical Authority Pillar: Enterprise Security Guide',
      details: 'Published 4,200-word authoritative guide with interactive diagrams and custom schema.',
      status: 'completed',
    },
  ],
  challenges: 'Search engine volatility during late October core algorithm tests created temporary fluctuation in secondary informational terms, but commercial transactional terms held firm.',
  nextMonthStrategyInput: `1. Expand comparison and alternatives pages against top 3 market competitors.
2. Scale digital PR link building campaign focusing on upcoming SaaS benchmark statistics.
3. Conduct internal linking audit to funnel link equity to newly published pillar content.
4. Implement FAQ schema on all service landing pages to capture SERP visual real estate.`,
  branding: DEFAULT_BRANDING,
  generatedContent: {
    executiveSummary: `During October 2026, Acme Cloud Solutions achieved record-breaking organic search visibility and user acquisition. Concerted technical remediations paired with targeted bottom-of-funnel content optimizations accelerated organic traffic to 31,200 monthly sessions—representing a stellar +27.3% expansion over the previous reporting cycle.

Crucially, this growth translated directly into business outcomes: organic lead conversions rose to 482 qualified inquiries, generating an estimated $38,600 in attributed pipeline revenue. The compounding effect of our technical speed enhancements and editorial link acquisition has elevated the domain authority to 58, consolidating defensible search rankings against legacy incumbents.

Our primary focus for the upcoming cycle is expanding high-intent comparison search clusters and reinforcing internal PageRank distribution to turn search visibility into sustained market leadership.`,
    performanceOverview: `Performance across all primary organic KPIs demonstrated exceptional health throughout October. User acquisition velocity gained momentum across both desktop and mobile platforms, driven by steady rank gains across commercial intent phrases. The overall keyword footprint broadened to 1,840 tracked keywords, reflecting expanding topical authority in the cloud infrastructure vertical.`,
    trafficAnalysis: `Organic traffic increased by 6,700 sessions to reach 31,200 total visitors (+27.3% month-over-month). Deeper analysis reveals that over 65% of the incremental growth originated from high-value product comparison queries and technical solution landing pages, signaling higher user intent and lower bounce rates (down 4.2%). Organic search remains Acme Cloud Solutions' most cost-effective and dependable customer acquisition engine.`,
    keywordAnalysis: `The website's ranking positions showed strong consolidation across upper SERP tiers. Top 3 rankings climbed to 42 keywords (+9), while Page 1 (Top 10) presence expanded to 168 keywords. Capturing 18 featured snippets this cycle significantly boosted click-through rates against zero-click search behavior. The top 100 footprint now encapsulates 980 keywords, creating a broad pipeline for future Page 1 migration.`,
    backlinkAnalysis: `Off-page equity expanded solidly with 34 high-quality editorial backlinks acquired across 215 unique referring domains. Domain Authority advanced to 58/100. Backlink acquisitions were strictly vetted for editorial context and organic traffic health, including publications such as CloudNative Journal and Enterprise Tech Insider. No toxic link footprints were detected.`,
    workCompletedAnalysis: `The agency team successfully delivered 5 major technical and editorial milestones during this sprint. Resolving Core Web Vitals bottlenecks directly benefited crawl efficiency and mobile indexing. Concurrently, publishing the Enterprise Security Pillar established immediate topical relevancy, garnering 4 organic backlinks within two weeks of launch.`,
    challengesAndObservations: `October featured noticeable SERP volatility attributed to search engine machine-learning algorithm adjustments. While minor fluctuations occurred across broader informational queries, our proactive schema markup and robust internal linking shielded core commercial landing pages from negative rank shifts.`,
    recommendations: [
      'Scale bottom-of-funnel "Acme vs Competitor" comparative hubs to capture active software buyers in final evaluation phases.',
      'Implement structured Product and Review schema across updated service modules to maximize SERP visual dominance.',
      'Refine lead capture forms with sticky navigation CTAs on top 5 organic entry pages to boost conversion rates above 1.8%.',
      'Conduct a quarterly toxic link audit and disavow sweep to maintain pristine domain authority hygiene.',
      'Optimize image assets and font delivery to lock in Core Web Vitals Largest Contentful Paint under 1.5 seconds globally.',
    ],
    nextMonthStrategy: [
      'Deploy 3 new competitor comparison pages targeting high-ACV commercial search volume.',
      'Launch Q4 Digital PR outreach campaign sharing exclusive cloud infrastructure benchmark data.',
      'Optimize internal anchor text flow from informational blog guides into core conversion pathways.',
      'Execute localized SERP audits for key enterprise regions in North America and Western Europe.',
      'Conduct bi-weekly conversion rate tracking reviews to ensure traffic gains compound into qualified MRR.',
    ],
    keyWins: [
      'Organic traffic expanded by +27.3% to reach an all-time monthly high of 31,200 sessions.',
      'Organic conversions scaled to 482 leads, contributing $38,600 in attributed organic revenue.',
      'Solidified 168 keywords onto Page 1 (Top 10), including 42 coveted Top 3 positions.',
      'Core Web Vitals scores attained a 98% pass rate following comprehensive LCP and asset optimizations.',
    ],
    keyMetricsHighlights: [
      {
        label: 'Organic Traffic',
        value: '31,200',
        change: '+27.3%',
        trend: 'up',
        commentary: 'Massive surge in qualified organic visitor sessions.',
      },
      {
        label: 'Page 1 Keywords',
        value: '168',
        change: '+18 MoM',
        trend: 'up',
        commentary: 'Direct driver of commercial conversion intent.',
      },
      {
        label: 'Domain Authority',
        value: '58/100',
        change: '+2 pts',
        trend: 'up',
        commentary: 'Strengthened algorithmic authority against competitors.',
      },
      {
        label: 'Organic Conversions',
        value: '482',
        change: '+21.4%',
        trend: 'up',
        commentary: 'Qualified pipeline inquiries attributed to search.',
      },
    ],
    missingDataNotes: [],
  },
};
