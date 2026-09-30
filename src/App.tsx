import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { QRStudio } from './components/QRStudio';
import { AnalyticsView } from './components/AnalyticsView';
import { PdfEmbedViewer } from './components/PdfEmbedViewer';
import { ShortLink } from './types';

export default function App() {
  const [isPdfRoute, setIsPdfRoute] = useState(false);
  const [activeTab, setActiveTab] = useState<'generator' | 'analytics'>('generator');
  const [shortLinks, setShortLinks] = useState<ShortLink[]>([]);

  useEffect(() => {
    if (window.location.pathname === '/pdf') {
      setIsPdfRoute(true);
    }
  }, []);

  // Fetch short links on mount
  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/links');
      const data = await res.json();
      if (Array.isArray(data)) {
        setShortLinks(data);
      }
    } catch (err) {
      console.error('Failed to fetch short links:', err);
    }
  };

  if (isPdfRoute) {
    return <PdfEmbedViewer />;
  }

  return (
    <div className="min-h-screen bg-[#FFF9F6] text-[#0E3415] flex flex-col font-sans selection:bg-[#0E3415]/20">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewQR={() => {
          setActiveTab('generator');
        }}
      />

      <main className="flex-1 pb-16">
        {activeTab === 'generator' && (
          <QRStudio />
        )}
        {activeTab === 'analytics' && (
          <AnalyticsView shortLinks={shortLinks} />
        )}
      </main>

      <footer className="border-t border-stone-200/60 py-6 text-center text-xs text-stone-500 bg-white/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-display font-bold text-[#0E3415]">
            <span>Rive QR Studio</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#0E3415]"></span>
            <span className="font-normal text-stone-500">rive-brochure.vercel.app</span>
          </div>
          <div>Powered by Rive AI & Vercel Redirects</div>
        </div>
      </footer>
    </div>
  );
}
