import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { QRStudio } from './components/QRStudio';
import { SharePointGuide } from './components/SharePointGuide';
import { ShortLinksManager } from './components/ShortLinksManager';
import { AnalyticsView } from './components/AnalyticsView';
import { ShortLink } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'generator' | 'shortlinks' | 'guide' | 'analytics'>('generator');
  const [shortLinks, setShortLinks] = useState<ShortLink[]>([]);
  const [selectedQRData, setSelectedQRData] = useState<string | undefined>(undefined);
  const [selectedQRTitle, setSelectedQRTitle] = useState<string | undefined>(undefined);

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

  const handleAddShortLink = async (newLinkData: Omit<ShortLink, 'id' | 'clicks' | 'createdAt'>) => {
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLinkData),
      });
      const created = await res.json();
      setShortLinks((prev) => [created, ...prev]);
      
      // Automatically switch to QR generator with this short link
      const shortUrl = `${window.location.origin}/r/${created.slug}`;
      setSelectedQRData(shortUrl);
      setSelectedQRTitle(created.title);
      setActiveTab('generator');
    } catch (err) {
      console.error('Failed to create short link:', err);
    }
  };

  const handleDeleteShortLink = async (id: string) => {
    try {
      await fetch(`/api/links/${id}`, { method: 'DELETE' });
      setShortLinks((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error('Failed to delete short link:', err);
    }
  };

  const handleUseForQR = (destinationUrl: string, title: string) => {
    setSelectedQRData(destinationUrl);
    setSelectedQRTitle(title);
    setActiveTab('generator');
  };

  return (
    <div className="min-h-screen bg-[#FFF9F6] text-[#2F2F35] flex flex-col font-sans selection:bg-[#F7A8C9]/30">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewQR={() => {
          setSelectedQRData(undefined);
          setSelectedQRTitle(undefined);
          setActiveTab('generator');
        }}
      />

      <main className="flex-1 pb-16">
        {activeTab === 'generator' && (
          <QRStudio initialData={selectedQRData} initialTitle={selectedQRTitle} />
        )}
        {activeTab === 'shortlinks' && (
          <ShortLinksManager
            shortLinks={shortLinks}
            onAddShortLink={handleAddShortLink}
            onDeleteShortLink={handleDeleteShortLink}
            onUseForQR={handleUseForQR}
          />
        )}
        {activeTab === 'guide' && (
          <SharePointGuide
            onSwitchToShortlinks={() => setActiveTab('shortlinks')}
            onSwitchToGenerator={() => setActiveTab('generator')}
          />
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
            <span className="font-normal text-stone-500">SharePoint & Cloud Redirection Hub</span>
          </div>
          <div>Powered by Rive AI & Daely Design System</div>
        </div>
      </footer>
    </div>
  );
}
