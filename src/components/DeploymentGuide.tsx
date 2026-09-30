import React from 'react';
import { Globe, ShieldCheck, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';

export const DeploymentGuide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Hero */}
      <div className="rounded-[32px] bg-gradient-to-br from-[#0E3415] to-[#194d24] text-white p-8 md:p-12 shadow-xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-[#A8F2D3]">
          <Globe className="w-4 h-4" />
          Custom Domain & DNS Setup Guide
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight">
          Connecting <span className="text-[#A8F2D3]">go.rive.ai</span> to Rive QR Studio
        </h1>
        <p className="text-stone-200 text-base md:text-lg leading-relaxed max-w-2xl">
          Follow these step-by-step deployment and DNS instructions to ensure your QR code camera scans proudly display <code className="bg-white/10 px-2 py-0.5 rounded font-mono text-[#A8F2D3]">go.rive.ai</code> instead of SharePoint or hosting domains.
        </p>
      </div>

      {/* Step 1: DNS Setup */}
      <div className="glass-panel rounded-[28px] p-8 border border-stone-200/80 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0E3415] text-[#A8F2D3] flex items-center justify-center font-bold font-mono">
            01
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-[#0E3415]">Configure DNS CNAME / A Records</h3>
            <p className="text-xs text-stone-500">Point your custom domain to your hosting server</p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-stone-700 leading-relaxed">
          <p>
            Log in to your domain registrar (Cloudflare, GoDaddy, Vercel, or Netlify DNS) where <code className="font-mono text-stone-900 bg-stone-100 px-1 py-0.5 rounded">rive.ai</code> is managed, and add a CNAME record:
          </p>

          <div className="bg-[#0E3415] text-[#A8F2D3] p-4 rounded-2xl font-mono text-xs space-y-2 overflow-x-auto shadow-inner">
            <div className="text-stone-300">// DNS Record Configuration</div>
            <div>Type: <span className="text-white font-bold">CNAME</span></div>
            <div>Name / Host: <span className="text-white font-bold">go</span> (results in go.rive.ai)</div>
            <div>Target / Value: <span className="text-white font-bold">your-cloud-run-url.run.app</span> (or Vercel / Netlify deployment URL)</div>
            <div>Proxy status: <span className="text-white font-bold">Proxied (Cloudflare Orange Cloud enabled)</span></div>
          </div>
        </div>
      </div>

      {/* Step 2: SharePoint Sharing Setting */}
      <div className="glass-panel rounded-[28px] p-8 border border-stone-200/80 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0E3415] text-[#A8F2D3] flex items-center justify-center font-bold font-mono">
            02
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-[#0E3415]">Important SharePoint Sharing Permission</h3>
            <p className="text-xs text-stone-500">Prevent Microsoft login walls when visitors scan your QR</p>
          </div>
        </div>

        <div className="space-y-3 text-sm text-stone-700 leading-relaxed">
          <p>
            When generating a short link pointing to a SharePoint PDF, ensure the SharePoint file permissions are set correctly:
          </p>
          <ul className="space-y-2 pl-4">
            <li className="flex items-start gap-2">
              <span className="text-[#0E3415] font-bold">✓</span>
              <span>In SharePoint, click <strong>Share</strong> → Link settings → Select <strong>"Anyone with the link can view"</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0E3415] font-bold">✓</span>
              <span>Do not restrict access to specific company internal users only, unless your QR code is strictly for internal staff.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Step 3: Redirect Architecture */}
      <div className="glass-panel rounded-[28px] p-8 border border-stone-200/80 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0E3415] text-[#A8F2D3] flex items-center justify-center font-bold font-mono">
            03
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-[#0E3415]">How the 302 Redirect Works</h3>
            <p className="text-xs text-stone-500">Backend routing and analytics</p>
          </div>
        </div>

        <p className="text-sm text-stone-700 leading-relaxed">
          When a user scans your QR code, their phone loads <code className="font-mono text-stone-900 bg-stone-100 px-1 py-0.5 rounded">https://go.rive.ai/r/brochure</code>. Our Node/Express backend router catches the request, increments the scan counter, and returns an **HTTP 302 Redirect** pointing instantly to your SharePoint PDF destination. You can update the SharePoint destination URL anytime in the <strong>My Short Links</strong> tab without ever needing to re-print your QR codes!
        </p>
      </div>
    </div>
  );
};
