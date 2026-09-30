import React, { useState } from 'react';
import { ShortLink } from '../types';
import { Link2, Plus, Copy, Check, ExternalLink, Trash2, QrCode, Shield, BarChart2 } from 'lucide-react';

interface ShortLinksManagerProps {
  shortLinks: ShortLink[];
  onAddShortLink: (link: Omit<ShortLink, 'id' | 'clicks' | 'createdAt'>) => void;
  onDeleteShortLink: (id: string) => void;
  onUseForQR: (destinationUrl: string, slug: string) => void;
}

export const ShortLinksManager: React.FC<ShortLinksManagerProps> = ({
  shortLinks,
  onAddShortLink,
  onDeleteShortLink,
  onUseForQR,
}) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destinationUrl) return;

    const generatedSlug =
      slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-') ||
      Math.random().toString(36).substring(2, 8);

    onAddShortLink({
      title: title.trim() || 'SharePoint Document',
      slug: generatedSlug,
      destinationUrl: destinationUrl.trim(),
    });

    setTitle('');
    setSlug('');
    setDestinationUrl('');
    setShowAddModal(false);
  };

  const handleCopy = (link: ShortLink) => {
    const fullUrl = `${window.location.origin}/r/${link.slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel rounded-[28px] p-8 border border-stone-200/80">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8ED8FF]/30 text-stone-900 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            SharePoint Domain Masking
          </div>
          <h1 className="text-3xl font-display font-bold text-stone-900">Branded Short Links</h1>
          <p className="text-stone-600 text-sm">
            Replace long <code className="text-xs bg-stone-100 px-1.5 py-0.5 rounded font-mono">sharepoint.com</code> URLs with clean custom domains like <code className="text-xs bg-pink-100 text-pink-800 px-1.5 py-0.5 rounded font-mono">rive.ai/r/your-slug</code>.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 rounded-full bg-[#2F2F35] text-white font-semibold text-sm hover:bg-stone-800 transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-4 h-4 text-[#F7A8C9]" />
          Create New Short Link
        </button>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-lg w-full shadow-2xl border border-stone-200 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-display font-bold text-stone-900">Create Branded Short Link</h3>
                <p className="text-xs text-stone-500">Mask any SharePoint or cloud document URL</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Document / Title Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2026 Summer Collection PDF"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F7A8C9]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Custom Slug (e.g. rive.ai/r/slug)
                </label>
                <div className="flex items-center rounded-2xl border border-stone-200 overflow-hidden bg-stone-50 focus-within:ring-2 focus-within:ring-[#F7A8C9]">
                  <span className="pl-4 pr-1 text-xs text-stone-400 font-mono">rive.ai/r/</span>
                  <input
                    type="text"
                    placeholder="summer-catalog"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full py-3 pr-4 bg-transparent text-sm focus:outline-none font-mono text-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  SharePoint Destination URL <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="https://mycompany-my.sharepoint.com/:b:/g/personal/..."
                  value={destinationUrl}
                  onChange={(e) => setDestinationUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F7A8C9] font-mono text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-full border border-stone-200 text-stone-700 text-sm font-semibold hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#2F2F35] text-white text-sm font-semibold hover:bg-stone-800 shadow-sm"
                >
                  Save Short Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List of Links */}
      {shortLinks.length === 0 ? (
        <div className="glass-panel rounded-[32px] p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-[#8ED8FF]/20 text-stone-800 flex items-center justify-center mx-auto">
            <Link2 className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-xl font-display font-bold text-stone-900">No Branded Short Links Created Yet</h3>
          <p className="text-stone-500 text-sm max-w-md mx-auto">
            Create your first short link to mask your SharePoint URLs and make your QR code camera previews look pristine.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 rounded-full bg-[#2F2F35] text-white font-semibold text-sm hover:bg-stone-800 transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-[#F7A8C9]" />
            Create First Short Link
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {shortLinks.map((link) => {
            const shortUrl = `${window.location.origin}/r/${link.slug}`;
            return (
              <div
                key={link.id}
                className="glass-panel rounded-[24px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-stone-200/80 hover:shadow-md transition-all"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h4 className="font-display font-bold text-lg text-stone-900 truncate">{link.title}</h4>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                      <BarChart2 className="w-3 h-3" />
                      {link.clicks || 0} scans
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#2F2F35] bg-stone-100/80 px-3 py-1.5 rounded-xl w-fit">
                    <span className="text-[#F7A8C9] font-bold">rive.ai/r/</span>
                    <span className="font-bold text-stone-800">{link.slug}</span>
                    <button
                      onClick={() => handleCopy(link)}
                      className="ml-2 text-stone-400 hover:text-stone-700 transition-colors"
                      title="Copy short link"
                    >
                      {copiedId === link.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-xs text-stone-500 truncate pt-1">
                    <strong className="text-stone-700">Points to SharePoint:</strong> {link.destinationUrl}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <a
                    href={`/r/${link.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs flex items-center gap-1.5 transition-all"
                    title="Test redirect page"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Test Redirect
                  </a>
                  <button
                    onClick={() => onUseForQR(shortUrl, link.title)}
                    className="px-4 py-2 rounded-xl bg-[#F7A8C9]/30 hover:bg-[#F7A8C9]/50 text-stone-900 font-semibold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    Generate QR
                  </button>
                  <button
                    onClick={() => onDeleteShortLink(link.id)}
                    className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-all"
                    title="Delete link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
