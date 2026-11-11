import React, { useState, useEffect } from 'react';
import {
  Building2,
  DollarSign,
  Sparkles,
  MapPin,
  Calendar,
  Image as ImageIcon,
  UserCheck,
  Phone,
  Mail,
  Clock,
  Plus,
  X,
  Check,
  Home,
  Trash2,
  Layers,
  Compass,
  Wind,
} from 'lucide-react';
import { useAppSelector } from '../../store';
import { Property, PropertyContact, ApartmentUnit } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { FormField, Input } from '../common/FormField';
import { Select } from '../common/Select';
import { resolveImageUrl, handleImageError, DEFAULT_PROPERTY_FALLBACK } from '../../utils/imageHelper';

interface PropertyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (propertyData: Omit<Property, 'id' | 'createdAt'>, assignToUserId?: string) => void;
  initialData?: Property | null;
}

const defaultAmenities = [
  'Private Elevator Access',
  'Panoramic Skyline View',
  '24/7 Doorman & Valet',
  'Heated Saltwater Infinity Pool',
  'High-Speed Fiber Internet',
  'In-Unit Washer & Dryer',
  'Pet Friendly with Pet Spa',
  'Fitness Studio & Wellness Gym',
  'Keyless Smart Entry Latch',
  'Private Wine Storage',
  'Direct Oceanfront Balcony',
  'Bicycle Repair Station',
];

const imagePresets = [
  { label: 'Luxury Penthouse', url: '/assets/images/prop_luxury_penthouse_1794130849626.jpg' },
  { label: 'Urban Loft Studio', url: '/assets/images/prop_studio_loft_1794130850753.jpg' },
  { label: 'Waterfront Condo', url: '/assets/images/prop_beachfront_condo_1794130850962.jpg' },
  { label: 'Private Villa', url: '/assets/images/prop_villa_residence_1794130852181.jpg' },
];

export const PropertyFormModal: React.FC<PropertyFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const { categories } = useAppSelector((state) => state.categories);
  const { users } = useAppSelector((state) => state.users);

  const [activeTab, setActiveTab] = useState<'details' | 'units' | 'specs' | 'collection' | 'contact'>('details');

  // Form Fields
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Metropolis');
  const [state, setState] = useState('CA');
  const [zipCode, setZipCode] = useState('90017');
  const [price, setPrice] = useState(4500);
  const [securityDeposit, setSecurityDeposit] = useState(4500);
  const [maintenanceFee, setMaintenanceFee] = useState(250);
  const [size, setSize] = useState(1450);
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);
  const [balconies, setBalconies] = useState(1);
  const [floor, setFloor] = useState('14th Floor');
  const [furnishing, setFurnishing] = useState<'Fully Furnished' | 'Semi-Furnished' | 'Unfurnished'>('Fully Furnished');
  const [parking, setParking] = useState('1 Reserved Garage Bay');
  const [amenities, setAmenities] = useState<string[]>(['Panoramic Skyline View', 'High-Speed Fiber Internet']);
  const [customAmenity, setCustomAmenity] = useState('');
  const [coverImage, setCoverImage] = useState(imagePresets[0].url);
  const [galleryImage, setGalleryImage] = useState(imagePresets[1].url);
  const [availabilityStatus, setAvailabilityStatus] = useState<'Available' | 'Assigned' | 'Reserved' | 'Maintenance'>('Available');
  const [availableFrom, setAvailableFrom] = useState('2026-03-01');

  // Multi-unit management inside building
  const [units, setUnits] = useState<ApartmentUnit[]>([
    {
      id: 'init-u1',
      unitNumber: 'Unit 201',
      title: '2-Bed Standard Suite',
      bedrooms: 2,
      bathrooms: 2,
      balconies: 1, // 2 bed, 2 bath, 1 balcony
      size: 1180,
      floor: '2nd Floor',
      price: 3400,
      availabilityStatus: 'Available',
      assignedUserId: null,
    },
    {
      id: 'init-u2',
      unitNumber: 'Unit 305',
      title: '3-Bed Family Residence',
      bedrooms: 3,
      bathrooms: 2,
      balconies: 2, // 3 bed, 2 bath, 2 balconies
      size: 1650,
      floor: '3rd Floor',
      price: 4300,
      availabilityStatus: 'Available',
      assignedUserId: null,
    },
  ]);

  // Unit adder state
  const [newUnitNumber, setNewUnitNumber] = useState('');
  const [newUnitBeds, setNewUnitBeds] = useState(2);
  const [newUnitBaths, setNewUnitBaths] = useState(2);
  const [newUnitBalconies, setNewUnitBalconies] = useState(1);
  const [newUnitSize, setNewUnitSize] = useState(1250);
  const [newUnitFloor, setNewUnitFloor] = useState('2nd Floor');
  const [newUnitPrice, setNewUnitPrice] = useState(3400);
  const [showAddUnitForm, setShowAddUnitForm] = useState(false);

  // Exclusive, Completed, Ongoing (Separate from Category)
  const [isExclusive, setIsExclusive] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [projectStage, setProjectStage] = useState<'completed' | 'ongoing'>('completed');
  const [listingCollection, setListingCollection] = useState<'exclusive' | 'completed' | 'ongoing' | 'standard'>('completed');

  // Contact Details
  const [contactName, setContactName] = useState('Julian Vance');
  const [contactRole, setContactRole] = useState('Senior Portfolio Director');
  const [contactPhone, setContactPhone] = useState('+1 (555) 890-1234');
  const [contactEmail, setContactEmail] = useState('julian.vance@dplproperties.com');
  const [contactWhatsapp, setContactWhatsapp] = useState('+15558901234');
  const [contactOfficeHours, setContactOfficeHours] = useState('Mon - Fri: 8:00 AM - 6:00 PM PST');

  // Direct tenant assignment on creation
  const [assignedUserId, setAssignedUserId] = useState<string>('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setCategoryId(initialData.categoryId);
      setTitle(initialData.title);
      setDescription(initialData.description);
      setAddress(initialData.address);
      setCity(initialData.city);
      setState(initialData.state);
      setZipCode(initialData.zipCode);
      setPrice(initialData.price);
      setSecurityDeposit(initialData.securityDeposit);
      setMaintenanceFee(initialData.maintenanceFee);
      setSize(initialData.size);
      setBedrooms(initialData.bedrooms);
      setBathrooms(initialData.bathrooms);
      setBalconies(initialData.balconies ?? 1);
      setFloor(String(initialData.floor));
      setFurnishing(initialData.furnishing);
      setParking(initialData.parking);
      setAmenities(initialData.amenities);
      setCoverImage(initialData.images[0] || imagePresets[0].url);
      setGalleryImage(initialData.images[1] || imagePresets[1].url);
      setAvailabilityStatus(initialData.availabilityStatus);
      setAvailableFrom(initialData.availableFrom);
      setIsExclusive(!!initialData.isExclusive);
      setIsFeatured(!!initialData.isFeatured);
      setProjectStage(initialData.projectStage || 'completed');
      setListingCollection(initialData.listingCollection || 'standard');
      setContactName(initialData.contactAgent?.name || 'Julian Vance');
      setContactRole(initialData.contactAgent?.role || 'Senior Portfolio Director');
      setContactPhone(initialData.contactAgent?.phone || '+1 (555) 890-1234');
      setContactEmail(initialData.contactAgent?.email || 'julian.vance@dplproperties.com');
      setContactWhatsapp(initialData.contactAgent?.whatsapp || '+15558901234');
      setContactOfficeHours(initialData.contactAgent?.officeHours || 'Mon - Fri: 8:00 AM - 6:00 PM PST');
      setAssignedUserId(initialData.assignedUserId || '');
      if (initialData.units && initialData.units.length > 0) {
        setUnits(initialData.units);
      }
    } else {
      // Defaults
      setTitle('');
      setDescription('');
      setAddress('');
      setPrice(4500);
      setAssignedUserId('');
    }
  }, [initialData, isOpen]);

  const handleAddUnit = () => {
    if (!newUnitNumber.trim()) return;
    const newUnit: ApartmentUnit = {
      id: `u-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      unitNumber: newUnitNumber.trim(),
      title: `${newUnitBeds}-Bed ${newUnitBaths}-Bath with ${newUnitBalconies} Balcon${newUnitBalconies === 1 ? 'y' : 'ies'}`,
      bedrooms: Number(newUnitBeds),
      bathrooms: Number(newUnitBaths),
      balconies: Number(newUnitBalconies),
      size: Number(newUnitSize),
      floor: newUnitFloor.trim() || 'Floor 1',
      price: Number(newUnitPrice),
      availabilityStatus: 'Available',
      assignedUserId: null,
    };
    setUnits([...units, newUnit]);
    setNewUnitNumber('');
    setShowAddUnitForm(false);
  };

  const handleQuickAddPreset = (beds: number, baths: number, balcs: number, defaultSize: number, defaultRent: number) => {
    const nextNum = `Unit ${200 + units.length + 1}`;
    const newUnit: ApartmentUnit = {
      id: `u-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      unitNumber: nextNum,
      title: `${beds}-Bed ${baths}-Bath Suite`,
      bedrooms: beds,
      bathrooms: baths,
      balconies: balcs,
      size: defaultSize,
      floor: `Floor ${Math.min(12, units.length + 2)}`,
      price: defaultRent,
      availabilityStatus: 'Available',
      assignedUserId: null,
    };
    setUnits([...units, newUnit]);
  };

  const handleRemoveUnit = (id: string) => {
    setUnits(units.filter((u) => u.id !== id));
  };

  const toggleAmenity = (item: string) => {
    if (amenities.includes(item)) {
      setAmenities(amenities.filter((a) => a !== item));
    } else {
      setAmenities([...amenities, item]);
    }
  };

  const handleAddCustomAmenity = () => {
    if (customAmenity.trim() && !amenities.includes(customAmenity.trim())) {
      setAmenities([...amenities, customAmenity.trim()]);
      setCustomAmenity('');
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Property title is required';
    if (!address.trim()) errs.address = 'Street address is required';
    if (!city.trim()) errs.city = 'City is required';
    if (price <= 0) errs.price = 'Valid monthly rent is required';
    if (size <= 0) errs.size = 'Square footage is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      setActiveTab('details');
      return;
    }

    const matchedCategory = categories.find((c) => c.id === categoryId);

    const contactAgent: PropertyContact = {
      name: contactName,
      role: contactRole,
      phone: contactPhone,
      email: contactEmail,
      whatsapp: contactWhatsapp,
      officeHours: contactOfficeHours,
    };

    const finalListingCollection = isExclusive
      ? 'exclusive'
      : projectStage === 'ongoing'
      ? 'ongoing'
      : 'completed';

    const propertyPayload: Omit<Property, 'id' | 'createdAt'> = {
      categoryId,
      categoryName: matchedCategory ? matchedCategory.name : 'General Residential',
      title: title.trim(),
      description: description.trim() || 'Exquisite modern residential property curated by DPL.',
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      zipCode: zipCode.trim(),
      price: Number(price),
      securityDeposit: Number(securityDeposit),
      maintenanceFee: Number(maintenanceFee),
      size: Number(size),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      balconies: Number(balconies),
      floor,
      furnishing,
      parking,
      amenities,
      images: [coverImage, galleryImage].filter(Boolean),
      availabilityStatus: assignedUserId ? 'Assigned' : availabilityStatus,
      availableFrom,
      assignedUserId: assignedUserId || null,
      units: units.length > 0 ? units : [
        {
          id: `u-${Date.now()}-1`,
          unitNumber: 'Unit 101',
          title: 'Primary Residence Unit',
          bedrooms: Number(bedrooms),
          bathrooms: Number(bathrooms),
          balconies: Number(balconies),
          size: Number(size),
          floor,
          price: Number(price),
          availabilityStatus: 'Available',
          assignedUserId: null,
        },
      ],
      isExclusive,
      isFeatured,
      projectStage,
      listingCollection: finalListingCollection,
      contactAgent,
    };

    onSubmit(propertyPayload, assignedUserId || undefined);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `Edit Property: ${initialData.title}` : 'Add New Apartment / Property'}
      subtitle="Complete real estate specifications, exclusive listing classification, and contact details"
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Step Navigation Tabs with Mobile Scroll */}
        <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-xl border border-sky-100 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-2.5 px-3 text-sm font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap min-h-[42px] ${
              activeTab === 'details'
                ? 'bg-sky-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-sky-800'
            }`}
          >
            1. Basic & Building
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('units')}
            className={`flex-1 py-2.5 px-3 text-sm font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap min-h-[42px] flex items-center justify-center gap-1.5 ${
              activeTab === 'units'
                ? 'bg-sky-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-sky-800'
            }`}
          >
            <span>2. Units, Floor & Size</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
              activeTab === 'units' ? 'bg-white text-sky-800' : 'bg-sky-100 text-sky-900'
            }`}>
              {units.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`flex-1 py-2.5 px-3 text-sm font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap min-h-[42px] ${
              activeTab === 'specs'
                ? 'bg-sky-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-sky-800'
            }`}
          >
            3. Amenities
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('collection')}
            className={`flex-1 py-2.5 px-3 text-sm font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap min-h-[42px] ${
              activeTab === 'collection'
                ? 'bg-sky-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-sky-800'
            }`}
          >
            4. Exclusive Lists
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`flex-1 py-2.5 px-3 text-sm font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap min-h-[42px] ${
              activeTab === 'contact'
                ? 'bg-sky-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-sky-800'
            }`}
          >
            5. Contacts & Assign
          </button>
        </div>

        {/* TAB 1: BASIC & PRICING */}
        {activeTab === 'details' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <FormField label="Assigned Category" required>
                <Select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  options={categories.map((c) => ({
                    value: c.id,
                    label: c.name,
                  }))}
                />
              </FormField>

              <FormField label="Availability Status">
                <Select
                  value={availabilityStatus}
                  onChange={(e) => setAvailabilityStatus(e.target.value as any)}
                  options={[
                    { value: 'Available', label: 'Available (Ready for Lease)' },
                    { value: 'Assigned', label: 'Assigned / Leased' },
                    { value: 'Reserved', label: 'Reserved' },
                    { value: 'Maintenance', label: 'Under Maintenance' },
                  ]}
                />
              </FormField>
            </div>

            <FormField label="Apartment Title / Name" required error={errors.title}>
              <Input
                placeholder="e.g. The Skyview Crown Penthouse 42B"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={!!errors.title}
              />
            </FormField>

            <FormField label="Full Street Address" required error={errors.address}>
              <Input
                placeholder="e.g. 888 Grand Horizon Ave, Suite 42B"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                error={!!errors.address}
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <FormField label="City" required error={errors.city}>
                <Input value={city} onChange={(e) => setCity(e.target.value)} />
              </FormField>
              <FormField label="State">
                <Input value={state} onChange={(e) => setState(e.target.value)} />
              </FormField>
              <FormField label="Zip Code">
                <Input value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              <FormField label="Monthly Rent ($)" required error={errors.price}>
                <Input
                  type="number"
                  min="0"
                  step="50"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </FormField>

              <FormField label="Security Deposit ($)">
                <Input
                  type="number"
                  min="0"
                  step="50"
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                />
              </FormField>

              <FormField label="Maintenance Fee ($/mo)">
                <Input
                  type="number"
                  min="0"
                  step="10"
                  value={maintenanceFee}
                  onChange={(e) => setMaintenanceFee(Number(e.target.value))}
                />
              </FormField>
            </div>

            <FormField label="Property Description / Overview">
              <textarea
                rows={3}
                placeholder="Highlight the architectural finishes, views, appliance brands, and luxury amenities..."
                className="w-full text-sm text-slate-900 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-700/25 focus:border-sky-700"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormField>

            <div className="flex justify-end pt-2">
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setActiveTab('units')}
              >
                Next: Units, Floor & Size ({units.length})
              </Button>
            </div>
          </div>
        )}

        {/* TAB 2: BUILDING UNITS, FLOOR LEVEL & SIZING */}
        {activeTab === 'units' && (
          <div className="space-y-4">
            {/* Core Property Footprint: Size & Floor Level */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Building Footprint, Floor Level & Base Specs
                  </h4>
                  <span className="text-xs text-slate-500">
                    Set overall property floor level and default square footage
                  </span>
                </div>
                <span className="text-xs font-bold text-sky-850 bg-sky-100/90 border border-sky-300 px-2.5 py-1 rounded-md">
                  Size & Floor Level
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <FormField label="Size (sq ft)" required>
                  <Input
                    type="number"
                    min="100"
                    step="50"
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                  />
                </FormField>

                <FormField label="Floor / Level">
                  <Input
                    placeholder="e.g. 42nd Floor or 14-Story Tower"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                  />
                </FormField>

                <FormField label="Bedrooms (Base)">
                  <Input
                    type="number"
                    min="0"
                    max="12"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                  />
                </FormField>

                <FormField label="Bathrooms (Base)">
                  <Input
                    type="number"
                    step="0.5"
                    min="1"
                    max="12"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                  />
                </FormField>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-slate-200/60">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Base Balconies:</span>
                  <div className="flex items-center gap-1">
                    {[0, 1, 2, 3, 4].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setBalconies(count)}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                          balconies === count
                            ? 'bg-sky-700 text-white border-sky-700 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300'
                        }`}
                      >
                        {count} {count === 1 ? 'Balcony' : 'Balconies'}
                      </button>
                    ))}
                  </div>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  Individual units below can have independent balcony and bedroom counts
                </span>
              </div>
            </div>

            <div className="bg-sky-50/70 border border-sky-200/80 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-sky-700 text-white flex items-center justify-center text-xs font-bold">
                    {units.length}
                  </span>
                  <h4 className="text-sm font-bold text-sky-950">
                    Building Units & Floor Layouts
                  </h4>
                </div>
                <p className="text-xs text-sky-800/85 mt-0.5">
                  Configure individual apartment units with unique combinations of bedrooms, bathrooms, and balconies (e.g., 2 Bed / 2 Bath / 1 Balcony vs 3 Bed / 2 Bath / 2 Balconies).
                </p>
              </div>
              <Button
                type="button"
                variant={showAddUnitForm ? 'secondary' : 'primary'}
                size="sm"
                onClick={() => setShowAddUnitForm(!showAddUnitForm)}
                className="shrink-0"
              >
                {showAddUnitForm ? (
                  <>
                    <X className="w-3.5 h-3.5 mr-1.5" />
                    Close Custom Form
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 mr-1.5" />
                    Add Custom Unit
                  </>
                )}
              </Button>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Quick Unit Presets (Click to Add)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickAddPreset(2, 2, 1, 1180, 3400)}
                  className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-sky-500 hover:bg-sky-50/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800 group-hover:text-sky-800">2 Bed · 2 Bath</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">1 Balcony</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex justify-between">
                    <span>1,180 sqft</span>
                    <span className="font-semibold text-sky-700">$3,400/mo</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickAddPreset(3, 2, 2, 1650, 4300)}
                  className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-sky-500 hover:bg-sky-50/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800 group-hover:text-sky-800">3 Bed · 2 Bath</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">2 Balconies</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex justify-between">
                    <span>1,650 sqft</span>
                    <span className="font-semibold text-sky-700">$4,300/mo</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickAddPreset(1, 1, 1, 780, 2600)}
                  className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-sky-500 hover:bg-sky-50/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800 group-hover:text-sky-800">1 Bed · 1 Bath</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">1 Balcony</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex justify-between">
                    <span>780 sqft</span>
                    <span className="font-semibold text-sky-700">$2,600/mo</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickAddPreset(4, 3.5, 3, 2800, 7500)}
                  className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-sky-500 hover:bg-sky-50/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800 group-hover:text-sky-800">4 Bed · 3.5 Bath</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">3 Balconies</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex justify-between">
                    <span>2,800 sqft</span>
                    <span className="font-semibold text-sky-700">$7,500/mo</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Custom Unit Form */}
            {showAddUnitForm && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    New Apartment Unit Specifications
                  </h5>
                  <span className="text-xs text-slate-500">Specify bedrooms, bathrooms, and balconies</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <FormField label="Unit # / Suite" required>
                    <Input
                      placeholder="e.g. Unit 402"
                      value={newUnitNumber}
                      onChange={(e) => setNewUnitNumber(e.target.value)}
                    />
                  </FormField>
                  <FormField label="Floor / Level">
                    <Input
                      placeholder="e.g. 4th Floor"
                      value={newUnitFloor}
                      onChange={(e) => setNewUnitFloor(e.target.value)}
                    />
                  </FormField>
                  <FormField label="Bedrooms" required>
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      value={newUnitBeds}
                      onChange={(e) => setNewUnitBeds(Number(e.target.value))}
                    />
                  </FormField>
                  <FormField label="Bathrooms" required>
                    <Input
                      type="number"
                      step="0.5"
                      min="1"
                      max="10"
                      value={newUnitBaths}
                      onChange={(e) => setNewUnitBaths(Number(e.target.value))}
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <FormField label="Balconies Count" required hint="Dedicated balcony terraces">
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2, 3, 4].map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => setNewUnitBalconies(count)}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                            newUnitBalconies === count
                              ? 'bg-sky-700 text-white border-sky-700 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300'
                          }`}
                        >
                          {count} {count === 1 ? 'Balc' : 'Balcs'}
                        </button>
                      ))}
                    </div>
                  </FormField>
                  <FormField label="Size (sq ft)" required>
                    <Input
                      type="number"
                      min="200"
                      step="50"
                      value={newUnitSize}
                      onChange={(e) => setNewUnitSize(Number(e.target.value))}
                    />
                  </FormField>
                  <FormField label="Monthly Rent ($)" required>
                    <Input
                      type="number"
                      min="100"
                      step="50"
                      value={newUnitPrice}
                      onChange={(e) => setNewUnitPrice(Number(e.target.value))}
                    />
                  </FormField>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddUnitForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    disabled={!newUnitNumber.trim()}
                    onClick={handleAddUnit}
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Confirm & Add Unit
                  </Button>
                </div>
              </div>
            )}

            {/* List of Configured Units */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Current Units in Building ({units.length})
                </span>
                <span className="text-xs text-slate-500">
                  {units.filter((u) => u.assignedUserId).length} Assigned · {units.filter((u) => !u.assignedUserId).length} Vacant
                </span>
              </div>

              {units.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                  <Building2 className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
                  <p className="text-xs font-semibold text-slate-600">No units added yet</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Click a quick preset above or create a custom unit
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs max-h-60 overflow-y-auto">
                  {units.map((unit) => (
                    <div
                      key={unit.id}
                      className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-slate-50/70 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-100 flex flex-col items-center justify-center shrink-0">
                          <Home className="w-4 h-4 text-sky-700 mb-0.5" />
                          <span className="text-xs font-bold text-sky-900 leading-none">
                            {unit.unitNumber.replace(/Unit /i, '#')}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{unit.unitNumber}</span>
                            <span className="text-xs font-medium text-slate-500">({unit.floor})</span>
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                                unit.assignedUserId
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-sky-50 text-sky-700 border border-sky-200'
                              }`}
                            >
                              {unit.assignedUserId ? 'Leased' : 'Available'}
                            </span>
                          </div>
                          <div className="flex items-center flex-wrap gap-2 text-xs text-slate-600 mt-1">
                            <span className="font-semibold text-slate-700">
                              {unit.bedrooms} Bed · {unit.bathrooms} Bath
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="inline-flex items-center text-sky-800 font-bold bg-sky-50 px-2 py-0.5 rounded text-xs">
                              <Wind className="w-3.5 h-3.5 mr-1 text-sky-600" />
                              {unit.balconies ?? 1} {(unit.balconies ?? 1) === 1 ? 'Balcony' : 'Balconies'}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span>{unit.size} sqft</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div className="text-right">
                          <div className="text-sm font-bold text-sky-800">${unit.price.toLocaleString()}</div>
                          <div className="text-xs text-slate-400">per month</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveUnit(unit.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Remove unit"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab('details')}
              >
                Back: Basic Info
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setActiveTab('specs')}
              >
                Next: Amenities
              </Button>
            </div>
          </div>
        )}

        {/* TAB 3: AMENITIES */}
        {activeTab === 'specs' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <FormField label="Furnishing State">
                <Select
                  value={furnishing}
                  onChange={(e) => setFurnishing(e.target.value as any)}
                  options={[
                    { value: 'Fully Furnished', label: 'Fully Furnished' },
                    { value: 'Semi-Furnished', label: 'Semi-Furnished' },
                    { value: 'Unfurnished', label: 'Unfurnished' },
                  ]}
                />
              </FormField>

              <FormField label="Parking Assignment">
                <Input
                  placeholder="e.g. 2 Reserved EV Stalls"
                  value={parking}
                  onChange={(e) => setParking(e.target.value)}
                />
              </FormField>
            </div>

            {/* Photos & Visuals */}
            <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-100 space-y-3">
              <label className="text-xs font-bold text-slate-800 block">
                Apartment Imagery (Cover & Gallery)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-slate-500 font-semibold block mb-1">
                    Primary Cover Photo URL
                  </span>
                  <Input
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                  />
                  {coverImage && (
                    <img
                      src={resolveImageUrl(coverImage)}
                      alt="Cover preview"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => handleImageError(e, DEFAULT_PROPERTY_FALLBACK)}
                      className="mt-2 w-full h-24 object-cover rounded-xl border border-sky-100"
                    />
                  )}
                </div>

                <div>
                  <span className="text-xs text-slate-500 font-semibold block mb-1">
                    Secondary Gallery Photo URL
                  </span>
                  <Input
                    value={galleryImage}
                    onChange={(e) => setGalleryImage(e.target.value)}
                  />
                  {galleryImage && (
                    <img
                      src={resolveImageUrl(galleryImage)}
                      alt="Gallery preview"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => handleImageError(e, DEFAULT_PROPERTY_FALLBACK)}
                      className="mt-2 w-full h-24 object-cover rounded-xl border border-sky-100"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <span className="text-xs text-slate-500 font-medium">Quick presets:</span>
                {imagePresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCoverImage(preset.url);
                    }}
                    className="text-xs font-semibold text-sky-800 bg-white border border-sky-200 hover:border-sky-300 px-3 py-1.5 rounded-lg cursor-pointer min-h-[34px]"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities Checklist */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Amenities & Unit Features
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {defaultAmenities.map((amenity) => {
                  const isSelected = amenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs text-left transition-colors cursor-pointer min-h-[40px] ${
                        isSelected
                          ? 'border-sky-700 bg-sky-700 text-white font-semibold shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-sky-50/50'
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border ${
                          isSelected
                            ? 'bg-white border-white text-sky-800'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5" />}
                      </div>
                      <span className="truncate">{amenity}</span>
                    </button>
                  );
                })}
              </div>

              {/* Add custom amenity */}
              <div className="flex gap-2 mt-2.5">
                <Input
                  placeholder="Add custom amenity (e.g. Heated Bathroom Floors)"
                  value={customAmenity}
                  onChange={(e) => setCustomAmenity(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomAmenity();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleAddCustomAmenity}
                >
                  Add
                </Button>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setActiveTab('units')}
              >
                Back: Units, Floor & Size
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setActiveTab('collection')}
              >
                Next: Exclusive & Status Lists
              </Button>
            </div>
          </div>
        )}

        {/* TAB 4: EXCLUSIVE / COMPLETED / ONGOING (Separate from Category) */}
        {activeTab === 'collection' && (
          <div className="space-y-4">
            <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200/80">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-800" />
                <h4 className="text-xs font-bold text-sky-950">
                  Special Status Collections (Separate from Category)
                </h4>
              </div>
              <p className="text-xs text-sky-900 mt-1">
                Properties can be organized into Exclusive Collections, Completed (Ready to Move), or Ongoing construction pipelines independently of their architectural category.
              </p>
            </div>

            {/* Exclusive Feature Toggle */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Add to Exclusive Feature List
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  Marks this apartment as a flagship VIP listing with premier priority and gold badge.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={isExclusive}
                  onChange={(e) => setIsExclusive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-700"></div>
              </label>
            </div>

            {/* Project Stage: Completed vs Ongoing */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-900 block">
                Development Stage (Completed vs Ongoing)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setProjectStage('completed')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    projectStage === 'completed'
                      ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      Completed / Ready to Move
                    </span>
                    <span className="w-3.5 h-3.5 rounded-full border border-emerald-600 flex items-center justify-center">
                      {projectStage === 'completed' && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Construction and snagging complete. Ready for immediate tenant assignment.
                  </p>
                </div>

                <div
                  onClick={() => setProjectStage('ongoing')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    projectStage === 'ongoing'
                      ? 'border-sky-700 bg-sky-50/60 ring-1 ring-sky-700'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      Ongoing / Under Development
                    </span>
                    <span className="w-3.5 h-3.5 rounded-full border border-sky-700 flex items-center justify-center">
                      {projectStage === 'ongoing' && (
                        <span className="w-2 h-2 rounded-full bg-sky-700" />
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Under active development. Showcases upcoming handover dates and pre-leasing.
                  </p>
                </div>
              </div>
            </div>

            {/* Handover / Available from Date */}
            <FormField
              label={projectStage === 'ongoing' ? 'Estimated Handover Date' : 'Available From'}
              required
            >
              <Input
                type="date"
                value={availableFrom}
                onChange={(e) => setAvailableFrom(e.target.value)}
              />
            </FormField>

            <div className="flex justify-between pt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setActiveTab('specs')}
              >
                Back
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setActiveTab('contact')}
              >
                Next: Contact Details & Assignment
              </Button>
            </div>
          </div>
        )}

        {/* TAB 4: CONTACTS & DIRECT ASSIGNMENT */}
        {activeTab === 'contact' && (
          <div className="space-y-4">
            <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-100 space-y-1">
              <h4 className="text-xs font-bold text-slate-800">
                Property Management Contact Details
              </h4>
              <p className="text-xs text-slate-500">
                Contact information regarding unit availability and private viewing appointments.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <FormField label="Assigned Manager / Agent Name" required>
                <Input
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
              </FormField>

              <FormField label="Professional Title / Role">
                <Input
                  value={contactRole}
                  onChange={(e) => setContactRole(e.target.value)}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <FormField label="Phone Number" required>
                <Input
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </FormField>

              <FormField label="Email Address" required>
                <Input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </FormField>

              <FormField label="WhatsApp Number">
                <Input
                  value={contactWhatsapp}
                  onChange={(e) => setContactWhatsapp(e.target.value)}
                />
              </FormField>
            </div>

            <FormField label="Office Hours / Response Time">
              <Input
                value={contactOfficeHours}
                onChange={(e) => setContactOfficeHours(e.target.value)}
              />
            </FormField>

            {/* Direct User Assignment */}
            <div className="p-4 bg-gradient-to-r from-sky-900 to-slate-900 text-white rounded-2xl space-y-2 mt-4">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-sky-300" />
                <h4 className="text-xs font-bold">
                  Direct Tenant Assignment
                </h4>
              </div>
              <p className="text-xs text-slate-300">
                Assign this apartment directly to a registered user for personalized account access.
              </p>

              <div className="pt-2">
                <select
                  value={assignedUserId}
                  onChange={(e) => setAssignedUserId(e.target.value)}
                  className="w-full text-xs text-slate-900 bg-white border border-slate-300 rounded-xl px-3 py-2.5 cursor-pointer focus:outline-hidden min-h-[42px]"
                >
                  <option value="">-- No Immediate Tenant (Keep Available) --</option>
                  {users
                    .filter((u) => u.role === 'user')
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email}) - {user.assignedPropertyId ? 'Currently Assigned' : 'Unassigned'}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setActiveTab('collection')}
              >
                Back
              </Button>
              <div className="flex items-center gap-2">
                <Button type="button" variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  {initialData ? 'Update Property' : 'Publish Property'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};
