import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  Key,
  Trash2,
  Edit2,
  Sparkles,
  CheckCircle2,
  Clock,
  Eye,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Phone,
  Mail,
  UserCheck,
  Check,
  Wind,
  Layers,
  Home,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  deleteProperty,
  unassignProperty,
  togglePropertyExclusive,
  setCategoryFilter,
  setStatusFilter,
  setSearchQuery,
  setSelectedProperty,
} from '../../store/slices/propertiesSlice';
import { setUserAssignedProperty } from '../../store/slices/usersSlice';
import { terminateBooking } from '../../store/slices/bookingsSlice';
import { Property, User } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { Input } from '../common/FormField';
import { Select } from '../common/Select';
import { Tabs } from '../common/Tabs';
import { resolveImageUrl, handleImageError, DEFAULT_PROPERTY_FALLBACK } from '../../utils/imageHelper';

interface PropertyManagementProps {
  onOpenCreateProperty: () => void;
  onOpenEditProperty: (property: Property) => void;
  onOpenAssignModal: (property: Property) => void;
  onViewPropertyDetails: (property: Property) => void;
}

export const PropertyManagement: React.FC<PropertyManagementProps> = ({
  onOpenCreateProperty,
  onOpenEditProperty,
  onOpenAssignModal,
  onViewPropertyDetails,
}) => {
  const dispatch = useAppDispatch();
  const { properties, categoryFilter, statusFilter, searchQuery } = useAppSelector(
    (state) => state.properties
  );
  const { categories } = useAppSelector((state) => state.categories);
  const { users } = useAppSelector((state) => state.users);
  const { bookings } = useAppSelector((state) => state.bookings);

  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);

  const handleDeleteConfirm = () => {
    if (propertyToDelete) {
      if (propertyToDelete.assignedUserId) {
        dispatch(
          setUserAssignedProperty({
            userId: propertyToDelete.assignedUserId,
            propertyId: null,
          })
        );
        const relatedBooking = bookings.find(
          (b) => b.propertyId === propertyToDelete.id && b.status === 'Active'
        );
        if (relatedBooking) {
          dispatch(terminateBooking(relatedBooking.id));
        }
      }
      dispatch(deleteProperty(propertyToDelete.id));
      setPropertyToDelete(null);
    }
  };

  const handleUnassign = (property: Property) => {
    if (property.assignedUserId) {
      dispatch(
        setUserAssignedProperty({
          userId: property.assignedUserId,
          propertyId: null,
        })
      );
      const relatedBooking = bookings.find(
        (b) => b.propertyId === property.id && b.status === 'Active'
      );
      if (relatedBooking) {
        dispatch(terminateBooking(relatedBooking.id));
      }
    }
    dispatch(unassignProperty(property.id));
  };

  // Filtered properties
  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' ? true : p.categoryId === categoryFilter;

    const matchesStatus =
      statusFilter === 'all' ? true : p.availabilityStatus === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categoryTabs = [
    { id: 'all', label: 'All Categories', count: properties.length },
    ...categories.map((c) => ({
      id: c.id,
      label: c.name,
      count: properties.filter((p) => p.categoryId === c.id).length,
    })),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-sky-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Apartments & Property Portfolios
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-100">
              {properties.length} units
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Create residences under each category, curate exclusive & project status lists, and assign directly to tenants.
          </p>
        </div>
        <Button
          onClick={onOpenCreateProperty}
          icon={<Plus className="w-4 h-4" />}
          size="md"
          className="w-full sm:w-auto"
        >
          Add New Apartment
        </Button>
      </div>

      {/* Category Tabs Bar */}
      <div className="bg-white p-3 rounded-2xl border border-sky-100 shadow-xs">
        <Tabs
          tabs={categoryTabs}
          activeTab={categoryFilter}
          onChange={(id) => dispatch(setCategoryFilter(id))}
        />
      </div>

      {/* Filters & Search Sub-bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-sky-100 shadow-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-500 font-semibold mr-1">Status:</span>
          {['all', 'Available', 'Assigned', 'Reserved', 'Maintenance'].map((st) => (
            <button
              key={st}
              onClick={() => dispatch(setStatusFilter(st))}
              className={`px-3 py-1.5 text-xs rounded-xl font-semibold transition-all cursor-pointer min-h-[36px] ${
                statusFilter === st
                  ? 'bg-sky-700 text-white shadow-xs shadow-sky-800/25'
                  : 'bg-slate-100 text-slate-600 hover:bg-sky-50 hover:text-sky-800'
              }`}
            >
              {st === 'all' ? 'All' : st}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <Input
            placeholder="Search apartment, address..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            icon={<Search className="w-4 h-4 text-sky-700" />}
          />
        </div>
      </div>

      {/* Property Cards Grid (Responsive: 1 col mobile, 2 col md, 3 col xl) */}
      {filteredProperties.length === 0 ? (
        <div className="bg-white rounded-3xl border border-sky-100 p-12 text-center shadow-xs">
          <Building2 className="w-10 h-10 text-sky-200 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-700">No properties found</h3>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting search or click &ldquo;Add New Apartment&rdquo; to create one.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProperties.map((property) => {
            const assignedUser = users.find((u) => u.id === property.assignedUserId);

            return (
              <div
                key={property.id}
                className="bg-white rounded-2xl sm:rounded-3xl border border-sky-100/90 shadow-xs overflow-hidden flex flex-col justify-between hover:border-sky-300 hover:shadow-md transition-all group"
              >
                <div>
                  {/* Image with badges */}
                  <div className="relative aspect-16/10 bg-slate-100 overflow-hidden isolate">
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
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Building2 className="w-8 h-8" />
                      </div>
                    )}

                    {/* Gradient overlay for badges */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-auto">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {property.isExclusive && (
                          <span className="bg-amber-500/95 text-slate-950 font-bold text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                            <Sparkles className="w-3.5 h-3.5 text-slate-950" /> Exclusive
                          </span>
                        )}
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-md shadow-xs ${
                            property.projectStage === 'ongoing'
                              ? 'bg-sky-800/90 text-white'
                              : 'bg-emerald-600/90 text-white'
                          }`}
                        >
                          {property.projectStage === 'ongoing' ? 'Ongoing Dev' : 'Completed'}
                        </span>
                      </div>

                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-md shadow-xs ${
                          property.availabilityStatus === 'Available'
                            ? 'bg-emerald-50 text-emerald-800'
                            : property.availabilityStatus === 'Assigned'
                            ? 'bg-sky-50 text-sky-850 border border-sky-300'
                            : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        {property.availabilityStatus}
                      </span>
                    </div>

                    {/* Bottom overlay: Price & Category */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between text-white">
                      <div>
                        <span className="text-xs font-medium text-slate-200 block drop-shadow-xs">
                          {property.categoryName}
                        </span>
                        <div className="text-xl font-bold font-mono tracking-tight drop-shadow-xs tabular-nums text-sky-100">
                          ${property.price.toLocaleString()}
                          <span className="text-xs font-normal text-slate-200">/mo</span>
                        </div>
                      </div>
                      <span className="text-xs text-slate-200 font-mono drop-shadow-xs">
                        {property.floor}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4.5 space-y-3.5">
                    <div>
                      <h3
                        onClick={() => onViewPropertyDetails(property)}
                        className="text-base font-bold text-slate-900 hover:text-sky-800 transition-colors cursor-pointer line-clamp-1"
                        title={property.title}
                      >
                        {property.title}
                      </h3>
                      <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1 truncate">
                        <MapPin className="w-4 h-4 text-sky-700 shrink-0" />
                        <span>{property.address}, {property.city}</span>
                      </p>
                    </div>

                    {/* Specifications bar with Balconies */}
                    <div className="flex items-center justify-between text-sm text-slate-700 py-2.5 border-y border-slate-100 font-mono tabular-nums">
                      <span className="flex items-center gap-1.5" title="Bedrooms">
                        <Bed className="w-4 h-4 text-slate-400" /> {property.bedrooms}B
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="flex items-center gap-1.5" title="Bathrooms">
                        <Bath className="w-4 h-4 text-slate-400" /> {property.bathrooms}Ba
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="flex items-center gap-1.5 text-sky-800 font-semibold" title="Balconies">
                        <Wind className="w-4 h-4 text-sky-600" /> {property.balconies ?? 1} Balc
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="flex items-center gap-1.5" title="Square Footage">
                        <Maximize2 className="w-4 h-4 text-slate-400" /> {property.size.toLocaleString()} sqft
                      </span>
                    </div>

                    {/* Multi-unit breakdown preview */}
                    {property.units && property.units.length > 0 && (
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700 flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-sky-700" />
                            {property.units.length} Building Units:
                          </span>
                          <span className="text-xs text-slate-500">
                            {property.units.filter((u) => u.assignedUserId).length} leased · {property.units.filter((u) => !u.assignedUserId).length} vacant
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {property.units.slice(0, 3).map((u) => (
                            <span
                              key={u.id}
                              className={`text-xs font-medium px-2 py-0.5 rounded border ${
                                u.assignedUserId
                                  ? 'bg-sky-50 text-sky-850 border-sky-200 font-semibold'
                                  : 'bg-white text-slate-700 border-slate-200'
                              }`}
                              title={`${u.unitNumber}: ${u.bedrooms} Bed, ${u.bathrooms} Bath, ${u.balconies ?? 1} Balconies ($${u.price}/mo)`}
                            >
                              <strong className="font-bold">{u.unitNumber}</strong>: {u.bedrooms}B/{u.bathrooms}Ba · {u.balconies ?? 1} Balc
                            </span>
                          ))}
                          {property.units.length > 3 && (
                            <button
                              type="button"
                              onClick={() => onViewPropertyDetails(property)}
                              className="text-xs font-bold text-sky-700 bg-sky-50/70 hover:bg-sky-100 px-2 py-0.5 rounded border border-sky-200 cursor-pointer"
                            >
                              +{property.units.length - 3} more
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Assigned Tenant or Ready Notice */}
                    {assignedUser ? (
                      <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-100 flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Avatar src={assignedUser.image} name={assignedUser.name} size="sm" />
                          <div className="text-sm min-w-0">
                            <span className="font-bold text-slate-900 block leading-tight truncate">
                              {assignedUser.name}
                            </span>
                            <span className="text-xs text-sky-700 font-semibold">
                              Assigned Tenant
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleUnassign(property)}
                          className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer shrink-0 ml-2"
                        >
                          Unassign
                        </button>
                      </div>
                    ) : (
                      <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/60 flex items-center justify-between text-sm">
                        <span className="text-xs sm:text-sm text-emerald-800 font-semibold">
                          Available for tenant assignment
                        </span>
                        <button
                          onClick={() => onOpenAssignModal(property)}
                          className="text-xs sm:text-sm font-bold text-sky-700 hover:text-sky-900 hover:underline flex items-center gap-1 cursor-pointer min-h-[34px]"
                        >
                          <Key className="w-3.5 h-3.5 text-sky-700" /> Assign
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                  {/* Quick toggle exclusive */}
                  <button
                    onClick={() => dispatch(togglePropertyExclusive(property.id))}
                    title={property.isExclusive ? 'Remove from Exclusive' : 'Add to Exclusive List'}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer min-h-[34px] ${
                      property.isExclusive
                        ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                        : 'text-slate-500 hover:text-sky-800 hover:bg-sky-100/60'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{property.isExclusive ? 'Exclusive' : '+ Exclusive'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onViewPropertyDetails(property)}
                      title="View full specs & contact details"
                      className="p-2 text-slate-500 hover:text-sky-800 hover:bg-sky-100/60 rounded-lg transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onOpenEditProperty(property)}
                      title="Edit property"
                      className="p-2 text-slate-500 hover:text-sky-800 hover:bg-sky-100/60 rounded-lg transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPropertyToDelete(property)}
                      title="Delete property"
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!propertyToDelete}
        onClose={() => setPropertyToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Apartment Property"
        message={`Are you sure you want to delete "${propertyToDelete?.title}"? Any active lease or booking associated with this unit will be terminated.`}
        confirmLabel="Delete Property"
        variant="danger"
      />
    </div>
  );
};
