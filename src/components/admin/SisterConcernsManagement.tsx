import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Globe,
  Building2,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  addSisterConcern,
  updateSisterConcern,
  deleteSisterConcern,
  toggleSisterConcernStatus,
} from '../../store/slices/sisterConcernsSlice';
import { SisterConcern } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { FormField, Input } from '../common/FormField';

const imagePresets = [
  {
    label: 'Corporate Tower',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Hospitality Resort',
    url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Commercial Glass',
    url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Modern Engineering',
    url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Eco Architecture',
    url: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Financial Landmark',
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  },
];

export const SisterConcernsManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { sisterConcerns } = useAppSelector((state) => state.sisterConcerns);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConcern, setEditingConcern] = useState<SisterConcern | null>(null);
  const [concernToDelete, setConcernToDelete] = useState<SisterConcern | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [error, setError] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setEditingConcern(null);
    setName('');
    setImage('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80');
    setIndustry('Real Estate Development & Assets');
    setDescription('');
    setWebsiteUrl('https://dpl.com');
    setStatus('active');
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (concern: SisterConcern) => {
    setEditingConcern(concern);
    setName(concern.name);
    setImage(concern.image);
    setIndustry(concern.industry || '');
    setDescription(concern.description || '');
    setWebsiteUrl(concern.websiteUrl || '');
    setStatus(concern.status);
    setError(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Company / brand name is required.');
      return;
    }
    if (!image.trim()) {
      setError('Image URL is required.');
      return;
    }

    if (editingConcern) {
      dispatch(
        updateSisterConcern({
          id: editingConcern.id,
          data: {
            name: name.trim(),
            image: image.trim(),
            industry: industry.trim(),
            description: description.trim(),
            websiteUrl: websiteUrl.trim(),
            status,
          },
        })
      );
    } else {
      dispatch(
        addSisterConcern({
          name: name.trim(),
          image: image.trim(),
          industry: industry.trim() || 'DPL Group Enterprise',
          description: description.trim(),
          websiteUrl: websiteUrl.trim(),
          status,
        })
      );
    }

    setIsModalOpen(false);
    setEditingConcern(null);
  };

  const handleConfirmDelete = () => {
    if (concernToDelete) {
      dispatch(deleteSisterConcern(concernToDelete.id));
      setConcernToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sky-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-sky-700 text-white flex items-center justify-center font-bold">
              <Briefcase className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Sister Concerns & Group Brands
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage corporate sister companies, subsidiary brands, logos, and external partnership portfolio images.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleOpenCreate}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Sister Concern
          </Button>
        </div>
      </div>

      {/* Grid of Sister Concerns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sisterConcerns.map((concern) => (
          <div
            key={concern.id}
            className="bg-white rounded-2xl sm:rounded-3xl border border-sky-200/90 overflow-hidden hover:border-sky-600 transition-all shadow-2xs flex flex-col justify-between group"
          >
            <div>
              {/* Image Container with Cover Photo */}
              <div className="relative aspect-16/9 bg-slate-900 overflow-hidden isolate">
                <img
                  src={concern.image}
                  alt={concern.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform-gpu transition-transform duration-500 ease-out group-hover:scale-105 will-change-transform"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                {/* Top status */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-100 bg-sky-950/80 backdrop-blur-xs px-2.5 py-1 rounded-md border border-sky-400/30">
                    {concern.industry || 'Sister Company'}
                  </span>

                  <button
                    type="button"
                    onClick={() => dispatch(toggleSisterConcernStatus(concern.id))}
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-md shadow-xs cursor-pointer transition-colors ${
                      concern.status === 'active'
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-300 text-slate-800'
                    }`}
                    title="Click to toggle active status"
                  >
                    {concern.status === 'active' ? 'Active' : 'Inactive'}
                  </button>
                </div>

                {/* Brand Name overlay */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-base sm:text-lg font-bold tracking-tight text-white drop-shadow-xs line-clamp-1">
                    {concern.name}
                  </h3>
                </div>
              </div>

              {/* Content description & website */}
              <div className="p-4 space-y-2">
                {concern.description ? (
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {concern.description}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 italic">No description provided.</p>
                )}

                {concern.websiteUrl && (
                  <a
                    href={concern.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-850 hover:text-sky-950 hover:underline pt-1"
                  >
                    <Globe className="w-3.5 h-3.5 text-sky-700" />
                    <span>{concern.websiteUrl.replace(/^https?:\/\//, '')}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                )}
              </div>
            </div>

            {/* Action Buttons Footer */}
            <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                Added: {new Date(concern.createdAt).toLocaleDateString()}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(concern)}
                  title="Edit sister concern"
                  className="p-2 text-slate-500 hover:text-sky-800 hover:bg-sky-100 rounded-xl transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setConcernToDelete(concern)}
                  title="Delete sister concern"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sister Concern Form Modal (Create / Edit) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingConcern(null);
        }}
        title={editingConcern ? 'Edit Sister Concern' : 'Add New Sister Concern'}
        subtitle="Manage brand image, logo, industry sector, and corporate website"
        maxWidth="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <FormField label="Sister Concern / Brand Name" required>
            <Input
              placeholder="e.g. DPL Horizon Capital"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </FormField>

          <FormField label="Industry / Sector" required>
            <Input
              placeholder="e.g. Asset & Equity Management"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              required
            />
          </FormField>

          <div className="space-y-2">
            <FormField label="Sister Concern Image / Logo URL" required>
              <Input
                placeholder="https://images.unsplash.com/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
              />
            </FormField>

            {/* Image presets */}
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              <span className="text-xs text-slate-500 font-medium">Image presets:</span>
              {imagePresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImage(preset.url)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                    image === preset.url
                      ? 'bg-sky-100 text-sky-900 border-sky-400 font-bold'
                      : 'bg-white text-sky-850 border-sky-200 hover:border-sky-300'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Live image preview */}
            {image && (
              <div className="relative aspect-16/9 rounded-xl overflow-hidden border border-sky-200 bg-slate-900 mt-2">
                <img
                  src={image}
                  alt="Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <FormField label="Corporate Website URL">
            <Input
              placeholder="e.g. https://capital.dpl.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
            />
          </FormField>

          <FormField label="Brief Description / Profile">
            <Input
              placeholder="e.g. Premier private equity and real estate investment arm..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormField>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Active Status
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStatus('active')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer min-h-[38px] ${
                  status === 'active'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                Active Concern
              </button>
              <button
                type="button"
                onClick={() => setStatus('inactive')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer min-h-[38px] ${
                  status === 'inactive'
                    ? 'bg-slate-700 text-white border-slate-700 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                Inactive
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => {
                setIsModalOpen(false);
                setEditingConcern(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              {editingConcern ? 'Update Concern' : 'Add Concern'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      {concernToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-rose-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                Delete Sister Concern?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Are you sure you want to remove <strong className="text-slate-800">"{concernToDelete.name}"</strong>? This will remove its branding, logo, and link.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConcernToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmDelete}
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
