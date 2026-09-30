import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { QRStudio } from './components/QRStudio';
import { ShortLinksManager } from './components/ShortLinksManager';
import { AnalyticsView } from './components/AnalyticsView';
import { DeploymentGuide } from './components/DeploymentGuide';
import { ShortLink } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'generator' | 'links' | 'analytics' | 'deployment'>('generator');
  const [shortLinks, setShortLinks] = useState<ShortLink[]>([]);
  const [selectedQRData, setSelectedQRData] = useState<string | undefined>(undefined);
  const [selectedQRTitle, setSelectedQRTitle] = useState<string | undefined>(undefined);

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

  const handleAddShortLink = async (newLinkData: Omit<ShortLink, 'id' | 'scanCount' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLinkData),
      });
      if (!res.ok) {
        return false;
      }
      const created = await res.json();
      setShortLinks((prev) => [created, ...prev]);
      return true;
    } catch (err) {
      console.error('Failed to create short link:', err);
      return false;
    }
  };

  const handleUpdateShortLink = async (id: string, destinationUrl: string, title: string) => {
    try {
      const res = await fetch(`/api/links/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destinationUrl, title }),
      });
      const updated = await res.json();
      setShortLinks((prev) => prev.map((l) => (l.id === id ? updated : l)));
    } catch (err) {
      console.error('Failed to update short link:', err);
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

  const handleUseForQR = (shortUrl: string, title: string) => {
    setSelectedQRData(shortUrl);
    setSelectedQRTitle(title);
    setActiveTab('generator');
  };

  return (
    <div className="min-h-screen bg-[#FFF9F6] text-[#0E3415] flex flex-col font-sans selection:bg-[#0E3415]/20">
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
          <QRStudio
            initialData={selectedQRData}
            initialTitle={selectedQRTitle}
            shortLinks={shortLinks}
          />
        )}
        {activeTab === 'links' && (
          <ShortLinksManager
            shortLinks={shortLinks}
            onAddShortLink={handleAddShortLink}
            onUpdateShortLink={handleUpdateShortLink}
            onDeleteShortLink={handleDeleteShortLink}
            onUseForQR={handleUseForQR}
          />
        )}
        {activeTab === 'analytics' && (
          <AnalyticsView shortLinks={shortLinks} />
        )}
        {activeTab === 'deployment' && (
          <DeploymentGuide />
        )}
      </main>

      <footer className="border-t border-stone-200/60 py-6 text-center text-xs text-stone-500 bg-white/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-display font-bold text-[#0E3415]">
            <span>Rive QR Studio</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#0E3415]"></span>
            <span className="font-normal text-stone-500">go.rive.ai Redirection & QR Hub</span>
          </div>
          <div>Powered by Rive AI & Custom Domain Routing</div>
        </div>
      </footer>
    </div>
  );
}
