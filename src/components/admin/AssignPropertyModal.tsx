import React, { useState, useEffect } from 'react';
import { Key, Calendar, DollarSign, UserCheck, Building2, Check, AlertCircle, Home } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { assignPropertyToUser, assignUnitToUser } from '../../store/slices/propertiesSlice';
import { setUserAssignedProperty } from '../../store/slices/usersSlice';
import { createBooking } from '../../store/slices/bookingsSlice';
import { Property, User } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { FormField, Input } from '../common/FormField';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';

interface AssignPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedUser?: User | null;
  preselectedProperty?: Property | null;
}

export const AssignPropertyModal: React.FC<AssignPropertyModalProps> = ({
  isOpen,
  onClose,
  preselectedUser,
  preselectedProperty,
}) => {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.users);
  const { properties } = useAppSelector((state) => state.properties);

  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  const [selectedUnitId, setSelectedUnitId] = useState<string>('');
  const [startDate, setStartDate] = useState('2026-03-01');
  const [endDate, setEndDate] = useState('2027-02-28');
  const [agreedRent, setAgreedRent] = useState<number>(0);
  const [securityDeposit, setSecurityDeposit] = useState<number>(0);
  const [installmentPlan, setInstallmentPlan] = useState<'4' | '2' | '3' | '1' | '12'>('4');
  const [firstInstallmentPaidNow, setFirstInstallmentPaidNow] = useState<boolean>(true);
  const [notes, setNotes] = useState('Direct administrative assignment for personalized account access.');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (preselectedUser) {
      setSelectedUserId(preselectedUser.id);
    } else if (users.length > 0) {
      const firstAvailableUser = users.find((u) => u.role === 'user' && !u.assignedPropertyId) || users.find(u => u.role === 'user');
      if (firstAvailableUser) setSelectedUserId(firstAvailableUser.id);
    }

    if (preselectedProperty) {
      setSelectedPropertyId(preselectedProperty.id);
      const availUnit = preselectedProperty.units?.find((u) => u.availabilityStatus === 'Available') || preselectedProperty.units?.[0];
      if (availUnit) {
        setSelectedUnitId(availUnit.id);
        setAgreedRent(availUnit.price);
        setSecurityDeposit(availUnit.securityDeposit || availUnit.price);
      } else {
        setSelectedUnitId('');
        setAgreedRent(preselectedProperty.price);
        setSecurityDeposit(preselectedProperty.securityDeposit);
      }
    } else if (properties.length > 0) {
      const firstAvailProp = properties.find((p) => p.availabilityStatus === 'Available') || properties[0];
      if (firstAvailProp) {
        setSelectedPropertyId(firstAvailProp.id);
        const availUnit = firstAvailProp.units?.find((u) => u.availabilityStatus === 'Available') || firstAvailProp.units?.[0];
        if (availUnit) {
          setSelectedUnitId(availUnit.id);
          setAgreedRent(availUnit.price);
          setSecurityDeposit(availUnit.securityDeposit || availUnit.price);
        } else {
          setSelectedUnitId('');
          setAgreedRent(firstAvailProp.price);
          setSecurityDeposit(firstAvailProp.securityDeposit);
        }
      }
    }
  }, [preselectedUser, preselectedProperty, isOpen]);

  const handlePropertyChange = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    const prop = properties.find((p) => p.id === propertyId);
    if (prop) {
      const availUnit = prop.units?.find((u) => u.availabilityStatus === 'Available') || prop.units?.[0];
      if (availUnit) {
        setSelectedUnitId(availUnit.id);
        setAgreedRent(availUnit.price);
        setSecurityDeposit(availUnit.securityDeposit || availUnit.price);
      } else {
        setSelectedUnitId('');
        setAgreedRent(prop.price);
        setSecurityDeposit(prop.securityDeposit);
      }
    }
  };

  const handleUnitChange = (unitId: string) => {
    setSelectedUnitId(unitId);
    const prop = properties.find((p) => p.id === selectedPropertyId);
    if (prop && prop.units) {
      const unit = prop.units.find((u) => u.id === unitId);
      if (unit) {
        setAgreedRent(unit.price);
        setSecurityDeposit(unit.securityDeposit || unit.price);
      }
    }
  };

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      setError('Please select a resident user');
      return;
    }
    if (!selectedPropertyId) {
      setError('Please select an apartment building');
      return;
    }

    const user = users.find((u) => u.id === selectedUserId);
    const property = properties.find((p) => p.id === selectedPropertyId);

    if (!user || !property) {
      setError('Invalid user or property selected');
      return;
    }

    const chosenUnit = property.units?.find((u) => u.id === selectedUnitId);

    // 1. Assign property and unit in propertiesSlice
    dispatch(assignPropertyToUser({ propertyId: property.id, userId: user.id, unitId: selectedUnitId }));
    if (selectedUnitId) {
      dispatch(
        assignUnitToUser({
          propertyId: property.id,
          unitId: selectedUnitId,
          userId: user.id,
          userName: user.name,
        })
      );
    }

    // 2. Assign property in usersSlice
    dispatch(
      setUserAssignedProperty({
        userId: user.id,
        propertyId: property.id,
        unitId: selectedUnitId || null,
        unitNumber: chosenUnit ? `${chosenUnit.unitNumber} (${chosenUnit.bedrooms}B/${chosenUnit.bathrooms}Ba · ${chosenUnit.balconies} Balc)` : null,
      })
    );

    // 3. Build Installment Payment Schedule
    const count = Number(installmentPlan);
    const annualRent = Number(agreedRent) * 12;
    const totalContractValue = annualRent + Number(securityDeposit);
    const installmentAmount = Math.round(totalContractValue / count);

    const start = new Date(startDate);
    const monthsPerInstallment = 12 / count;
    const installments = [];

    for (let i = 1; i <= count; i++) {
      const d = new Date(start);
      d.setMonth(start.getMonth() + Math.round((i - 1) * monthsPerInstallment));
      const dueDate = d.toISOString().split('T')[0];

      const isFirstPaid = i === 1 && firstInstallmentPaidNow;
      installments.push({
        id: `inst-${Date.now()}-${i}`,
        installmentNumber: i,
        title: count === 1
          ? 'Single Lump Sum Payment'
          : i === 1
          ? 'Installment 1: Move-in Deposit & Advance'
          : `Installment ${i}: Term Balance`,
        dueDate,
        amount: installmentAmount,
        paidAmount: isFirstPaid ? installmentAmount : 0,
        status: isFirstPaid ? ('Paid' as const) : ('Pending' as const),
        paidAt: isFirstPaid ? new Date().toISOString() : null,
        paymentMethod: isFirstPaid ? ('Bank Wire' as const) : undefined,
        transactionRef: isFirstPaid ? `TX-INIT-${Math.floor(100000 + Math.random() * 900000)}` : undefined,
        notes: isFirstPaid ? 'First installment confirmed on assignment.' : undefined,
      });
    }

    const totalPaidAmount = firstInstallmentPaidNow ? installmentAmount : 0;
    const totalDueAmount = Math.max(0, totalContractValue - totalPaidAmount);

    const unitSpecs = chosenUnit
      ? `${chosenUnit.bedrooms} Bed · ${chosenUnit.bathrooms} Bath · ${chosenUnit.balconies} Balcon${chosenUnit.balconies === 1 ? 'y' : 'ies'} (${chosenUnit.size} sqft)`
      : `${property.bedrooms} Bed · ${property.bathrooms} Bath · ${property.balconies || 1} Balcony (${property.size} sqft)`;

    dispatch(
      createBooking({
        propertyId: property.id,
        propertyTitle: property.title,
        propertyAddress: property.address,
        unitId: selectedUnitId || null,
        unitNumber: chosenUnit ? chosenUnit.unitNumber : null,
        unitSpecs,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userPhone: user.phone,
        startDate,
        endDate,
        monthlyRent: Number(agreedRent),
        securityDeposit: Number(securityDeposit),
        totalContractValue,
        totalPaidAmount,
        totalDueAmount,
        installments,
        status: 'Active',
        notes: notes + (chosenUnit ? ` Assigned ${chosenUnit.unitNumber} (${unitSpecs}).` : '') + ` Payment scheduled in ${count} installment${count > 1 ? 's' : ''}.`,
      })
    );

    onClose();
  };

  const chosenUser = users.find((u) => u.id === selectedUserId);
  const chosenProperty = properties.find((p) => p.id === selectedPropertyId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Direct Property Assignment"
      subtitle="Grant personalized account access and establish active lease record"
      maxWidth="xl"
    >
      <form onSubmit={handleAssign} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* User Selection */}
        <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-100 space-y-2">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-sky-800" />
            1. Select User Profile
          </label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full text-xs text-slate-900 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 cursor-pointer focus:outline-hidden min-h-[42px]"
          >
            <option value="">-- Choose Tenant User --</option>
            {users
              .filter((u) => u.role === 'user')
              .map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} · {u.email} ({u.assignedPropertyId ? 'Currently Assigned' : 'Ready for Lease'})
                </option>
              ))}
          </select>

          {chosenUser && (
            <div className="flex items-center gap-3 pt-1">
              <Avatar src={chosenUser.image} name={chosenUser.name} size="sm" />
              <div className="text-xs">
                <span className="font-bold text-slate-900">{chosenUser.name}</span>
                <span className="text-slate-500 ml-2">{chosenUser.phone}</span>
              </div>
            </div>
          )}
        </div>

        {/* Property Selection */}
        <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-100 space-y-2">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-sky-800" />
            2. Select Apartment / Residence
          </label>
          <select
            value={selectedPropertyId}
            onChange={(e) => handlePropertyChange(e.target.value)}
            className="w-full text-xs text-slate-900 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 cursor-pointer focus:outline-hidden min-h-[42px]"
          >
            <option value="">-- Choose Property --</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} · ${p.price.toLocaleString()}/mo ({p.availabilityStatus})
              </option>
            ))}
          </select>

          {chosenProperty && (
            <div className="flex items-center gap-3 pt-1">
              {chosenProperty.images[0] && (
                <img
                  src={chosenProperty.images[0]}
                  alt={chosenProperty.title}
                  className="w-12 h-10 object-cover rounded-lg border border-sky-100"
                />
              )}
              <div className="text-xs">
                <div className="font-bold text-slate-900 text-sm">{chosenProperty.title}</div>
                <div className="text-slate-500 text-xs">{chosenProperty.address} · {chosenProperty.floor}</div>
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Specific Unit Selection */}
        {chosenProperty?.units && chosenProperty.units.length > 0 && (
          <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-200/90 space-y-2.5">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Home className="w-4 h-4 text-sky-800" />
                3. Select Specific Unit / Layout
              </label>
              <span className="text-xs font-mono text-sky-900 font-semibold">
                {chosenProperty.units.length} Units in Building
              </span>
            </div>

            <select
              value={selectedUnitId}
              onChange={(e) => handleUnitChange(e.target.value)}
              className="w-full text-xs sm:text-sm text-slate-900 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 cursor-pointer focus:outline-hidden min-h-[44px]"
            >
              <option value="">-- Choose Specific Unit in Building --</option>
              {chosenProperty.units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.unitNumber} · {unit.bedrooms} Bed, {unit.bathrooms} Bath, {unit.balconies} Balcon{unit.balconies === 1 ? 'y' : 'ies'} · {unit.size} sqft (${unit.price.toLocaleString()}/mo) - [{unit.availabilityStatus}]
                </option>
              ))}
            </select>

            {chosenProperty.units.find((u) => u.id === selectedUnitId) && (
              (() => {
                const curUnit = chosenProperty.units.find((u) => u.id === selectedUnitId)!;
                return (
                  <div className="p-3 bg-white rounded-xl border border-sky-200 flex flex-wrap items-center justify-between gap-2 text-xs shadow-2xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sky-900 bg-sky-100 border border-sky-300 px-2 py-0.5 rounded-md text-xs">
                        {curUnit.unitNumber}
                      </span>
                      <span className="text-slate-800 font-semibold text-xs sm:text-sm">
                        {curUnit.bedrooms} Bed · {curUnit.bathrooms} Bath · {curUnit.balconies} Balcon{curUnit.balconies === 1 ? 'y' : 'ies'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                      <span>{curUnit.size} sqft</span>
                      <span>·</span>
                      <span>{curUnit.floor}</span>
                      <span>·</span>
                      <strong className="text-sky-800 font-bold">${curUnit.price.toLocaleString()}/mo</strong>
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        )}

        {/* Lease Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <FormField label="Lease Start Date" required>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </FormField>
          <FormField label="Lease Expiration Date" required>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </FormField>
        </div>

        {/* Financial Terms */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <FormField label="Agreed Monthly Rent ($)" required>
            <Input
              type="number"
              value={agreedRent}
              onChange={(e) => setAgreedRent(Number(e.target.value))}
            />
          </FormField>
          <FormField label="Security Deposit Held ($)" required>
            <Input
              type="number"
              value={securityDeposit}
              onChange={(e) => setSecurityDeposit(Number(e.target.value))}
            />
          </FormField>
        </div>

        {/* Installment Payment Plan (User Requirement) */}
        <div className="p-4 bg-sky-50/80 rounded-2xl border border-sky-200/90 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-1">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-sky-800" />
              Due Amount Installment Payment Plan
            </span>
            <span className="text-xs font-mono text-sky-900 font-bold">
              Total Contract: ${((agreedRent * 12) + securityDeposit).toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Split Due Amount Into:">
              <select
                value={installmentPlan}
                onChange={(e) => setInstallmentPlan(e.target.value as any)}
                className="w-full text-xs text-slate-900 bg-white border border-slate-200 rounded-xl px-3 py-2 cursor-pointer focus:outline-hidden min-h-[38px]"
              >
                <option value="4">4 Quarterly Installments (25% each)</option>
                <option value="2">2 Semi-Annual Installments (50% each)</option>
                <option value="3">3 Tri-Annual Installments</option>
                <option value="12">12 Monthly Installments</option>
                <option value="1">1 Full Payment (No Installments)</option>
              </select>
            </FormField>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 cursor-pointer min-h-[38px]">
                <input
                  type="checkbox"
                  checked={firstInstallmentPaidNow}
                  onChange={(e) => setFirstInstallmentPaidNow(e.target.checked)}
                  className="rounded text-sky-700 focus:ring-sky-700"
                />
                <span className="text-xs font-semibold text-slate-800">
                  Record 1st Installment Paid upon move-in
                </span>
              </label>
            </div>
          </div>

          {/* Breakdown Preview */}
          <div className="p-3 bg-white rounded-xl border border-sky-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="text-slate-600">
              Per installment:{' '}
              <strong className="text-slate-900 font-mono">
                ${Math.round(((agreedRent * 12) + securityDeposit) / Number(installmentPlan)).toLocaleString()}
              </strong>
            </div>
            <div className="text-slate-600">
              Paid Today:{' '}
              <strong className="text-emerald-700 font-mono">
                ${(firstInstallmentPaidNow ? Math.round(((agreedRent * 12) + securityDeposit) / Number(installmentPlan)) : 0).toLocaleString()}
              </strong>
            </div>
            <div className="text-slate-600">
              Remaining Due in Installments:{' '}
              <strong className="text-sky-900 font-mono font-bold">
                ${(firstInstallmentPaidNow 
                  ? ((agreedRent * 12) + securityDeposit) - Math.round(((agreedRent * 12) + securityDeposit) / Number(installmentPlan))
                  : ((agreedRent * 12) + securityDeposit)).toLocaleString()}
              </strong>
            </div>
          </div>
        </div>

        <FormField label="Lease Notes / Administrative Reference">
          <Input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Parking space #4, pet deposit collected..."
          />
        </FormField>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" icon={<Key className="w-4 h-4" />}>
            Confirm Direct Assignment
          </Button>
        </div>
      </form>
    </Modal>
  );
};
