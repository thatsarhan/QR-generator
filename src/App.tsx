import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { QRStudio } from './components/QRStudio';
import { AnalyticsView } from './components/AnalyticsView';
import { ShortLink } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'generator' | 'analytics'>('generator');
  const [shortLinks, setShortLinks] = useState<ShortLink[]>([]);

  // Fetch short links on mount
  useEffect(() => {
    fetch('/api/links')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setShortLinks(data);
        }
      })
      .catch((err) => console.error('Failed to load short links:', err));
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF9F6] text-[#2F2F35] flex flex-col font-sans selection:bg-[#F7A8C9]/30">
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
          <div className="flex items-center gap-2 font-display font-bold text-stone-800">
            <span>Rive QR Studio</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#F7A8C9]"></span>
            <span className="font-normal text-stone-500">SharePoint & Custom URL Masking</span>
          </div>
          <div>Powered by Rive AI & Daely Design System</div>
        </div>
      </footer>
    </div>
  );
}
