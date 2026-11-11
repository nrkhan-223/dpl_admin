import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  Building2,
  Plus,
  MapPin,
  Calendar,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  togglePropertyExclusive,
  updateProperty,
} from '../../store/slices/propertiesSlice';
import { Property } from '../../types';
import { Button } from '../common/Button';
import { Tabs } from '../common/Tabs';

interface CollectionsManagementProps {
  onOpenCreateProperty: () => void;
  onViewPropertyDetails: (property: Property) => void;
}

export const CollectionsManagement: React.FC<CollectionsManagementProps> = ({
  onOpenCreateProperty,
  onViewPropertyDetails,
}) => {
  const dispatch = useAppDispatch();
  const { properties } = useAppSelector((state) => state.properties);

  const [activeCollectionTab, setActiveCollectionTab] = useState<'exclusive' | 'completed' | 'ongoing'>('exclusive');

  const exclusiveProps = properties.filter((p) => p.isExclusive);
  const completedProps = properties.filter((p) => p.projectStage === 'completed');
  const ongoingProps = properties.filter((p) => p.projectStage === 'ongoing');

  const collectionTabs = [
    {
      id: 'exclusive',
      label: 'Exclusive Feature List',
      count: exclusiveProps.length,
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" />,
    },
    {
      id: 'completed',
      label: 'Completed Properties',
      count: completedProps.length,
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
    },
    {
      id: 'ongoing',
      label: 'Ongoing Developments',
      count: ongoingProps.length,
      icon: <Clock className="w-3.5 h-3.5 text-sky-700" />,
    },
  ];

  const currentList =
    activeCollectionTab === 'exclusive'
      ? exclusiveProps
      : activeCollectionTab === 'completed'
      ? completedProps
      : ongoingProps;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-sky-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Curated Property Lists & Project Pipelines
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200/80">
              Separate from Category
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Curate listings into Exclusive showcases, Completed move-in ready apartments, or Ongoing construction developments.
          </p>
        </div>
        <Button
          onClick={onOpenCreateProperty}
          icon={<Plus className="w-4 h-4" />}
          size="md"
          className="w-full sm:w-auto"
        >
          Add Apartment to List
        </Button>
      </div>

      {/* Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-sky-100 shadow-xs">
        <Tabs
          tabs={collectionTabs}
          activeTab={activeCollectionTab}
          onChange={(id) => setActiveCollectionTab(id as any)}
        />
      </div>

      {/* Overview Banner for current list */}
      <div
        className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          activeCollectionTab === 'exclusive'
            ? 'bg-amber-50/60 border-amber-200/80 text-amber-950'
            : activeCollectionTab === 'completed'
            ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-950'
            : 'bg-sky-50/60 border-sky-200/80 text-sky-950'
        }`}
      >
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider">
            {activeCollectionTab === 'exclusive' && 'Exclusive Collection Showcase'}
            {activeCollectionTab === 'completed' && 'Completed Residences (Move-in Ready)'}
            {activeCollectionTab === 'ongoing' && 'Ongoing Developments & Future Handovers'}
          </h3>
          <p className="text-xs mt-0.5 opacity-80">
            {activeCollectionTab === 'exclusive' &&
              'Properties given premier priority and marked with verified luxury badges.'}
            {activeCollectionTab === 'completed' &&
              'Finished construction, available for immediate tenancy and private viewing appointments.'}
            {activeCollectionTab === 'ongoing' &&
              'Under active construction with scheduled completion dates and pre-lease registration.'}
          </p>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <span className="text-2xl font-bold font-mono tabular-nums">
            {currentList.length}
          </span>
          <span className="text-xs opacity-75 block">active listings</span>
        </div>
      </div>

      {/* Grid of properties in this list (1 col on mobile, 2 col md, 3 col lg) */}
      {currentList.length === 0 ? (
        <div className="bg-white rounded-3xl border border-sky-100 p-12 text-center shadow-xs">
          <Building2 className="w-10 h-10 text-sky-200 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-700">No properties in this list</h4>
          <p className="text-xs text-slate-400 mt-1">
            Toggle properties below to include them in the {activeCollectionTab} collection.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentList.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-2xl sm:rounded-3xl border border-sky-100 shadow-xs overflow-hidden flex flex-col justify-between hover:border-sky-300 transition-all"
            >
              <div>
                <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    {property.isExclusive && (
                      <span className="bg-amber-500 text-slate-950 font-bold text-xs px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                        <Sparkles className="w-3.5 h-3.5 text-slate-950" /> Exclusive
                      </span>
                    )}
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-md text-white shadow-xs ${
                        property.projectStage === 'ongoing' ? 'bg-sky-800' : 'bg-emerald-600'
                      }`}
                    >
                      {property.projectStage === 'ongoing' ? 'Ongoing' : 'Completed'}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between text-white">
                    <div>
                      <span className="text-xs text-slate-200 block drop-shadow-xs">
                        Category: {property.categoryName}
                      </span>
                      <span className="text-lg font-bold font-mono drop-shadow-xs tabular-nums text-sky-100">
                        ${property.price.toLocaleString()}/mo
                      </span>
                    </div>
                    <span className="text-xs text-slate-200 font-mono">
                      {property.floor}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2.5">
                  <div>
                    <h4
                      onClick={() => onViewPropertyDetails(property)}
                      className="text-base font-bold text-slate-900 hover:text-sky-800 transition-colors cursor-pointer line-clamp-1"
                    >
                      {property.title}
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-sky-700 shrink-0" />
                      <span className="truncate">{property.address}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-600 pt-1 font-mono tabular-nums">
                    <span>{property.bedrooms} Beds</span>
                    <span>·</span>
                    <span>{property.bathrooms} Baths</span>
                    <span>·</span>
                    <span>{property.size} sqft</span>
                  </div>

                  <div className="text-xs text-slate-500 flex items-center gap-1 pt-1">
                    <Calendar className="w-3 h-3 text-sky-700" />
                    <span>
                      {property.projectStage === 'ongoing' ? 'Estimated Handover:' : 'Available:'}{' '}
                      <strong className="text-slate-800">{property.availableFrom}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Controls */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                {/* Switch stage */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() =>
                      dispatch(
                        updateProperty({
                          id: property.id,
                          data: {
                            projectStage:
                              property.projectStage === 'completed' ? 'ongoing' : 'completed',
                          },
                        })
                      )
                    }
                    className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-sky-300 hover:text-sky-700 px-3 py-1.5 rounded-lg cursor-pointer transition-colors min-h-[36px]"
                  >
                    Move to {property.projectStage === 'completed' ? 'Ongoing' : 'Completed'}
                  </button>

                  <button
                    onClick={() => dispatch(togglePropertyExclusive(property.id))}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors min-h-[36px] ${
                      property.isExclusive
                        ? 'bg-amber-100 text-amber-900 border border-amber-200'
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-sky-300 hover:text-sky-700'
                    }`}
                  >
                    {property.isExclusive ? '★ Exclusive' : '+ Exclusive'}
                  </button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewPropertyDetails(property)}
                >
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
