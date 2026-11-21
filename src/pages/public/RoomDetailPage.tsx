import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Bed,
  Maximize2,
  Check,
  ArrowLeft,
  Calendar,
  Sparkles,
  Shield,
  Coffee,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../components/ui/Toast';

export const RoomDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { rooms, addEnquiry } = useData();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const room = rooms.find((r) => r.slug === slug);

  // Active gallery image
  const [activeImage, setActiveImage] = useState<string>(room?.mainImage || '');

  // Quick enquiry form state
  const [formData, setFormData] = useState({
    guestName: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!room) {
    return (
      <div className="pt-32 pb-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="font-serif text-3xl text-forest-deep mb-4">Room Not Found</h2>
        <p className="text-sm text-charcoal/60 mb-6">The suite you are looking for does not exist or has been archived.</p>
        <Link to="/rooms" className="btn-luxury-primary">
          Back to All Rooms
        </Link>
      </div>
    );
  }

  const allImages = [room.mainImage, ...(room.galleryImages || [])];

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.guestName || !formData.email || !formData.phone || !formData.checkIn || !formData.checkOut) {
      showToast('Please fill in all required enquiry fields.', 'error');
      return;
    }

    if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      showToast('Check-out date must be after check-in date.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await addEnquiry({
        guestName: formData.guestName,
        email: formData.email,
        phone: formData.phone,
        roomId: room.id,
        roomName: room.name,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: formData.guests,
        message: formData.message || `Enquiry for ${room.name}`,
      });

      showToast(`Thank you, ${formData.guestName}. Your enquiry for ${room.name} has been sent!`, 'success');
      setFormData({
        guestName: '',
        email: '',
        phone: '',
        checkIn: '',
        checkOut: '',
        guests: 2,
        message: ''
      });
    } catch {
      showToast('Failed to submit enquiry. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-24 bg-ivory min-h-screen">
      
      {/* Back Link */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4">
        <Link
          to="/rooms"
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-luxury uppercase text-forest/70 hover:text-forest transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Rooms & Suites</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Main Title & Hero Gallery */}
        <div className="mb-10">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-bronze block mb-2">
            {room.view}
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-forest-deep mb-3">
            {room.name}
          </h1>
          <p className="text-sm sm:text-base text-charcoal/70 font-light max-w-2xl">
            {room.tagline}
          </p>
        </div>

        {/* Hero Gallery Component */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">
          {/* Main Large Display */}
          <div className="lg:col-span-9 aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden shadow-lg bg-sand/30">
            <img
              src={activeImage || room.mainImage}
              alt={room.name}
              className="w-full h-full object-cover transition-all duration-500"
            />
          </div>

          {/* Thumbnails */}
          <div className="lg:col-span-3 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible">
            {allImages.slice(0, 4).map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImage(img)}
                className={`relative flex-1 min-w-[100px] lg:min-w-0 rounded-lg overflow-hidden aspect-[4/3] border-2 transition-all ${
                  (activeImage || room.mainImage) === img ? 'border-bronze scale-98 shadow-md' : 'border-transparent opacity-75 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`${room.name} view ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Content & Sticky Enquiry Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Room Details */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Overview & Story */}
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl text-forest-deep mb-4">
                The Living Experience
              </h2>
              <p className="text-sm sm:text-base text-charcoal/80 font-light leading-relaxed mb-6">
                {room.longDescription || room.description}
              </p>
              
              {/* Features Badges */}
              <div className="flex flex-wrap gap-2 pt-2">
                {room.features.map((feat, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-1.5 rounded-full bg-sand/40 text-charcoal text-xs font-medium"
                  >
                    {feat}
                  </span>
                ))}
              </div>
            </div>

            {/* Room Specifications Table */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-sand-dark/20 shadow-xs">
              <h3 className="font-serif text-xl text-forest-deep mb-6">
                Space Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div>
                  <span className="text-xs text-charcoal/50 uppercase tracking-wider block mb-1">Room Dimension</span>
                  <p className="font-medium text-charcoal">{room.roomSize}</p>
                </div>
                <div>
                  <span className="text-xs text-charcoal/50 uppercase tracking-wider block mb-1">Max Occupancy</span>
                  <p className="font-medium text-charcoal">{room.capacity} Guests</p>
                </div>
                <div>
                  <span className="text-xs text-charcoal/50 uppercase tracking-wider block mb-1">Bed Configuration</span>
                  <p className="font-medium text-charcoal">{room.bedConfiguration}</p>
                </div>
                <div>
                  <span className="text-xs text-charcoal/50 uppercase tracking-wider block mb-1">Orientation & View</span>
                  <p className="font-medium text-charcoal">{room.view}</p>
                </div>
              </div>
            </div>

            {/* Amenities Grid */}
            <div>
              <h3 className="font-serif text-2xl text-forest-deep mb-6">
                Curated Amenities & Inclusions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {room.amenities.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white p-3.5 rounded-lg border border-sand-dark/20">
                    <Check className="w-4 h-4 text-bronze shrink-0 mt-0.5" />
                    <span className="text-xs text-charcoal/80 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stay Policies */}
            <div className="border-t border-sand-dark/30 pt-8 text-xs text-charcoal/70 space-y-3">
              <h4 className="font-serif text-lg text-forest-deep">Stay Policies</h4>
              <p>· <strong>Check-in:</strong> 2:00 PM onwards · <strong>Check-out:</strong> 11:00 AM</p>
              <p>· Non-smoking throughout all indoor pavilions.</p>
              <p>· Complimentary optical WiFi throughout the property.</p>
            </div>

          </div>

          {/* Right Column: Sticky Booking Enquiry Card */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="bg-white rounded-xl p-8 border border-sand-dark/30 shadow-xl">
              
              <div className="flex items-baseline justify-between pb-6 border-b border-sand-dark/20 mb-6">
                <div>
                  <span className="text-xs text-charcoal/50 uppercase tracking-wider block">Sample Rate</span>
                  <span className="font-serif text-3xl font-semibold text-forest-deep">${room.price}</span>
                  <span className="text-xs text-charcoal/60"> / night</span>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 text-[10px] font-semibold tracking-widest uppercase bg-sand/30 text-bronze rounded">
                    Boutique Stay
                  </span>
                </div>
              </div>

              <h3 className="font-serif text-xl text-forest-deep mb-2">
                Request Stay Availability
              </h3>
              <p className="text-xs text-charcoal/60 mb-6 font-light">
                Send an enquiry directly to our retreat hosts. We will respond promptly with availability and tailor your stay.
              </p>

              <form onSubmit={handleEnquirySubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold tracking-wider uppercase text-charcoal/70 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.guestName}
                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    placeholder="e.g. Maya Chen"
                    className="w-full px-3.5 py-2.5 text-xs bg-ivory/50 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold tracking-wider uppercase text-charcoal/70 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@domain.com"
                      className="w-full px-3.5 py-2.5 text-xs bg-ivory/50 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold tracking-wider uppercase text-charcoal/70 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3.5 py-2.5 text-xs bg-ivory/50 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold tracking-wider uppercase text-charcoal/70 mb-1">
                      Check-In *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.checkIn}
                      onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-ivory/50 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold tracking-wider uppercase text-charcoal/70 mb-1">
                      Check-Out *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.checkOut}
                      onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-ivory/50 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold tracking-wider uppercase text-charcoal/70 mb-1">
                    Guests
                  </label>
                  <select
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 text-xs bg-ivory/50 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests (upon request)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold tracking-wider uppercase text-charcoal/70 mb-1">
                    Special Notes
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Dietary preferences, arrival details, or questions..."
                    className="w-full px-3.5 py-2.5 text-xs bg-ivory/50 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 text-xs font-semibold tracking-luxury uppercase bg-forest hover:bg-forest-deep text-ivory rounded transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting Enquiry...' : 'Submit Booking Enquiry'}
                </button>
              </form>

              <p className="text-[10px] text-charcoal/40 text-center mt-4">
                No immediate payment required. Demonstration enquiry saved to the owner dashboard.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
