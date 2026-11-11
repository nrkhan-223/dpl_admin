import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import {
  updateCallbackStatus,
  updateCallbackNotes,
  deleteCallbackRequest,
  resetCallbacksToDefault,
} from '../../store/slices/callbackRequestsSlice';
import { CallbackRequest } from '../../types';
import {
  PhoneCall,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  Clock3,
  Search,
  Filter,
  Trash2,
  MessageSquare,
  Sparkles,
  User,
  Plus,
  RefreshCw,
  PhoneForwarded,
  Check,
  Building,
} from 'lucide-react';
import RequestCallbackModal from './RequestCallbackModal';

export default function CallbackRequestsManagement() {
  const dispatch = useDispatch();
  const callbacks = useSelector((state: RootState) => state.callbackRequests.requests);

  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Completed'>('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'Normal' | 'High' | 'Urgent'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);

  // Note editing state
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  // Delete confirm state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filtered callbacks
  const filteredCallbacks = (callbacks || []).filter((item) => {
    if (statusFilter !== 'All' && item.status !== statusFilter) return false;
    if (priorityFilter !== 'All' && item.priority !== priorityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchPhone = item.phone.toLowerCase().includes(q);
      const matchEmail = item.email.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchProp = item.propertyInterest ? item.propertyInterest.toLowerCase().includes(q) : false;
      if (!matchName && !matchPhone && !matchEmail && !matchDesc && !matchProp) return false;
    }
    return true;
  });

  // Summary counts
  const totalCount = callbacks?.length || 0;
  const pendingCount = callbacks?.filter((c) => c.status === 'Pending').length || 0;
  const inProgressCount = callbacks?.filter((c) => c.status === 'In Progress').length || 0;
  const completedCount = callbacks?.filter((c) => c.status === 'Completed').length || 0;
  const urgentCount = callbacks?.filter((c) => c.priority === 'Urgent' && c.status !== 'Completed').length || 0;

  const handleStartNoteEdit = (item: CallbackRequest) => {
    setEditingNoteId(item.id);
    setNoteText(item.adminNotes || '');
  };

  const handleSaveNote = (id: string) => {
    dispatch(updateCallbackNotes({ id, notes: noteText }));
    setEditingNoteId(null);
    setNoteText('');
  };

  const handleStatusChange = (id: string, status: CallbackRequest['status']) => {
    dispatch(updateCallbackStatus({ id, status }));
  };

  const handleDelete = (id: string) => {
    dispatch(deleteCallbackRequest(id));
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-sky-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-850 flex items-center justify-center border border-sky-200 font-bold">
              <PhoneCall className="w-5 h-5 text-sky-800" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Callback Requests</h1>
                <span className="text-xs font-mono font-bold text-sky-900 bg-sky-100/80 border border-sky-200 px-2.5 py-0.5 rounded-full">
                  {totalCount} Total
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">
                Review prospective client inquiries, call users directly, record follow-up notes, and track resolution.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={() => dispatch(resetCallbacksToDefault())}
            title="Reset to initial sample callback requests"
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-sky-800 hover:border-sky-300 hover:bg-sky-50/50 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsNewRequestModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-800 hover:bg-sky-900 text-white rounded-xl font-medium shadow-sm transition-colors text-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Simulate User Callback</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div
          onClick={() => {
            setStatusFilter('All');
            setPriorityFilter('All');
          }}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            statusFilter === 'All' && priorityFilter === 'All'
              ? 'bg-sky-50 border-sky-300 ring-2 ring-sky-700/10'
              : 'bg-white border-sky-200/90 hover:border-sky-400'
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Requests</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalCount}</p>
          <p className="text-xs text-slate-500 mt-0.5">All customer inquiries</p>
        </div>

        <div
          onClick={() => setStatusFilter('Pending')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            statusFilter === 'Pending'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-600/10'
              : 'bg-white border-amber-200/90 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Pending</p>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          </div>
          <p className="text-2xl font-bold text-amber-900 mt-1">{pendingCount}</p>
          <p className="text-xs text-amber-700 mt-0.5">Awaiting initial call</p>
        </div>

        <div
          onClick={() => setStatusFilter('In Progress')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            statusFilter === 'In Progress'
              ? 'bg-sky-50 border-sky-300 ring-2 ring-sky-700/10'
              : 'bg-white border-sky-200/90 hover:border-sky-300'
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-800">In Progress</p>
          <p className="text-2xl font-bold text-sky-950 mt-1">{inProgressCount}</p>
          <p className="text-xs text-sky-700 mt-0.5">Contacted / scheduled</p>
        </div>

        <div
          onClick={() => setStatusFilter('Completed')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            statusFilter === 'Completed'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-600/10'
              : 'bg-white border-emerald-200/90 hover:border-emerald-300'
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Completed</p>
          <p className="text-2xl font-bold text-emerald-900 mt-1">{completedCount}</p>
          <p className="text-xs text-emerald-700 mt-0.5">Call made & resolved</p>
        </div>

        <div
          onClick={() => setPriorityFilter(priorityFilter === 'Urgent' ? 'All' : 'Urgent')}
          className={`col-span-2 lg:col-span-1 cursor-pointer p-4 rounded-xl border transition-all ${
            priorityFilter === 'Urgent'
              ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-600/10'
              : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-rose-700">Urgent Open</p>
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <p className="text-2xl font-bold text-rose-900 mt-1">{urgentCount}</p>
          <p className="text-xs text-rose-700 mt-0.5">Needs priority response</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-sky-200/90 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, phone number, email, or request description..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-700 focus:bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-medium text-slate-500 whitespace-nowrap">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-sky-700"
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent Only</option>
            <option value="High">High Priority</option>
            <option value="Normal">Normal</option>
          </select>
        </div>
      </div>

      {/* Main List */}
      {filteredCallbacks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-800 flex items-center justify-center mx-auto mb-3">
            <PhoneForwarded className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No callback requests found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
            {searchQuery || statusFilter !== 'All' || priorityFilter !== 'All'
              ? 'No requests match your current filters. Try resetting search or filter options.'
              : 'There are currently no callback requests in the system. Use the button below to submit a test request.'}
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            {(searchQuery || statusFilter !== 'All' || priorityFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('All');
                  setPriorityFilter('All');
                }}
                className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Clear Filters
              </button>
            )}
            <button
              onClick={() => setIsNewRequestModalOpen(true)}
              className="px-4 py-2 bg-sky-800 text-white rounded-xl text-sm font-medium hover:bg-sky-900 cursor-pointer"
            >
              Simulate Callback Request
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCallbacks.map((item) => {
            const isEditingNote = editingNoteId === item.id;
            const isDeleting = deleteConfirmId === item.id;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border transition-all shadow-xs overflow-hidden ${
                  item.status === 'Pending'
                    ? 'border-amber-300 ring-1 ring-amber-400/20 hover:border-amber-400'
                    : item.status === 'In Progress'
                    ? 'border-sky-300 ring-1 ring-sky-400/20 hover:border-sky-400'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="p-6">
                  {/* Top Bar of card */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    {/* Left: Client name, metadata, and description */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-800 font-bold text-sm flex items-center justify-center">
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">{item.name}</h2>

                        {/* Status chip */}
                        {item.status === 'Pending' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            Pending Callback
                          </span>
                        )}
                        {item.status === 'In Progress' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200">
                            <Clock3 className="w-3 h-3" />
                            In Progress
                          </span>
                        )}
                        {item.status === 'Completed' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Completed
                          </span>
                        )}

                        {/* Priority indicator */}
                        {item.priority === 'Urgent' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertCircle className="w-3 h-3 text-rose-600" />
                            Urgent
                          </span>
                        )}
                        {item.priority === 'High' && (
                          <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            High Priority
                          </span>
                        )}

                        {/* Property interest if present */}
                        {item.propertyInterest && (
                          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Building className="w-3 h-3 text-slate-400" />
                            {item.propertyInterest}
                          </span>
                        )}
                      </div>

                      {/* Contact row */}
                      <div className="flex flex-wrap items-center gap-y-1 text-sm text-slate-600">
                        <a
                          href={`tel:${item.phone}`}
                          className="font-semibold text-sky-800 hover:text-sky-950 flex items-center gap-1.5 group mr-3"
                        >
                          <PhoneCall className="w-3.5 h-3.5 text-sky-700 group-hover:scale-110 transition-transform" />
                          <span>{item.phone}</span>
                        </a>
                        <span className="text-slate-300 mr-3">·</span>
                        <a
                          href={`mailto:${item.email}`}
                          className="text-slate-600 hover:text-sky-800 flex items-center gap-1.5 mr-3"
                        >
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.email}</span>
                        </a>
                        <span className="text-slate-300 mr-3">·</span>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mr-3">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>Preferred: {item.preferredTime || 'Anytime'}</span>
                        </div>
                        <span className="text-slate-300 mr-3">·</span>
                        <span className="text-xs text-slate-400">
                          Requested: {new Date(item.createdAt).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </span>
                        {item.calledAt && (
                          <>
                            <span className="text-slate-300 mr-3">·</span>
                            <span className="text-xs text-emerald-700 font-medium">
                              Called at: {new Date(item.calledAt).toLocaleDateString()}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Request Description */}
                      <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/70 text-sm text-slate-700 leading-relaxed">
                        <p className="font-medium text-xs text-slate-400 uppercase tracking-wider mb-1">
                          Inquiry / Description:
                        </p>
                        <p className="whitespace-pre-wrap">{item.description}</p>
                      </div>

                      {/* Admin Notes Section */}
                      <div className="pt-1">
                        {isEditingNote ? (
                          <div className="space-y-2 mt-2">
                            <textarea
                              value={noteText}
                              onChange={(e) => setNoteText(e.target.value)}
                              rows={2}
                              placeholder="Write admin follow-up notes (e.g. Called client at 3 PM, interested in 3-bed unit on 7th floor...)"
                              className="w-full text-xs p-2.5 bg-sky-50/50 border border-sky-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-700"
                            />
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleSaveNote(item.id)}
                                className="px-3 py-1 bg-sky-800 text-white rounded-lg text-xs font-medium hover:bg-sky-900 cursor-pointer"
                              >
                                Save Note
                              </button>
                              <button
                                onClick={() => setEditingNoteId(null)}
                                className="px-3 py-1 border border-slate-200 text-slate-600 rounded-lg text-xs hover:bg-slate-50 cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-2 text-xs">
                            <div className="text-slate-500">
                              {item.adminNotes ? (
                                <p className="text-slate-700">
                                  <span className="font-semibold text-sky-900">Admin Note: </span>
                                  {item.adminNotes}
                                </p>
                              ) : (
                                <span className="italic text-slate-400">No follow-up notes recorded yet.</span>
                              )}
                            </div>
                            <button
                              onClick={() => handleStartNoteEdit(item)}
                              className="text-sky-800 hover:text-sky-950 font-medium hover:underline shrink-0 cursor-pointer"
                            >
                              {item.adminNotes ? 'Edit Note' : '+ Add Note'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Action buttons */}
                    <div className="flex flex-col sm:items-end gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                      {/* Call Direct Button */}
                      <a
                        href={`tel:${item.phone}`}
                        onClick={() => {
                          if (item.status === 'Pending') {
                            handleStatusChange(item.id, 'In Progress');
                          }
                        }}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-xs transition-colors"
                      >
                        <PhoneCall className="w-4 h-4" />
                        <span>Call {item.phone}</span>
                      </a>

                      {/* WhatsApp Link */}
                      <a
                        href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 border border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl text-xs font-medium transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp Message</span>
                      </a>

                      {/* Status Selector Dropdown */}
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-xs text-slate-400">Status:</span>
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value as any)}
                          className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-sky-700 text-slate-700 cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>

                      {/* Delete confirmation */}
                      <div className="mt-1">
                        {isDeleting ? (
                          <div className="flex items-center gap-1.5 bg-rose-50 p-1.5 rounded-lg border border-rose-200 text-xs">
                            <span className="text-rose-800 font-medium">Delete?</span>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="px-2 py-0.5 bg-rose-600 text-white rounded font-medium hover:bg-rose-700 cursor-pointer"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-0.5 border border-slate-200 bg-white text-slate-600 rounded cursor-pointer"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(item.id)}
                            className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 p-1 cursor-pointer"
                            title="Delete this request"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Simulate Callback Modal */}
      {isNewRequestModalOpen && (
        <RequestCallbackModal
          isOpen={isNewRequestModalOpen}
          onClose={() => setIsNewRequestModalOpen(false)}
        />
      )}
    </div>
  );
}
