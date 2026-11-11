import React, { useState } from 'react';
import {
  PhoneCall,
  User,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { addCallbackRequest } from '../../store/slices/callbackRequestsSlice';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { FormField, Input } from '../common/FormField';

interface RequestCallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPropertyInterest?: string;
}

export const RequestCallbackModal: React.FC<RequestCallbackModalProps> = ({
  isOpen,
  onClose,
  defaultPropertyInterest,
}) => {
  const dispatch = useAppDispatch();
  const { properties } = useAppSelector((state) => state.properties);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [propertyInterest, setPropertyInterest] = useState(defaultPropertyInterest || '');
  const [preferredTime, setPreferredTime] = useState('Morning (9:00 AM – 12:00 PM)');
  const [priority, setPriority] = useState<'Urgent' | 'High' | 'Normal'>('Normal');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setError(null);
      if (defaultPropertyInterest) {
        setPropertyInterest(defaultPropertyInterest);
      }
    }
  }, [isOpen, defaultPropertyInterest]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!phone.trim()) {
      setError('Phone number is required.');
      return;
    }
    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a description of your inquiry.');
      return;
    }

    dispatch(
      addCallbackRequest({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        description: description.trim(),
        propertyInterest: propertyInterest ? propertyInterest.trim() : undefined,
        preferredTime,
        priority,
      })
    );

    setIsSuccess(true);
    setTimeout(() => {
      onClose();
      // Reset form
      setName('');
      setPhone('');
      setEmail('');
      setDescription('');
      setPropertyInterest('');
      setIsSuccess(false);
    }, 1800);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request a Phone Callback"
      subtitle="Submit your contact details and inquiry description to receive an official callback from DPL management."
      maxWidth="lg"
    >
      {isSuccess ? (
        <div className="py-8 px-4 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border-2 border-emerald-300">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Callback Request Submitted!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto mt-1">
              Thank you, <strong>{name}</strong>. Your callback request has been logged and assigned to DPL management.
            </p>
          </div>
          <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-xs text-sky-850 font-mono inline-block">
            Target Phone: {phone} · Priority: {priority}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FormField label="Full Name" required>
              <Input
                placeholder="e.g. Sarah Jenkins"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Phone Number" required hint="Where we should call you">
              <Input
                type="tel"
                placeholder="e.g. +1 (555) 234-5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </FormField>
          </div>

          {/* Email & Property Interest */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FormField label="Email Address" required>
              <Input
                type="email"
                placeholder="e.g. sarah.jenkins@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Property or Apartment of Interest">
              <select
                value={propertyInterest}
                onChange={(e) => setPropertyInterest(e.target.value)}
                className="w-full text-xs sm:text-sm text-slate-900 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 cursor-pointer focus:outline-hidden min-h-[44px]"
              >
                <option value="">-- General Inquiries / Any Property --</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.title}>
                    {p.title} (${p.price.toLocaleString()}/mo)
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          {/* Description of Inquiry */}
          <FormField
            label="Inquiry Description & Details"
            required
            hint="Describe what you would like to discuss (units, pricing, balcony specs, installment terms)"
          >
            <textarea
              rows={3}
              placeholder="e.g. Interested in the 2-bedroom unit with 1 balcony. Would like to verify move-in dates and discuss installment payment options."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full p-3 text-xs sm:text-sm text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 transition-all resize-y min-h-[90px]"
            />
          </FormField>

          {/* Preferred Callback Time & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Preferred Callback Window
              </label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-xl px-3 py-2 cursor-pointer focus:outline-hidden min-h-[40px]"
              >
                <option value="Morning (9:00 AM – 12:00 PM)">Morning (9:00 AM – 12:00 PM)</option>
                <option value="Afternoon (1:00 PM – 4:00 PM)">Afternoon (1:00 PM – 4:00 PM)</option>
                <option value="Evening (5:00 PM – 7:30 PM)">Evening (5:00 PM – 7:30 PM)</option>
                <option value="Immediate / Urgent Callback">Immediate / Urgent Callback</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Urgency Priority
              </label>
              <div className="flex items-center gap-1.5 pt-0.5">
                {(['Normal', 'High', 'Urgent'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer min-h-[36px] ${
                      priority === p
                        ? p === 'Urgent'
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : p === 'High'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-sky-700 text-white border-sky-700 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              <PhoneCall className="w-4 h-4 mr-1.5" />
              Request Callback
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default RequestCallbackModal;
