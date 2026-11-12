import React, { useState } from 'react';
import {
  PhoneCall,
  Phone,
  MessageSquare,
  Mail,
  Clock,
  Calendar,
  Info,
  MapPin,
  CheckCircle2,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  updateContactInfo,
  addScheduleItem,
  updateScheduleItem,
  deleteScheduleItem,
  toggleOpenStatus,
} from '../../store/slices/contactInfoSlice';
import { OfficeScheduleItem } from '../../types';
import { Button } from '../common/Button';
import { FormField, Input } from '../common/FormField';
import { Modal } from '../common/Modal';
import RequestCallbackModal from './RequestCallbackModal';

export const ContactInfoManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { info } = useAppSelector((state) => state.contactInfo);

  // Local form state
  const [hotline, setHotline] = useState(info.hotline);
  const [whatsapp, setWhatsapp] = useState(info.whatsapp);
  const [email, setEmail] = useState(info.email);
  const [supportEmail, setSupportEmail] = useState(info.supportEmail || '');
  const [address, setAddress] = useState(info.address);
  const [cityStateZip, setCityStateZip] = useState(info.cityStateZip);
  const [emergencyNote, setEmergencyNote] = useState(info.emergencyNote);
  const [statusBadgeText, setStatusBadgeText] = useState(info.statusBadgeText);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Schedule modal state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<OfficeScheduleItem | null>(null);
  const [scheduleDays, setScheduleDays] = useState('');
  const [scheduleHours, setScheduleHours] = useState('');
  const [scheduleApptOnly, setScheduleApptOnly] = useState(false);
  const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false);

  // Synchronize when info changes
  React.useEffect(() => {
    setHotline(info.hotline);
    setWhatsapp(info.whatsapp);
    setEmail(info.email);
    setSupportEmail(info.supportEmail || '');
    setAddress(info.address);
    setCityStateZip(info.cityStateZip);
    setEmergencyNote(info.emergencyNote);
    setStatusBadgeText(info.statusBadgeText);
  }, [info]);

  const handleSaveContactDetails = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      updateContactInfo({
        hotline: hotline.trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim(),
        supportEmail: supportEmail.trim(),
        address: address.trim(),
        cityStateZip: cityStateZip.trim(),
        emergencyNote: emergencyNote.trim(),
        statusBadgeText: statusBadgeText.trim(),
      })
    );
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const handleOpenAddSchedule = () => {
    setEditingSchedule(null);
    setScheduleDays('Sunday – Wednesday');
    setScheduleHours('9:00 AM – 7:00 PM');
    setScheduleApptOnly(false);
    setIsScheduleModalOpen(true);
  };

  const handleOpenEditSchedule = (item: OfficeScheduleItem) => {
    setEditingSchedule(item);
    setScheduleDays(item.days);
    setScheduleHours(item.hours);
    setScheduleApptOnly(!!item.isAppointmentOnly);
    setIsScheduleModalOpen(true);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleDays.trim() || !scheduleHours.trim()) return;

    if (editingSchedule) {
      dispatch(
        updateScheduleItem({
          id: editingSchedule.id,
          data: {
            days: scheduleDays.trim(),
            hours: scheduleHours.trim(),
            isAppointmentOnly: scheduleApptOnly,
          },
        })
      );
    } else {
      dispatch(
        addScheduleItem({
          days: scheduleDays.trim(),
          hours: scheduleHours.trim(),
          isAppointmentOnly: scheduleApptOnly,
        })
      );
    }
    setIsScheduleModalOpen(false);
    setEditingSchedule(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sky-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-sky-800 text-white flex items-center justify-center font-bold shadow-xs">
              <PhoneCall className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Contact Information & Office Hours
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage customer service hotlines, WhatsApp contact channels, headquarters address, and office operating hours.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setIsCallbackModalOpen(true)}
          >
            <PhoneCall className="w-3.5 h-3.5 mr-1 text-sky-800" />
            Preview Callback Modal
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSaveContactDetails}
          >
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            Save Changes
          </Button>
        </div>
      </div>

      {isSavedNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-800 font-bold flex items-center gap-2 shadow-xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Contact details and operating hours have been successfully saved to live system.</span>
        </div>
      )}

      {/* Contact Settings & Operating Hours Form Panels */}
      <div className="space-y-6">
          {/* Section 1: Hotline, WhatsApp & Email */}
          <form onSubmit={handleSaveContactDetails} className="bg-white rounded-2xl sm:rounded-3xl border border-sky-200/90 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  Primary Client Contact Channels
                </h3>
              </div>
              <span className="text-xs text-sky-850 font-bold bg-sky-100/90 border border-sky-300 px-2 py-0.5 rounded-md">
                Direct Channels
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="24/7 Hotline Number" required hint="Used for urgent tenant & client calls">
                <div className="relative">
                  <Input
                    placeholder="+1 (800) 555-DPL-VIP"
                    value={hotline}
                    onChange={(e) => setHotline(e.target.value)}
                    required
                  />
                </div>
              </FormField>

              <FormField label="Official WhatsApp Number" required hint="Direct message channel">
                <div className="relative">
                  <Input
                    placeholder="+1 (555) 987-6543"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    required
                  />
                </div>
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Primary Inquiries Email" required>
                <Input
                  type="email"
                  placeholder="contact@dpl.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="VIP Concierge / Support Email">
                <Input
                  type="email"
                  placeholder="concierge@dpl.com"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Corporate Headquarters Address" required>
                <Input
                  placeholder="DPL Horizon Corporate Tower, Level 42"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="City, District & Region" required>
                <Input
                  placeholder="742 Skyline Boulevard, Prime Financial District"
                  value={cityStateZip}
                  onChange={(e) => setCityStateZip(e.target.value)}
                  required
                />
              </FormField>
            </div>

            <FormField label="24/7 Emergency Support Note" hint="Displayed at the footer of operating hours card">
              <Input
                placeholder="24/7 Hotline support remains active for urgent client inquiries."
                value={emergencyNote}
                onChange={(e) => setEmergencyNote(e.target.value)}
              />
            </FormField>

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="primary" size="sm">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Update Channels
              </Button>
            </div>
          </form>

          {/* Section 2: Office Operating Hours Schedule Manager */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-sky-200/90 p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-700" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Office Operating Hours Schedule
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage weekly operating windows (e.g. Saturday–Thursday, Friday Jummah, and public holidays).
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => dispatch(toggleOpenStatus())}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors cursor-pointer flex items-center gap-1.5 min-h-[36px] ${
                    info.isOpenNow
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-rose-50 text-rose-800 border-rose-300'
                  }`}
                  title="Click to toggle current Open / Closed status"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      info.isOpenNow ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                    }`}
                  />
                  <span>Status: {info.statusBadgeText || (info.isOpenNow ? 'OPEN NOW' : 'CLOSED NOW')}</span>
                </button>

                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleOpenAddSchedule}
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Hours
                </Button>
              </div>
            </div>

            {/* List of Schedules */}
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
              {info.schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:bg-sky-50/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-sky-100 border border-sky-300 flex items-center justify-center shrink-0 text-sky-850">
                      <Calendar className="w-4 h-4 text-sky-700" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        {schedule.days}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span>{schedule.hours}</span>
                        {schedule.isAppointmentOnly && (
                          <span className="text-sky-800 bg-sky-100 px-1.5 py-0.2 rounded text-xs font-semibold">
                            By Appointment
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        schedule.isAppointmentOnly
                          ? 'bg-sky-100 text-sky-900 border border-sky-300'
                          : 'bg-amber-400 text-slate-950 font-bold'
                      }`}
                    >
                      {schedule.hours}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditSchedule(schedule)}
                        className="p-1.5 text-slate-400 hover:text-sky-800 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit schedule window"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (info.schedules.length <= 1) {
                            alert('You must keep at least one operating hours entry.');
                            return;
                          }
                          dispatch(deleteScheduleItem(schedule.id));
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete schedule window"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
      </div>

      {/* Add / Edit Schedule Modal */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setEditingSchedule(null);
        }}
        title={editingSchedule ? 'Edit Operating Window' : 'Add Operating Hours Window'}
        subtitle="Define active customer service hours, Jummah timings, or appointment windows"
        maxWidth="md"
      >
        <form onSubmit={handleScheduleSubmit} className="space-y-4">
          <FormField label="Days / Range" required hint="e.g. Saturday – Thursday, Friday (Jummah), Sunday – Wednesday">
            <Input
              placeholder="e.g. Saturday – Thursday"
              value={scheduleDays}
              onChange={(e) => setScheduleDays(e.target.value)}
              required
            />
          </FormField>

          <FormField label="Operating Hours Text" required hint="e.g. 9:00 AM – 8:00 PM or Appointments Only">
            <Input
              placeholder="e.g. 9:00 AM – 8:00 PM"
              value={scheduleHours}
              onChange={(e) => setScheduleHours(e.target.value)}
              required
            />
          </FormField>

          <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <input
              type="checkbox"
              id="scheduleApptOnly"
              checked={scheduleApptOnly}
              onChange={(e) => setScheduleApptOnly(e.target.checked)}
              className="w-4 h-4 text-sky-700 rounded border-slate-300 focus:ring-sky-600"
            />
            <label htmlFor="scheduleApptOnly" className="text-xs font-bold text-slate-700 cursor-pointer">
              Mark as 'Appointments Only' (Highlights the schedule window with appointment-only status)
            </label>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => {
                setIsScheduleModalOpen(false);
                setEditingSchedule(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              {editingSchedule ? 'Update Hours' : 'Add Hours'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Client Callback Request Modal */}
      <RequestCallbackModal
        isOpen={isCallbackModalOpen}
        onClose={() => setIsCallbackModalOpen(false)}
      />
    </div>
  );
};
