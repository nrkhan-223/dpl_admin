import React, { useState } from 'react';
import {
  X,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  Sparkles,
  Phone,
  Mail,
  MessageSquare,
  Building2,
  Share2,
  ChevronLeft,
  ChevronRight,
  Info,
  Home,
  Layers,
  Key,
} from 'lucide-react';
import { Property } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { resolveImageUrl, handleImageError, DEFAULT_PROPERTY_FALLBACK } from '../../utils/imageHelper';

interface PropertyDetailsModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenAssign?: (property: Property, unitId?: string) => void;
}

export const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  property,
  isOpen,
  onClose,
  onOpenAssign,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedContact, setCopiedContact] = useState(false);

  if (!property) return null;

  const images = property.images && property.images.length > 0 ? property.images : [];

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedContact(true);
      setTimeout(() => setCopiedContact(false), 2000);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="4xl" showCloseButton={true}>
      <div className="space-y-6">
        {/* Gallery Hero Section */}
        <div className="relative aspect-16/9 sm:aspect-21/9 bg-slate-900 rounded-2xl overflow-hidden -mx-5 -mt-5 sm:-mx-6">
          {images.length > 0 ? (
            <img
              src={resolveImageUrl(images[activeImageIndex])}
              alt={property.title}
              referrerPolicy="no-referrer"
              onError={(e) => handleImageError(e, DEFAULT_PROPERTY_FALLBACK)}
              className="w-full h-full object-cover transition-all duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <Building2 className="w-12 h-12" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

          {/* Image Navigation Controls */}
          {images.length > 1 && (
            <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-auto">
              <button
                onClick={handlePrevImage}
                className="w-9 h-9 rounded-full bg-black/60 hover:bg-sky-700 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextImage}
                className="w-9 h-9 rounded-full bg-black/60 hover:bg-sky-700 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
                aria-label="Next photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto flex-wrap gap-2">
            <div className="flex items-center gap-2">
              {property.isExclusive && (
                <span className="bg-amber-500 text-slate-950 font-bold text-xs uppercase px-2.5 py-1 rounded-md flex items-center gap-1 shadow-md">
                  <Sparkles className="w-3.5 h-3.5 text-slate-950" /> Exclusive Collection
                </span>
              )}
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-md shadow-md text-white ${
                  property.projectStage === 'ongoing' ? 'bg-sky-800' : 'bg-emerald-600'
                }`}
              >
                {property.projectStage === 'ongoing' ? 'Ongoing Development' : 'Completed / Move-in Ready'}
              </span>
            </div>

            <button
              onClick={handleShare}
              className="bg-white/20 hover:bg-sky-700 text-white text-xs px-2.5 py-1 rounded-md backdrop-blur-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedContact ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>

          {/* Bottom Title & Pricing */}
          <div className="absolute bottom-4 left-5 right-5 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2 text-white">
            <div>
              <span className="text-xs font-semibold text-sky-200 uppercase tracking-wider block">
                {property.categoryName} · {property.floor}
              </span>
              <h2 className="text-lg sm:text-2xl font-bold tracking-tight">
                {property.title}
              </h2>
              <p className="text-xs text-slate-200 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                <span>{property.address}, {property.city}, {property.state} {property.zipCode}</span>
              </p>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className="text-xs text-slate-300 block">Monthly Lease</span>
              <div className="text-2xl sm:text-3xl font-mono font-bold tracking-tight text-white tabular-nums">
                ${property.price.toLocaleString()}
                <span className="text-sm font-normal text-sky-200">/mo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Selector */}
        {images.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-16 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  activeImageIndex === idx
                    ? 'border-sky-700 ring-2 ring-sky-700/30'
                    : 'border-slate-200 opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={resolveImageUrl(img)}
                  alt={`Thumbnail ${idx}`}
                  referrerPolicy="no-referrer"
                  onError={(e) => handleImageError(e, DEFAULT_PROPERTY_FALLBACK)}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Specifications Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-sky-50/50 p-4 rounded-2xl border border-sky-100 font-mono text-xs tabular-nums text-slate-800">
          <div className="flex items-center gap-2.5">
            <Bed className="w-4 h-4 text-sky-800" />
            <div>
              <span className="text-slate-400 text-xs uppercase font-sans block">Bedrooms</span>
              <span className="font-bold text-sm">{property.bedrooms} Beds</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Bath className="w-4 h-4 text-sky-800" />
            <div>
              <span className="text-slate-400 text-xs uppercase font-sans block">Bathrooms</span>
              <span className="font-bold text-sm">{property.bathrooms} Baths</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Maximize2 className="w-4 h-4 text-sky-800" />
            <div>
              <span className="text-slate-400 text-xs uppercase font-sans block">Interior Size</span>
              <span className="font-bold text-sm">{property.size.toLocaleString()} sqft</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Building2 className="w-4 h-4 text-sky-800" />
            <div>
              <span className="text-slate-400 text-xs uppercase font-sans block">Floor Level</span>
              <span className="font-bold font-sans text-sm">{property.floor}</span>
            </div>
          </div>
        </div>

        {/* Financials & Terms */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-white rounded-xl border border-slate-200">
            <span className="text-slate-400 block mb-0.5">Security Deposit</span>
            <span className="text-sm font-bold font-mono text-slate-900 tabular-nums">
              ${property.securityDeposit.toLocaleString()}
            </span>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-slate-200">
            <span className="text-slate-400 block mb-0.5">Monthly Maintenance</span>
            <span className="text-sm font-bold font-mono text-slate-900 tabular-nums">
              ${property.maintenanceFee.toLocaleString()}/mo
            </span>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-slate-200">
            <span className="text-slate-400 block mb-0.5">Furnishing & Parking</span>
            <span className="text-xs font-semibold text-slate-900 block truncate">
              {property.furnishing}
            </span>
            <span className="text-xs text-slate-500 truncate block">
              {property.parking}
            </span>
          </div>
        </div>

        {/* Availability Calendar & Status */}
        <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-950 block">
                Availability & Handover Status
              </span>
              <span className="text-xs text-emerald-800">
                {property.availabilityStatus === 'Available'
                  ? `Available from ${property.availableFrom} for lease assignment.`
                  : property.availabilityStatus === 'Assigned'
                  ? 'Currently assigned to tenant.'
                  : `Status: ${property.availabilityStatus}`}
              </span>
            </div>
          </div>

          <Badge
            variant={property.availabilityStatus === 'Available' ? 'emerald' : 'slate'}
            size="md"
          >
            {property.availabilityStatus}
          </Badge>
        </div>

        {/* Building Units & Floor Plans Directory (Multi-Unit Section) */}
        {property.units && property.units.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2 border-t border-slate-100 pt-3">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-sky-800" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Building Units & Floor Plans ({property.units.length} Units)
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Individual units with custom bedroom, bathroom, and balcony layouts
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {property.units.map((unit) => {
                const isAvail = unit.availabilityStatus === 'Available';
                return (
                  <div
                    key={unit.id}
                    className="p-3.5 bg-white rounded-2xl border border-sky-200/90 hover:border-sky-700 transition-all shadow-2xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-base text-slate-900">
                            {unit.unitNumber}
                          </span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                            isAvail ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-900'
                          }`}>
                            {unit.availabilityStatus}
                          </span>
                        </div>
                        {unit.title && (
                          <span className="text-xs text-slate-500 block mt-0.5">
                            {unit.title}
                          </span>
                        )}
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold font-mono text-sky-850 block tabular-nums">
                          ${unit.price.toLocaleString()}
                          <span className="text-xs text-slate-400 font-sans font-normal">/mo</span>
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          {unit.floor}
                        </span>
                      </div>
                    </div>

                    {/* Unit Specifications: Bedrooms, Bathrooms, Balconies, Sqft */}
                    <div className="grid grid-cols-4 gap-1 p-2 bg-sky-50/50 rounded-xl border border-sky-100 text-center font-mono text-xs tabular-nums text-slate-800">
                      <div>
                        <span className="text-xs text-slate-400 font-sans block uppercase">Beds</span>
                        <span className="font-bold text-sm">{unit.bedrooms}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 font-sans block uppercase">Baths</span>
                        <span className="font-bold text-sm">{unit.bathrooms}</span>
                      </div>
                      <div className="bg-sky-100/80 rounded-md py-0.5 border border-sky-200">
                        <span className="text-xs text-sky-900 font-sans block uppercase font-bold">Balcony</span>
                        <span className="font-black text-sky-950 text-sm">{unit.balconies}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 font-sans block uppercase">Sqft</span>
                        <span className="font-bold text-sm">{unit.size}</span>
                      </div>
                    </div>

                    {/* Features or Assignment */}
                    <div className="flex items-center justify-between pt-1 gap-2 text-xs">
                      {unit.assignedUserName ? (
                        <span className="text-xs text-sky-800 font-semibold truncate">
                          Tenant: {unit.assignedUserName}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500 truncate">
                          {unit.features && unit.features.length > 0 ? unit.features.join(' · ') : 'Ready for tenant assignment'}
                        </span>
                      )}

                      {isAvail && onOpenAssign && (
                        <button
                          onClick={() => {
                            onClose();
                            onOpenAssign(property, unit.id);
                          }}
                          className="px-3 py-1.5 text-xs font-bold text-sky-900 bg-sky-100 hover:bg-sky-200 border border-sky-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          <Key className="w-3.5 h-3.5 text-sky-700" /> Assign Unit
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Property Overview
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {property.description}
          </p>
        </div>

        {/* Amenities List */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
            Features & Building Amenities
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {property.amenities.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2.5 bg-sky-50/40 rounded-xl border border-sky-100 text-xs text-slate-700"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-sky-700 shrink-0" />
                <span className="truncate">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dedicated Property Management Contact Details Section */}
        <div className="p-5 bg-gradient-to-r from-slate-900 to-sky-950 text-white rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sky-900/60 pb-3">
            <div>
              <span className="text-xs font-mono text-sky-300 uppercase tracking-wider">
                Direct Inquiries & Viewing Scheduling
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Property Management Contact Details
              </h3>
            </div>
            <span className="text-xs text-sky-300 font-mono">
              {property.contactAgent.officeHours}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-white">
                {property.contactAgent.name}
              </div>
              <div className="text-xs text-sky-200">
                {property.contactAgent.role} · DPL Horizon Portfolios
              </div>
              <div className="text-xs text-slate-300 mt-1 space-y-0.5">
                <div>Phone: {property.contactAgent.phone}</div>
                <div>Email: {property.contactAgent.email}</div>
              </div>
            </div>

            {/* Direct Contact Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`tel:${property.contactAgent.phone}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-white text-slate-900 hover:bg-sky-50 rounded-xl transition-colors shadow-xs min-h-[40px]"
              >
                <Phone className="w-3.5 h-3.5 text-sky-800" />
                <span>Call Manager</span>
              </a>

              <a
                href={`mailto:${property.contactAgent.email}?subject=Inquiry for ${encodeURIComponent(property.title)}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-sky-800 text-white hover:bg-sky-700 rounded-xl border border-sky-700 transition-colors min-h-[40px]"
              >
                <Mail className="w-3.5 h-3.5 text-sky-200" />
                <span>Send Email</span>
              </a>

              {property.contactAgent.whatsapp && (
                <a
                  href={`https://wa.me/${property.contactAgent.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 rounded-xl transition-colors min-h-[40px]"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
