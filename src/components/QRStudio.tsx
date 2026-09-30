import React, { useState, useEffect, useRef } from 'react';
import { QRConfig, PatternStyle, EyeStyle, ErrorCorrectionLevel, QRTemplate, ShortLink } from '../types';
import { generateQRCodeCanvas } from '../utils/qrHelper';
import { 
  Download, Sparkles, Globe, Upload, Trash2, Sliders, Palette, 
  Image as ImageIcon, CheckCircle2, Bookmark, Check, AlertTriangle
} from 'lucide-react';

interface QRStudioProps {
  initialData?: string;
  initialTitle?: string;
  shortLinks: ShortLink[];
}

const PRESET_DOMAINS = [
  { name: 'rivelabs.ai (Recommended)', value: 'https://rivelabs.ai' },
  { name: 'rivelabs.com', value: 'https://rivelabs.com' },
  { name: 'go.rive.ai', value: 'https://go.rive.ai' },
  { name: 'Custom Local', value: window.location.origin },
];

const PRESET_COLORS = [
  { name: 'Rive Green', value: '#0E3415' },
  { name: 'Deep Forest', value: '#194d24' },
  { name: 'Charcoal', value: '#2F2F35' },
  { name: 'Navy', value: '#1e3a8a' },
  { name: 'Burgundy', value: '#7f1d1d' },
  { name: 'Gold', value: '#b45309' },
  { name: 'Pure Black', value: '#000000' },
];

const PRESET_BG_COLORS = [
  { name: 'Pure White', value: '#FFFFFF' },
  { name: 'Warm Cream', value: '#FFF9F6' },
  { name: 'Light Mint', value: '#f0fdf4' },
  { name: 'Soft Gray', value: '#f3f4f6' },
  { name: 'Dark Slate', value: '#111827' },
];

const PRESET_LOGOS = [
  { name: 'PDF Document', url: 'https://api.iconify.design/lucide:file-text.svg?color=%230E3415' },
  { name: 'Rive Leaf', url: 'https://api.iconify.design/lucide:leaf.svg?color=%230E3415' },
  { name: 'Globe / Web', url: 'https://api.iconify.design/lucide:globe.svg?color=%230E3415' },
  { name: 'Star Sparkle', url: 'https://api.iconify.design/lucide:sparkles.svg?color=%230E3415' },
];

export const QRStudio: React.FC<QRStudioProps> = ({ initialData, initialTitle, shortLinks }) => {
  const [shortDomain, setShortDomain] = useState<string>('https://rivelabs.ai');

  const [config, setConfig] = useState<QRConfig>(() => {
    const saved = localStorage.getItem('rive_qr_config_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (initialData) parsed.data = initialData;
        if (initialTitle) parsed.name = initialTitle;
        return parsed;
      } catch (e) {
        // fallback
      }
    }
    return {
      id: '1',
      name: initialTitle || 'Summer Brochure QR',
      type: 'url',
      data: initialData || `https://rivelabs.ai/r/brochure`,
      encodeDirectly: false,
      patternColor: '#0E3415',
      eyeOuterColor: '#0E3415',
      eyeInnerColor: '#0E3415',
      isEyesLinked: true,
      backgroundColor: '#FFFFFF',
      isTransparentBg: false,
      patternStyle: 'rounded',
      eyeStyle: 'rounded',
      errorCorrectionLevel: 'M',
      logoUrl: PRESET_LOGOS[0].url,
      logoSize: 24,
      logoBg: true,
      logoRound: true,
      createdAt: Date.now(),
    };
  });

  const [templates, setTemplates] = useState<QRTemplate[]>(() => {
    const saved = localStorage.getItem('rive_qr_templates');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Classic Green', config: { patternColor: '#0E3415', patternStyle: 'rounded', eyeStyle: 'rounded' } },
      { id: '2', name: 'Modern Minimal', config: { patternColor: '#2F2F35', patternStyle: 'extra-rounded', eyeStyle: 'circle' } }
    ];
  });

  const [templateName, setTemplateName] = useState('');
  const [exportSize, setExportSize] = useState<number>(512);
  const [savedMsg, setSavedMsg] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    localStorage.setItem('rive_qr_config_v3', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('rive_qr_templates', JSON.stringify(templates));
  }, [templates]);

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
      generateQRCodeCanvas(canvasRef.current, config, exportSize);
    }
  }, [config, exportSize]);

  const handleSaveTemplate = () => {
    if (!templateName.trim()) return;
    const newTpl: QRTemplate = {
      id: Math.random().toString(36).substring(2, 8),
      name: templateName.trim(),
      config: {
        patternColor: config.patternColor,
        eyeOuterColor: config.eyeOuterColor,
        eyeInnerColor: config.eyeInnerColor,
        isEyesLinked: config.isEyesLinked,
        patternStyle: config.patternStyle,
        eyeStyle: config.eyeStyle,
        logoBg: config.logoBg,
        logoRound: config.logoRound,
      }
    };
    setTemplates((prev) => [newTpl, ...prev]);
    setTemplateName('');
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  const handleApplyTemplate = (tpl: QRTemplate) => {
    setConfig((prev) => ({ ...prev, ...tpl.config }));
  };

  const handleDownloadPNG = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${exportSize}px.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
      setConfig((prev) => ({ ...prev, logoUrl: uploadEvent.target?.result as string, logoSize: 24 }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Controls (7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        <div className="glass-panel rounded-[32px] p-6 md:p-8 border border-stone-200/80 space-y-8 shadow-sm">
          
          {/* Section 1: Domain & Short Link Selection */}
          <div className="space-y-4 bg-gradient-to-br from-white via-stone-50/50 to-emerald-50/20 p-6 rounded-[24px] border border-stone-200/80">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-display font-bold text-[#0E3415] flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#0E3415]" />
                1. Short Domain & Camera Display Name
              </h3>
              <span className="text-xs bg-[#0E3415]/10 text-[#0E3415] font-semibold px-2.5 py-0.5 rounded-full">
                Shows rivelabs.ai
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Phone cameras display the root domain + extension (stripping subdomains like <code className="font-mono text-stone-500">rivelabs-my.sharepoint.com</code> down to <code className="font-mono text-stone-500">sharepoint.com</code>). Select <strong className="text-[#0E3415]">rivelabs.ai</strong> so your camera scans display your exact brand name!
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                  Target Short Domain Prefix
                </label>
                <select
                  value={shortDomain}
                  onChange={(e) => {
                    const newDom = e.target.value;
                    setShortDomain(newDom);
                    // update current data slug path if it starts with a short url
                    const match = config.data.match(/\/r\/([a-z0-9-_]+)$/i);
                    if (match && match[1]) {
                      setConfig((prev) => ({ ...prev, data: `${newDom}/r/${match[1]}` }));
                    }
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-[#0E3415]"
                >
                  {PRESET_DOMAINS.map((dom) => (
                    <option key={dom.value} value={dom.value}>
                      {dom.name}
                    </option>
                  ))}
                </select>
              </div>

              {shortLinks.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                    Select from My Short Links
                  </label>
                  <select
                    onChange={(e) => {
                      if (!e.target.value) return;
                      const fullUrl = `${shortDomain}/r/${e.target.value}`;
                      setConfig((prev) => ({ ...prev, data: fullUrl, encodeDirectly: false }));
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-[#0E3415]"
                  >
                    <option value="">-- Choose existing short link --</option>
                    {shortLinks.map((l) => (
                      <option key={l.id} value={l.slug}>
                        {shortDomain}/r/{l.slug} → {l.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                  Encoded QR Payload URL
                </label>
                <input
                  type="text"
                  value={config.data}
                  onChange={(e) => setConfig((prev) => ({ ...prev, data: e.target.value }))}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#0E3415] bg-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="directEncode"
                  checked={config.encodeDirectly}
                  onChange={(e) => setConfig((prev) => ({ ...prev, encodeDirectly: e.target.checked }))}
                  className="rounded accent-[#0E3415]"
                />
                <label htmlFor="directEncode" className="text-xs text-stone-700 cursor-pointer font-medium">
                  Encode destination directly (skip redirect / no short link)
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: Logo Customization */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-display font-bold text-[#0E3415] flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#0E3415]" />
                2. Brand Logo & Error Correction
              </h3>
              {config.logoUrl && (
                <span className="text-xs bg-amber-50 text-amber-800 font-semibold px-2.5 py-0.5 rounded-full border border-amber-200">
                  Error Correction Forced to [H]
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="px-5 py-2.5 rounded-full bg-[#0E3415] text-white font-semibold text-xs hover:bg-[#154c1f] transition-all cursor-pointer flex items-center gap-2 shadow-sm">
                <Upload className="w-3.5 h-3.5 text-[#A8F2D3]" />
                Upload Logo (PNG/JPG/SVG)
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
                      ? 'border-[#0E3415] bg-[#0E3415] text-white shadow-sm'
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
                  <span>Logo Size (Capped at 25% for scan reliability)</span>
                  <span className="font-mono">{config.logoSize}%</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="28"
                  value={config.logoSize}
                  onChange={(e) => setConfig((prev) => ({ ...prev, logoSize: Number(e.target.value) }))}
                  className="w-full accent-[#0E3415]"
                />

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.logoBg}
                      onChange={(e) => setConfig((prev) => ({ ...prev, logoBg: e.target.checked }))}
                      className="rounded accent-[#0E3415]"
                    />
                    Rounded White Plate Behind Logo
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.logoRound}
                      onChange={(e) => setConfig((prev) => ({ ...prev, logoRound: e.target.checked }))}
                      className="rounded accent-[#0E3415]"
                    />
                    Circular Plate
                  </label>
                </div>
              </div>
            )}
          </div>

          <hr className="border-stone-200/60" />

          {/* Section 3: Colors */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-display font-bold text-[#0E3415] flex items-center gap-2">
                <Palette className="w-5 h-5 text-[#0E3415]" />
                3. Colors & Contrast
              </h3>
              <label className="flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.isEyesLinked}
                  onChange={(e) => setConfig((prev) => ({ 
                    ...prev, 
                    isEyesLinked: e.target.checked,
                    eyeOuterColor: e.target.checked ? prev.patternColor : prev.eyeOuterColor,
                    eyeInnerColor: e.target.checked ? prev.patternColor : prev.eyeInnerColor
                  }))}
                  className="rounded accent-[#0E3415]"
                />
                Match Corner Eyes to Pattern
              </label>
            </div>

            {/* Pattern Color */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                Foreground Pattern Color
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {PRESET_COLORS.map((col) => (
                  <button
                    key={col.value}
                    onClick={() => setConfig((prev) => ({ 
                      ...prev, 
                      patternColor: col.value,
                      eyeOuterColor: prev.isEyesLinked ? col.value : prev.eyeOuterColor,
                      eyeInnerColor: prev.isEyesLinked ? col.value : prev.eyeInnerColor
                    }))}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                      config.patternColor === col.value ? 'border-[#0E3415] scale-110 shadow-sm' : 'border-stone-200'
                    }`}
                    style={{ backgroundColor: col.value }}
                    title={col.name}
                  />
                ))}
                <div className="flex items-center gap-2 ml-2 pl-2 border-l border-stone-200">
                  <input
                    type="color"
                    value={config.patternColor}
                    onChange={(e) => {
                      const val = e.target.value;
                      setConfig((prev) => ({ 
                        ...prev, 
                        patternColor: val,
                        eyeOuterColor: prev.isEyesLinked ? val : prev.eyeOuterColor,
                        eyeInnerColor: prev.isEyesLinked ? val : prev.eyeInnerColor
                      }));
                    }}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                  />
                  <span className="text-xs font-mono text-stone-600">{config.patternColor}</span>
                </div>
              </div>
            </div>

            {/* Separate Corner Eye Colors if Unlinked */}
            {!config.isEyesLinked && (
              <div className="space-y-3 pt-2 bg-stone-50 p-4 rounded-2xl border border-stone-200 animate-in fade-in duration-200">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                    Corner Eye Outer Frame Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.eyeOuterColor}
                      onChange={(e) => setConfig((prev) => ({ ...prev, eyeOuterColor: e.target.value }))}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                    />
                    <span className="text-xs font-mono text-stone-600">{config.eyeOuterColor}</span>
                  </div>
                </div>
                <div className="space-y-2 pt-2 border-t border-stone-200">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                    Corner Eye Inner Dot Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.eyeInnerColor}
                      onChange={(e) => setConfig((prev) => ({ ...prev, eyeInnerColor: e.target.value }))}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                    />
                    <span className="text-xs font-mono text-stone-600">{config.eyeInnerColor}</span>
                  </div>
                </div>
              </div>
            )}

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
                    className="rounded accent-[#0E3415]"
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
                        config.backgroundColor === col.value ? 'border-[#0E3415] scale-110 shadow-sm' : 'border-stone-200'
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

            {/* Contrast Warning Check */}
            {!config.isTransparentBg && config.backgroundColor === '#FFFFFF' && config.patternColor === '#FFFFFF' && (
              <div className="p-3 bg-red-50 rounded-xl border border-red-200 flex items-center gap-2 text-xs text-red-700">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                Warning: Foreground and background colors are both white. Low contrast prevents reliable scanning.
              </div>
            )}
          </div>

          <hr className="border-stone-200/60" />

          {/* Section 4: Dot & Eye Styles */}
          <div className="space-y-6">
            <h3 className="text-xl font-display font-bold text-[#0E3415] flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#0E3415]" />
              4. Dot & Eye Shapes
            </h3>

            {/* Pattern Style */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                Dot Style
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['rounded', 'extra-rounded', 'dots', 'squares', 'diamond', 'classy'] as PatternStyle[]).map((style) => (
                  <button
                    key={style}
                    onClick={() => setConfig((prev) => ({ ...prev, patternStyle: style }))}
                    className={`p-3 rounded-2xl border text-xs font-semibold capitalize transition-all ${
                      config.patternStyle === style
                        ? 'border-[#0E3415] bg-[#0E3415] text-white shadow-sm'
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
                Corner Eye Style
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['rounded', 'square', 'circle'] as EyeStyle[]).map((style) => (
                  <button
                    key={style}
                    onClick={() => setConfig((prev) => ({ ...prev, eyeStyle: style }))}
                    className={`p-3 rounded-2xl border text-xs font-semibold capitalize transition-all ${
                      config.eyeStyle === style
                        ? 'border-[#0E3415] bg-[#0E3415] text-white shadow-sm'
                        : 'border-stone-200 bg-white/80 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Correction Level */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                Error Correction Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['L', 'M', 'Q', 'H'] as ErrorCorrectionLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    disabled={Boolean(config.logoUrl)}
                    onClick={() => setConfig((prev) => ({ ...prev, errorCorrectionLevel: lvl }))}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      config.errorCorrectionLevel === lvl || config.logoUrl
                        ? 'border-[#0E3415] bg-[#0E3415] text-white shadow-sm'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {lvl} {lvl === 'H' && '(High)'}
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
            <h3 className="font-display font-bold text-lg text-[#0E3415]">Live Preview</h3>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> EC: {config.logoUrl ? 'H (Forced)' : config.errorCorrectionLevel}
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
            <p className="text-[11px] text-emerald-700 font-medium pt-1">
              📷 Camera scan will cleanly display: <strong className="font-mono underline">{new URL(config.data).hostname}</strong>
            </p>
          </div>

          {/* Export Resolution Picker & Download */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs text-stone-600 font-semibold">
              <span>Export Resolution:</span>
              <div className="flex gap-2">
                {[512, 1024, 2048].map((res) => (
                  <button
                    key={res}
                    onClick={() => setExportSize(res)}
                    className={`px-3 py-1 rounded-lg border text-xs ${
                      exportSize === res ? 'bg-[#0E3415] text-white border-[#0E3415]' : 'bg-white text-stone-700 border-stone-200'
                    }`}
                  >
                    {res}px
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleDownloadPNG}
              className="w-full py-4 rounded-2xl bg-[#0E3415] text-white font-bold text-sm hover:bg-[#154c1f] transition-all shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
            >
              <Download className="w-4 h-4 text-[#A8F2D3]" />
              Download High-Res PNG ({exportSize}px)
            </button>

            {/* Template Save Section */}
            <div className="pt-2 border-t border-stone-200 space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Template Name (e.g. Green Brand)"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0E3415]"
                />
                <button
                  onClick={handleSaveTemplate}
                  className="px-4 py-2 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 whitespace-nowrap"
                >
                  Save Template
                </button>
              </div>

              {savedMsg && (
                <div className="text-xs text-emerald-600 font-semibold">Template saved successfully!</div>
              )}

              {templates.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[11px] text-stone-500 w-full text-left font-semibold">Saved Templates:</span>
                  {templates.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => handleApplyTemplate(tpl)}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium border border-stone-200"
                    >
                      {tpl.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
