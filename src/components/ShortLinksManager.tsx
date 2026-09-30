import React, { useState } from 'react';
import { ShortLink } from '../types';
import { Link2, Plus, Copy, Check, ExternalLink, Trash2, Edit3, QrCode, Shield, Sparkles } from 'lucide-react';

interface ShortLinksManagerProps {
  shortLinks: ShortLink[];
  onAddShortLink: (link: Omit<ShortLink, 'id' | 'scanCount' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  onUpdateShortLink: (id: string, destinationUrl: string, title: string) => void;
  onDeleteShortLink: (id: string) => void;
  onUseForQR: (shortUrl: string, title: string) => void;
}

export const ShortLinksManager: React.FC<ShortLinksManagerProps> = ({
  shortLinks,
  onAddShortLink,
  onUpdateShortLink,
  onDeleteShortLink,
  onUseForQR,
}) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLink, setEditingLink] = useState<ShortLink | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!destinationUrl) return;

    const cleanSlug =
      slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-') ||
      Math.random().toString(36).substring(2, 8);

    const success = await onAddShortLink({
      title: title.trim() || 'SharePoint Document',
      slug: cleanSlug,
      destinationUrl: destinationUrl.trim(),
    });

    if (success) {
      setTitle('');
      setSlug('');
      setDestinationUrl('');
      setShowAddModal(false);
    } else {
      setErrorMsg('This slug is already taken or invalid. Please choose another slug.');
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink) return;
    onUpdateShortLink(editingLink.id, editingLink.destinationUrl, editingLink.title);
    setEditingLink(null);
  };

  const handleCopy = (link: ShortLink) => {
    const fullUrl = `${window.location.origin}/r/${link.slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel rounded-[28px] p-8 border border-stone-200/80">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E3415]/15 text-[#0E3415] text-xs font-semibold">
            <Shield className="w-3.5 h-3.5 text-[#0E3415]" />
            Redirect Routing Service (go.rive.ai)
          </div>
          <h1 className="text-3xl font-display font-bold text-[#0E3415]">My Short Links</h1>
          <p className="text-stone-600 text-sm">
            Manage your branded redirect links. These short URLs ensure your QR codes display <code className="bg-stone-100 px-1.5 py-0.5 rounded font-mono text-stone-800">go.rive.ai</code> instead of SharePoint domains.
          </p>
        </div>
        <button
          onClick={() => {
            setErrorMsg('');
            setShowAddModal(true);
          }}
          className="px-6 py-3 rounded-full bg-[#0E3415] text-white font-semibold text-sm hover:bg-[#154c1f] transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-4 h-4 text-[#A8F2D3]" />
          Create New Short Link
        </button>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-lg w-full shadow-2xl border border-stone-200 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-display font-bold text-[#0E3415]">Create Branded Short Link</h3>
                <p className="text-xs text-stone-500">HTTP 302 Redirect to SharePoint or any URL</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Document / Title Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Summer Collection Brochure"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E3415]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Custom Slug (e.g. go.rive.ai/brochure)
                </label>
                <div className="flex items-center rounded-2xl border border-stone-200 overflow-hidden bg-stone-50 focus-within:ring-2 focus-within:ring-[#0E3415]">
                  <span className="pl-4 pr-1 text-xs text-stone-400 font-mono">go.rive.ai/r/</span>
                  <input
                    type="text"
                    placeholder="brochure (leave blank for random)"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full py-3 pr-4 bg-transparent text-sm focus:outline-none font-mono text-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Destination URL (SharePoint PDF) <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="https://rivelabs-my.sharepoint.com/:b:/g/personal/..."
                  value={destinationUrl}
                  onChange={(e) => setDestinationUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E3415] font-mono text-xs"
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
                  className="px-6 py-2.5 rounded-full bg-[#0E3415] text-white text-sm font-semibold hover:bg-[#154c1f] shadow-sm"
                >
                  Save Short Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-lg w-full shadow-2xl border border-stone-200 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-display font-bold text-[#0E3415]">Edit Destination URL</h3>
                <p className="text-xs text-stone-500">The QR code keeps working after edits</p>
              </div>
              <button
                onClick={() => setEditingLink(null)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  value={editingLink.title}
                  onChange={(e) => setEditingLink({ ...editingLink, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E3415]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Slug (Read-Only)
                </label>
                <input
                  type="text"
                  disabled
                  value={editingLink.slug}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm bg-stone-100 font-mono text-stone-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  New SharePoint Destination URL <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={editingLink.destinationUrl}
                  onChange={(e) => setEditingLink({ ...editingLink, destinationUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E3415] font-mono text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingLink(null)}
                  className="px-5 py-2.5 rounded-full border border-stone-200 text-stone-700 text-sm font-semibold hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#0E3415] text-white text-sm font-semibold hover:bg-[#154c1f] shadow-sm"
                >
                  Update Destination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* My Links Table */}
      {shortLinks.length === 0 ? (
        <div className="glass-panel rounded-[32px] p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-[#0E3415]/10 text-[#0E3415] flex items-center justify-center mx-auto">
            <Link2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-display font-bold text-[#0E3415]">No Short Links Created Yet</h3>
          <p className="text-stone-500 text-sm max-w-md mx-auto">
            Create your first branded redirect link to mask SharePoint URLs with go.rive.ai.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 rounded-full bg-[#0E3415] text-white font-semibold text-sm hover:bg-[#154c1f] transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-[#A8F2D3]" />
            Create First Short Link
          </button>
        </div>
      ) : (
        <div className="glass-panel rounded-[28px] overflow-hidden border border-stone-200/80 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/80 text-stone-600 text-xs uppercase tracking-wider">
                  <th className="py-3.5 px-6 font-semibold">Title & Slug</th>
                  <th className="py-3.5 px-6 font-semibold">SharePoint Destination</th>
                  <th className="py-3.5 px-6 font-semibold">Scan Count</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {shortLinks.map((link) => {
                  const shortUrl = `${window.location.origin}/r/${link.slug}`;
                  return (
                    <tr key={link.id} className="hover:bg-white/70 transition-colors">
                      <td className="py-4 px-6 font-medium text-stone-900">
                        <div className="font-bold text-[#0E3415]">{link.title}</div>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="font-mono text-xs text-stone-600">go.rive.ai/r/{link.slug}</span>
                          <button
                            onClick={() => handleCopy(link)}
                            className="text-stone-400 hover:text-stone-700 transition-colors"
                            title="Copy short link"
                          >
                            {copiedId === link.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-stone-500 max-w-xs truncate">
                        {link.destinationUrl}
                      </td>
                      <td className="py-4 px-6 font-bold text-stone-900 tabular-nums">
                        {link.scanCount || 0}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => onUseForQR(shortUrl, link.title)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#0E3415]/10 hover:bg-[#0E3415]/20 text-[#0E3415] font-semibold text-xs inline-flex items-center gap-1 transition-all"
                          title="Generate QR code for this link"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          QR
                        </button>
                        <button
                          onClick={() => setEditingLink(link)}
                          className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs inline-flex items-center gap-1 transition-all"
                          title="Edit destination"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => onDeleteShortLink(link.id)}
                          className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 inline-flex items-center transition-all"
                          title="Delete link"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
