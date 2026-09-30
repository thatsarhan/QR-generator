import React from 'react';
import { QrCode, BarChart3, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'generator' | 'analytics';
  setActiveTab: (tab: 'generator' | 'analytics') => void;
  onNewQR: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onNewQR }) => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-stone-200/80 px-6 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Zone 1: Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('generator')}>
          <div className="w-10 h-10 rounded-2xl bg-[#0E3415] flex items-center justify-center shadow-sm text-white font-bold">
            <QrCode className="w-5 h-5 text-[#A8F2D3]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-lg tracking-tight text-[#0E3415]">Rive QR Studio</span>
              <span className="px-2 py-0.5 rounded-full bg-[#0E3415]/10 text-[#0E3415] font-mono text-[10px] font-bold">rive-brochure.vercel.app</span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium">Branded QR Generator</p>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-stone-100/80 p-1 rounded-full border border-stone-200/60 text-sm font-medium">
          <button
            onClick={() => setActiveTab('generator')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all whitespace-nowrap ${
              activeTab === 'generator'
                ? 'bg-[#0E3415] text-white shadow-sm font-semibold'
                : 'text-stone-600 hover:text-[#0E3415]'
            }`}
          >
            <QrCode className="w-4 h-4 text-[#A8F2D3]" />
            QR Studio
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-[#0E3415] text-white shadow-sm font-semibold'
                : 'text-stone-600 hover:text-[#0E3415]'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-[#A8F2D3]" />
            Scan Analytics
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNewQR}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#0E3415] rounded-full hover:bg-stone-800 transition-all shadow-sm whitespace-nowrap hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#A8F2D3]" />
            Create QR Code
          </button>
        </div>
      </div>
    </header>
  );
};
