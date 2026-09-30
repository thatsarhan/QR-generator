import React from 'react';
import { ExternalLink, Shield } from 'lucide-react';

export const PdfEmbedViewer: React.FC = () => {
  const pdfUrl = 'https://rivelabs-my.sharepoint.com/:b:/g/personal/arhan_rive_ai/EQvSampleSharePointDocument';
  // SharePoint embed view URL format or direct view
  const embedUrl = `${pdfUrl}?download=1&web=1`;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#FFF9F6] text-[#0E3415] font-sans">
      {/* Top minimal header */}
      <header className="bg-white border-b border-stone-200 px-6 py-3 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#0E3415] text-[#A8F2D3] flex items-center justify-center font-bold text-xs">
            R
          </div>
          <div>
            <h1 className="font-display font-bold text-sm text-[#0E3415]">Rive Brochure</h1>
            <p className="text-[10px] text-stone-500">Official Product Catalog & Summer Collection</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-full bg-[#0E3415] text-white text-xs font-semibold hover:bg-[#154c1f] transition-all flex items-center gap-1.5 shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#A8F2D3]" />
            Open PDF in New Tab
          </a>
        </div>
      </header>

      {/* Main Full-Screen PDF Container */}
      <div className="flex-1 relative w-full h-full bg-stone-100 overflow-hidden flex flex-col">
        <iframe
          src={embedUrl}
          title="Rive Brochure PDF"
          className="w-full flex-1 border-0"
          style={{ minHeight: 'calc(100vh - 60px)' }}
        />

        {/* Fallback footer notice if embed is blocked by SharePoint headers */}
        <div className="bg-stone-900 text-stone-300 py-2.5 px-6 text-center text-xs flex items-center justify-center gap-2 shrink-0">
          <Shield className="w-3.5 h-3.5 text-[#A8F2D3]" />
          <span>If the viewer shows blank due to SharePoint security policies,</span>
          <a href={pdfUrl} target="_blank" rel="noreferrer" className="text-[#A8F2D3] underline font-semibold">
            click here to view the PDF directly
          </a>
        </div>
      </div>
    </div>
  );
};
