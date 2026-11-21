import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Search,
  Sparkles,
  Phone,
  Mail,
  User,
  XCircle,
  ShieldAlert,
  ArrowRight,
  Info
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../components/ui/Toast';
import { Booking, BookingStatus } from '../../types';

export const BookingPage: React.FC = () => {
  const { getHourlySlotsForDate, bookSlot, cancelBooking, findBookingByIdOrPhone } = useData();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();

  // Mode: "book" or "manage"
  const [activeTab, setActiveTab] = useState<'book' | 'manage'>('book');

  // Today's date in YYYY-MM-DD
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return searchParams.get('date') || getTodayString();
  });

  const [selectedSlot, setSelectedSlot] = useState<string>('');

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    bookingType: 'Suite Viewing & Stay Consultation' as Booking['bookingType'],
    guests: 2,
    specialRequests: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Manage / Lookup state
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupResults, setLookupResults] = useState<Booking[] | null>(null);
  const [isCancellingId, setIsCancellingId] = useState<string | null>(null);

  // Refresh slots on date change
  const slots = getHourlySlotsForDate(selectedDate);

  // Date shortcuts
  const getDateOffset = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const handleSlotSelect = (timeSlot: string, status: string) => {
    if (status !== 'available') return;
    setSelectedSlot(timeSlot);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSlot) {
      showToast('Please select an available 1-hour time slot.', 'error');
      return;
    }

    if (!formData.customerName.trim() || !formData.phone.trim() || !formData.email.trim()) {
      showToast('Please complete all required customer details.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await bookSlot({
        customerName: formData.customerName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        bookingDate: selectedDate,
        timeSlot: selectedSlot,
        bookingType: formData.bookingType,
        guests: formData.guests,
        specialRequests: formData.specialRequests.trim() || undefined
      });

      setConfirmedBooking(created);
      showToast(`Reservation confirmed! Reference: ${created.id}`, 'success');
      setSelectedSlot('');
    } catch (err: any) {
      showToast(err.message || 'Slot booking failed. Please try another time.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupQuery.trim()) {
      showToast('Enter your Booking ID or Phone number to look up.', 'error');
      return;
    }
    const res = findBookingByIdOrPhone(lookupQuery);
    setLookupResults(res);
  };

  const handleCustomerCancel = async (bookingId: string) => {
    if (!window.confirm('Are you sure you wish to cancel this reservation? The slot will be released back to other guests.')) {
      return;
    }

    setIsCancellingId(bookingId);
    try {
      await cancelBooking(bookingId, 'Cancelled by customer via self-service portal');
      showToast(`Booking ${bookingId} cancelled and slot released.`, 'info');

      // Update local view
      if (confirmedBooking?.id === bookingId) {
        setConfirmedBooking({ ...confirmedBooking, status: 'Cancelled' });
      }
      if (lookupResults) {
        setLookupResults((prev) =>
          prev?.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled' } : b)) || []
        );
      }
    } catch {
      showToast('Unable to cancel booking at this time.', 'error');
    } finally {
      setIsCancellingId(null);
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

  return (
    <div className="pt-28 pb-24 bg-ivory min-h-screen">
      
      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 sm:px-8 mb-12 text-center">
        <span className="text-xs font-semibold tracking-[0.25em] uppercase text-bronze block mb-3">
          HOURLY RESERVATION SYSTEM
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-forest-deep mb-4">
          Reserve Your Slot
        </h1>
        <p className="text-sm sm:text-base text-charcoal/75 font-light leading-relaxed max-w-2xl mx-auto">
          To maintain utmost privacy and personalized attention, Havenora accepts strictly one reservation per hourly slot. All times in local Nepal Time (NPT · UTC+05:45).
        </p>

        {/* Tab Toggle: Book vs Lookup/Cancel */}
        <div className="inline-flex p-1 bg-white rounded-xl border border-sand-dark/30 shadow-xs mt-8">
          <button
            type="button"
            onClick={() => setActiveTab('book')}
            className={`px-6 py-2.5 text-xs font-semibold tracking-wider uppercase rounded-lg transition-all ${
              activeTab === 'book'
                ? 'bg-forest text-ivory shadow-xs'
                : 'text-charcoal/70 hover:text-charcoal'
            }`}
          >
            Book Available Slot
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manage')}
            className={`px-6 py-2.5 text-xs font-semibold tracking-wider uppercase rounded-lg transition-all ${
              activeTab === 'manage'
                ? 'bg-forest text-ivory shadow-xs'
                : 'text-charcoal/70 hover:text-charcoal'
            }`}
          >
            Manage / Cancel Booking
          </button>
        </div>
      </section>

      {/* Main Container */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {activeTab === 'book' ? (
          <div>
            {confirmedBooking && confirmedBooking.status !== 'Cancelled' ? (
              /* Success Confirmation View */
              <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 sm:p-12 border border-sand-dark/30 shadow-xl text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <span className="text-xs font-semibold tracking-luxury uppercase text-bronze block mb-1">
                    RESERVATION LOGGED
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-forest-deep">
                    Your Hourly Slot is Reserved
                  </h2>
                  <p className="text-xs text-charcoal/60 mt-1">
                    We look forward to welcoming you to Havenora, Pokhara.
                  </p>
                </div>

                {/* Details Summary Card */}
                <div className="bg-ivory rounded-xl p-6 border border-sand-dark/20 text-xs text-left space-y-3">
                  <div className="flex justify-between items-center py-1.5 border-b border-sand-dark/20">
                    <span className="text-charcoal/60 uppercase tracking-wider font-semibold text-[10px]">Reference Code:</span>
                    <span className="font-mono text-sm font-bold text-forest">{confirmedBooking.id}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-sand-dark/20">
                    <span className="text-charcoal/60 uppercase tracking-wider font-semibold text-[10px]">Date:</span>
                    <span className="font-semibold text-charcoal">{confirmedBooking.bookingDate}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-sand-dark/20">
                    <span className="text-charcoal/60 uppercase tracking-wider font-semibold text-[10px]">Time Slot:</span>
                    <span className="font-semibold text-forest-deep">{confirmedBooking.timeSlot} (NPT)</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-sand-dark/20">
                    <span className="text-charcoal/60 uppercase tracking-wider font-semibold text-[10px]">Experience Type:</span>
                    <span className="font-medium text-charcoal">{confirmedBooking.bookingType}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-sand-dark/20">
                    <span className="text-charcoal/60 uppercase tracking-wider font-semibold text-[10px]">Guest Name:</span>
                    <span className="text-charcoal">{confirmedBooking.customerName} ({confirmedBooking.guests} Guests)</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-charcoal/60 uppercase tracking-wider font-semibold text-[10px]">Status:</span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${getStatusBadge(confirmedBooking.status)}`}>
                      {confirmedBooking.status}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setConfirmedBooking(null)}
                    className="w-full sm:w-auto px-6 py-3 text-xs font-semibold tracking-wider uppercase bg-forest text-ivory rounded hover:bg-forest-deep transition-colors"
                  >
                    Book Another Slot
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCustomerCancel(confirmedBooking.id)}
                    className="w-full sm:w-auto px-6 py-3 text-xs font-semibold tracking-wider uppercase border border-red-300 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    Cancel Reservation
                  </button>
                </div>

                <p className="text-[11px] text-charcoal/50">
                  Tip: Save your reference code <strong className="font-mono">{confirmedBooking.id}</strong> to check status or cancel anytime.
                </p>
              </div>
            ) : (
              /* Booking Calendar & Slot Picker Grid */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                
                {/* Left Column: Date & Slot Picker */}
                <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-sand-dark/30 shadow-xs space-y-6">
                  
                  {/* Date Selector Header */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-semibold tracking-wider uppercase text-charcoal/80 flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-bronze" />
                        <span>1. Choose Reservation Date</span>
                      </label>
                      <span className="text-[11px] text-charcoal/50">Timezone: Nepal (NPT · UTC+05:45)</span>
                    </div>

                    {/* Quick Date Pills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {[
                        { label: 'Today', date: getDateOffset(0) },
                        { label: 'Tomorrow', date: getDateOffset(1) },
                        { label: 'In 2 Days', date: getDateOffset(2) },
                        { label: 'In 3 Days', date: getDateOffset(3) },
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => {
                            setSelectedDate(item.date);
                            setSelectedSlot('');
                          }}
                          className={`px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                            selectedDate === item.date
                              ? 'bg-forest text-ivory border-forest'
                              : 'bg-ivory/60 hover:bg-sand/30 border-sand-dark/30 text-charcoal'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    <input
                      type="date"
                      value={selectedDate}
                      min={getTodayString()}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setSelectedSlot('');
                      }}
                      className="w-full p-2.5 text-xs bg-ivory/60 border border-sand-dark/40 rounded-lg focus:outline-none focus:border-forest text-charcoal"
                    />
                  </div>

                  {/* Hourly Slot Grid */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-semibold tracking-wider uppercase text-charcoal/80 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-bronze" />
                        <span>2. Select Exactly 1 Hourly Slot</span>
                      </label>
                      
                      {/* Legend */}
                      <div className="flex items-center gap-3 text-[10px]">
                        <span className="flex items-center gap-1 text-emerald-700">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Available
                        </span>
                        <span className="flex items-center gap-1 text-gray-500">
                          <span className="w-2 h-2 rounded-full bg-gray-400" /> Booked
                        </span>
                        <span className="flex items-center gap-1 text-amber-700">
                          <span className="w-2 h-2 rounded-full bg-amber-500" /> Blocked
                        </span>
                      </div>
                    </div>

                    {/* Slots Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {slots.map((s) => {
                        const isSelected = selectedSlot === s.timeSlot;
                        const isAvailable = s.status === 'available';
                        const isBooked = s.status === 'booked';
                        const isBlocked = s.status === 'blocked';

                        return (
                          <button
                            key={s.timeSlot}
                            type="button"
                            disabled={!isAvailable}
                            onClick={() => handleSlotSelect(s.timeSlot, s.status)}
                            className={`p-3 rounded-lg border text-left transition-all relative flex flex-col justify-between min-h-[64px] ${
                              isSelected
                                ? 'bg-forest text-ivory border-forest ring-2 ring-bronze/50 shadow-sm'
                                : isAvailable
                                ? 'bg-white hover:bg-sand/20 border-sand-dark/30 text-charcoal hover:border-forest cursor-pointer'
                                : isBooked
                                ? 'bg-gray-100/80 border-gray-200 text-gray-400 cursor-not-allowed opacity-75'
                                : 'bg-amber-50/70 border-amber-200 text-amber-600 cursor-not-allowed opacity-75'
                            }`}
                          >
                            <span className="text-xs font-semibold font-mono">
                              {s.timeSlot}
                            </span>

                            <div className="flex items-center justify-between mt-1 text-[10px]">
                              {isAvailable && (
                                <span className={`font-medium ${isSelected ? 'text-sand' : 'text-emerald-700'}`}>
                                  {isSelected ? '✓ Selected' : 'Available'}
                                </span>
                              )}
                              {isBooked && <span className="text-gray-500">Reserved</span>}
                              {isBlocked && <span className="text-amber-700">Unavailable</span>}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {!selectedSlot && (
                      <p className="text-[11px] text-charcoal/50 italic mt-3">
                        * Click an available slot above to proceed with your booking details.
                      </p>
                    )}
                  </div>

                </div>

                {/* Right Column: Customer Details Form */}
                <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-sand-dark/30 shadow-xl sticky top-28">
                  <h3 className="font-serif text-2xl text-forest-deep mb-2">
                    Guest Information
                  </h3>
                  <p className="text-xs text-charcoal/60 mb-6 font-light">
                    {selectedSlot ? (
                      <span className="text-forest font-medium">
                        Selected: <strong>{selectedDate}</strong> at <strong>{selectedSlot}</strong> (1 hour)
                      </span>
                    ) : (
                      'Please select a 1-hour time slot on the left.'
                    )}
                  </p>

                  <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        placeholder="e.g. Maya Shrestha"
                        className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+977 980 000 0000"
                          className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@domain.com"
                          className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
                          Reservation Purpose
                        </label>
                        <select
                          value={formData.bookingType}
                          onChange={(e) => setFormData({ ...formData, bookingType: e.target.value as any })}
                          className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
                        >
                          <option value="Suite Viewing & Stay Consultation">Suite Viewing & Consultation</option>
                          <option value="Sunrise Tea & Yoga Experience">Sunrise Tea & Yoga</option>
                          <option value="Culinary Hearth Tasting">Culinary Hearth Tasting</option>
                          <option value="Private Wellness Sanctuary">Private Wellness Sanctuary</option>
                          <option value="General Retreat Experience">General Retreat Experience</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
                          Party Size
                        </label>
                        <select
                          value={formData.guests}
                          onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
                          className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
                        >
                          <option value={1}>1 Guest</option>
                          <option value={2}>2 Guests</option>
                          <option value={3}>3 Guests</option>
                          <option value={4}>4 Guests</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
                        Special Requests or Dietary Requirements
                      </label>
                      <textarea
                        rows={3}
                        value={formData.specialRequests}
                        onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                        placeholder="Arrival notes, preferences, or questions..."
                        className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !selectedSlot}
                      className="w-full py-3.5 text-xs font-semibold tracking-luxury uppercase bg-forest hover:bg-forest-deep text-ivory rounded shadow-md transition-all active:scale-98 disabled:opacity-40"
                    >
                      {isSubmitting ? (
                        'Securing Hourly Slot...'
                      ) : selectedSlot ? (
                        `Confirm Booking for ${selectedSlot}`
                      ) : (
                        'Select a Slot to Continue'
                      )}
                    </button>

                    <div className="flex items-center gap-2 text-[10px] text-charcoal/50 pt-1">
                      <Info className="w-3.5 h-3.5 shrink-0 text-bronze" />
                      <span>One confirmed booking per hourly slot. Immediately reserved upon confirmation.</span>
                    </div>
                  </form>
                </div>

              </div>
            )}
          </div>
        ) : (
          /* Manage / Cancel Existing Booking Tab */
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="bg-white rounded-2xl p-8 border border-sand-dark/30 shadow-sm space-y-4">
              <h2 className="font-serif text-2xl text-forest-deep">
                Look Up Your Reservation
              </h2>
              <p className="text-xs text-charcoal/60">
                Enter your Booking Reference Code (e.g. <code className="font-bold text-forest">HV-70192</code>) or the phone number used during reservation.
              </p>

              <form onSubmit={handleLookup} className="flex gap-2">
                <input
                  type="text"
                  value={lookupQuery}
                  onChange={(e) => setLookupQuery(e.target.value)}
                  placeholder="e.g. HV-70192 or 9841234567"
                  className="flex-1 p-3 text-xs bg-ivory/60 border border-sand-dark/40 rounded-lg focus:outline-none focus:border-forest text-charcoal"
                />
                <button
                  type="submit"
                  className="px-6 py-3 text-xs font-semibold tracking-wider uppercase bg-forest hover:bg-forest-deep text-ivory rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </form>
            </div>

            {/* Results */}
            {lookupResults !== null && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl text-forest-deep">
                  Search Results ({lookupResults.length})
                </h3>

                {lookupResults.length > 0 ? (
                  lookupResults.map((b) => (
                    <div
                      key={b.id}
                      className="bg-white rounded-xl p-6 border border-sand-dark/30 shadow-xs space-y-4 text-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-sand-dark/20">
                        <div>
                          <span className="font-mono text-xs font-bold text-forest block">{b.id}</span>
                          <span className="text-[11px] text-charcoal/50">{b.bookingType}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border self-start ${getStatusBadge(b.status)}`}>
                          {b.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-charcoal/80">
                        <div>
                          <span className="text-charcoal/50 text-[10px] uppercase block">Date & Time Slot</span>
                          <p className="font-semibold">{b.bookingDate} · {b.timeSlot} (NPT)</p>
                        </div>
                        <div>
                          <span className="text-charcoal/50 text-[10px] uppercase block">Guest</span>
                          <p>{b.customerName} ({b.guests} Guests)</p>
                        </div>
                      </div>

                      {b.status !== 'Cancelled' && (
                        <div className="pt-3 border-t border-sand-dark/20 flex justify-end">
                          <button
                            type="button"
                            disabled={isCancellingId === b.id}
                            onClick={() => handleCustomerCancel(b.id)}
                            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-red-600 hover:bg-red-50 border border-red-200 rounded transition-colors"
                          >
                            {isCancellingId === b.id ? 'Cancelling...' : 'Cancel This Reservation'}
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center bg-white rounded-xl border border-sand-dark/30 text-xs text-charcoal/60">
                    No reservations found matching "{lookupQuery}". Please check the code or phone number.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </section>

    </div>
  );
};
