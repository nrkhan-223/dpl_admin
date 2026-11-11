import React, { useState } from 'react';
import {
  CalendarCheck2,
  Key,
  Search,
  Trash2,
  DollarSign,
  Building,
  CheckCircle,
  FileText,
  Receipt,
  CreditCard,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  updateBookingStatus,
  terminateBooking,
  deleteBooking,
} from '../../store/slices/bookingsSlice';
import { unassignProperty } from '../../store/slices/propertiesSlice';
import { setUserAssignedProperty } from '../../store/slices/usersSlice';
import { Booking } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { Input } from '../common/FormField';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { Tabs } from '../common/Tabs';
import { InstallmentManagerModal } from './InstallmentManagerModal';

interface BookingsDashboardProps {
  onOpenAssignModal: () => void;
}

export const BookingsDashboard: React.FC<BookingsDashboardProps> = ({
  onOpenAssignModal,
}) => {
  const dispatch = useAppDispatch();
  const { bookings } = useAppSelector((state) => state.bookings);
  const { users } = useAppSelector((state) => state.users);

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<Booking | null>(null);
  const [selectedBookingForInstallments, setSelectedBookingForInstallments] = useState<Booking | null>(null);
  const [bookingToTerminate, setBookingToTerminate] = useState<Booking | null>(null);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);

  const activeBookings = bookings.filter((b) => b.status === 'Active');
  const totalRevenue = activeBookings.reduce((sum, b) => sum + b.monthlyRent, 0);

  // Installment aggregations
  const totalContractVolume = bookings.reduce(
    (sum, b) => sum + (b.totalContractValue || b.monthlyRent * 12 + b.securityDeposit),
    0
  );
  const totalCollectedInstallments = bookings.reduce((sum, b) => sum + (b.totalPaidAmount || 0), 0);
  const totalOutstandingDue = bookings.reduce((sum, b) => sum + (b.totalDueAmount || 0), 0);

  // Selected booking current state for modal
  const currentBookingForInstallments = selectedBookingForInstallments
    ? bookings.find((b) => b.id === selectedBookingForInstallments.id) || selectedBookingForInstallments
    : null;

  const handleTerminateConfirm = () => {
    if (bookingToTerminate) {
      dispatch(terminateBooking(bookingToTerminate.id));
      dispatch(unassignProperty(bookingToTerminate.propertyId));
      dispatch(
        setUserAssignedProperty({
          userId: bookingToTerminate.userId,
          propertyId: null,
        })
      );
      setBookingToTerminate(null);
    }
  };

  const handleDeleteConfirm = () => {
    if (bookingToDelete) {
      dispatch(deleteBooking(bookingToDelete.id));
      setBookingToDelete(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.userEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ? true : b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statusTabs = [
    { id: 'all', label: 'All Leases', count: bookings.length },
    { id: 'Active', label: 'Active Leases', count: bookings.filter((b) => b.status === 'Active').length },
    { id: 'Upcoming', label: 'Upcoming', count: bookings.filter((b) => b.status === 'Upcoming').length },
    { id: 'Terminated', label: 'Terminated / Closed', count: bookings.filter((b) => b.status === 'Terminated').length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-sky-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Centralized Lease & Booking Management
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-100">
              {bookings.length} records
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Admin centralized registry of property leases, tenant agreements, payment schedules, and occupancy terms.
          </p>
        </div>
        <Button
          onClick={onOpenAssignModal}
          icon={<Key className="w-4 h-4" />}
          size="md"
          className="w-full sm:w-auto"
        >
          Assign Property to Tenant
        </Button>
      </div>

      {/* Summary KPI Strip (1 col on mobile, 2 col sm, 4 col lg) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-sky-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Leases
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 mt-1 tabular-nums">
              {activeBookings.length}
            </div>
            <span className="text-xs text-sky-700 font-semibold mt-0.5 block">
              Direct tenant access active
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-sky-100/90 border border-sky-300 text-sky-850 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5 text-sky-800" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-sky-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Contract Value
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 mt-1 tabular-nums">
              ${totalContractVolume.toLocaleString()}
            </div>
            <span className="text-xs text-slate-500 mt-0.5 block">Total signed lease commitments</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-sky-100/90 border border-sky-300 text-sky-800 flex items-center justify-center shrink-0">
            <Building className="w-5 h-5 text-sky-800" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-sky-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Installments Collected
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-800 mt-1 tabular-nums">
              ${totalCollectedInstallments.toLocaleString()}
            </div>
            <span className="text-xs text-emerald-700 font-semibold mt-0.5 block">
              {totalContractVolume > 0 ? Math.round((totalCollectedInstallments / totalContractVolume) * 100) : 0}% cleared
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-100/90 border border-emerald-300 text-emerald-800 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5 text-emerald-700" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-sky-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-sky-900 uppercase tracking-wider">
              Outstanding Due
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-sky-900 mt-1 tabular-nums">
              ${totalOutstandingDue.toLocaleString()}
            </div>
            <span className="text-xs text-sky-700 font-semibold mt-0.5 block">
              Scheduled in installments
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-sky-100/90 border border-sky-300 text-sky-800 flex items-center justify-center shrink-0">
            <Receipt className="w-5 h-5 text-sky-800" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-sky-100 shadow-xs">
        <Tabs
          tabs={statusTabs}
          activeTab={statusFilter}
          onChange={(id) => setStatusFilter(id)}
        />

        <div className="w-full sm:w-72">
          <Input
            placeholder="Search tenant or property..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4 text-sky-700" />}
          />
        </div>
      </div>

      {/* Bookings Table with Responsive Horizontal Scroll */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-sky-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[760px]">
            <thead className="bg-gradient-to-r from-sky-50/60 to-slate-50/80 text-slate-700 font-bold uppercase tracking-wider text-xs border-b border-sky-100">
              <tr>
                <th className="px-5 py-3.5">Property Residence & Unit</th>
                <th className="px-4 py-3.5">Tenant Resident</th>
                <th className="px-4 py-3.5">Lease Term</th>
                <th className="px-4 py-3.5">Due & Installments</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <CalendarCheck2 className="w-8 h-8 mx-auto text-sky-300 mb-2" />
                    <p className="font-semibold text-slate-700">No lease records found</p>
                    <p className="text-sm text-slate-400 mt-1">
                      Click &ldquo;Assign Property to Tenant&rdquo; to establish a new lease.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => {
                  const tenantUser = users.find((u) => u.id === booking.userId);
                  const instList = booking.installments || [];
                  const paidInstCount = instList.filter((i) => i.status === 'Paid').length;
                  const contractVal = booking.totalContractValue || booking.monthlyRent * 12 + booking.securityDeposit;
                  const paidVal = booking.totalPaidAmount || 0;
                  const dueVal = Math.max(0, contractVal - paidVal);

                  return (
                    <tr
                      key={booking.id}
                      className="hover:bg-sky-50/30 transition-colors"
                    >
                      {/* Property & Unit */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-sky-100/80 border border-sky-300 flex items-center justify-center text-sky-800 shrink-0">
                            <Building className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-slate-900 text-base line-clamp-1">
                                {booking.propertyTitle}
                              </span>
                              {booking.unitNumber && (
                                <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-850 border border-sky-300 shrink-0">
                                  {booking.unitNumber}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                              {booking.propertyAddress}
                            </span>
                            {booking.unitSpecs && (
                              <span className="text-xs text-sky-800 font-semibold block mt-0.5">
                                {booking.unitSpecs}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Tenant */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={tenantUser?.image}
                            name={booking.userName}
                            size="sm"
                          />
                          <div>
                            <span className="font-bold text-slate-900 text-sm block leading-tight">
                              {booking.userName}
                            </span>
                            <span className="text-xs text-slate-500">
                              {booking.userPhone}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Lease Term */}
                      <td className="px-4 py-4 font-mono text-sm tabular-nums text-slate-700">
                        <div>
                          <strong>{booking.startDate}</strong> to
                        </div>
                        <div className="text-slate-500">{booking.endDate}</div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          ${booking.monthlyRent.toLocaleString()}/mo
                        </div>
                      </td>

                      {/* Installments & Due Balance */}
                      <td className="px-4 py-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 font-mono">
                            <span className="font-bold text-slate-900 text-sm">
                              ${paidVal.toLocaleString()}
                            </span>
                            <span className="text-slate-400 text-xs">/ ${contractVal.toLocaleString()}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {dueVal > 0 ? (
                              <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-850 border border-sky-300">
                                ${dueVal.toLocaleString()} Due
                              </span>
                            ) : (
                              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                                Fully Paid
                              </span>
                            )}
                            <span className="text-xs text-slate-500 font-mono">
                              {paidInstCount}/{instList.length} Tranches
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => setSelectedBookingForInstallments(booking)}
                            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-sky-700 hover:text-sky-900 hover:underline cursor-pointer mt-0.5"
                          >
                            <Receipt className="w-3.5 h-3.5 text-sky-700" />
                            {dueVal > 0 ? 'Pay Installment / Ledger' : 'View Installment Ledger'}
                          </button>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <Badge
                          variant={
                            booking.status === 'Active'
                              ? 'emerald'
                              : booking.status === 'Upcoming'
                              ? 'sky'
                              : 'slate'
                          }
                          size="sm"
                          dot={booking.status === 'Active'}
                        >
                          {booking.status}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedBookingForInstallments(booking)}
                            title="Manage installment payment schedule"
                            className="p-2 text-sky-700 hover:text-sky-900 hover:bg-sky-100/70 rounded-xl transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                          >
                            <CreditCard className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setSelectedBookingForDetails(booking)}
                            title="View lease agreement summary"
                            className="p-2 text-slate-500 hover:text-sky-800 hover:bg-sky-100/60 rounded-xl transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                          >
                            <FileText className="w-4 h-4" />
                          </button>

                          {booking.status === 'Active' && (
                            <button
                              onClick={() => setBookingToTerminate(booking)}
                              title="Terminate lease & free up apartment"
                              className="px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer min-h-[36px]"
                            >
                              End Lease
                            </button>
                          )}

                          <button
                            onClick={() => setBookingToDelete(booking)}
                            title="Delete booking record"
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* LEASE SUMMARY MODAL */}
      <Modal
        isOpen={!!selectedBookingForDetails}
        onClose={() => setSelectedBookingForDetails(null)}
        title="Residential Tenancy Agreement"
        subtitle={`Contract Reference: ${selectedBookingForDetails?.id}`}
        maxWidth="lg"
      >
        {selectedBookingForDetails && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">
                  {selectedBookingForDetails.propertyTitle}
                </span>
                <Badge variant="emerald">{selectedBookingForDetails.status}</Badge>
              </div>
              <p className="text-slate-500">
                {selectedBookingForDetails.propertyAddress}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-500 block mb-1">Assigned Tenant</span>
                <strong className="text-slate-900 block text-sm">
                  {selectedBookingForDetails.userName}
                </strong>
                <span className="text-slate-500">{selectedBookingForDetails.userEmail}</span>
                <span className="text-slate-500 block">{selectedBookingForDetails.userPhone}</span>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-500 block mb-1">Financial Terms</span>
                <strong className="text-sky-700 block font-mono text-sm">
                  ${selectedBookingForDetails.monthlyRent.toLocaleString()} / month
                </strong>
                <span className="text-slate-500 font-mono block">
                  Security Deposit: ${selectedBookingForDetails.securityDeposit.toLocaleString()}
                </span>
                <span className="text-emerald-700 font-semibold mt-0.5 block">Direct lease verified</span>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 font-mono">
              <span className="text-slate-500 block mb-1 font-sans">Lease Term Window</span>
              <div className="text-slate-900 font-semibold">
                Commencement: {selectedBookingForDetails.startDate}
              </div>
              <div className="text-slate-900 font-semibold">
                Expiration: {selectedBookingForDetails.endDate}
              </div>
            </div>

            {selectedBookingForDetails.notes && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block mb-1">Administrative Notes</span>
                <p className="text-slate-700">{selectedBookingForDetails.notes}</p>
              </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setSelectedBookingForInstallments(selectedBookingForDetails);
                  setSelectedBookingForDetails(null);
                }}
              >
                <Receipt className="w-3.5 h-3.5 mr-1" />
                Open Installment Ledger & Due Balance
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedBookingForDetails(null)}
              >
                Close Summary
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* INSTALLMENTS LEDGER & PAYMENT MODAL */}
      <InstallmentManagerModal
        isOpen={!!selectedBookingForInstallments}
        onClose={() => setSelectedBookingForInstallments(null)}
        booking={currentBookingForInstallments}
      />

      {/* TERMINATE CONFIRMATION */}
      <ConfirmDialog
        isOpen={!!bookingToTerminate}
        onClose={() => setBookingToTerminate(null)}
        onConfirm={handleTerminateConfirm}
        title="Terminate Active Lease"
        message={`Are you sure you want to terminate the lease for "${bookingToTerminate?.userName}" at ${bookingToTerminate?.propertyTitle}? The apartment will immediately be reverted to "Available" status.`}
        confirmLabel="Terminate Lease"
        variant="danger"
      />

      {/* DELETE CONFIRMATION */}
      <ConfirmDialog
        isOpen={!!bookingToDelete}
        onClose={() => setBookingToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Lease Record"
        message="Are you sure you want to permanently delete this lease record from the database archives?"
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
};
