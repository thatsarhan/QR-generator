import React from 'react';
import { ShieldCheck, ArrowRight, Smartphone, Link, CheckCircle2, AlertCircle, Sparkles, ExternalLink } from 'lucide-react';

interface SharePointGuideProps {
  onSwitchToShortlinks: () => void;
  onSwitchToGenerator: () => void;
}

export const SharePointGuide: React.FC<SharePointGuideProps> = ({
  onSwitchToShortlinks,
  onSwitchToGenerator,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      {/* Hero Banner */}
      <div className="rounded-[32px] bg-gradient-to-br from-[#F7A8C9]/30 via-[#8ED8FF]/20 to-[#B8A7FF]/30 p-8 md:p-12 border border-white/60 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-gradient-to-br from-[#F7A8C9]/20 to-transparent blur-3xl pointer-events-none"></div>
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-stone-200/80 text-xs font-semibold text-stone-800 backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4 text-[#F7A8C9]" />
            SharePoint Camera Scan Solution
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-[#2F2F35] tracking-tight">
            How to make your QR code display <span className="text-transparent bg-clip-text bg-gradient-to-r from-stone-900 to-[#F7A8C9]">rive.ai</span> instead of SharePoint
          </h1>
          <p className="text-stone-600 text-base md:text-lg leading-relaxed">
            When you encode a raw SharePoint URL directly into a QR code, phone cameras instantly display the long, unreadable <code className="bg-white/70 px-2 py-0.5 rounded text-sm font-mono text-stone-800">yourcompany.sharepoint.com/...</code> domain. Here is the professional workaround used by top brands.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={onSwitchToShortlinks}
              className="px-6 py-3 rounded-full bg-[#2F2F35] text-white font-semibold text-sm hover:bg-stone-800 transition-all shadow-md flex items-center gap-2"
            >
              Create Branded Short Link
              <ArrowRight className="w-4 h-4 text-[#F7A8C9]" />
            </button>
            <button
              onClick={onSwitchToGenerator}
              className="px-6 py-3 rounded-full bg-white/80 border border-stone-200 text-stone-800 font-semibold text-sm hover:bg-white transition-all shadow-sm"
            >
              Design Custom QR Code
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* The Problem */}
        <div className="glass-panel rounded-[28px] p-8 border border-red-100 bg-gradient-to-b from-white to-red-50/30 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-stone-900">The Problem: Raw SharePoint Link</h3>
              <p className="text-xs text-stone-500">What users see when scanning a direct PDF link</p>
            </div>
          </div>

          <div className="bg-stone-900 text-stone-200 p-4 rounded-2xl font-mono text-xs space-y-2 shadow-inner">
            <div className="text-stone-400 text-[10px] uppercase tracking-wider">// Scanned URL Payload</div>
            <div className="text-red-400 break-all">
              https://mycompany-my.sharepoint.com/:b:/g/personal/arhan_rive_ai/EQv..._long_random_tokens
            </div>
          </div>

          <ul className="space-y-3 text-sm text-stone-600">
            <li className="flex items-start gap-2.5">
              <span className="text-red-500 font-bold mt-0.5">✕</span>
              <span>Camera preview banner shows unbranded <strong>sharepoint.com</strong> domain.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-red-500 font-bold mt-0.5">✕</span>
              <span>Looks untrustworthy or cluttered to customers and partners scanning your flyers or packaging.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-red-500 font-bold mt-0.5">✕</span>
              <span>If your SharePoint file link ever changes, the QR code is permanently broken.</span>
            </li>
          </ul>
        </div>

        {/* The Solution */}
        <div className="glass-panel rounded-[28px] p-8 border border-[#F7A8C9]/40 bg-gradient-to-b from-white to-pink-50/30 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F7A8C9]/30 text-[#2F2F35] flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-stone-900">The Solution: Branded Masking</h3>
              <p className="text-xs text-stone-500">What users see with Rive QR Studio short links</p>
            </div>
          </div>

          <div className="bg-[#2F2F35] text-stone-200 p-4 rounded-2xl font-mono text-xs space-y-2 shadow-inner">
            <div className="text-[#8ED8FF] text-[10px] uppercase tracking-wider">// Branded Short Link Payload</div>
            <div className="text-[#F7A8C9] font-bold text-sm">
              https://rive.ai/r/catalog-2026
            </div>
          </div>

          <ul className="space-y-3 text-sm text-stone-600">
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-500 font-bold mt-0.5">✓</span>
              <span>Camera banner displays clean <strong>rive.ai/r/catalog-2026</strong>.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-500 font-bold mt-0.5">✓</span>
              <span>Instantly redirects visitors seamlessly to your SharePoint PDF document.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-500 font-bold mt-0.5">✓</span>
              <span>Update the underlying SharePoint URL anytime without re-printing your QR codes!</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Step-by-Step Instructions */}
      <div className="glass-panel rounded-[32px] p-8 md:p-10 space-y-8">
        <h3 className="text-2xl font-display font-bold text-stone-900">How to set this up in 3 easy steps</h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/80 rounded-2xl p-6 border border-stone-200/80 space-y-4 shadow-sm relative">
            <div className="w-8 h-8 rounded-full bg-[#8ED8FF]/30 text-stone-900 font-bold flex items-center justify-center text-sm">
              1
            </div>
            <h4 className="font-display font-bold text-lg text-stone-900">Copy SharePoint Link</h4>
            <p className="text-stone-600 text-sm leading-relaxed">
              Open your document in Microsoft SharePoint, click <strong>Share</strong> → <strong>Copy Link</strong> with permissions set to "Anyone with the link can view".
            </p>
          </div>

          <div className="bg-white/80 rounded-2xl p-6 border border-stone-200/80 space-y-4 shadow-sm relative">
            <div className="w-8 h-8 rounded-full bg-[#F7A8C9]/30 text-stone-900 font-bold flex items-center justify-center text-sm">
              2
            </div>
            <h4 className="font-display font-bold text-lg text-stone-900">Create Branded Slug</h4>
            <p className="text-stone-600 text-sm leading-relaxed">
              Go to our <strong>SharePoint Masking</strong> tab, paste your SharePoint URL, and choose your custom slug (e.g. <code className="text-xs bg-stone-100 p-1 rounded font-mono">rive.ai/r/my-pdf</code>).
            </p>
          </div>

          <div className="bg-white/80 rounded-2xl p-6 border border-stone-200/80 space-y-4 shadow-sm relative">
            <div className="w-8 h-8 rounded-full bg-[#B8A7FF]/30 text-stone-900 font-bold flex items-center justify-center text-sm">
              3
            </div>
            <h4 className="font-display font-bold text-lg text-stone-900">Generate QR & Print</h4>
            <p className="text-stone-600 text-sm leading-relaxed">
              Generate your custom QR code with colors and your brand logo in the <strong>QR Studio</strong>. Download high-res PNG/SVG and you're ready!
            </p>
          </div>
        </div>

        <div className="pt-4 flex justify-center">
          <button
            onClick={onSwitchToShortlinks}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#F7A8C9] to-[#8ED8FF] text-stone-900 font-bold text-sm shadow-md hover:opacity-95 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Get Started with SharePoint Masking Now
          </button>
        </div>
      </div>
    </div>
  );
};
