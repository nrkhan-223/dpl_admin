import React from 'react';
import {
  Building2,
  Key,
  Trash2,
  Edit2,
  Sparkles,
  Eye,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Wind,
  Layers,
  Sofa,
  Car,
  Calendar,
  Phone,
  Mail,
  UserCheck,
  Shield,
  Layers3,
} from 'lucide-react';
import { Property, User } from '../../types';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { resolveImageUrl, handleImageError, DEFAULT_PROPERTY_FALLBACK } from '../../utils/imageHelper';

interface ApartmentListItemProps {
  property: Property;
  assignedUser?: User;
  onViewDetails: (property: Property) => void;
  onEdit: (property: Property) => void;
  onAssign: (property: Property) => void;
  onUnassign: (property: Property) => void;
  onToggleExclusive: (id: string) => void;
  onDelete: (property: Property) => void;
}

export const ApartmentListItem: React.FC<ApartmentListItemProps> = ({
  property,
  assignedUser,
  onViewDetails,
  onEdit,
  onAssign,
  onUnassign,
  onToggleExclusive,
  onDelete,
}) => {
  const leasedUnitsCount = property.units?.filter((u) => u.assignedUserId).length ?? 0;
  const vacantUnitsCount = (property.units?.length ?? 0) - leasedUnitsCount;

  const cleanFloorText = (fl?: string | number) => {
    if (!fl) return 'Ground Floor';
    const str = String(fl).trim();
    if (/^floor\s*/i.test(str)) return str;
    return `Floor ${str}`;
  };

  return (
    <article className="bg-white rounded-2xl border border-slate-200/80 hover:border-sky-300 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col lg:flex-row group">
      {/* 1. Left Wing: Photographic Thumbnail, Status, Tenant & All Actions */}
      <div className="p-3.5 lg:border-r border-slate-100/90 shrink-0 w-full lg:w-60 xl:w-64 flex flex-col justify-between bg-slate-50/30">
        <div>
          {/* Reduced-height photo container */}
          <div
            onClick={() => onViewDetails(property)}
            className="w-full h-36 sm:h-40 relative rounded-xl overflow-hidden bg-slate-100 cursor-pointer shadow-2xs isolate"
            title="Click to view full property specifications"
          >
            {property.images[0] ? (
              <img
                src={resolveImageUrl(property.images[0])}
                alt={property.title}
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={(e) => handleImageError(e, DEFAULT_PROPERTY_FALLBACK)}
                className="w-full h-full object-cover transform-gpu transition-transform duration-500 ease-out group-hover:scale-105 will-change-transform"
              />
            ) : (
              <div className="w-full h-full min-h-[140px] flex items-center justify-center text-slate-400">
                <Building2 className="w-10 h-10" />
              </div>
            )}

            {/* Vignette Overlay for Crisp Badges */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/35 pointer-events-none" />

            {/* Top Badges */}
            <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-1 flex-wrap">
                {property.isExclusive && (
                  <span className="bg-amber-400 text-slate-950 font-bold text-2xs uppercase tracking-wider px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-xs">
                    <Sparkles className="w-2.5 h-2.5 text-slate-950 fill-slate-950" />
                    Exclusive
                  </span>
                )}
                <span
                  className={`text-2xs font-semibold px-1.5 py-0.5 rounded shadow-xs ${
                    property.projectStage === 'ongoing'
                      ? 'bg-sky-800 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {property.projectStage === 'ongoing' ? 'Ongoing' : 'Completed'}
                </span>
              </div>
            </div>

            {/* Bottom Badges on Image */}
            <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between pointer-events-none">
              <span className="text-2xs font-semibold bg-black/60 backdrop-blur-md text-white px-1.5 py-0.5 rounded">
                {property.categoryName}
              </span>
              <span className="text-2xs font-mono font-medium bg-black/60 backdrop-blur-md text-slate-200 px-1.5 py-0.5 rounded">
                {property.images.length || 1} {property.images.length === 1 ? 'photo' : 'photos'}
              </span>
            </div>
          </div>

          {/* Status & Lease Assignment Card (Directly Under Image) */}
          <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                Status:
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                  property.availabilityStatus === 'Available'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : property.availabilityStatus === 'Assigned'
                    ? 'bg-sky-100 text-sky-850 border border-sky-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}
              >
                {property.availabilityStatus}
              </span>
            </div>

            {assignedUser ? (
              <div className="p-2 bg-sky-50/90 rounded-lg border border-sky-100 space-y-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar src={assignedUser.image} name={assignedUser.name} size="sm" />
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-slate-900 truncate block leading-tight">
                      {assignedUser.name}
                    </span>
                    <span className="text-2xs text-slate-500 truncate block">
                      {assignedUser.email}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onUnassign(property)}
                  className="w-full py-1 px-2 text-2xs font-semibold text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors cursor-pointer text-center"
                >
                  Unassign Tenant
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="font-medium text-2xs leading-tight">
                    Vacant · Ready to lease
                  </span>
                </div>
                <Button
                  onClick={() => onAssign(property)}
                  size="sm"
                  icon={<Key className="w-3.5 h-3.5" />}
                  className="w-full justify-center text-xs py-1.5 h-auto"
                >
                  Assign Tenant
                </Button>
              </div>
            )}
          </div>

          {/* Full Actions Section (Moved Under Image) */}
          <div className="mt-2.5 p-3 bg-slate-50/90 rounded-xl border border-slate-200/80 space-y-2">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 block font-mono">
              Actions
            </span>

            <Button
              onClick={() => onViewDetails(property)}
              variant="secondary"
              size="sm"
              icon={<Eye className="w-4 h-4" />}
              className="w-full justify-center text-xs"
            >
              View Full Specs
            </Button>

            <button
              onClick={() => onEdit(property)}
              title="Edit apartment details"
              className="w-full py-1.5 px-3 bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-800 border border-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[34px]"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>

            <button
              onClick={() => onToggleExclusive(property.id)}
              title={property.isExclusive ? 'Remove from Exclusive list' : 'Add to Exclusive list'}
              className={`w-full py-1.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[34px] ${
                property.isExclusive
                  ? 'bg-amber-100 text-amber-950 border-amber-300 hover:bg-amber-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-sky-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{property.isExclusive ? 'Exclusive Active' : '+ Exclusive'}</span>
            </button>

            <button
              onClick={() => onDelete(property)}
              title="Delete apartment"
              className="w-full py-1.5 px-3 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl transition-colors cursor-pointer min-h-[34px] flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Content Area: Architectural Specs, Sub-Units, Agent, Amenities & Base Rent */}
      <div className="flex-1 p-4 sm:p-5 lg:p-6 flex flex-col justify-between gap-3.5 min-w-0">
        {/* Title, Category & Location */}
        <div>
          <div className="flex items-center gap-2 flex-wrap text-xs mb-1">
            <span className="font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200/80">
              {property.categoryName}
            </span>
            <span className="text-slate-400 font-mono">{cleanFloorText(property.floor)}</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-500 font-mono flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Available: <strong className="text-slate-700">{property.availableFrom || 'Immediate'}</strong>
            </span>
          </div>

          <h3
            onClick={() => onViewDetails(property)}
            className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors cursor-pointer truncate"
            title={property.title}
          >
            {property.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 mt-0.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span className="truncate">{property.address}, {property.city}, {property.state} {property.zipCode}</span>
          </p>
        </div>

        {/* Specifications Strip with clear icons */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 py-2 px-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-mono text-slate-700">
          <div className="flex items-center gap-1.5" title="Bedrooms">
            <Bed className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-900">{property.bedrooms}</span> Beds
          </div>
          <span className="text-slate-300">·</span>
          <div className="flex items-center gap-1.5" title="Bathrooms">
            <Bath className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-900">{property.bathrooms}</span> Baths
          </div>
          <span className="text-slate-300">·</span>
          <div className="flex items-center gap-1.5 text-sky-800 font-semibold" title="Balconies">
            <Wind className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span>{property.balconies ?? 1} Balconies</span>
          </div>
          <span className="text-slate-300">·</span>
          <div className="flex items-center gap-1.5" title="Square Footage">
            <Maximize2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-900">{property.size.toLocaleString()}</span> sqft
          </div>
          <span className="text-slate-300">·</span>
          <div className="flex items-center gap-1.5" title="Furnishing">
            <Sofa className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{property.furnishing}</span>
          </div>
          <span className="text-slate-300">·</span>
          <div className="flex items-center gap-1.5" title="Parking Space">
            <Car className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate max-w-[140px]">{property.parking || 'Parking Included'}</span>
          </div>
        </div>

        {/* Multi-unit Breakdown (Horizontally Scrollable - Increased Height) */}
        {property.units && property.units.length > 0 && (
          <div className="space-y-2 min-w-0">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5 font-mono">
                <Layers3 className="w-4 h-4 text-sky-700" />
                Building Sub-Units ({property.units.length}):
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {leasedUnitsCount} leased · {vacantUnitsCount} vacant
              </span>
            </div>

            <div className="flex items-stretch gap-2.5 overflow-x-auto overscroll-contain py-1.5 px-0.5 min-w-0 [scrollbar-width:thin]">
              {property.units.map((u) => (
                <div
                  key={u.id}
                  className={`shrink-0 min-w-[210px] sm:min-w-[230px] p-3 rounded-xl border flex flex-col justify-between gap-2 transition-all shadow-2xs ${
                    u.assignedUserId
                      ? 'bg-sky-50/80 text-sky-950 border-sky-200'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-sky-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-slate-900 font-mono">
                      {u.unitNumber}
                    </span>
                    {u.assignedUserId ? (
                      <span className="text-2xs font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-md border border-sky-200">
                        Leased
                      </span>
                    ) : (
                      <span className="text-2xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Vacant
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
                    <span>{u.bedrooms} Bed</span>
                    <span className="text-slate-300">·</span>
                    <span>{u.bathrooms} Bath</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-sky-800 font-semibold">{u.balconies ?? 1} Balc</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs font-mono">
                    <span className="text-slate-400 text-2xs uppercase">
                      {cleanFloorText(u.floor || property.floor)}
                    </span>
                    <span className="font-bold text-sm text-slate-900">
                      ${u.price.toLocaleString()}
                      <span className="text-2xs font-normal text-slate-500">/mo</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leasing Specialist Agent Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Leasing Specialist:
            </span>
            <span className="font-bold text-slate-900">
              {property.contactAgent?.name || 'Julian Vance'}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-500 font-mono flex items-center gap-1">
              <Phone className="w-3 h-3 text-sky-600" />
              {property.contactAgent?.phone || '+1 (212) 555-0199'}
            </span>
            {property.contactAgent?.email && (
              <>
                <span className="text-slate-300">·</span>
                <span className="text-slate-500 font-mono flex items-center gap-1">
                  <Mail className="w-3 h-3 text-sky-600" />
                  {property.contactAgent.email}
                </span>
              </>
            )}
          </div>
          <span className="text-2xs font-mono text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
            {property.contactAgent?.role || 'Senior Agent'}
          </span>
        </div>

        {/* Amenities Preview */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="text-2xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
              Amenities:
            </span>
            {property.amenities.slice(0, 5).map((amenity, idx) => (
              <span
                key={idx}
                className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60"
              >
                {amenity}
              </span>
            ))}
            {property.amenities.length > 5 && (
              <button
                type="button"
                onClick={() => onViewDetails(property)}
                className="text-xs font-semibold text-sky-700 hover:text-sky-900 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200 cursor-pointer"
              >
                +{property.amenities.length - 5} more
              </button>
            )}
          </div>
        )}

        {/* Base Monthly Rent & Financial Breakdown (Under Amenities) */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-sky-50/70 rounded-xl border border-sky-100 font-mono text-xs mt-1">
          <div className="flex items-center gap-2">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 font-sans">
              Base Monthly Rent:
            </span>
            <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight tabular-nums">
              ${property.price.toLocaleString()}
              <span className="text-xs font-normal text-slate-500 font-sans">/mo</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Security Deposit:</span>
              <strong className="text-slate-900 tabular-nums">
                ${property.securityDeposit ? property.securityDeposit.toLocaleString() : '0'}
              </strong>
            </div>
            <span className="text-sky-200">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Maintenance:</span>
              <strong className="text-slate-900 tabular-nums">
                ${property.maintenanceFee ? property.maintenanceFee.toLocaleString() : '0'}/mo
              </strong>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
