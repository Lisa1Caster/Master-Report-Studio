import React from 'react';
import { SeoPerformanceData } from '../types/report';
import { TrendingUp, TrendingDown, Target, Award, Link2, DollarSign } from 'lucide-react';

interface ReportChartsProps {
  data: SeoPerformanceData;
  primaryColor?: string;
}

export const ReportCharts: React.FC<ReportChartsProps> = ({
  data,
  primaryColor = '#4f46e5',
}) => {
  const prevTraffic = Number(data.organicTrafficPrevious) || 0;
  const currTraffic = Number(data.organicTrafficCurrent) || 0;
  const maxTraffic = Math.max(prevTraffic, currTraffic, 100);

  const prevPct = Math.round((prevTraffic / maxTraffic) * 100);
  const currPct = Math.round((currTraffic / maxTraffic) * 100);

  const top3 = Number(data.keywordsTop3) || 0;
  const top10 = Number(data.keywordsTop10) || 0;
  const top100 = Number(data.keywordsTop100) || 0;
  const totalKw = Number(data.totalRankingKeywords) || Math.max(top100, 1);

  const top3Pct = Math.min(100, Math.round((top3 / totalKw) * 100));
  const top10Pct = Math.min(100, Math.round((top10 / totalKw) * 100));
  const top100Pct = Math.min(100, Math.round((top100 / totalKw) * 100));

  const changePct = data.organicTrafficChangePct;
  const isPositive = changePct !== null && changePct !== '' && Number(changePct) >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
      {/* Chart 1: Organic Traffic Growth Comparison */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Organic Traffic Trajectory</h4>
            <p className="text-xs text-slate-500">Current vs. Previous Period Sessions</p>
          </div>
          {changePct !== null && changePct !== '' && (
            <span
              className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                isPositive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                  : 'bg-rose-50 text-rose-700 border border-rose-200/60'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              {isPositive ? '+' : ''}
              {changePct}%
            </span>
          )}
        </div>

        <div className="space-y-4 pt-2">
          {/* Previous Period Bar */}
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-600 mb-1.5">
              <span>Previous Reporting Period</span>
              <span className="font-semibold text-slate-800">
                {prevTraffic > 0 ? prevTraffic.toLocaleString() : 'Baseline'}
              </span>
            </div>
            <div className="h-5 w-full bg-slate-100 rounded-lg overflow-hidden p-0.5">
              <div
                className="h-full bg-slate-400 rounded-md transition-all duration-500"
                style={{ width: `${prevPct || 8}%` }}
              />
            </div>
          </div>

          {/* Current Period Bar */}
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-600 mb-1.5">
              <span className="font-semibold text-slate-900">Current Reporting Period</span>
              <span className="font-bold text-indigo-700">
                {currTraffic > 0 ? currTraffic.toLocaleString() : 'Active'}
              </span>
            </div>
            <div className="h-5 w-full bg-slate-100 rounded-lg overflow-hidden p-0.5">
              <div
                className="h-full rounded-md transition-all duration-500"
                style={{
                  width: `${currPct || 10}%`,
                  backgroundColor: primaryColor,
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Net Visitor Variance:</span>
          <span className="font-semibold text-slate-800">
            {currTraffic && prevTraffic ? (
              `${currTraffic - prevTraffic >= 0 ? '+' : ''}${(
                currTraffic - prevTraffic
              ).toLocaleString()} sessions`
            ) : (
              'Continuous Measurement'
            )}
          </span>
        </div>
      </div>

      {/* Chart 2: Keyword Ranking Tier Breakdown */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Keyword Ranking Distribution</h4>
            <p className="text-xs text-slate-500">Tier Breakdown across Search Engine Results</p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
            <Award className="w-3.5 h-3.5" />
            {totalKw > 0 ? `${totalKw.toLocaleString()} Total` : 'Tracked'}
          </span>
        </div>

        <div className="space-y-3 pt-1">
          {/* Top 3 */}
          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-amber-800 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                Positions 1 - 3 (Top CTR)
              </span>
              <span className="font-bold text-slate-900">{top3} terms</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${top3Pct > 0 ? Math.max(top3Pct, 4) : 0}%` }}
              />
            </div>
          </div>

          {/* Top 10 */}
          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-indigo-800 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" />
                Page 1 (Positions 4 - 10)
              </span>
              <span className="font-bold text-slate-900">{top10} terms</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: `${top10Pct > 0 ? Math.max(top10Pct, 6) : 0}%` }}
              />
            </div>
          </div>

          {/* Top 100 */}
          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-slate-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
                Positions 11 - 100 (Growth Pipeline)
              </span>
              <span className="font-bold text-slate-900">{top100} terms</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-400 rounded-full"
                style={{ width: `${top100Pct > 0 ? Math.max(top100Pct, 12) : 0}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Search Visibility Share:</span>
          <span className="font-semibold text-slate-800">
            {top3 > 0 || top10 > 0 ? `${top3 + top10} Page 1 Placements` : 'Indexed Profile'}
          </span>
        </div>
      </div>
    </div>
  );
};
