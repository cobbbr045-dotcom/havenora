import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Compass, ShieldCheck, Heart, Feather } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const AboutPage: React.FC = () => {
  const { settings } = useData();

  return (
    <div className="pt-28 pb-24 bg-ivory min-h-screen">
      
      {/* Header Banner */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 mb-20 text-center">
        <span className="text-xs font-semibold tracking-[0.25em] uppercase text-bronze block mb-3">
          OUR ORIGIN & PHILOSOPHY
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-forest-deep mb-6 leading-tight">
          Hospitality with a little more heart.
        </h1>
        <p className="text-base sm:text-lg text-charcoal/75 font-light leading-relaxed max-w-3xl mx-auto">
          {settings.brandDescription}
        </p>
      </section>

      {/* Hero Narrative Image */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-24">
        <div className="aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl relative">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2400&q=85"
            alt="Havenora hillside retreat"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/80 via-transparent to-transparent flex items-end p-8 sm:p-12">
            <p className="font-serif italic text-xl sm:text-2xl text-white max-w-xl">
              "We didn't set out to build a hotel. We sought to build a sanctuary where the mind naturally stills."
            </p>
          </div>
        </div>
      </section>

      {/* Main Narrative Sections */}
      <section className="max-w-4xl mx-auto px-6 sm:px-8 space-y-16">
        
        <div className="space-y-6">
          <span className="text-xs font-semibold tracking-luxury uppercase text-bronze">
            THE ARCHITECTURE OF SILENCE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-forest-deep">
            Built from the landscape, not upon it.
          </h2>
          <p className="text-sm sm:text-base text-charcoal/80 font-light leading-relaxed">
            {settings.fullStory}
          </p>
          <p className="text-sm sm:text-base text-charcoal/80 font-light leading-relaxed">
            Every retaining wall was laid by generational master stonemasons from the Pokhara valley using grey river stone collected with environmental permits. The timber consists of salvaged mountain cedar and sustainably harvested teak, left unvarnished so the subtle aroma of natural wood breathes into each room.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-sand-dark/30">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-sand/40 flex items-center justify-center text-bronze">
              <Feather className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl text-forest-deep">Mindful Pace</h3>
            <p className="text-xs text-charcoal/70 font-light leading-relaxed">
              No rushed breakfasts or artificial timetables. Your rhythm here belongs solely to you.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-sand/40 flex items-center justify-center text-bronze">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl text-forest-deep">Intuitive Warmth</h3>
            <p className="text-xs text-charcoal/70 font-light leading-relaxed">
              Hospitality that is attentive yet discreet, rooted in genuine Himalayan warmth rather than scripted service.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-sand/40 flex items-center justify-center text-bronze">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl text-forest-deep">Deep Ecology</h3>
            <p className="text-xs text-charcoal/70 font-light leading-relaxed">
              Zero single-use plastics, solar water heating, mountain rainwater harvesting, and support for local artisan guilds.
            </p>
          </div>
        </div>

        {/* Dual Portrait & Quote */}
        <div className="bg-white rounded-xl p-8 sm:p-12 border border-sand-dark/30 shadow-sm flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 rounded-full overflow-hidden shrink-0 border-2 border-bronze">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
              alt="Retreat Host"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <blockquote className="font-serif italic text-lg sm:text-xl text-forest-deep mb-3">
              "We welcome every guest as someone returning home from a long expedition. Pokhara has always possessed a spiritual calm; we merely carved out a quiet seat for you to take it in."
            </blockquote>
            <span className="text-xs font-semibold tracking-wider uppercase text-bronze block">
              Tenzing & Elena Norbu — Founders & Curators
            </span>
          </div>
        </div>

      </section>

      {/* CTA */}
      <section className="text-center mt-24">
        <Link
          to="/contact"
          className="btn-luxury-primary"
        >
          Plan Your Stay With Us
        </Link>
      </section>

    </div>
  );
};
