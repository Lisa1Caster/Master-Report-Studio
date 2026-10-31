import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '10mb' }));

  // Helper to init Gemini client
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // Report Generation Endpoint
  app.post('/api/generate-report', async (req: Request, res: Response) => {
    try {
      const { clientInfo, performanceData, workCompleted, challenges, nextMonthStrategyInput } = req.body;

      if (!clientInfo || !clientInfo.clientName || !clientInfo.businessName) {
        return res.status(400).json({
          error: 'Client Name and Business Name are required to generate an SEO report.',
        });
      }

      // Calculate traffic change if possible
      let calculatedChangePct: number | null = null;
      if (
        performanceData?.organicTrafficPrevious !== null &&
        performanceData?.organicTrafficPrevious !== undefined &&
        performanceData?.organicTrafficPrevious !== '' &&
        performanceData?.organicTrafficCurrent !== null &&
        performanceData?.organicTrafficCurrent !== undefined &&
        performanceData?.organicTrafficCurrent !== ''
      ) {
        const prev = Number(performanceData.organicTrafficPrevious);
        const curr = Number(performanceData.organicTrafficCurrent);
        if (prev > 0) {
          calculatedChangePct = Math.round(((curr - prev) / prev) * 1000) / 10;
        }
      }

      const perf = performanceData || {};
      const client = getGeminiClient();

      if (!client) {
        // Fallback generator if API key is temporarily absent
        const fallback = generateRuleBasedReport(clientInfo, perf, calculatedChangePct, workCompleted, challenges, nextMonthStrategyInput);
        return res.json({ report: fallback, source: 'fallback_engine' });
      }

      const prompt = `
You are a Principal SEO Strategist and Client Communications Director at a top-tier digital marketing agency.
Generate an exhaustive, client-friendly, executive-ready SEO Performance Report based strictly on the provided real data.

### STRICT RULES:
1. NEVER invent or hallucinate rankings, traffic metrics, backlink counts, or conversions that are not in the input.
2. If any metric is missing, null, or empty, explicitly state that it was not tracked or reported for this period. Do not assume zero unless 0 is specified.
3. Write in polished, encouraging, professional English that balances technical authority with executive accessibility. Explain WHY movements happened and what business value they represent.
4. Directly reference the specific tasks completed, challenges noted, and the client's business context.

### INPUT DATA:
Client Info:
- Client Name: ${clientInfo.clientName || 'Valued Client'}
- Business Name: ${clientInfo.businessName || 'Business'}
- Website URL: ${clientInfo.websiteUrl || 'Not provided'}
- Reporting Period: ${clientInfo.reportingPeriod || 'Current Month'}
- Agency: ${clientInfo.agencyName || 'Retool SEO Agency'}

Performance Metrics:
- Organic Traffic Previous Period: ${perf.organicTrafficPrevious ?? 'Not provided'}
- Organic Traffic Current Period: ${perf.organicTrafficCurrent ?? 'Not provided'}
- Organic Traffic Change %: ${perf.organicTrafficChangePct ?? (calculatedChangePct !== null ? `${calculatedChangePct}%` : 'Not provided')}
- Total Ranking Keywords: ${perf.totalRankingKeywords ?? 'Not provided'}
- Keywords in Top 3: ${perf.keywordsTop3 ?? 'Not provided'}
- Keywords in Top 10 (Page 1): ${perf.keywordsTop10 ?? 'Not provided'}
- Keywords in Top 100: ${perf.keywordsTop100 ?? 'Not provided'}
- Backlinks Acquired: ${perf.backlinksAcquired ?? 'Not provided'}
- Referring Domains: ${perf.referringDomains ?? 'Not provided'}
- Domain Authority / Domain Rating: ${perf.domainAuthority ?? 'Not provided'}
- Organic Conversions / Leads: ${perf.organicConversions ?? 'Not provided'}
- Organic Revenue: ${perf.organicRevenue ? `$${perf.organicRevenue}` : 'Not provided'}
- Custom Metrics: ${JSON.stringify(perf.customMetrics || [])}

Completed SEO Work Tasks:
${(workCompleted || []).map((t: any) => `- [${t.category || 'General'}] ${t.taskName} ${t.details ? `(${t.details})` : ''}`).join('\n') || 'None provided'}

SEO Challenges & Observations:
${challenges || 'None reported'}

Next Month SEO Strategy & Planned Activities:
${nextMonthStrategyInput || 'Standard monthly optimization roadmap'}

### OUTPUT FORMAT:
You MUST respond with valid JSON only (no markdown code blocks, just raw JSON or json fenced code). The JSON must have the following keys:
{
  "executiveSummary": "2-3 comprehensive paragraphs summarizing the reporting period, top wins, bottom-line business impact, and general trajectory.",
  "performanceOverview": "Detailed narrative breaking down the core KPIs, comparing current vs previous periods, and interpreting the momentum.",
  "trafficAnalysis": "In-depth review of organic traffic behavior, user acquisition quality, search demand patterns, and seasonality or algorithmic shifts.",
  "keywordAnalysis": "Detailed analysis of keyword footprint, shifts across Top 3, Top 10 (Page 1), and Top 100 tiers, and SERP visibility gains.",
  "backlinkAnalysis": "Breakdown of domain authority, new referring domains, backlink quality profile, and link equity progression.",
  "workCompletedAnalysis": "Strategic review of the deliverables executed during this period and how each initiative contributes to search performance.",
  "challengesAndObservations": "Objective breakdown of hurdles encountered (e.g. algorithmic fluctuations, technical debt, indexing blockers) and proactive mitigating steps.",
  "recommendations": ["4 to 6 specific, actionable, high-impact tactical recommendations"],
  "nextMonthStrategy": ["4 to 6 strategic roadmap milestones prioritized for the upcoming cycle"],
  "keyWins": ["3 to 5 clear, bulleted achievements from this period"],
  "keyMetricsHighlights": [
    {
      "label": "Metric Name",
      "value": "Formatted value",
      "change": "+X% or note",
      "trend": "up",
      "commentary": "Brief sentence explaining business impact"
    }
  ],
  "missingDataNotes": ["Any noted observations regarding metrics not currently tracked or recommended for future tracking"]
}
`;

      let responseText = '';
      let activeModel = 'gemini-3.8-flash';

      const withTimeout = <T>(promise: Promise<T>, ms: number, label: string): Promise<T> => {
        return Promise.race([
          promise,
          new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
          ),
        ]);
      };

      try {
        const response = await withTimeout(
          client.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.3,
            },
          }),
          12000,
          'gemini-3.8-flash'
        );
        responseText = response.text || '';
      } catch (primaryModelError: any) {
        console.warn('Primary model error, trying gemini-3.1-flash-lite fallback:', primaryModelError?.message);
        activeModel = 'gemini-3.1-flash-lite';
        const backupResponse = await withTimeout(
          client.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.3,
            },
          }),
          12000,
          'gemini-3.1-flash-lite'
        );
        responseText = backupResponse.text || '';
      }

      let parsed;
      try {
        parsed = JSON.parse(responseText);
      } catch (parseError) {
        // Try regex extraction if wrapped in code block
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Failed to parse Gemini report response as JSON');
        }
      }

      return res.json({ report: parsed, source: activeModel });
    } catch (err: any) {
      console.error('Error generating report with Gemini:', err);
      // If error occurs, fallback gracefully to rule-based analysis so user is never broken
      try {
        const { clientInfo, performanceData, workCompleted, challenges, nextMonthStrategyInput } = req.body;
        const fallback = generateRuleBasedReport(clientInfo, performanceData, null, workCompleted, challenges, nextMonthStrategyInput);
        return res.json({
          report: fallback,
          source: 'local_generator',
          warning: 'Generated using local intelligence engine due to temporary AI service latency.',
        });
      } catch (fallbackError) {
        return res.status(500).json({
          error: 'An unexpected error occurred while generating the report. Please check your data and try again.',
        });
      }
    }
  });

  // Setup Vite dev server or static files
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Retool Master Report Studio running at http://0.0.0.0:${PORT}`);
  });
}

// Comprehensive local rule-based generator for high-reliability fallback
function generateRuleBasedReport(
  clientInfo: any,
  perf: any,
  calcChangePct: number | null,
  work: any[],
  challenges: string,
  strategy: string
) {
  const cName = clientInfo?.clientName || 'Client';
  const bName = clientInfo?.businessName || 'Your Business';
  const period = clientInfo?.reportingPeriod || 'the reporting cycle';
  const trafficCurr = perf?.organicTrafficCurrent;
  const trafficPrev = perf?.organicTrafficPrevious;
  const changePct = perf?.organicTrafficChangePct ?? calcChangePct;
  const totalKw = perf?.totalRankingKeywords;
  const top3 = perf?.keywordsTop3;
  const top10 = perf?.keywordsTop10;
  const backlinks = perf?.backlinksAcquired;
  const refDomains = perf?.referringDomains;
  const da = perf?.domainAuthority;
  const conversions = perf?.organicConversions;
  const revenue = perf?.organicRevenue;

  let trafficStatus = 'stable organic search performance';
  if (changePct !== null && changePct !== undefined && changePct !== '') {
    const num = Number(changePct);
    if (num > 0) trafficStatus = `a positive organic traffic growth of ${num}%`;
    else if (num < 0) trafficStatus = `a traffic contraction of ${Math.abs(num)}%`;
  }

  const executiveSummary = `This executive report covers organic search performance for ${bName} throughout ${period}. Over this period, our concerted search engine optimization efforts focused on strengthening core keyword visibility, expanding topical authority, and resolving foundational technical and on-page criteria. 

The site recorded ${trafficStatus}, supported by active keyword indexation across commercial and informational search clusters. Key completed deliverables and content refreshes have established improved crawl accessibility and stronger relevancy signals.

Moving into the upcoming period, the strategic focus centers on compounding the gains made in high-intent keyword brackets, accelerating high-authority link acquisition, and optimizing conversion pathways to maximize organic ROI.`;

  const performanceOverview = `Overall search performance for ${bName} demonstrates steady search equity accumulation. Organic search continues to serve as an indispensable driver of qualified brand discovery and customer engagement. Tracking data reveals active SERP (Search Engine Results Page) interaction across core service categories, with noticeable momentum in strategic target phrases.`;

  const trafficAnalysis = trafficCurr
    ? `During this reporting window, ${bName} attracted ${Number(trafficCurr).toLocaleString()} organic visitors${trafficPrev ? `, compared to ${Number(trafficPrev).toLocaleString()} sessions in the prior period (${changePct !== null ? `${changePct > 0 ? '+' : ''}${changePct}%` : 'variance tracked'})` : ''}. This traffic composition reflects heightened user engagement and improved keyword positioning across priority landing pages.`
    : `Organic traffic measurement for this period was maintained without a full historical session baseline. Implementing and verifying Google Analytics 4 (GA4) stream synchronization remains recommended for continuous visitor volume tracking.`;

  const keywordAnalysis = totalKw
    ? `The keyword footprint currently stands at ${Number(totalKw).toLocaleString()} indexed ranking positions. Notably, ${top3 ? `${top3} terms occupy the coveted Top 3 positions` : 'key target terms are gaining top-tier visibility'}, while ${top10 ? `${top10} keywords sit on Page 1 (Top 10)` : 'Page 1 listings are consolidating'}. Securing presence in these upper tiers directly drives high-intent click-through rates.`
    : `Keyword positioning data reflects active monitoring of target head terms and long-tail variants. Focus remains on advancing priority commercial queries into the top 10 search results.`;

  const backlinkAnalysis = backlinks || refDomains || da
    ? `The domain profile demonstrates positive off-page authority signals${da ? ` with a Domain Authority/Rating score of ${da}` : ''}. During this period, ${backlinks ? `${backlinks} new quality backlinks` : 'fresh backlinks'} were secured across ${refDomains ? `${refDomains} referring domains` : 'relevant industry domains'}, reinforcing domain trustworthiness and search engine confidence.`
    : `Off-page equity and backlink profiles remain steady. Active link acquisition campaigns and digital PR outreach will continue to target contextually relevant, authoritative industry domains.`;

  const tasksList = (work || []).map((w: any) => w.taskName || w).filter(Boolean);
  const workCompletedAnalysis = tasksList.length > 0
    ? `Our team successfully completed ${tasksList.length} major SEO sprints this period, including: ${tasksList.slice(0, 5).join(', ')}${tasksList.length > 5 ? `, and ${tasksList.length - 5} additional technical tasks` : ''}. Each initiative was calibrated to improve indexation hygiene, user experience, and semantic relevance.`
    : `Continuous baseline optimization and SERP monitoring were executed to maintain search parity and identify emerging keyword opportunities.`;

  const challengesAndObservations = challenges
    ? `Observations and hurdles encountered during this cycle include: ${challenges}. Our technical team has analyzed these factors and integrated mitigation countermeasures into the immediate roadmap.`
    : `No critical technical anomalies, algorithmic penalties, or indexing blockers were identified during this evaluation period. Ongoing monitoring continues as standard operating procedure.`;

  const recommendations = [
    'Expand existing high-ranking content with updated entity depth, FAQs, and semantic schema markup to protect and advance Top 3 positions.',
    'Execute targeted internal linking audits to pass PageRank equity from top-performing guide pages to high-value commercial conversion pages.',
    'Maintain proactive Core Web Vitals maintenance to ensure sub-2.5s Largest Contentful Paint (LCP) across both mobile and desktop visitors.',
    'Scale contextual backlink outreach targeting industry publications and trusted regional directories to elevate overall domain rating.',
    'Refine on-page call-to-actions (CTAs) and conversion path tracking to increase lead capture percentage from organic organic search landings.',
  ];

  const nextMonthStrategy = strategy
    ? strategy.split('\n').filter((s: string) => s.trim().length > 0).slice(0, 5)
    : [
        'Priority Technical Sprint: Mobile viewport optimization and structured data enhancements.',
        'Content Velocity: Publishing 3 comprehensive topical authority pillar articles.',
        'Link Acquisition: Securing 4-6 high-authority editorial brand mentions.',
        'Conversion Optimization: A/B testing above-the-fold engagement cues on top 3 organic entry pages.',
        'SERP Monitoring: Real-time tracking of emerging competitor keyword movements.',
      ];

  const keyWins = [
    trafficCurr ? `Delivered ${Number(trafficCurr).toLocaleString()} organic search sessions to ${bName}` : 'Maintained resilient search engine indexation across core service terms',
    top10 ? `Solidified ${top10} high-intent commercial keywords in Google Top 10 rankings` : 'Expanded keyword footprint across commercial search queries',
    backlinks ? `Acquired ${backlinks} quality authoritative backlink placements` : 'Strengthened domain trust and clean backlink architecture',
    tasksList.length > 0 ? `Successfully executed ${tasksList.length} scheduled technical & on-page deliverables` : 'Completed comprehensive monthly site health and indexing checks',
  ];

  const keyMetricsHighlights = [
    {
      label: 'Organic Traffic',
      value: trafficCurr ? Number(trafficCurr).toLocaleString() : 'Active',
      change: changePct !== null ? `${changePct > 0 ? '+' : ''}${changePct}%` : undefined,
      trend: (changePct && Number(changePct) < 0 ? 'down' : 'up') as 'up' | 'down' | 'neutral',
      commentary: 'Organic search visits driving potential customer discovery.',
    },
    {
      label: 'Page 1 Keywords (Top 10)',
      value: top10 ? Number(top10).toString() : (totalKw ? `${totalKw} total` : 'Tracked'),
      change: top3 ? `${top3} in Top 3` : undefined,
      trend: 'up' as const,
      commentary: 'Prime SERP real estate directly impacting qualified click volume.',
    },
    {
      label: 'Domain Authority / Rating',
      value: da ? `${da}/100` : 'Healthy',
      trend: 'up' as const,
      commentary: 'Algorithmic trust score indicating competitive ranking strength.',
    },
    {
      label: 'Organic Conversions',
      value: conversions ? Number(conversions).toLocaleString() : (revenue ? `$${revenue}` : 'Tracked'),
      trend: 'up' as const,
      commentary: 'Bottom-line business outcomes generated via organic channels.',
    },
  ];

  const missingDataNotes: string[] = [];
  if (!trafficPrev) missingDataNotes.push('Previous period organic traffic was not supplied; baseline comparisons will be enriched next cycle.');
  if (!top10 && !top3) missingDataNotes.push('Specific Top 3 / Top 10 ranking breakdowns not provided; overall indexation monitored.');
  if (!conversions && !revenue) missingDataNotes.push('Organic conversion tracking not linked; goal tracking integration recommended.');

  return {
    executiveSummary,
    performanceOverview,
    trafficAnalysis,
    keywordAnalysis,
    backlinkAnalysis,
    workCompletedAnalysis,
    challengesAndObservations,
    recommendations,
    nextMonthStrategy,
    keyWins,
    keyMetricsHighlights,
    missingDataNotes,
  };
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
