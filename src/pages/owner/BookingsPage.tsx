import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Check,
  Slash,
  Unlock,
  Trash2,
  Search,
  Filter,
  Eye,
  Plus,
  RefreshCw,
  Phone,
  Mail,
  User,
  ShieldAlert
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Booking, BookingStatus, BlockedSlot } from '../../types';
import { OPERATIONAL_HOURLY_SLOTS } from '../../lib/initialData';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/Toast';

export const BookingsPage: React.FC = () => {
  const {
    bookings,
    blockedSlots,
    updateBookingStatus,
    deleteBooking,
    blockSlot,
    unblockSlot,
    getHourlySlotsForDate
  } = useData();

  const { showToast } = useToast();

  const getTodayString = () => new Date().toISOString().split('T')[0];

  const [activeView, setActiveView] = useState<'schedule' | 'all-bookings'>('schedule');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());

  // Filter & Search in all-bookings view
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Manual block slot modal
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [blockForm, setBlockForm] = useState({
    date: getTodayString(),
    timeSlot: OPERATIONAL_HOURLY_SLOTS[0],
    reason: 'Private Property Event'
  });

  // Selected booking detail modal
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Booking to delete
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);

  const hourlySlots = getHourlySlotsForDate(selectedDate);

  // Stats
  const todayBookings = bookings.filter((b) => b.bookingDate === getTodayString() && b.status !== 'Cancelled');
  const pendingCount = bookings.filter((b) => b.status === 'Pending').length;
  const confirmedCount = bookings.filter((b) => b.status === 'Confirmed').length;

  const handleStatusUpdate = (bookingId: string, newStatus: BookingStatus) => {
    updateBookingStatus(bookingId, newStatus);
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking({ ...selectedBooking, status: newStatus });
    }
    showToast(`Booking ${bookingId} status updated to ${newStatus}`, 'success');
  };

  const handleCreateBlock = (e: React.FormEvent) => {
    e.preventDefault();
    blockSlot(blockForm.date, blockForm.timeSlot, blockForm.reason);
    showToast(`Slot ${blockForm.timeSlot} on ${blockForm.date} blocked.`, 'info');
    setIsBlockModalOpen(false);
  };

  const handleUnblock = (id: string, timeSlot: string) => {
    unblockSlot(id);
    showToast(`Slot ${timeSlot} reopened for bookings.`, 'success');
  };

  const confirmDelete = () => {
    if (bookingToDelete) {
      deleteBooking(bookingToDelete);
      showToast('Booking record removed permanently.', 'info');
      if (selectedBooking?.id === bookingToDelete) {
        setSelectedBooking(null);
      }
      setBookingToDelete(null);
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-500 border-gray-200 line-through';
      case 'Completed':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone.includes(searchTerm) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Stats */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-sand-dark/20 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold tracking-luxury uppercase text-bronze block mb-1">
            HOURLY RESERVATION MANAGEMENT
          </span>
          <h2 className="font-serif text-3xl text-forest-deep">
            Customer Hourly Bookings
          </h2>
          <p className="text-xs sm:text-sm text-charcoal/60 mt-1">
            Real-time hourly schedule, slot conflicts, confirmations, and manual blocks. (Timezone: NPT)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setBlockForm({ ...blockForm, date: selectedDate });
              setIsBlockModalOpen(true);
            }}
            className="px-4 py-2.5 text-xs font-semibold tracking-wider uppercase bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Slash className="w-3.5 h-3.5" />
            <span>Block Time Slot</span>
          </button>
        </div>
      </div>

      {/* Mini KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-sand-dark/20 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-charcoal/50 block">Today's Bookings</span>
            <span className="text-2xl font-serif font-bold text-forest-deep">{todayBookings.length}</span>
          </div>
          <CalendarIcon className="w-6 h-6 text-bronze" />
        </div>

        <div className="bg-white rounded-xl p-4 border border-sand-dark/20 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-charcoal/50 block">Pending Action</span>
            <span className="text-2xl font-serif font-bold text-blue-700">{pendingCount}</span>
          </div>
          <Clock className="w-6 h-6 text-blue-600" />
        </div>

        <div className="bg-white rounded-xl p-4 border border-sand-dark/20 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-charcoal/50 block">Confirmed Reservations</span>
            <span className="text-2xl font-serif font-bold text-emerald-700">{confirmedCount}</span>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
        </div>
      </div>

      {/* View Switcher: Daily Hourly Schedule vs All Bookings Table */}
      <div className="flex items-center justify-between border-b border-sand-dark/20 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveView('schedule')}
            className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-lg transition-colors ${
              activeView === 'schedule'
                ? 'bg-forest text-ivory'
                : 'text-charcoal/70 hover:bg-ivory'
            }`}
          >
            Hourly Slot Grid
          </button>
          <button
            type="button"
            onClick={() => setActiveView('all-bookings')}
            className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-lg transition-colors ${
              activeView === 'all-bookings'
                ? 'bg-forest text-ivory'
                : 'text-charcoal/70 hover:bg-ivory'
            }`}
          >
            All Bookings Table ({bookings.length})
          </button>
        </div>

        {activeView === 'schedule' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-charcoal/60 hidden sm:inline">Viewing Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white border border-sand-dark/40 rounded-lg focus:outline-none focus:border-forest text-charcoal"
            />
          </div>
        )}
      </div>

      {/* VIEW 1: Hourly Slot Schedule for Selected Date */}
      {activeView === 'schedule' && (
        <div className="bg-white rounded-xl p-6 border border-sand-dark/20 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sand-dark/20">
            <div>
              <h3 className="font-serif text-xl text-forest-deep">
                Schedule for {selectedDate}
              </h3>
              <p className="text-xs text-charcoal/50">
                12 operational 1-hour slots. Instant status updates between owner and customer views.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Available ({hourlySlots.filter((s) => s.status === 'available').length})
              </span>
              <span className="flex items-center gap-1.5 text-blue-700">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                Booked ({hourlySlots.filter((s) => s.status === 'booked').length})
              </span>
              <span className="flex items-center gap-1.5 text-amber-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Blocked ({hourlySlots.filter((s) => s.status === 'blocked').length})
              </span>
            </div>
          </div>

          {/* Slots List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hourlySlots.map((slot) => {
              const isAvailable = slot.status === 'available';
              const isBooked = slot.status === 'booked';
              const isBlocked = slot.status === 'blocked';
              const booking = slot.booking;
              const blockedSlot = slot.blockedSlot;

              return (
                <div
                  key={slot.timeSlot}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between min-h-[130px] ${
                    isAvailable
                      ? 'bg-emerald-50/30 border-emerald-200'
                      : isBooked
                      ? 'bg-white border-blue-200 shadow-xs'
                      : 'bg-amber-50/50 border-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-charcoal">
                      {slot.timeSlot}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        isAvailable
                          ? 'bg-emerald-100 text-emerald-800'
                          : isBooked
                          ? getStatusBadge(booking!.status)
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isAvailable ? 'Available' : isBooked ? booking!.status : 'Blocked'}
                    </span>
                  </div>

                  {/* Slot Details */}
                  <div className="my-2 text-xs">
                    {isAvailable && (
                      <p className="text-charcoal/50 text-[11px]">
                        Open for customer booking.
                      </p>
                    )}

                    {isBooked && booking && (
                      <div className="space-y-0.5">
                        <p className="font-semibold text-charcoal truncate">{booking.customerName}</p>
                        <p className="text-[11px] text-charcoal/60 truncate">{booking.bookingType}</p>
                        <p className="text-[10px] text-charcoal/40 font-mono">{booking.phone}</p>
                      </div>
                    )}

                    {isBlocked && blockedSlot && (
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-amber-700 block font-semibold">
                          Reason for Block:
                        </span>
                        <p className="text-charcoal/70 text-[11px] italic">"{blockedSlot.reason}"</p>
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="pt-2 border-t border-sand-dark/15 flex items-center justify-between text-xs">
                    {isAvailable && (
                      <button
                        type="button"
                        onClick={() => {
                          setBlockForm({ date: selectedDate, timeSlot: slot.timeSlot, reason: 'Property Maintenance' });
                          setIsBlockModalOpen(true);
                        }}
                        className="text-[11px] text-amber-700 hover:text-amber-900 font-medium"
                      >
                        + Block This Slot
                      </button>
                    )}

                    {isBooked && booking && (
                      <div className="flex items-center justify-between w-full">
                        <button
                          type="button"
                          onClick={() => setSelectedBooking(booking)}
                          className="text-[11px] text-forest hover:text-bronze font-medium flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          {booking.status === 'Pending' && (
                            <button
                              type="button"
                              onClick={() => handleStatusUpdate(booking.id, 'Confirmed')}
                              className="px-2 py-0.5 text-[10px] font-semibold uppercase bg-emerald-600 text-white rounded hover:bg-emerald-700"
                              title="Confirm booking"
                            >
                              Confirm
                            </button>
                          )}
                          {booking.status !== 'Cancelled' && (
                            <button
                              type="button"
                              onClick={() => handleStatusUpdate(booking.id, 'Cancelled')}
                              className="px-2 py-0.5 text-[10px] font-semibold uppercase bg-red-100 text-red-700 rounded hover:bg-red-200"
                              title="Cancel & release slot"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {isBlocked && blockedSlot && (
                      <button
                        type="button"
                        onClick={() => handleUnblock(blockedSlot.id, slot.timeSlot)}
                        className="text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Reopen Slot</span>
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: All Bookings Data Table */}
      {activeView === 'all-bookings' && (
        <div className="bg-white rounded-xl border border-sand-dark/20 shadow-xs overflow-hidden space-y-4 p-5">
          
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by customer name, phone, email, or code..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-ivory/60 border border-sand-dark/30 rounded-lg focus:outline-none focus:border-forest text-charcoal"
              />
              <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-charcoal/50">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-ivory/60 border border-sand-dark/30 rounded-lg focus:outline-none focus:border-forest text-charcoal"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] border-b border-sand-dark/20 text-charcoal/60 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-semibold">Ref</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Date & Time Slot</th>
                  <th className="py-3 px-4 font-semibold">Experience Type</th>
                  <th className="py-3 px-4 font-semibold">Guests</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/30">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-ivory/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-forest">
                      {b.id}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-charcoal">{b.customerName}</p>
                      <p className="text-[11px] text-charcoal/50">{b.phone}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-charcoal">{b.bookingDate}</p>
                      <p className="text-[11px] text-forest-deep font-mono">{b.timeSlot}</p>
                    </td>
                    <td className="py-3 px-4 text-charcoal/80">
                      {b.bookingType}
                    </td>
                    <td className="py-3 px-4 text-charcoal/80">
                      {b.guests}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusUpdate(b.id, e.target.value as BookingStatus)}
                        className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded border cursor-pointer ${getStatusBadge(
                          b.status
                        )}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="p-1.5 text-charcoal/60 hover:text-forest rounded"
                          title="View booking"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setBookingToDelete(b.id)}
                          className="p-1.5 text-charcoal/40 hover:text-red-600 rounded"
                          title="Delete booking"
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

          {filteredBookings.length === 0 && (
            <div className="text-center py-12 text-xs text-charcoal/50">
              No customer bookings found.
            </div>
          )}

        </div>
      )}

      {/* Manual Block Slot Modal */}
      <Modal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        title="Block Hourly Slot"
        subtitle="Prevent customers from booking a specific date and time slot"
        maxWidth="md"
      >
        <form onSubmit={handleCreateBlock} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
              Date
            </label>
            <input
              type="date"
              required
              value={blockForm.date}
              onChange={(e) => setBlockForm({ ...blockForm, date: e.target.value })}
              className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
              Hourly Slot
            </label>
            <select
              value={blockForm.timeSlot}
              onChange={(e) => setBlockForm({ ...blockForm, timeSlot: e.target.value })}
              className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal font-mono"
            >
              <option value="ALL_DAY">ALL DAY (Block entire 24h schedule)</option>
              {OPERATIONAL_HOURLY_SLOTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
              Reason / Internal Note
            </label>
            <input
              type="text"
              required
              value={blockForm.reason}
              onChange={(e) => setBlockForm({ ...blockForm, reason: e.target.value })}
              placeholder="e.g. Pavilion Maintenance or Private Booking"
              className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
            />
          </div>

          <div className="pt-4 border-t border-sand-dark/20 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsBlockModalOpen(false)}
              className="px-4 py-2 uppercase tracking-wider text-charcoal/70 hover:bg-sand/30 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 uppercase tracking-wider font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded shadow-xs"
            >
              Block Slot
            </button>
          </div>
        </form>
      </Modal>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <Modal
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          title={`Booking: ${selectedBooking.customerName}`}
          subtitle={`Reference ID: ${selectedBooking.id}`}
          maxWidth="lg"
        >
          <div className="space-y-5 text-xs">
            <div className="bg-ivory rounded-xl p-5 border border-sand-dark/20 space-y-2">
              <div className="flex justify-between py-1 border-b border-sand-dark/20">
                <span className="text-charcoal/60 uppercase text-[10px]">Date & Time Slot:</span>
                <span className="font-semibold text-forest-deep">{selectedBooking.bookingDate} · {selectedBooking.timeSlot}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-sand-dark/20">
                <span className="text-charcoal/60 uppercase text-[10px]">Customer Phone:</span>
                <span className="font-mono font-medium text-charcoal">{selectedBooking.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-sand-dark/20">
                <span className="text-charcoal/60 uppercase text-[10px]">Email:</span>
                <span className="text-charcoal">{selectedBooking.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-sand-dark/20">
                <span className="text-charcoal/60 uppercase text-[10px]">Experience Type:</span>
                <span className="text-charcoal font-medium">{selectedBooking.bookingType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-sand-dark/20">
                <span className="text-charcoal/60 uppercase text-[10px]">Guests:</span>
                <span className="text-charcoal">{selectedBooking.guests}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-charcoal/60 uppercase text-[10px]">Current Status:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${getStatusBadge(selectedBooking.status)}`}>
                  {selectedBooking.status}
                </span>
              </div>
            </div>

            {selectedBooking.specialRequests && (
              <div>
                <span className="font-semibold uppercase tracking-wider text-charcoal/70 block mb-1">
                  Customer Notes / Special Requests:
                </span>
                <div className="p-3 bg-white rounded border border-sand-dark/30 italic text-charcoal/80">
                  "{selectedBooking.specialRequests}"
                </div>
              </div>
            )}

            {/* Quick Status Action Buttons */}
            <div>
              <span className="font-semibold uppercase tracking-wider text-charcoal/70 block mb-2">
                Update Status:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusUpdate(selectedBooking.id, 'Confirmed')}
                  className="px-3 py-1.5 rounded uppercase font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Confirm Reservation
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusUpdate(selectedBooking.id, 'Completed')}
                  className="px-3 py-1.5 rounded uppercase font-semibold bg-purple-600 text-white hover:bg-purple-700"
                >
                  Mark Completed
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusUpdate(selectedBooking.id, 'Cancelled')}
                  className="px-3 py-1.5 rounded uppercase font-semibold bg-red-100 text-red-700 hover:bg-red-200"
                >
                  Reject / Cancel Slot
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-sand-dark/20 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setBookingToDelete(selectedBooking.id)}
                className="text-red-600 hover:text-red-800 uppercase font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Record</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 uppercase tracking-wider bg-sand/30 hover:bg-sand/60 text-charcoal rounded"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!bookingToDelete}
        onClose={() => setBookingToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Booking Record?"
        message="This action will delete the reservation record permanently."
        confirmText="Delete"
        isDestructive={true}
      />

    </div>
  );
};
