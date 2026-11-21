import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Bed, Maximize2, Check, ArrowUpRight, Sparkles } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const RoomsPage: React.FC = () => {
  const { rooms } = useData();
  const [filter, setFilter] = useState<'all' | 'terrace' | 'suite'>('all');

  const publishedRooms = rooms.filter((r) => r.published);

  const filteredRooms = publishedRooms.filter((room) => {
    if (filter === 'all') return true;
    if (filter === 'terrace') return room.name.toLowerCase().includes('retreat') || room.view.toLowerCase().includes('garden');
    if (filter === 'suite') return room.name.toLowerCase().includes('suite');
    return true;
  });

  return (
    <div className="pt-28 pb-24 bg-ivory min-h-screen">
      
      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-16 text-center">
        <span className="text-xs font-semibold tracking-[0.25em] uppercase text-bronze block mb-3">
          SANCTUARY ACCOMMODATION
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-forest-deep mb-6">
          Rooms & Suites
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-charcoal/70 font-light leading-relaxed">
          Each room at Havenora is designed as an architectural sanctuary. Organic textures, hand-hewn river stone, and generous views of Pokhara’s natural landscape create a tranquil space to recharge.
        </p>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2 text-xs font-semibold tracking-wider uppercase rounded-full transition-all ${
              filter === 'all'
                ? 'bg-forest text-ivory shadow-sm'
                : 'bg-white text-charcoal/70 hover:bg-sand/30 border border-sand-dark/30'
            }`}
          >
            All Spaces ({publishedRooms.length})
          </button>
          <button
            onClick={() => setFilter('suite')}
            className={`px-5 py-2 text-xs font-semibold tracking-wider uppercase rounded-full transition-all ${
              filter === 'suite'
                ? 'bg-forest text-ivory shadow-sm'
                : 'bg-white text-charcoal/70 hover:bg-sand/30 border border-sand-dark/30'
            }`}
          >
            Suites Only
          </button>
          <button
            onClick={() => setFilter('terrace')}
            className={`px-5 py-2 text-xs font-semibold tracking-wider uppercase rounded-full transition-all ${
              filter === 'terrace'
                ? 'bg-forest text-ivory shadow-sm'
                : 'bg-white text-charcoal/70 hover:bg-sand/30 border border-sand-dark/30'
            }`}
          >
            Garden & Terrace
          </button>
        </div>
      </section>

      {/* Rooms List */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-16">
        {filteredRooms.map((room, idx) => (
          <div
            key={room.id}
            className="bg-white rounded-xl overflow-hidden border border-sand-dark/30 shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-0"
          >
            {/* Image Col */}
            <div className={`lg:col-span-7 relative min-h-[340px] lg:min-h-[460px] overflow-hidden ${
              idx % 2 === 1 ? 'lg:order-2' : 'lg:order-1'
            }`}>
              <img
                src={room.mainImage}
                alt={room.name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute top-5 left-5 bg-forest-deep/80 backdrop-blur-xs text-sand text-[10px] font-semibold tracking-widest uppercase px-3.5 py-1.5 rounded">
                {room.tagline}
              </div>
              <div className="absolute bottom-5 right-5 bg-white/95 backdrop-blur-xs text-forest-deep px-4 py-2 rounded shadow-md text-right">
                <span className="text-[10px] text-charcoal/60 uppercase tracking-wider block">Sample rate from</span>
                <span className="font-serif text-2xl font-semibold">${room.price}</span>
                <span className="text-xs text-charcoal/60"> / night</span>
              </div>
            </div>

            {/* Info Col */}
            <div className={`lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between ${
              idx % 2 === 1 ? 'lg:order-1' : 'lg:order-2'
            }`}>
              <div>
                <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-bronze mb-2 block">
                  {room.view}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-forest-deep mb-3">
                  {room.name}
                </h2>
                <p className="text-sm text-charcoal/75 font-light leading-relaxed mb-6">
                  {room.description}
                </p>

                {/* Key Specs */}
                <div className="grid grid-cols-2 gap-3 py-4 border-y border-sand-dark/20 text-xs text-charcoal/80 mb-6">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-bronze" />
                    <span>Max {room.capacity} Guests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bed className="w-4 h-4 text-bronze" />
                    <span>{room.bedConfiguration}</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <Maximize2 className="w-4 h-4 text-bronze" />
                    <span>{room.roomSize}</span>
                  </div>
                </div>

                {/* Selected Amenities List */}
                <div className="space-y-2 mb-8">
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-charcoal/50 block">
                    Highlighted Amenities:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-charcoal/70">
                    {room.amenities.slice(0, 4).map((amenity, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-bronze shrink-0" />
                        <span className="truncate">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-4 border-t border-sand-dark/20">
                <Link
                  to={`/rooms/${room.slug}`}
                  className="flex-1 text-center py-3 text-xs font-semibold tracking-luxury uppercase bg-forest hover:bg-forest-deep text-ivory rounded transition-colors"
                >
                  View Details
                </Link>
                <Link
                  to={`/contact?room=${room.id}`}
                  className="flex-1 text-center py-3 text-xs font-semibold tracking-luxury uppercase bg-bronze hover:bg-bronze-light text-white rounded transition-colors"
                >
                  Enquire Stay
                </Link>
              </div>

            </div>
          </div>
        ))}
      </section>

      {/* Note on demonstration pricing */}
      <div className="max-w-4xl mx-auto px-6 mt-16 text-center text-xs text-charcoal/50">
        All room descriptions, amenities, and sample pricing are for demonstration purposes. Havenora does not process live monetary payments or automated credit card billing.
      </div>
    </div>
  );
};
