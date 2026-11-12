import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
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
import { ApartmentListItem } from './ApartmentListItem';

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

      {/* Property List View with all comprehensive details */}
      {filteredProperties.length === 0 ? (
        <div className="bg-white rounded-3xl border border-sky-100 p-12 text-center shadow-xs">
          <Building2 className="w-10 h-10 text-sky-200 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-700">No properties found</h3>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting search or click &ldquo;Add New Apartment&rdquo; to create one.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredProperties.map((property) => (
            <ApartmentListItem
              key={property.id}
              property={property}
              assignedUser={users.find((u) => u.id === property.assignedUserId)}
              onViewDetails={onViewPropertyDetails}
              onEdit={onOpenEditProperty}
              onAssign={onOpenAssignModal}
              onUnassign={handleUnassign}
              onToggleExclusive={(id) => dispatch(togglePropertyExclusive(id))}
              onDelete={(p) => setPropertyToDelete(p)}
            />
          ))}
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
