import React from 'react';
import { QrCode, Link2, BookOpen, BarChart3, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'generator' | 'shortlinks' | 'guide' | 'analytics';
  setActiveTab: (tab: 'generator' | 'shortlinks' | 'guide' | 'analytics') => void;
  onNewQR: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onNewQR }) => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-stone-200/80 px-6 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Zone 1: Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('generator')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#F7A8C9] to-[#8ED8FF] flex items-center justify-center shadow-sm text-stone-900 font-bold">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-lg tracking-tight text-[#2F2F35]">Rive QR Studio</span>
              <span className="w-2 h-2 rounded-full bg-[#F7A8C9]"></span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium">Branded QR & SharePoint Masking</p>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-stone-100/80 p-1 rounded-full border border-stone-200/60 text-sm font-medium">
          <button
            onClick={() => setActiveTab('generator')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap ${
              activeTab === 'generator'
                ? 'bg-white text-[#2F2F35] shadow-sm font-semibold'
                : 'text-stone-600 hover:text-[#2F2F35]'
            }`}
          >
            <QrCode className="w-4 h-4 text-[#F7A8C9]" />
            QR Studio
          </button>
          <button
            onClick={() => setActiveTab('shortlinks')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap ${
              activeTab === 'shortlinks'
                ? 'bg-white text-[#2F2F35] shadow-sm font-semibold'
                : 'text-stone-600 hover:text-[#2F2F35]'
            }`}
          >
            <Link2 className="w-4 h-4 text-[#8ED8FF]" />
            SharePoint Masking
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap ${
              activeTab === 'guide'
                ? 'bg-white text-[#2F2F35] shadow-sm font-semibold'
                : 'text-stone-600 hover:text-[#2F2F35]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#B8A7FF]" />
            Camera Fix Guide
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-white text-[#2F2F35] shadow-sm font-semibold'
                : 'text-stone-600 hover:text-[#2F2F35]'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-[#FFC6A5]" />
            Analytics
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNewQR}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#2F2F35] rounded-full hover:bg-stone-800 transition-all shadow-sm whitespace-nowrap hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F7A8C9]" />
            Create Branded QR
          </button>
        </div>
      </div>
    </header>
  );
};
