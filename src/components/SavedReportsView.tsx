import React, { useState } from 'react';
import { SeoReport } from '../types/report';
import {
  Search,
  Filter,
  Eye,
  Copy,
  Trash2,
  FilePlus,
  Download,
  Upload,
  Calendar,
  Building,
  Globe,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';

interface SavedReportsViewProps {
  reports: SeoReport[];
  onSelectReport: (report: SeoReport) => void;
  onNewReport: () => void;
  onDuplicateReport: (id: string) => void;
  onDeleteReport: (id: string) => void;
  onImportReports: (imported: SeoReport[]) => void;
}

export const SavedReportsView: React.FC<SavedReportsViewProps> = ({
  reports,
  onSelectReport,
  onNewReport,
  onDuplicateReport,
  onDeleteReport,
  onImportReports,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'generated' | 'draft'>('all');

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.clientInfo.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.clientInfo.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.clientInfo.reportingPeriod.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ? true : r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reports, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `retool-seo-reports-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportReports(parsed);
          alert(`Successfully imported ${parsed.length} reports!`);
        } else {
          alert('Invalid backup file format');
        }
      } catch (err) {
        alert('Failed to parse backup JSON file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Saved Client Reports Archive
          </h2>
          <p className="text-xs text-slate-500">
            Manage, duplicate, and export previously generated SEO client deliverables
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJson}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
            title="Export full JSON database backup"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Backup</span>
          </button>

          <label className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Import Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />
          </label>

          <button
            onClick={onNewReport}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span>Create New Report</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by client, domain, or period..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium">Filter:</span>
          {(['all', 'generated', 'draft'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                statusFilter === status
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-8">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No matching reports found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Try adjusting your search query or generate a new client report.
          </p>
          <button
            onClick={onNewReport}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
          >
            Create New Report
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report) => {
            const perf = report.performanceData;
            const client = report.clientInfo;
            const changePct = perf.organicTrafficChangePct;
            const isPositive = changePct !== null && changePct !== '' && Number(changePct) >= 0;

            return (
              <div
                key={report.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200/50">
                        {client.reportingPeriod}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1.5">
                        {client.businessName || 'Unnamed Client'}
                      </h3>
                      <p className="text-xs text-slate-500">{client.websiteUrl}</p>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        report.status === 'generated'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                      }`}
                    >
                      {report.status === 'generated' ? 'Ready' : 'Draft'}
                    </span>
                  </div>

                  {/* Quick Metrics Strip */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 my-3 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">
                        Traffic
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {perf.organicTrafficCurrent
                          ? Number(perf.organicTrafficCurrent).toLocaleString()
                          : '—'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">
                        Traffic Lift
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          changePct !== null && changePct !== ''
                            ? isPositive
                              ? 'text-emerald-600'
                              : 'text-rose-600'
                            : 'text-slate-700'
                        }`}
                      >
                        {changePct !== null && changePct !== ''
                          ? `${isPositive ? '+' : ''}${changePct}%`
                          : '—'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">
                        Page 1 KWs
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {perf.keywordsTop10 || '—'}
                      </span>
                    </div>
                  </div>

                  {/* Tasks count & date */}
                  <div className="text-[11px] text-slate-500 mb-4 flex items-center justify-between">
                    <span>{report.workCompleted?.length || 0} Deliverables documented</span>
                    <span>{client.reportDate}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onSelectReport(report)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Report</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onDuplicateReport(report.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                      title="Duplicate for Next Month"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteReport(report.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Report"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
