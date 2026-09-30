import React from 'react';
import { ShortLink } from '../types';
import { BarChart3, TrendingUp, ShieldCheck } from 'lucide-react';

interface AnalyticsViewProps {
  shortLinks: ShortLink[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ shortLinks }) => {
  const totalScans = shortLinks.reduce((acc, curr) => acc + (curr.scanCount || 0), 0);
  const activeLinksCount = shortLinks.length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="glass-panel rounded-[28px] p-8 border border-stone-200/80 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E3415]/10 text-[#0E3415] text-xs font-semibold">
          <BarChart3 className="w-3.5 h-3.5" />
          Real-Time Scan Telemetry
        </div>
        <h1 className="text-3xl font-display font-bold text-[#0E3415]">Redirect Scan Analytics</h1>
        <p className="text-stone-600 text-sm">
          Track scan counts and performance metrics across all your branded <code className="font-mono bg-stone-100 px-1.5 py-0.5 rounded text-stone-800">go.rive.ai</code> short links.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="glass-panel rounded-[24px] p-6 border border-stone-200/80 space-y-2">
          <div className="text-stone-500 text-xs font-semibold uppercase tracking-wider">Total Scans</div>
          <div className="text-4xl font-display font-bold text-[#0E3415] flex items-baseline gap-2">
            {totalScans}
            <span className="text-xs font-medium text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +18% this week
            </span>
          </div>
          <p className="text-xs text-stone-500">HTTP 302 Redirect hits</p>
        </div>

        <div className="glass-panel rounded-[24px] p-6 border border-stone-200/80 space-y-2">
          <div className="text-stone-500 text-xs font-semibold uppercase tracking-wider">Active Short Links</div>
          <div className="text-4xl font-display font-bold text-[#0E3415]">{activeLinksCount}</div>
          <p className="text-xs text-stone-500">Masking SharePoint documents</p>
        </div>

        <div className="glass-panel rounded-[24px] p-6 border border-stone-200/80 space-y-2">
          <div className="text-stone-500 text-xs font-semibold uppercase tracking-wider">Camera Display Domain</div>
          <div className="text-xl font-display font-bold text-[#0E3415] truncate">go.rive.ai</div>
          <p className="text-xs text-stone-500">Zero sharepoint.com visibility</p>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="glass-panel rounded-[28px] p-8 border border-stone-200/80 space-y-6">
        <h3 className="text-xl font-display font-bold text-[#0E3415]">Link Performance Breakdown</h3>

        {shortLinks.length === 0 ? (
          <div className="text-center py-12 text-stone-500 text-sm">
            No short links created yet. Create a masked short link to start tracking scan analytics.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 text-xs uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Title & Slug</th>
                  <th className="py-3 px-4 font-semibold">SharePoint Destination</th>
                  <th className="py-3 px-4 font-semibold">Scan Count</th>
                  <th className="py-3 px-4 font-semibold">Last Updated</th>
                  <th className="py-3 px-4 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {shortLinks.map((link) => (
                  <tr key={link.id} className="hover:bg-white/50 transition-colors">
                    <td className="py-4 px-4 font-medium text-stone-900">
                      <div className="font-bold text-[#0E3415]">{link.title}</div>
                      <div className="text-xs font-mono text-stone-500">go.rive.ai/r/{link.slug}</div>
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-stone-500 max-w-xs truncate">
                      {link.destinationUrl}
                    </td>
                    <td className="py-4 px-4 font-bold text-[#0E3415] tabular-nums">
                      {link.scanCount || 0}
                    </td>
                    <td className="py-4 px-4 text-xs text-stone-500 tabular-nums">
                      {new Date(link.updatedAt || link.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                        <ShieldCheck className="w-3 h-3" /> Active 302
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
