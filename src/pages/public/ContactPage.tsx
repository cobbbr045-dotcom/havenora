import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Users,
  MessageSquare
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../components/ui/Toast';

export const ContactPage: React.FC = () => {
  const { rooms, settings, addEnquiry } = useData();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();

  const selectedRoomId = searchParams.get('room') || '';

  const [formData, setFormData] = useState({
    guestName: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    roomId: selectedRoomId,
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEnquiry, setSubmittedEnquiry] = useState<any | null>(null);

  useEffect(() => {
    if (selectedRoomId) {
      setFormData((prev) => ({ ...prev, roomId: selectedRoomId }));
    }
  }, [selectedRoomId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.guestName.trim()) {
      newErrors.guestName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.checkIn) {
      newErrors.checkIn = 'Check-in date is required';
    }

    if (!formData.checkOut) {
      newErrors.checkOut = 'Check-out date is required';
    } else if (formData.checkIn && new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      newErrors.checkOut = 'Check-out must be at least one day after check-in';
    }

    if (formData.guests < 1) {
      newErrors.guests = 'At least 1 guest is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please correct the highlighted form errors.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedRoom = rooms.find((r) => r.id === formData.roomId);

      const created = await addEnquiry({
        guestName: formData.guestName,
        email: formData.email,
        phone: formData.phone,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: formData.guests,
        roomId: formData.roomId || undefined,
        roomName: selectedRoom ? selectedRoom.name : 'General Enquiry',
        message: formData.message || undefined,
      });

      setSubmittedEnquiry(created);
      showToast('Booking enquiry sent to the owner portal successfully!', 'success');
    } catch {
      showToast('An error occurred while saving your enquiry. Please retry.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmittedEnquiry(null);
    setFormData({
      guestName: '',
      email: '',
      phone: '',
      checkIn: '',
      checkOut: '',
      guests: 2,
      roomId: '',
      message: ''
    });
    setErrors({});
  };

  return (
    <div className="pt-28 pb-24 bg-ivory min-h-screen">
      
      {/* Page Header */}
      <section className="max-w-4xl mx-auto px-6 sm:px-8 mb-16 text-center">
        <span className="text-xs font-semibold tracking-[0.25em] uppercase text-bronze block mb-3">
          RESERVATIONS & INQUIRIES
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-forest-deep mb-6">
          Begin Your Stay
        </h1>
        <p className="text-sm sm:text-base text-charcoal/75 font-light leading-relaxed max-w-2xl mx-auto">
          We welcome reservations by personalized enquiry. Share your anticipated dates and preferences; our retreat curators will reply promptly with confirmed suite options.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Form or Success Card */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-8 sm:p-12 border border-sand-dark/30 shadow-xl">
            
            {submittedEnquiry ? (
              <div className="py-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                
                <div>
                  <h2 className="font-serif text-3xl text-forest-deep mb-2">
                    Enquiry Received
                  </h2>
                  <p className="text-sm text-charcoal/70 max-w-md mx-auto">
                    Thank you, <strong className="font-medium text-charcoal">{submittedEnquiry.guestName}</strong>. Your stay request for <strong className="font-medium text-charcoal">{submittedEnquiry.roomName}</strong> has been logged.
                  </p>
                </div>

                <div className="bg-ivory p-6 rounded-xl border border-sand-dark/20 text-xs text-left max-w-md mx-auto space-y-2">
                  <div className="flex justify-between py-1 border-b border-sand-dark/20">
                    <span className="text-charcoal/60">Enquiry Reference:</span>
                    <span className="font-mono font-medium text-forest">{submittedEnquiry.id}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-sand-dark/20">
                    <span className="text-charcoal/60">Dates:</span>
                    <span className="font-medium">{submittedEnquiry.checkIn} → {submittedEnquiry.checkOut}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-sand-dark/20">
                    <span className="text-charcoal/60">Guests:</span>
                    <span className="font-medium">{submittedEnquiry.guests}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-charcoal/60">Status:</span>
                    <span className="px-2 py-0.5 rounded bg-bronze/10 text-bronze font-semibold uppercase text-[10px]">
                      {submittedEnquiry.status}
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={handleResetForm}
                    className="px-6 py-2.5 text-xs font-semibold tracking-wider uppercase border border-forest/30 text-forest rounded hover:bg-forest/5"
                  >
                    Submit Another Enquiry
                  </button>
                  <a
                    href="/owner/login"
                    className="px-6 py-2.5 text-xs font-semibold tracking-wider uppercase bg-forest text-ivory rounded hover:bg-forest-deep"
                  >
                    View in Owner Portal →
                  </a>
                </div>

                <p className="text-[11px] text-charcoal/50 italic">
                  * Note: In this demonstration platform, the enquiry was stored directly into your reactive local data layer and is instantly visible in the Owner Portal.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl text-forest-deep mb-2">
                    Stay Request Form
                  </h2>
                  <p className="text-xs text-charcoal/60 font-light">
                    Fields marked with an asterisk (*) are required.
                  </p>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold tracking-wider uppercase text-charcoal/80 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.guestName}
                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    placeholder="e.g. Elena Rostova"
                    className={`w-full px-4 py-3 text-sm bg-ivory/60 border rounded-lg focus:outline-none focus:border-forest text-charcoal ${
                      errors.guestName ? 'border-red-500' : 'border-sand-dark/40'
                    }`}
                  />
                  {errors.guestName && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.guestName}
                    </p>
                  )}
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold tracking-wider uppercase text-charcoal/80 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className={`w-full px-4 py-3 text-sm bg-ivory/60 border rounded-lg focus:outline-none focus:border-forest text-charcoal ${
                        errors.email ? 'border-red-500' : 'border-sand-dark/40'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold tracking-wider uppercase text-charcoal/80 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+977 980 000 0000"
                      className={`w-full px-4 py-3 text-sm bg-ivory/60 border rounded-lg focus:outline-none focus:border-forest text-charcoal ${
                        errors.phone ? 'border-red-500' : 'border-sand-dark/40'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Check In / Check Out */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold tracking-wider uppercase text-charcoal/80 mb-1.5">
                      Check-In Date *
                    </label>
                    <input
                      type="date"
                      value={formData.checkIn}
                      onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                      className={`w-full px-4 py-3 text-sm bg-ivory/60 border rounded-lg focus:outline-none focus:border-forest text-charcoal ${
                        errors.checkIn ? 'border-red-500' : 'border-sand-dark/40'
                      }`}
                    />
                    {errors.checkIn && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.checkIn}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold tracking-wider uppercase text-charcoal/80 mb-1.5">
                      Check-Out Date *
                    </label>
                    <input
                      type="date"
                      value={formData.checkOut}
                      onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                      className={`w-full px-4 py-3 text-sm bg-ivory/60 border rounded-lg focus:outline-none focus:border-forest text-charcoal ${
                        errors.checkOut ? 'border-red-500' : 'border-sand-dark/40'
                      }`}
                    />
                    {errors.checkOut && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.checkOut}
                      </p>
                    )}
                  </div>
                </div>

                {/* Room Preference and Guests */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold tracking-wider uppercase text-charcoal/80 mb-1.5">
                      Preferred Room / Suite
                    </label>
                    <select
                      value={formData.roomId}
                      onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                      className="w-full px-4 py-3 text-sm bg-ivory/60 border border-sand-dark/40 rounded-lg focus:outline-none focus:border-forest text-charcoal"
                    >
                      <option value="">No preference / General</option>
                      {rooms.filter((r) => r.published).map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.name} (from ${room.price}/night)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold tracking-wider uppercase text-charcoal/80 mb-1.5">
                      Number of Guests
                    </label>
                    <select
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
                      className="w-full px-4 py-3 text-sm bg-ivory/60 border border-sand-dark/40 rounded-lg focus:outline-none focus:border-forest text-charcoal"
                    >
                      <option value={1}>1 Guest</option>
                      <option value={2}>2 Guests</option>
                      <option value={3}>3 Guests</option>
                      <option value={4}>4+ Guests (multiple suites)</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold tracking-wider uppercase text-charcoal/80 mb-1.5">
                    Additional Message or Special Inquiries
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about special requests, dietary needs, airport pick-up, or celebration details..."
                    className="w-full px-4 py-3 text-sm bg-ivory/60 border border-sand-dark/40 rounded-lg focus:outline-none focus:border-forest text-charcoal"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 text-xs font-semibold tracking-luxury uppercase bg-forest hover:bg-forest-deep text-ivory rounded-lg transition-all shadow-md active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Submitting Enquiry...</span>
                  ) : (
                    <>
                      <span>Submit Stay Enquiry</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-charcoal/50 text-center font-light">
                  All booking enquiries are transmitted securely to the property management system.
                </p>
              </form>
            )}

          </div>

          {/* Right Column: Contact Details & Hospitality Desk */}
          <div className="lg:col-span-5 space-y-8">
            
            <div className="bg-forest-deep text-ivory rounded-2xl p-8 sm:p-10 shadow-lg border border-forest-light/20">
              <span className="text-xs font-semibold tracking-luxury uppercase text-bronze block mb-2">
                HOSPITALITY CONCIERGE
              </span>
              <h3 className="font-serif text-3xl text-white mb-6">
                Direct Contact
              </h3>

              <div className="space-y-6 text-sm font-light text-ivory/80">
                <div className="flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-bronze shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Physical Address</strong>
                    <span>{settings.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Phone className="w-5 h-5 text-bronze shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Telephone & Concierge</strong>
                    <span>{settings.phone}</span>
                    <span className="block text-xs text-ivory/50 mt-0.5">Available 7:00 AM — 9:00 PM (NPT)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Mail className="w-5 h-5 text-bronze shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Electronic Mail</strong>
                    <span>{settings.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quiet retreat assurance */}
            <div className="bg-white rounded-2xl p-8 border border-sand-dark/30 shadow-xs space-y-3">
              <h4 className="font-serif text-xl text-forest-deep">
                The Havenora Promise
              </h4>
              <p className="text-xs text-charcoal/70 font-light leading-relaxed">
                We safeguard your privacy and tranquility. We never share customer information, and our property maintains quiet hours after sunset to ensure all guests experience peaceful restorative rest.
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
