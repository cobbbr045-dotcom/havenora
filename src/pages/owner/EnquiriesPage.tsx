import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Trash2,
  Eye,
  CheckCircle,
  MessageSquare,
  Clock,
  Calendar,
  User,
  Mail,
  Phone,
  Bed,
  Save,
  AlertTriangle,
  Inbox
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Enquiry, EnquiryStatus } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/Toast';

export const EnquiriesPage: React.FC = () => {
  const { enquiries, updateEnquiryStatus, updateEnquiryNotes, deleteEnquiry } = useData();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Selected enquiry for details modal
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [notesInput, setNotesInput] = useState('');

  // Delete dialog state
  const [enquiryToDelete, setEnquiryToDelete] = useState<string | null>(null);

  const statuses: ('All' | EnquiryStatus)[] = ['All', 'New', 'Contacted', 'Pending', 'Confirmed', 'Cancelled'];

  const filteredEnquiries = enquiries
    .filter((item) => {
      const matchesSearch =
        item.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone.includes(searchTerm) ||
        (item.roomName && item.roomName.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const handleOpenDetails = (enq: Enquiry) => {
    setSelectedEnquiry(enq);
    setNotesInput(enq.internalNotes || '');
  };

  const handleSaveNotes = () => {
    if (selectedEnquiry) {
      updateEnquiryNotes(selectedEnquiry.id, notesInput);
      setSelectedEnquiry({ ...selectedEnquiry, internalNotes: notesInput });
      showToast('Internal notes updated successfully', 'success');
    }
  };

  const handleStatusChange = (id: string, newStatus: EnquiryStatus) => {
    updateEnquiryStatus(id, newStatus);
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
    }
    showToast(`Enquiry status changed to ${newStatus}`, 'success');
  };

  const confirmDelete = () => {
    if (enquiryToDelete) {
      deleteEnquiry(enquiryToDelete);
      showToast('Enquiry record deleted permanently.', 'info');
      if (selectedEnquiry?.id === enquiryToDelete) {
        setSelectedEnquiry(null);
      }
      setEnquiryToDelete(null);
    }
  };

  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case 'New':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Contacted':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Pending':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Filter and Search Bar */}
      <div className="bg-white rounded-xl p-5 border border-sand-dark/20 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by guest name, email, phone or suite..."
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-ivory/60 border border-sand-dark/30 rounded-lg focus:outline-none focus:border-forest text-charcoal"
          />
          <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-3" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Status Filter */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg uppercase tracking-wider transition-colors ${
                  statusFilter === st
                    ? 'bg-forest text-ivory'
                    : 'text-charcoal/70 hover:bg-ivory border border-transparent hover:border-sand-dark/30'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Sort order toggle */}
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="p-2 text-xs text-charcoal/70 hover:bg-ivory border border-sand-dark/30 rounded-lg flex items-center gap-1.5"
            title="Toggle sort order"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
          </button>

        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-xl border border-sand-dark/20 shadow-xs overflow-hidden">
        {filteredEnquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] border-b border-sand-dark/20 text-charcoal/60 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Guest</th>
                  <th className="py-3.5 px-4 font-semibold">Suite Requested</th>
                  <th className="py-3.5 px-4 font-semibold">Stay Dates</th>
                  <th className="py-3.5 px-4 font-semibold">Guests</th>
                  <th className="py-3.5 px-4 font-semibold">Received</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/30">
                {filteredEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-ivory/50 transition-colors">
                    
                    {/* Guest name and contact */}
                    <td className="py-4 px-4">
                      <p className="font-semibold text-charcoal">{enq.guestName}</p>
                      <p className="text-[11px] text-charcoal/60">{enq.email}</p>
                      <p className="text-[10px] text-charcoal/40 font-mono">{enq.phone}</p>
                    </td>

                    {/* Suite Requested */}
                    <td className="py-4 px-4 font-medium text-forest-deep">
                      {enq.roomName || 'General Enquiry'}
                    </td>

                    {/* Stay Dates */}
                    <td className="py-4 px-4 text-charcoal/80">
                      <div className="flex items-center gap-1 text-[11px]">
                        <span>{enq.checkIn}</span>
                        <span className="text-charcoal/40">→</span>
                        <span>{enq.checkOut}</span>
                      </div>
                    </td>

                    {/* Guests count */}
                    <td className="py-4 px-4 text-charcoal/80">
                      {enq.guests} {enq.guests === 1 ? 'Guest' : 'Guests'}
                    </td>

                    {/* Date received */}
                    <td className="py-4 px-4 text-charcoal/50 text-[11px]">
                      {new Date(enq.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>

                    {/* Status dropdown */}
                    <td className="py-4 px-4">
                      <select
                        value={enq.status}
                        onChange={(e) => handleStatusChange(enq.id, e.target.value as EnquiryStatus)}
                        className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full border cursor-pointer focus:outline-none ${getStatusBadge(
                          enq.status
                        )}`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenDetails(enq)}
                          className="p-1.5 text-charcoal/70 hover:text-forest hover:bg-sand/30 rounded transition-colors"
                          title="View complete enquiry details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEnquiryToDelete(enq.id)}
                          className="p-1.5 text-charcoal/40 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete enquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <Inbox className="w-10 h-10 text-charcoal/30 mx-auto mb-3" />
            <h4 className="font-serif text-lg text-charcoal">No enquiries found</h4>
            <p className="text-xs text-charcoal/50 mt-1 max-w-sm mx-auto">
              No reservation enquiries match your current search or status filter.
            </p>
          </div>
        )}
      </div>

      {/* Detail & Internal Notes Modal */}
      {selectedEnquiry && (
        <Modal
          isOpen={!!selectedEnquiry}
          onClose={() => setSelectedEnquiry(null)}
          title={`Enquiry: ${selectedEnquiry.guestName}`}
          subtitle={`Reference ID: ${selectedEnquiry.id}`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            
            {/* Guest Summary Card */}
            <div className="bg-ivory rounded-xl p-5 border border-sand-dark/20 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-charcoal/50 uppercase tracking-wider text-[10px] block mb-0.5">Guest Contact</span>
                <p className="font-semibold text-charcoal">{selectedEnquiry.guestName}</p>
                <p className="text-charcoal/70 mt-0.5">{selectedEnquiry.email}</p>
                <p className="text-charcoal/70 font-mono mt-0.5">{selectedEnquiry.phone}</p>
              </div>

              <div>
                <span className="text-charcoal/50 uppercase tracking-wider text-[10px] block mb-0.5">Reservation Parameters</span>
                <p className="font-semibold text-forest-deep">{selectedEnquiry.roomName || 'General Enquiry'}</p>
                <p className="text-charcoal/70 mt-0.5">Dates: {selectedEnquiry.checkIn} → {selectedEnquiry.checkOut}</p>
                <p className="text-charcoal/70 mt-0.5">Party Size: {selectedEnquiry.guests} Guests</p>
              </div>
            </div>

            {/* Guest Message */}
            {selectedEnquiry.message && (
              <div>
                <span className="text-xs font-semibold tracking-wider uppercase text-charcoal/70 block mb-2">
                  Guest Inquiries / Requests
                </span>
                <div className="p-4 bg-white rounded-lg border border-sand-dark/30 text-xs text-charcoal/80 leading-relaxed italic">
                  "{selectedEnquiry.message}"
                </div>
              </div>
            )}

            {/* Status Selector */}
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-charcoal/70 block mb-2">
                Operational Status
              </span>
              <div className="flex flex-wrap gap-2">
                {(['New', 'Contacted', 'Pending', 'Confirmed', 'Cancelled'] as EnquiryStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(selectedEnquiry.id, st)}
                    className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg border transition-all ${
                      selectedEnquiry.status === st
                        ? 'bg-forest text-ivory border-forest'
                        : 'bg-white text-charcoal/70 hover:bg-sand/30 border-sand-dark/30'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Internal Owner Notes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold tracking-wider uppercase text-charcoal/70">
                  Internal Operations Notes
                </span>
                <span className="text-[10px] text-charcoal/40">Private to management</span>
              </div>
              <textarea
                rows={4}
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="Add private guest notes, dietary accommodations, tour arrangements, or response log..."
                className="w-full p-3.5 text-xs bg-ivory/50 border border-sand-dark/40 rounded-lg focus:outline-none focus:border-forest text-charcoal"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold tracking-wider uppercase bg-forest hover:bg-forest-deep text-ivory rounded transition-colors shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Internal Notes</span>
                </button>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-sand-dark/20 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setEnquiryToDelete(selectedEnquiry.id)}
                className="text-xs text-red-600 hover:text-red-800 font-medium tracking-wider uppercase flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Enquiry</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="px-5 py-2 text-xs font-semibold tracking-wider uppercase bg-sand/30 hover:bg-sand/60 text-charcoal rounded"
              >
                Close
              </button>
            </div>

          </div>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!enquiryToDelete}
        onClose={() => setEnquiryToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Enquiry Record?"
        message="This action will permanently delete this customer enquiry from your database. This cannot be undone."
        confirmText="Delete Record"
        isDestructive={true}
      />

    </div>
  );
};
