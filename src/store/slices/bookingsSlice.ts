import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Booking, Installment } from '../../types';
import { initialBookings } from '../../data/initialData';

interface BookingsState {
  bookings: Booking[];
  statusFilter: string;
  searchQuery: string;
}

export const generateDefaultInstallments = (
  monthlyRent: number,
  securityDeposit: number,
  startDateStr: string
): { installments: Installment[]; totalContractValue: number; totalPaidAmount: number; totalDueAmount: number } => {
  const annualRent = monthlyRent * 12;
  const totalContract = annualRent + securityDeposit;
  const quarterAmount = Math.round(totalContract / 4);

  const start = new Date(startDateStr || '2026-03-01');
  const installments: Installment[] = [];

  for (let i = 1; i <= 4; i++) {
    const dueDate = new Date(start);
    dueDate.setMonth(start.getMonth() + (i - 1) * 3);
    const dateStr = dueDate.toISOString().split('T')[0];

    const isFirst = i === 1;
    installments.push({
      id: `inst-${Date.now()}-${i}`,
      installmentNumber: i,
      title: isFirst ? `Installment 1: Move-in Deposit & Advance` : `Installment ${i}: Term Balance`,
      dueDate: dateStr,
      amount: quarterAmount,
      paidAmount: isFirst ? quarterAmount : 0,
      status: isFirst ? 'Paid' : 'Pending',
      paidAt: isFirst ? new Date().toISOString() : null,
      paymentMethod: isFirst ? 'Bank Wire' : undefined,
      notes: isFirst ? 'Initial payment confirmed upon lease assignment.' : undefined,
    });
  }

  const totalPaid = quarterAmount;
  const totalDue = totalContract - totalPaid;

  return {
    installments,
    totalContractValue: totalContract,
    totalPaidAmount: totalPaid,
    totalDueAmount: totalDue,
  };
};

const loadInitialBookings = (): Booking[] => {
  try {
    const saved = localStorage.getItem('dpl_bookings');
    if (saved) {
      const parsed: Booking[] = JSON.parse(saved);
      return parsed.map((b) => {
        if (!b.installments || b.installments.length === 0) {
          const matchInitial = initialBookings.find((ib) => ib.id === b.id);
          if (matchInitial && matchInitial.installments && matchInitial.installments.length > 0) {
            return {
              ...b,
              totalContractValue: matchInitial.totalContractValue,
              totalPaidAmount: matchInitial.totalPaidAmount,
              totalDueAmount: matchInitial.totalDueAmount,
              installments: matchInitial.installments,
            };
          }
          const generated = generateDefaultInstallments(b.monthlyRent || 3000, b.securityDeposit || 3000, b.startDate);
          return {
            ...b,
            ...generated,
          };
        }
        return b;
      });
    }
  } catch (e) {
    console.error('Failed to load bookings from localStorage', e);
  }
  return initialBookings;
};

const initialState: BookingsState = {
  bookings: loadInitialBookings(),
  statusFilter: 'all',
  searchQuery: '',
};

const saveBookings = (bookings: Booking[]) => {
  try {
    localStorage.setItem('dpl_bookings', JSON.stringify(bookings));
  } catch (e) {
    console.error('Failed to save bookings', e);
  }
};

export const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    createBooking: (state, action: PayloadAction<Omit<Booking, 'id' | 'createdAt'>>) => {
      let bookingData = action.payload;

      // Ensure installments exist
      if (!bookingData.installments || bookingData.installments.length === 0) {
        const generated = generateDefaultInstallments(
          bookingData.monthlyRent || 3000,
          bookingData.securityDeposit || 3000,
          bookingData.startDate
        );
        bookingData = {
          ...bookingData,
          totalContractValue: generated.totalContractValue,
          totalPaidAmount: generated.totalPaidAmount,
          totalDueAmount: generated.totalDueAmount,
          installments: generated.installments,
        };
      }

      const newBooking: Booking = {
        ...bookingData,
        id: `bk-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      state.bookings.unshift(newBooking);
      saveBookings(state.bookings);
    },
    recordInstallmentPayment: (
      state,
      action: PayloadAction<{
        bookingId: string;
        installmentId: string;
        paidAmount: number;
        paymentMethod: 'Credit Card' | 'Bank Wire' | 'ACH Direct Debit' | 'Check / Cash';
        transactionRef?: string;
        notes?: string;
        paidDate?: string;
      }>
    ) => {
      const bk = state.bookings.find((b) => b.id === action.payload.bookingId);
      if (bk && bk.installments) {
        const inst = bk.installments.find((i) => i.id === action.payload.installmentId);
        if (inst) {
          inst.paidAmount = (inst.paidAmount || 0) + action.payload.paidAmount;
          if (inst.paidAmount >= inst.amount) {
            inst.status = 'Paid';
          }
          inst.paidAt = action.payload.paidDate || new Date().toISOString();
          inst.paymentMethod = action.payload.paymentMethod;
          if (action.payload.transactionRef) {
            inst.transactionRef = action.payload.transactionRef;
          }
          if (action.payload.notes) {
            inst.notes = action.payload.notes;
          }
        }

        // Recalculate totals
        bk.totalPaidAmount = bk.installments.reduce((sum, i) => sum + (i.paidAmount || 0), 0);
        bk.totalDueAmount = Math.max(0, bk.totalContractValue - bk.totalPaidAmount);

        saveBookings(state.bookings);
      }
    },
    updateInstallmentSchedule: (
      state,
      action: PayloadAction<{
        bookingId: string;
        installments: Installment[];
      }>
    ) => {
      const bk = state.bookings.find((b) => b.id === action.payload.bookingId);
      if (bk) {
        bk.installments = action.payload.installments;
        bk.totalContractValue = action.payload.installments.reduce((sum, i) => sum + i.amount, 0);
        bk.totalPaidAmount = action.payload.installments.reduce((sum, i) => sum + (i.paidAmount || 0), 0);
        bk.totalDueAmount = Math.max(0, bk.totalContractValue - bk.totalPaidAmount);
        saveBookings(state.bookings);
      }
    },
    updateBookingStatus: (
      state,
      action: PayloadAction<{ id: string; status: Booking['status'] }>
    ) => {
      const bk = state.bookings.find((b) => b.id === action.payload.id);
      if (bk) {
        bk.status = action.payload.status;
        saveBookings(state.bookings);
      }
    },
    terminateBooking: (state, action: PayloadAction<string>) => {
      const bk = state.bookings.find((b) => b.id === action.payload);
      if (bk) {
        bk.status = 'Terminated';
        saveBookings(state.bookings);
      }
    },
    deleteBooking: (state, action: PayloadAction<string>) => {
      state.bookings = state.bookings.filter((b) => b.id !== action.payload);
      saveBookings(state.bookings);
    },
    setBookingStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
    },
    setBookingSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  createBooking,
  recordInstallmentPayment,
  updateInstallmentSchedule,
  updateBookingStatus,
  terminateBooking,
  deleteBooking,
  setBookingStatusFilter,
  setBookingSearchQuery,
} = bookingsSlice.actions;

export default bookingsSlice.reducer;
