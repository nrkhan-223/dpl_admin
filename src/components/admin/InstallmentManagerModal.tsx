import React, { useState } from 'react';
import {
  DollarSign,
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Printer,
  Receipt,
  ArrowRight,
  ShieldCheck,
  Building2,
  Sparkles,
  X,
  Check,
} from 'lucide-react';
import { useAppDispatch } from '../../store';
import { recordInstallmentPayment } from '../../store/slices/bookingsSlice';
import { Booking, Installment } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { FormField, Input } from '../common/FormField';
import { Select } from '../common/Select';

interface InstallmentManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
}

export const InstallmentManagerModal: React.FC<InstallmentManagerModalProps> = ({
  isOpen,
  onClose,
  booking,
}) => {
  const dispatch = useAppDispatch();

  // Paying installment state
  const [activeInstallmentToPay, setActiveInstallmentToPay] = useState<Installment | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<'Bank Wire' | 'ACH Direct Debit' | 'Credit Card' | 'Check / Cash'>('Bank Wire');
  const [payTxnRef, setPayTxnRef] = useState<string>('');
  const [payNotes, setPayNotes] = useState<string>('');
  const [payDate, setPayDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Printable receipt state
  const [receiptInstallment, setReceiptInstallment] = useState<Installment | null>(null);

  if (!booking) return null;

  const installments = booking.installments || [];
  const totalContract = booking.totalContractValue || (booking.monthlyRent * 12 + booking.securityDeposit);
  const totalPaid = booking.totalPaidAmount || 0;
  const totalDue = Math.max(0, totalContract - totalPaid);
  const percentPaid = totalContract > 0 ? Math.round((totalPaid / totalContract) * 100) : 0;

  const handleOpenPayForm = (installment: Installment) => {
    setActiveInstallmentToPay(installment);
    const remainingForInst = Math.max(0, installment.amount - (installment.paidAmount || 0));
    setPayAmount(remainingForInst);
    setPayTxnRef(`TXN-${Date.now().toString().slice(-6)}`);
    setPayNotes(`DPL official installment payment for ${installment.title}`);
    setPayDate(new Date().toISOString().split('T')[0]);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInstallmentToPay) return;

    dispatch(
      recordInstallmentPayment({
        bookingId: booking.id,
        installmentId: activeInstallmentToPay.id,
        paidAmount: Number(payAmount),
        paymentMethod: payMethod,
        transactionRef: payTxnRef,
        notes: payNotes,
        paidDate: payDate,
      })
    );

    setActiveInstallmentToPay(null);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Due Amount Installment Payment Ledger"
        subtitle={`Contract ${booking.id} · ${booking.propertyTitle}`}
        maxWidth="2xl"
      >
        <div className="space-y-5">
          {/* Tenant & Assigned Unit Header */}
          <div className="bg-gradient-to-r from-sky-900 via-sky-850 to-sky-800 text-white rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-200 block">
                  Assigned Leaseholder & Apartment
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  {booking.userName}
                </h3>
                <div className="flex items-center flex-wrap gap-2 text-xs text-sky-100 mt-1">
                  <span>{booking.userEmail}</span>
                  <span className="text-sky-300">•</span>
                  <span>{booking.userPhone}</span>
                </div>
              </div>

              <div className="sm:text-right bg-sky-950/40 border border-sky-400/30 rounded-xl p-3 shrink-0">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-300 block">
                  Apartment Spec
                </span>
                <div className="text-sm font-bold text-white flex items-center sm:justify-end gap-1.5 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-sky-300" />
                  <span>{booking.unitNumber || 'Full Residence'}</span>
                </div>
                {booking.unitSpecs && (
                  <div className="text-xs text-sky-200 mt-0.5">
                    {booking.unitSpecs}
                  </div>
                )}
              </div>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4 pt-4 border-t border-sky-700/60">
              <div className="bg-white/10 rounded-xl p-2.5">
                <span className="text-xs uppercase font-bold text-sky-200">Total Contract</span>
                <div className="text-lg font-mono font-bold text-white tabular-nums">
                  ${totalContract.toLocaleString()}
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-2.5">
                <span className="text-xs uppercase font-bold text-emerald-200">Paid to Date ({percentPaid}%)</span>
                <div className="text-lg font-mono font-bold text-emerald-300 tabular-nums">
                  ${totalPaid.toLocaleString()}
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-2.5">
                <span className="text-xs uppercase font-bold text-sky-100">Remaining Due</span>
                <div className="text-lg font-mono font-bold text-sky-200 tabular-nums">
                  ${totalDue.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3">
              <div className="w-full bg-sky-950/50 rounded-full h-2 overflow-hidden border border-sky-600/40">
                <div
                  className="bg-emerald-400 h-2 rounded-full transition-all duration-500 shadow-xs"
                  style={{ width: `${percentPaid}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-xs text-sky-200 mt-1 font-mono">
                <span>Lease Period: {booking.startDate} - {booking.endDate}</span>
                <span>{percentPaid}% Cleared</span>
              </div>
            </div>
          </div>

          {/* Quick Pay Dialog if active */}
          {activeInstallmentToPay && (
            <div className="p-4 bg-sky-50 border-2 border-sky-500 rounded-2xl shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-sky-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-700 text-white flex items-center justify-center font-bold text-xs">
                    #{activeInstallmentToPay.installmentNumber}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-sky-950 uppercase tracking-wide">
                      Record Payment for {activeInstallmentToPay.title}
                    </h4>
                    <span className="text-xs text-sky-800">
                      Scheduled due: {activeInstallmentToPay.dueDate} · Amount: ${activeInstallmentToPay.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveInstallmentToPay(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleConfirmPayment} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <FormField label="Payment Amount ($)" required>
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      max={activeInstallmentToPay.amount}
                      value={payAmount}
                      onChange={(e) => setPayAmount(Number(e.target.value))}
                      required
                    />
                  </FormField>

                  <FormField label="Payment Method" required>
                    <Select
                      value={payMethod}
                      onChange={(e) => setPayMethod(e.target.value as any)}
                      options={[
                        { value: 'Bank Wire', label: 'Bank Wire Transfer' },
                        { value: 'ACH Direct Debit', label: 'ACH Direct Debit' },
                        { value: 'Credit Card', label: 'Credit / Debit Card' },
                        { value: 'Check / Cash', label: 'Cash / Check Deposit' },
                      ]}
                    />
                  </FormField>

                  <FormField label="Payment Date" required>
                    <Input
                      type="date"
                      value={payDate}
                      onChange={(e) => setPayDate(e.target.value)}
                      required
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField label="Transaction / Reference Code" required hint="Wire ID, Cheque #, or POS Ref">
                    <Input
                      placeholder="e.g. TXN-WIRE-48190"
                      value={payTxnRef}
                      onChange={(e) => setPayTxnRef(e.target.value)}
                      required
                    />
                  </FormField>

                  <FormField label="Admin Notes / Receipt Voucher Memo">
                    <Input
                      placeholder="e.g. Confirmed by accounting team"
                      value={payNotes}
                      onChange={(e) => setPayNotes(e.target.value)}
                    />
                  </FormField>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveInstallmentToPay(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={payAmount <= 0}
                  >
                    <Check className="w-3.5 h-3.5 mr-1" />
                    Confirm Payment of ${payAmount.toLocaleString()}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Installments Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Installment Payment Schedule ({installments.length} tranches)
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {installments.filter((i) => i.status === 'Paid').length} Paid ·{' '}
                {installments.filter((i) => i.status !== 'Paid').length} Due
              </span>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs divide-y divide-slate-100">
              {installments.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-semibold text-xs text-slate-700">No installments configured for this lease</p>
                </div>
              ) : (
                installments.map((inst) => {
                  const isPaid = inst.status === 'Paid';
                  const remainingDue = Math.max(0, inst.amount - (inst.paidAmount || 0));

                  return (
                    <div
                      key={inst.id}
                      className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                        isPaid ? 'bg-slate-50/50' : 'hover:bg-sky-50/30'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold font-mono ${
                            isPaid
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-sky-100 text-sky-800 border border-sky-200'
                          }`}
                        >
                          {isPaid ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : `#${inst.installmentNumber}`}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-slate-900">{inst.title}</span>
                            <Badge
                              variant={isPaid ? 'emerald' : inst.status === 'Overdue' ? 'rose' : 'sky'}
                              size="sm"
                            >
                              {inst.status}
                            </Badge>
                          </div>

                          <div className="flex items-center flex-wrap gap-2 text-xs text-slate-500 mt-1 font-mono">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              Due: <strong>{inst.dueDate}</strong>
                            </span>
                            {inst.paidAt && (
                              <>
                                <span className="text-slate-300">•</span>
                                <span className="text-emerald-700 font-semibold">
                                  Paid on {new Date(inst.paidAt).toLocaleDateString()}
                                </span>
                              </>
                            )}
                            {inst.paymentMethod && (
                              <>
                                <span className="text-slate-300">•</span>
                                <span>{inst.paymentMethod}</span>
                              </>
                            )}
                            {inst.transactionRef && (
                              <>
                                <span className="text-slate-300">•</span>
                                <span className="text-sky-800 bg-sky-50 px-1.5 py-0.5 rounded font-mono text-xs">
                                  Ref: {inst.transactionRef}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Amount and Action */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div className="text-left sm:text-right font-mono">
                          <div className="text-sm font-bold text-slate-900 tabular-nums">
                            ${inst.amount.toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-500 tabular-nums">
                            {isPaid ? (
                              <span className="text-emerald-600 font-semibold">Fully Cleared</span>
                            ) : (
                              <span>Due: ${remainingDue.toLocaleString()}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {isPaid ? (
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={() => setReceiptInstallment(inst)}
                              className="text-xs"
                            >
                              <Receipt className="w-3.5 h-3.5 mr-1 text-sky-700" />
                              Voucher
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="primary"
                              size="sm"
                              onClick={() => handleOpenPayForm(inst)}
                              className="text-xs"
                            >
                              <DollarSign className="w-3.5 h-3.5 mr-1" />
                              Pay Due
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              Payments immediately update tenant balance and lease ledger.
            </span>
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close Ledger
            </Button>
          </div>
        </div>
      </Modal>

      {/* DPL OFFICIAL PAYMENT RECEIPT VOUCHER MODAL */}
      <Modal
        isOpen={!!receiptInstallment}
        onClose={() => setReceiptInstallment(null)}
        title="DPL Official Payment Voucher"
        subtitle={`Receipt Ref #${receiptInstallment?.transactionRef || receiptInstallment?.id}`}
        maxWidth="lg"
      >
        {receiptInstallment && (
          <div className="space-y-4 text-xs font-sans">
            <div className="p-5 border border-sky-200 rounded-2xl bg-gradient-to-br from-white via-sky-50/30 to-sky-100/30 shadow-xs space-y-4">
              {/* Receipt Header */}
              <div className="flex items-start justify-between pb-3 border-b border-sky-100">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-sky-700 text-white font-black flex items-center justify-center text-xs tracking-wider">
                      DPL
                    </div>
                    <div>
                      <span className="font-extrabold text-sm text-slate-900 block leading-tight">
                        DPL Luxury Real Estate
                      </span>
                      <span className="text-xs text-slate-500">
                        Official Payment Acknowledgment
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-xs font-bold text-sky-800">
                    RECEIPT #{receiptInstallment.transactionRef || receiptInstallment.id}
                  </div>
                  <div className="text-xs text-slate-500">
                    Date: {receiptInstallment.paidAt ? new Date(receiptInstallment.paidAt).toLocaleDateString() : 'Paid'}
                  </div>
                </div>
              </div>

              {/* Tenancy & Residence specs */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-white rounded-xl border border-sky-100">
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Tenant Resident
                  </span>
                  <span className="font-bold text-slate-900 text-sm block mt-0.5">
                    {booking.userName}
                  </span>
                  <span className="text-xs text-slate-500 block">{booking.userEmail}</span>
                  <span className="text-xs text-slate-500 block">{booking.userPhone}</span>
                </div>

                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Property & Unit
                  </span>
                  <span className="font-bold text-slate-900 text-sm block mt-0.5">
                    {booking.propertyTitle}
                  </span>
                  <span className="text-xs text-sky-800 font-semibold block">
                    {booking.unitNumber || 'Main Residence'}
                  </span>
                  {booking.unitSpecs && (
                    <span className="text-xs text-slate-500 block">{booking.unitSpecs}</span>
                  )}
                </div>
              </div>

              {/* Payment Details */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-xs uppercase">
                    <tr>
                      <th className="p-2.5">Installment Description</th>
                      <th className="p-2.5">Payment Method</th>
                      <th className="p-2.5 text-right">Amount Paid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr>
                      <td className="p-2.5">
                        <div className="font-bold text-slate-800 text-sm">{receiptInstallment.title}</div>
                        <div className="text-xs text-slate-500">Due: {receiptInstallment.dueDate}</div>
                      </td>
                      <td className="p-2.5 text-slate-700 text-xs">
                        {receiptInstallment.paymentMethod || 'Bank Wire'}
                      </td>
                      <td className="p-2.5 text-right font-bold text-emerald-700 text-base">
                        ${(receiptInstallment.paidAmount || receiptInstallment.amount).toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Voucher Stamp */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    DPL Admin Verified Payment
                  </span>
                </div>

                <div className="text-right font-mono text-xs text-slate-600">
                  <span>Remaining Due on Contract: </span>
                  <strong className="text-sky-800">${totalDue.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handlePrintReceipt}
              >
                <Printer className="w-3.5 h-3.5 mr-1" />
                Print Voucher
              </Button>

              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setReceiptInstallment(null)}
              >
                Close Voucher
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
