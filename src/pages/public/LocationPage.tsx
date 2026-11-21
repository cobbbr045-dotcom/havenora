import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Plane, Car, Mountain, Compass, Sun, ShieldCheck } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const LocationPage: React.FC = () => {
  const { settings } = useData();

  return (
    <div className="pt-28 pb-24 bg-ivory min-h-screen">
      
      {/* Page Header */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 mb-16 text-center">
        <span className="text-xs font-semibold tracking-[0.25em] uppercase text-bronze block mb-3">
          SANCTUARY SETTING
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-forest-deep mb-6">
          Between the Mountains and the Moment
        </h1>
        <p className="text-base sm:text-lg text-charcoal/75 font-light leading-relaxed max-w-3xl mx-auto">
          Perched along the scenic Sarangkot ridgeline, Havenora commands panoramic perspectives over Pokhara valley, Phewa Lake, and the snow-capped summits of the Annapurna massif.
        </p>
      </section>

      {/* Map Integration */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-20">
        <div className="aspect-[21/10] sm:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl border border-sand-dark/30 bg-sand/20">
          <iframe
            title="Havenora Pokhara Location Map"
            src={settings.mapEmbedUrl}
            className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* Arrival Details & Logistics */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          
          <div className="bg-white p-8 rounded-xl border border-sand-dark/20 shadow-xs">
            <div className="w-10 h-10 rounded-full bg-sand/40 flex items-center justify-center text-bronze mb-5">
              <Plane className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-2xl text-forest-deep mb-3">By Air</h3>
            <p className="text-sm text-charcoal/70 font-light leading-relaxed mb-4">
              Regular 25-minute domestic flights connect Kathmandu (Tribhuvan International Airport) to Pokhara International Airport (PIA).
            </p>
            <span className="text-xs font-semibold text-bronze block">
              Havenora chauffeur pickup: 25 mins from PIA
            </span>
          </div>

          <div className="bg-white p-8 rounded-xl border border-sand-dark/20 shadow-xs">
            <div className="w-10 h-10 rounded-full bg-sand/40 flex items-center justify-center text-bronze mb-5">
              <Car className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-2xl text-forest-deep mb-3">Private Chauffeur</h3>
            <p className="text-sm text-charcoal/70 font-light leading-relaxed mb-4">
              We arrange direct luxury SUV transfers from anywhere in Nepal, including Kathmandu and Chitwan National Park.
            </p>
            <span className="text-xs font-semibold text-bronze block">
              Hybrid 4WD SUV with experienced mountain driver
            </span>
          </div>

          <div className="bg-white p-8 rounded-xl border border-sand-dark/20 shadow-xs">
            <div className="w-10 h-10 rounded-full bg-sand/40 flex items-center justify-center text-bronze mb-5">
              <Mountain className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-2xl text-forest-deep mb-3">Scenic Elevation</h3>
            <p className="text-sm text-charcoal/70 font-light leading-relaxed mb-4">
              Located at approximately 1,450 meters (4,750 ft), providing crisp, clean alpine breezes, cooler temperatures, and zero lakeside noise.
            </p>
            <span className="text-xs font-semibold text-bronze block">
              Spectacular Annapurna panoramic viewpoint
            </span>
          </div>

        </div>

        {/* Pokhara Seasons & Atmosphere */}
        <div className="bg-forest-deep text-ivory rounded-2xl p-8 sm:p-14">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold tracking-luxury uppercase text-bronze block mb-2">
              MOUNTAIN CLIMATE
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-white mb-6">
              When to visit Pokhara
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-ivory/80 font-light leading-relaxed">
              <div>
                <strong className="text-sand block mb-1">Autumn (October — December)</strong>
                Crystal-clear mountain skies, pristine visibility of the Annapurna range, and warm pleasant daytime sun.
              </div>
              <div>
                <strong className="text-sand block mb-1">Spring (March — May)</strong>
                Rhododendrons bloom across the hillsides, mild mountain temperatures, and vibrant local songbirds.
              </div>
              <div>
                <strong className="text-sand block mb-1">Winter (January — February)</strong>
                Deep quietude, crisp morning fireside coffee, snow-capped peaks against sapphire skies, and cozy hearths.
              </div>
              <div>
                <strong className="text-sand block mb-1">Monsoon (July — August)</strong>
                Lush emerald terraced hills, theatrical cloud formations, and quiet contemplative rain retreats.
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* CTA */}
      <section className="text-center mt-20">
        <Link
          to="/contact"
          className="btn-luxury-primary"
        >
          Request Chauffeur & Stay Details
        </Link>
      </section>

    </div>
  );
};
