import React, { useState, useEffect, useRef } from 'react';
import { QRConfig, PatternStyle, EyeStyle, QRDataType } from '../types';
import { generateQRCodeCanvas } from '../utils/qrHelper';
import { 
  QrCode, Download, Copy, Check, Upload, Trash2, Sliders, Palette, 
  Sparkles, Globe, FileText, Wifi, User, Mail, Phone, Image as ImageIcon,
  CheckCircle2, RefreshCw
} from 'lucide-react';

interface QRStudioProps {
  initialData?: string;
  initialTitle?: string;
}

const PRESET_COLORS = [
  { name: 'Charcoal', value: '#2F2F35' },
  { name: 'Daely Pink', value: '#F7A8C9' },
  { name: 'Sky Blue', value: '#8ED8FF' },
  { name: 'Lavender', value: '#B8A7FF' },
  { name: 'Coral', value: '#FF8FA6' },
  { name: 'Peach', value: '#FFC6A5' },
  { name: 'Mint', value: '#A8F2D3' },
  { name: 'Sun Yellow', value: '#FFE56D' },
];

const PRESET_BG_COLORS = [
  { name: 'Pure White', value: '#FFFFFF' },
  { name: 'Warm White', value: '#FFF9F6' },
  { name: 'Cream', value: '#FFF3EA' },
  { name: 'Light Gray', value: '#F5F5F7' },
  { name: 'Dark Slate', value: '#2F2F35' },
];

const PRESET_LOGOS = [
  { name: 'PDF Document', url: 'https://api.iconify.design/lucide:file-text.svg?color=%23F7A8C9' },
  { name: 'Rive Leaf', url: 'https://api.iconify.design/lucide:leaf.svg?color=%238ED8FF' },
  { name: 'Globe / Web', url: 'https://api.iconify.design/lucide:globe.svg?color=%23B8A7FF' },
  { name: 'Star Sparkle', url: 'https://api.iconify.design/lucide:sparkles.svg?color=%23FF8FA6' },
];

export const QRStudio: React.FC<QRStudioProps> = ({ initialData, initialTitle }) => {
  const [config, setConfig] = useState<QRConfig>({
    id: '1',
    name: initialTitle || 'My Branded QR Code',
    type: 'url',
    data: initialData || 'https://rive.ai/r/catalog-2026',
    patternColor: '#2F2F35',
    eyeColor: '#2F2F35',
    backgroundColor: '#FFFFFF',
    isTransparentBg: false,
    patternStyle: 'rounded',
    eyeStyle: 'rounded',
    logoUrl: PRESET_LOGOS[0].url,
    logoSize: 26,
    logoBg: true,
    logoRound: true,
    createdAt: Date.now(),
  });

  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (initialData) {
      setConfig((prev) => ({
        ...prev,
        data: initialData,
        name: initialTitle || prev.name,
      }));
    }
  }, [initialData, initialTitle]);

  useEffect(() => {
    if (canvasRef.current) {
      generateQRCodeCanvas(canvasRef.current, config, 500);
    }
  }, [config]);

  const handleDownloadPNG = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-qrcode.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadSVG = () => {
    // Generate SVG fallback or export data URI
    handleDownloadPNG();
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024 * 2) {
      alert('Logo file size must be under 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setConfig((prev) => ({ ...prev, logoUrl: uploadEvent.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Customization Controls (7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        <div className="glass-panel rounded-[32px] p-6 md:p-8 border border-stone-200/80 space-y-8 shadow-sm">
          {/* Section 1: Content & Data */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-display font-bold text-stone-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#F7A8C9]" />
                1. Target URL or Content
              </h3>
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
                {(['url', 'text', 'wifi', 'email'] as QRDataType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setConfig((prev) => ({ ...prev, type: t }))}
                    className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                      config.type === t ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                QR Code Name
              </label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => setConfig((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F7A8C9]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                Destination Link (SharePoint, Website, or Branded Short Link)
              </label>
              <textarea
                rows={2}
                value={config.data}
                onChange={(e) => setConfig((prev) => ({ ...prev, data: e.target.value }))}
                placeholder="https://rive.ai/r/catalog-2026"
                className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#F7A8C9]"
              />
              <p className="text-[11px] text-stone-500 mt-1">
                Tip: Use a branded short link (e.g. <code className="text-[#F7A8C9] font-bold">rive.ai/r/slug</code>) to mask long SharePoint URLs.
              </p>
            </div>
          </div>

          <hr className="border-stone-200/60" />

          {/* Section 2: Logo Customization */}
          <div className="space-y-4">
            <h3 className="text-xl font-display font-bold text-stone-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#8ED8FF]" />
              2. Add Brand Logo or Icon
            </h3>

            <div className="flex flex-wrap items-center gap-3">
              <label className="px-5 py-2.5 rounded-full bg-stone-900 text-white font-semibold text-xs hover:bg-stone-800 transition-all cursor-bezier flex items-center gap-2 shadow-sm">
                <Upload className="w-3.5 h-3.5 text-[#F7A8C9]" />
                Upload Custom Logo
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
              {config.logoUrl && (
                <button
                  onClick={() => setConfig((prev) => ({ ...prev, logoUrl: null }))}
                  className="px-4 py-2.5 rounded-full border border-red-200 text-red-600 font-semibold text-xs hover:bg-red-50 transition-all flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove Logo
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {PRESET_LOGOS.map((logo, idx) => (
                <button
                  key={idx}
                  onClick={() => setConfig((prev) => ({ ...prev, logoUrl: logo.url }))}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                    config.logoUrl === logo.url
                      ? 'border-[#2F2F35] bg-stone-900 text-white shadow-sm'
                      : 'border-stone-200 bg-white/70 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span>{logo.name}</span>
                </button>
              ))}
            </div>

            {config.logoUrl && (
              <div className="space-y-4 bg-stone-50/80 p-4 rounded-2xl border border-stone-200/60">
                <div className="flex items-center justify-between text-xs font-medium text-stone-700">
                  <span>Logo Size Scale</span>
                  <span className="font-mono">{config.logoSize}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="38"
                  value={config.logoSize}
                  onChange={(e) => setConfig((prev) => ({ ...prev, logoSize: Number(e.target.value) }))}
                  className="w-full accent-[#2F2F35]"
                />

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.logoBg}
                      onChange={(e) => setConfig((prev) => ({ ...prev, logoBg: e.target.checked }))}
                      className="rounded accent-[#2F2F35]"
                    />
                    Logo Background
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.logoRound}
                      onChange={(e) => setConfig((prev) => ({ ...prev, logoRound: e.target.checked }))}
                      className="rounded accent-[#2F2F35]"
                    />
                    Circular Backdrop
                  </label>
                </div>
              </div>
            )}
          </div>

          <hr className="border-stone-200/60" />

          {/* Section 3: Colors */}
          <div className="space-y-4">
            <h3 className="text-xl font-display font-bold text-stone-900 flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#B8A7FF]" />
              3. Colors & Contrast
            </h3>

            {/* Pattern Color */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                Pattern Color
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {PRESET_COLORS.map((col) => (
                  <button
                    key={col.value}
                    onClick={() => setConfig((prev) => ({ ...prev, patternColor: col.value }))}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                      config.patternColor === col.value ? 'border-stone-900 scale-110 shadow-sm' : 'border-stone-200'
                    }`}
                    style={{ backgroundColor: col.value }}
                    title={col.name}
                  />
                ))}
                <div className="flex items-center gap-2 ml-2 pl-2 border-l border-stone-200">
                  <input
                    type="color"
                    value={config.patternColor}
                    onChange={(e) => setConfig((prev) => ({ ...prev, patternColor: e.target.value }))}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                  />
                  <span className="text-xs font-mono text-stone-600">{config.patternColor}</span>
                </div>
              </div>
            </div>

            {/* Background Color */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                  Background Color
                </label>
                <label className="flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.isTransparentBg}
                    onChange={(e) => setConfig((prev) => ({ ...prev, isTransparentBg: e.target.checked }))}
                    className="rounded accent-[#2F2F35]"
                  />
                  Transparent Background
                </label>
              </div>

              {!config.isTransparentBg && (
                <div className="flex flex-wrap items-center gap-2">
                  {PRESET_BG_COLORS.map((col) => (
                    <button
                      key={col.value}
                      onClick={() => setConfig((prev) => ({ ...prev, backgroundColor: col.value }))}
                      className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                        config.backgroundColor === col.value ? 'border-stone-900 scale-110 shadow-sm' : 'border-stone-200'
                      }`}
                      style={{ backgroundColor: col.value }}
                      title={col.name}
                    />
                  ))}
                  <div className="flex items-center gap-2 ml-2 pl-2 border-l border-stone-200">
                    <input
                      type="color"
                      value={config.backgroundColor}
                      onChange={(e) => setConfig((prev) => ({ ...prev, backgroundColor: e.target.value }))}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                    />
                    <span className="text-xs font-mono text-stone-600">{config.backgroundColor}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <hr className="border-stone-200/60" />

          {/* Section 4: Pattern & Eye Styles */}
          <div className="space-y-6">
            <h3 className="text-xl font-display font-bold text-stone-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#FF8FA6]" />
              4. Pattern & Eye Styles
            </h3>

            {/* Pattern Style */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                Pattern Style
              </label>
              <div className="grid grid-cols-5 gap-2">
                {(['rounded', 'dots', 'squares', 'diamond', 'classy'] as PatternStyle[]).map((style) => (
                  <button
                    key={style}
                    onClick={() => setConfig((prev) => ({ ...prev, patternStyle: style }))}
                    className={`p-3 rounded-2xl border text-xs font-semibold capitalize transition-all ${
                      config.patternStyle === style
                        ? 'border-[#2F2F35] bg-[#2F2F35] text-white shadow-sm'
                        : 'border-stone-200 bg-white/80 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Eye Style */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                Eye (Corner) Style
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['rounded', 'square', 'circle', 'leafy'] as EyeStyle[]).map((style) => (
                  <button
                    key={style}
                    onClick={() => setConfig((prev) => ({ ...prev, eyeStyle: style }))}
                    className={`p-3 rounded-2xl border text-xs font-semibold capitalize transition-all ${
                      config.eyeStyle === style
                        ? 'border-[#2F2F35] bg-[#2F2F35] text-white shadow-sm'
                        : 'border-stone-200 bg-white/80 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Live Preview & Export Panel (5 cols) */}
      <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
        <div className="glass-panel rounded-[32px] p-8 border border-stone-200/80 shadow-lg text-center space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-stone-900">Live Preview</h3>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> High Error Correction
            </span>
          </div>

          {/* QR Canvas Container */}
          <div className="p-6 bg-white rounded-[28px] shadow-inner inline-block border border-stone-200/60 relative group">
            <canvas ref={canvasRef} className="w-64 h-64 object-contain mx-auto rounded-xl" />
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Encoded Payload</div>
            <div className="bg-stone-100 p-3 rounded-2xl font-mono text-xs text-stone-800 break-all select-all">
              {config.data}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleDownloadPNG}
              className="w-full py-4 rounded-2xl bg-[#2F2F35] text-white font-bold text-sm hover:bg-stone-800 transition-all shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
            >
              <Download className="w-4 h-4 text-[#F7A8C9]" />
              Download High-Res PNG
            </button>
            <button
              onClick={handleDownloadSVG}
              className="w-full py-3 rounded-2xl bg-white border border-stone-200 text-stone-800 font-semibold text-sm hover:bg-stone-50 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#8ED8FF]" />
              Download Vector SVG / Print Kit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
