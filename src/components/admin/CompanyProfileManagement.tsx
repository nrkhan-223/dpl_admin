import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  Shield,
  Clock,
  Building,
  Users,
  Trophy,
  Scale,
  Leaf,
  Wallet,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Milestone,
  Check,
  Star,
  Compass,
  Heart,
  ExternalLink,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  addCoreValue,
  updateCoreValue,
  deleteCoreValue,
  addMilestone,
  updateMilestone,
  deleteMilestone,
  addWhyChooseReason,
  updateWhyChooseReason,
  deleteWhyChooseReason,
  addKeyAchievement,
  updateKeyAchievement,
  deleteKeyAchievement,
} from '../../store/slices/companyProfileSlice';
import {
  CoreValue,
  JourneyMilestone,
  WhyChooseReason,
  KeyAchievement,
} from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { FormField, Input } from '../common/FormField';

export const CompanyProfileManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data } = useAppSelector((state) => state.companyProfile);

  // Active section tab: 'all' | 'values' | 'milestones' | 'why-choose' | 'achievements'
  const [activeTab, setActiveTab] = useState<
    'all' | 'values' | 'milestones' | 'why-choose' | 'achievements'
  >('all');

  // --- Modals State ---
  // Core Value Modal
  const [isValueModalOpen, setIsValueModalOpen] = useState(false);
  const [editingValue, setEditingValue] = useState<CoreValue | null>(null);
  const [valTitle, setValTitle] = useState('');
  const [valDescription, setValDescription] = useState('');
  const [valIcon, setValIcon] = useState('shield');
  const [valBadge, setValBadge] = useState('');

  // Milestone Modal
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<JourneyMilestone | null>(null);
  const [msYear, setMsYear] = useState('');
  const [msTitle, setMsTitle] = useState('');
  const [msDescription, setMsDescription] = useState('');

  // Why Choose Modal
  const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);
  const [editingWhy, setEditingWhy] = useState<WhyChooseReason | null>(null);
  const [whyTitle, setWhyTitle] = useState('');
  const [whyDescription, setWhyDescription] = useState('');
  const [whyIcon, setWhyIcon] = useState('scale');
  const [whyColor, setWhyColor] = useState<WhyChooseReason['color']>('blue');

  // Achievement Modal
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<KeyAchievement | null>(null);
  const [achNumber, setAchNumber] = useState('');
  const [achLabel, setAchLabel] = useState('');
  const [achIcon, setAchIcon] = useState('award');
  const [achColor, setAchColor] = useState<KeyAchievement['color']>('blue');

  // Delete confirm state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'value' | 'milestone' | 'why' | 'achievement';
    id: string;
  } | null>(null);

  // Handlers for Core Values
  const handleOpenAddValue = () => {
    setEditingValue(null);
    setValTitle('');
    setValDescription('');
    setValIcon('shield');
    setValBadge('');
    setIsValueModalOpen(true);
  };

  const handleOpenEditValue = (val: CoreValue) => {
    setEditingValue(val);
    setValTitle(val.title);
    setValDescription(val.description);
    setValIcon(val.icon || 'shield');
    setValBadge(val.badge || '');
    setIsValueModalOpen(true);
  };

  const handleSaveValue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valTitle.trim() || !valDescription.trim()) return;

    if (editingValue) {
      dispatch(
        updateCoreValue({
          ...editingValue,
          title: valTitle.trim(),
          description: valDescription.trim(),
          icon: valIcon,
          badge: valBadge.trim() ? valBadge.trim().toUpperCase() : undefined,
        })
      );
    } else {
      dispatch(
        addCoreValue({
          title: valTitle.trim(),
          description: valDescription.trim(),
          icon: valIcon,
          badge: valBadge.trim() ? valBadge.trim().toUpperCase() : undefined,
        })
      );
    }
    setIsValueModalOpen(false);
  };

  // Handlers for Milestones
  const handleOpenAddMilestone = () => {
    setEditingMilestone(null);
    setMsYear('2027');
    setMsTitle('');
    setMsDescription('');
    setIsMilestoneModalOpen(true);
  };

  const handleOpenEditMilestone = (ms: JourneyMilestone) => {
    setEditingMilestone(ms);
    setMsYear(ms.year);
    setMsTitle(ms.title);
    setMsDescription(ms.description);
    setIsMilestoneModalOpen(true);
  };

  const handleSaveMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msYear.trim() || !msTitle.trim() || !msDescription.trim()) return;

    if (editingMilestone) {
      dispatch(
        updateMilestone({
          ...editingMilestone,
          year: msYear.trim(),
          title: msTitle.trim(),
          description: msDescription.trim(),
        })
      );
    } else {
      dispatch(
        addMilestone({
          year: msYear.trim(),
          title: msTitle.trim(),
          description: msDescription.trim(),
        })
      );
    }
    setIsMilestoneModalOpen(false);
  };

  // Handlers for Why Dreamer Properties
  const handleOpenAddWhy = () => {
    setEditingWhy(null);
    setWhyTitle('');
    setWhyDescription('');
    setWhyIcon('scale');
    setWhyColor('blue');
    setIsWhyModalOpen(true);
  };

  const handleOpenEditWhy = (item: WhyChooseReason) => {
    setEditingWhy(item);
    setWhyTitle(item.title);
    setWhyDescription(item.description);
    setWhyIcon(item.icon);
    setWhyColor(item.color);
    setIsWhyModalOpen(true);
  };

  const handleSaveWhy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whyTitle.trim() || !whyDescription.trim()) return;

    if (editingWhy) {
      dispatch(
        updateWhyChooseReason({
          ...editingWhy,
          title: whyTitle.trim(),
          description: whyDescription.trim(),
          icon: whyIcon,
          color: whyColor,
        })
      );
    } else {
      dispatch(
        addWhyChooseReason({
          title: whyTitle.trim(),
          description: whyDescription.trim(),
          icon: whyIcon,
          color: whyColor,
        })
      );
    }
    setIsWhyModalOpen(false);
  };

  // Handlers for Key Achievements
  const handleOpenAddAchievement = () => {
    setEditingAchievement(null);
    setAchNumber('');
    setAchLabel('');
    setAchIcon('award');
    setAchColor('blue');
    setIsAchievementModalOpen(true);
  };

  const handleOpenEditAchievement = (item: KeyAchievement) => {
    setEditingAchievement(item);
    setAchNumber(item.number);
    setAchLabel(item.label);
    setAchIcon(item.icon);
    setAchColor(item.color);
    setIsAchievementModalOpen(true);
  };

  const handleSaveAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!achNumber.trim() || !achLabel.trim()) return;

    if (editingAchievement) {
      dispatch(
        updateKeyAchievement({
          ...editingAchievement,
          number: achNumber.trim(),
          label: achLabel.trim(),
          icon: achIcon,
          color: achColor,
        })
      );
    } else {
      dispatch(
        addKeyAchievement({
          number: achNumber.trim(),
          label: achLabel.trim(),
          icon: achIcon,
          color: achColor,
        })
      );
    }
    setIsAchievementModalOpen(false);
  };

  // Delete action execution
  const executeDelete = () => {
    if (!deleteConfirm) return;
    const { type, id } = deleteConfirm;
    if (type === 'value') dispatch(deleteCoreValue(id));
    if (type === 'milestone') dispatch(deleteMilestone(id));
    if (type === 'why') dispatch(deleteWhyChooseReason(id));
    if (type === 'achievement') dispatch(deleteKeyAchievement(id));
    setDeleteConfirm(null);
  };

  // Render Icon helper
  const renderIcon = (iconName: string, className: string = 'w-5 h-5') => {
    switch (iconName) {
      case 'shield':
        return <Shield className={className} />;
      case 'sparkles':
        return <Sparkles className={className} />;
      case 'compass':
        return <Compass className={className} />;
      case 'heart':
        return <Heart className={className} />;
      case 'scale':
        return <Scale className={className} />;
      case 'clock':
        return <Clock className={className} />;
      case 'leaf':
        return <Leaf className={className} />;
      case 'wallet':
        return <Wallet className={className} />;
      case 'award':
        return <Award className={className} />;
      case 'building':
        return <Building className={className} />;
      case 'users':
        return <Users className={className} />;
      case 'trophy':
        return <Trophy className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-sky-100 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-800 text-white flex items-center justify-center font-bold shadow-xs">
              <Award className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Values, Milestones & Core Pillars
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Manage institutional Core Values, Journey Milestones, Why Dreamer Properties reasons, and Key Achievements.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 text-sm font-medium">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'all'
              ? 'bg-sky-800 text-white font-bold shadow-xs'
              : 'text-slate-600 hover:text-sky-800 hover:bg-sky-50'
          }`}
        >
          All Sections
        </button>
        <button
          onClick={() => setActiveTab('values')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'values'
              ? 'bg-sky-800 text-white font-bold shadow-xs'
              : 'text-slate-600 hover:text-sky-800 hover:bg-sky-50'
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          <span>Core Values ({data.coreValues.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('milestones')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'milestones'
              ? 'bg-sky-800 text-white font-bold shadow-xs'
              : 'text-slate-600 hover:text-sky-800 hover:bg-sky-50'
          }`}
        >
          <Milestone className="w-3.5 h-3.5" />
          <span>Journey & Milestones ({data.milestones.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('why-choose')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'why-choose'
              ? 'bg-sky-800 text-white font-bold shadow-xs'
              : 'text-slate-600 hover:text-sky-800 hover:bg-sky-50'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Why Dreamer Properties? ({data.whyChooseUs.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('achievements')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'achievements'
              ? 'bg-sky-800 text-white font-bold shadow-xs'
              : 'text-slate-600 hover:text-sky-800 hover:bg-sky-50'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Key Achievements ({data.achievements.length})</span>
        </button>
      </div>

      {/* =========================================================================
          SECTION: CORE VALUES MANAGEMENT
         ========================================================================= */}
      {(activeTab === 'values' || activeTab === 'all') && (
        <div className="bg-white p-6 rounded-2xl border border-sky-200/90 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-850 flex items-center justify-center font-bold">
                  <Star className="w-4 h-4 text-sky-800" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">List of Core Values</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Institutional guiding principles and ethical standards defining Dreamer Properties.
              </p>
            </div>

            <Button
              size="sm"
              variant="primary"
              onClick={handleOpenAddValue}
              icon={<Plus className="w-4 h-4" />}
            >
              Add Core Value
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.coreValues.map((val) => (
              <div
                key={val.id}
                className="p-4 rounded-xl border border-sky-100 bg-white hover:border-sky-300 hover:shadow-xs transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="w-9 h-9 rounded-xl bg-sky-800 text-white flex items-center justify-center shadow-xs">
                      {renderIcon(val.icon, 'w-4 h-4')}
                    </div>
                    {val.badge && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-100 text-sky-900 border border-sky-200">
                        {val.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{val.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{val.description}</p>
                </div>

                <div className="flex items-center justify-end gap-1.5 pt-3 mt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleOpenEditValue(val)}
                    className="p-1.5 text-slate-400 hover:text-sky-800 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                    title="Edit core value"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm({ type: 'value', id: val.id })}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete core value"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION: JOURNEY & MILESTONES MANAGEMENT
         ========================================================================= */}
      {(activeTab === 'milestones' || activeTab === 'all') && (
        <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-850 flex items-center justify-center font-bold">
                  <Milestone className="w-4 h-4 text-sky-800" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">List of Journey & Milestones</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Chronological milestones and landmark growth stages of the organization.
              </p>
            </div>

            <Button
              size="sm"
              variant="primary"
              onClick={handleOpenAddMilestone}
              icon={<Plus className="w-4 h-4" />}
            >
              Add Milestone
            </Button>
          </div>

          <div className="relative pl-6 sm:pl-8 space-y-3.5 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-sky-200">
            {data.milestones.map((ms) => (
              <div
                key={ms.id}
                className="relative p-4 rounded-xl border border-sky-100 hover:border-sky-300 bg-white hover:bg-sky-50/20 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-10 rounded-xl bg-sky-850 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                    {ms.year}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{ms.title}</h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{ms.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleOpenEditMilestone(ms)}
                    className="p-1.5 text-slate-400 hover:text-sky-800 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                    title="Edit milestone"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm({ type: 'milestone', id: ms.id })}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete milestone"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION: WHY CHOOSE DREAMER PROPERTIES MANAGEMENT
         ========================================================================= */}
      {(activeTab === 'why-choose' || activeTab === 'all') && (
        <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-850 flex items-center justify-center font-bold">
                  <Scale className="w-4 h-4 text-sky-800" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Why Dreamer Properties Options</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Core institutional advantages, client trust guarantees, and unique property offerings.
              </p>
            </div>

            <Button
              size="sm"
              variant="primary"
              onClick={handleOpenAddWhy}
              icon={<Plus className="w-4 h-4" />}
            >
              Add Reason
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {data.whyChooseUs.map((why) => (
              <div
                key={why.id}
                className="p-4 rounded-xl border border-sky-100 hover:border-sky-300 bg-white hover:bg-sky-50/20 shadow-2xs transition-all flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                    {renderIcon(why.icon, 'w-5 h-5')}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{why.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{why.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleOpenEditWhy(why)}
                    className="p-1.5 text-slate-400 hover:text-sky-800 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                    title="Edit reason"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm({ type: 'why', id: why.id })}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete reason"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION: KEY ACHIEVEMENTS STATS
         ========================================================================= */}
      {(activeTab === 'achievements' || activeTab === 'all') && (
        <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-850 flex items-center justify-center font-bold">
                  <Trophy className="w-4 h-4 text-sky-800" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Key Achievements</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Headline operational scale indicators and institutional track records.
              </p>
            </div>

            <Button
              size="sm"
              variant="primary"
              onClick={handleOpenAddAchievement}
              icon={<Plus className="w-4 h-4" />}
            >
              Add Achievement Stat
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {data.achievements.map((ach) => (
              <div
                key={ach.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-sky-300 bg-white hover:bg-sky-50/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-9 h-9 rounded-xl bg-sky-800 text-white flex items-center justify-center">
                      {renderIcon(ach.icon, 'w-4 h-4')}
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      {ach.color}
                    </span>
                  </div>
                  <div className="text-xl font-black text-slate-900">{ach.number}</div>
                  <div className="text-xs font-semibold text-slate-500 mt-0.5">{ach.label}</div>
                </div>

                <div className="flex items-center justify-end gap-1.5 pt-3 mt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleOpenEditAchievement(ach)}
                    className="p-1.5 text-slate-400 hover:text-sky-800 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                    title="Edit achievement"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm({ type: 'achievement', id: ach.id })}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete achievement"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODALS FOR CORE VALUES, MILESTONES, WHY DREAMER & ACHIEVEMENTS
         ========================================================================= */}

      {/* Core Value Modal */}
      <Modal
        isOpen={isValueModalOpen}
        onClose={() => setIsValueModalOpen(false)}
        title={editingValue ? 'Edit Core Value' : 'Add Core Value'}
        subtitle="Specify the institutional value, description, and foundation badge"
        maxWidth="md"
      >
        <form onSubmit={handleSaveValue} className="space-y-4">
          <FormField label="Value Title" required hint="e.g. Integrity & Trust, Excellence, Innovation">
            <Input
              value={valTitle}
              onChange={(e) => setValTitle(e.target.value)}
              placeholder="e.g. Integrity & Trust"
              required
            />
          </FormField>

          <FormField label="Description" required hint="Short statement explaining the commitment">
            <textarea
              value={valDescription}
              onChange={(e) => setValDescription(e.target.value)}
              placeholder="e.g. Uncompromising honesty and transparency in all dealings."
              rows={3}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-700 focus:bg-white"
              required
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Icon">
              <select
                value={valIcon}
                onChange={(e) => setValIcon(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-700"
              >
                <option value="shield">Shield (Integrity & Trust)</option>
                <option value="sparkles">Sparkles (Excellence)</option>
                <option value="compass">Compass (Innovation)</option>
                <option value="heart">Heart (Client Centricity)</option>
                <option value="award">Award (Recognition)</option>
                <option value="building">Building (Infrastructure)</option>
              </select>
            </FormField>

            <FormField label="Badge / Tag (Optional)" hint="e.g. FOUNDATION">
              <Input
                value={valBadge}
                onChange={(e) => setValBadge(e.target.value)}
                placeholder="e.g. FOUNDATION"
              />
            </FormField>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" size="md" onClick={() => setIsValueModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              {editingValue ? 'Update Value' : 'Save Value'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Journey Milestone Modal */}
      <Modal
        isOpen={isMilestoneModalOpen}
        onClose={() => setIsMilestoneModalOpen(false)}
        title={editingMilestone ? 'Edit Journey Milestone' : 'Add Journey Milestone'}
        subtitle="Add a milestone year and development highlight to the company history timeline"
        maxWidth="md"
      >
        <form onSubmit={handleSaveMilestone} className="space-y-4">
          <FormField label="Milestone Year" required hint="e.g. 2010, 2015, 2020, 2026">
            <Input
              value={msYear}
              onChange={(e) => setMsYear(e.target.value)}
              placeholder="e.g. 2026"
              required
            />
          </FormField>

          <FormField label="Milestone Title" required hint="e.g. Smart High-Rise ERA, Company Foundation">
            <Input
              value={msTitle}
              onChange={(e) => setMsTitle(e.target.value)}
              placeholder="e.g. Smart High-Rise ERA"
              required
            />
          </FormField>

          <FormField label="Description" required hint="Details of this milestone achievement">
            <textarea
              value={msDescription}
              onChange={(e) => setMsDescription(e.target.value)}
              placeholder="e.g. Spearheading IoT-integrated smart automated residential complexes and commercial hubs."
              rows={3}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-700 focus:bg-white"
              required
            />
          </FormField>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" size="md" onClick={() => setIsMilestoneModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              {editingMilestone ? 'Update Milestone' : 'Save Milestone'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Why Choose Modal */}
      <Modal
        isOpen={isWhyModalOpen}
        onClose={() => setIsWhyModalOpen(false)}
        title={editingWhy ? 'Edit Reason' : 'Add Why Dreamer Properties Option'}
        subtitle="Add a customer-facing differentiator explaining why clients should choose Dreamer Properties"
        maxWidth="md"
      >
        <form onSubmit={handleSaveWhy} className="space-y-4">
          <FormField label="Option Title" required hint="e.g. 100% Legal Transparency, Timely Delivery Guarantee">
            <Input
              value={whyTitle}
              onChange={(e) => setWhyTitle(e.target.value)}
              placeholder="e.g. 100% Legal Transparency"
              required
            />
          </FormField>

          <FormField label="Description" required hint="Detailed customer benefit explanation">
            <textarea
              value={whyDescription}
              onChange={(e) => setWhyDescription(e.target.value)}
              placeholder="e.g. All land titles, city permits, and RAJUK approvals verified before project launch."
              rows={3}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-700 focus:bg-white"
              required
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Icon">
              <select
                value={whyIcon}
                onChange={(e) => setWhyIcon(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-700"
              >
                <option value="scale">Scale / Gavel (Legal & Approvals)</option>
                <option value="clock">Clock / Timer (Timely Delivery)</option>
                <option value="leaf">Leaf (Eco-Friendly & Green)</option>
                <option value="wallet">Wallet (Flexible Installments)</option>
                <option value="shield">Shield (Security & Protection)</option>
                <option value="building">Building (Architectural Engineering)</option>
              </select>
            </FormField>

            <FormField label="Color Accent">
              <select
                value={whyColor}
                onChange={(e) => setWhyColor(e.target.value as any)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-700"
              >
                <option value="blue">Blue (Primary)</option>
                <option value="green">Green (Timely Delivery)</option>
                <option value="emerald">Emerald (Eco-Friendly)</option>
                <option value="amber">Amber (Installments & Finance)</option>
                <option value="indigo">Indigo (Luxury & Premium)</option>
              </select>
            </FormField>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" size="md" onClick={() => setIsWhyModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              {editingWhy ? 'Update Option' : 'Save Option'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Key Achievement Modal */}
      <Modal
        isOpen={isAchievementModalOpen}
        onClose={() => setIsAchievementModalOpen(false)}
        title={editingAchievement ? 'Edit Key Achievement' : 'Add Key Achievement'}
        subtitle="Manage the 4 primary impact metrics displayed on the dashboard"
        maxWidth="md"
      >
        <form onSubmit={handleSaveAchievement} className="space-y-4">
          <FormField label="Metric / Number" required hint="e.g. 15+ Years, 120+, 50K+, 25+">
            <Input
              value={achNumber}
              onChange={(e) => setAchNumber(e.target.value)}
              placeholder="e.g. 15+ Years"
              required
            />
          </FormField>

          <FormField label="Label / Description" required hint="e.g. Industry Experience, Delivered Projects">
            <Input
              value={achLabel}
              onChange={(e) => setAchLabel(e.target.value)}
              placeholder="e.g. Industry Experience"
              required
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Icon">
              <select
                value={achIcon}
                onChange={(e) => setAchIcon(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-700"
              >
                <option value="award">Award / Ribbon</option>
                <option value="building">Delivered Projects (Building)</option>
                <option value="users">Happy Families (Users)</option>
                <option value="trophy">National Awards (Trophy)</option>
              </select>
            </FormField>

            <FormField label="Color Style">
              <select
                value={achColor}
                onChange={(e) => setAchColor(e.target.value as any)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-700"
              >
                <option value="blue">Blue Light Box</option>
                <option value="green">Green Light Box</option>
                <option value="amber">Amber / Yellow Light Box</option>
                <option value="purple">Purple Light Box</option>
              </select>
            </FormField>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" size="md" onClick={() => setIsAchievementModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              {editingAchievement ? 'Update Stat' : 'Save Stat'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirm Deletion"
        subtitle="Are you sure you want to delete this item from the company profile?"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            This item will be removed immediately from both the administration registry and the live customer story portal.
          </p>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={executeDelete}>
              <Trash2 className="w-4 h-4 mr-1" />
              Delete Item
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CompanyProfileManagement;
