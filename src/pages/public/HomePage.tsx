import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ChevronDown,
  Sparkles,
  Compass,
  Coffee,
  Sun,
  Wind,
  CheckCircle,
  Users,
  Bed,
  Maximize2
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const HomePage: React.FC = () => {
  const { rooms, gallery, settings } = useData();

  const publishedRooms = rooms.filter((r) => r.published);
  const previewGallery = gallery.filter((g) => g.published).slice(0, 6);

  return (
    <div className="w-full">
      
      {/* 3.2 Cinematic Full-Screen Hero */}
      <section className="relative h-screen min-h-[680px] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image with Dark Vignette Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero.jpg"
            alt="Havenora Boutique Retreat nestled in the Pokhara mountain landscape"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-black/40 to-black/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-ivory flex flex-col items-center mt-12">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sand/30 bg-forest-deep/40 backdrop-blur-md mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-bronze" />
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-sand">
              {settings.homepage.heroSubheading || 'POKHARA, NEPAL'}
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-[0.08em] leading-tight text-white mb-6">
            {settings.homepage.heroHeading || 'Where Every Stay Finds Its Calm.'}
          </h1>

          <p className="max-w-2xl text-base sm:text-lg md:text-xl font-light text-ivory/85 leading-relaxed mb-10">
            {settings.homepage.heroDescription ||
              'Discover a thoughtfully designed retreat where beautiful spaces, warm hospitality and the natural beauty of Pokhara come together.'}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              to={settings.homepage.primaryCtaLink || '/rooms'}
              className="w-full sm:w-auto px-8 py-4 text-xs font-semibold tracking-luxury uppercase bg-bronze hover:bg-bronze-light text-white rounded-xs transition-all shadow-lg active:scale-95 text-center"
            >
              {settings.homepage.primaryCtaText || 'EXPLORE OUR ROOMS'}
            </Link>
            <Link
              to={settings.homepage.secondaryCtaLink || '/about'}
              className="w-full sm:w-auto px-8 py-4 text-xs font-semibold tracking-luxury uppercase border border-ivory/40 hover:bg-ivory hover:text-forest text-ivory rounded-xs transition-all backdrop-blur-xs active:scale-95 text-center"
            >
              {settings.homepage.secondaryCtaText || 'DISCOVER HAVENORA'}
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-ivory/60 hover:text-ivory transition-colors cursor-pointer">
          <span className="text-[9px] tracking-[0.25em] uppercase font-medium mb-1">Scroll to explore</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </section>


      {/* 3.3 Introduction — The Havenora Experience */}
      <section className="py-24 sm:py-32 bg-ivory px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Text */}
            <div className="lg:col-span-6 flex flex-col">
              <span className="text-xs font-semibold tracking-[0.25em] uppercase text-bronze mb-4">
                {settings.homepage.introSubheading || 'THE HAVENORA EXPERIENCE'}
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-forest-deep leading-tight mb-8">
                {settings.homepage.introHeading || 'Escape the ordinary. Embrace the extraordinary.'}
              </h2>
              <p className="text-base sm:text-lg text-charcoal/80 font-light leading-relaxed mb-6">
                {settings.homepage.introDescription ||
                  'A place to slow down, reconnect and experience hospitality shaped around comfort, thoughtful design and meaningful moments.'}
              </p>
              <p className="text-sm text-charcoal/70 font-light leading-relaxed mb-8">
                Resting above the quiet waters of Phewa Lake with unobstructed views of the Annapurna sanctuary, Havenora was built with reverence for Himalayan craftsmanship. Every angle welcomes natural sunlight, gentle breezes, and silence.
              </p>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-xs font-semibold tracking-luxury uppercase text-forest hover:text-bronze transition-colors group"
                >
                  <span>Learn about our story & craft</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>

            {/* Right Asymmetrical Photography */}
            <div className="lg:col-span-6 relative">
              <div className="relative z-10 rounded-lg overflow-hidden shadow-2xl img-zoom-hover aspect-[4/5] max-w-md ml-auto">
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=85"
                  alt="Havenora architecture courtyard"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Secondary floating image */}
              <div className="hidden sm:block absolute -bottom-10 -left-6 z-20 w-56 rounded-lg overflow-hidden shadow-2xl border-4 border-ivory img-zoom-hover aspect-square">
                <img
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=85"
                  alt="Morning tea ritual"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* 3.4 Room Preview — Your Stay, Reimagined */}
      <section className="py-24 bg-white px-6 sm:px-8 lg:px-12 border-y border-sand-dark/20">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs font-semibold tracking-[0.25em] uppercase text-bronze block mb-3">
                YOUR STAY, REIMAGINED
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-forest-deep">
                Spaces made for slowing down.
              </h2>
            </div>
            <Link
              to="/rooms"
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-luxury uppercase text-forest hover:text-bronze transition-colors self-start md:self-end"
            >
              <span>View All Suites</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Room Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {publishedRooms.slice(0, 3).map((room) => (
              <div
                key={room.id}
                className="group flex flex-col bg-ivory rounded-lg overflow-hidden border border-sand-dark/20 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-[16/11] overflow-hidden bg-sand/30">
                  <img
                    src={room.mainImage}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-forest-deep/85 backdrop-blur-xs text-ivory text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded">
                    From ${room.price} / night
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-2xl text-forest-deep mb-2 group-hover:text-bronze transition-colors">
                      {room.name}
                    </h3>
                    <p className="text-xs text-charcoal/70 font-light leading-relaxed mb-6 line-clamp-2">
                      {room.description}
                    </p>

                    {/* Quick Specs */}
                    <div className="flex items-center gap-4 text-xs text-charcoal/60 border-t border-b border-sand-dark/20 py-3 mb-6">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-bronze" />
                        <span>Up to {room.capacity} guests</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Bed className="w-3.5 h-3.5 text-bronze" />
                        <span>{room.bedConfiguration}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <Link
                      to={`/rooms/${room.slug}`}
                      className="flex-1 text-center py-2.5 text-xs font-semibold tracking-wider uppercase bg-forest text-ivory hover:bg-forest-deep rounded transition-colors"
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/contact?room=${room.id}`}
                      className="flex-1 text-center py-2.5 text-xs font-semibold tracking-wider uppercase border border-forest/30 text-forest hover:bg-forest/5 rounded transition-colors"
                    >
                      Enquire
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Demonstration Notice */}
          <p className="text-center text-xs text-charcoal/50 mt-10 italic">
            * Sample pricing & amenities shown for conceptual demonstration.
          </p>
        </div>
      </section>


      {/* 3.5 Experiences — Moments worth staying for */}
      <section className="py-24 sm:py-32 bg-ivory px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-bronze block mb-3">
              CURATED EXPERIENCES
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-forest-deep mb-4">
              Moments worth staying for.
            </h2>
            <p className="text-sm sm:text-base text-charcoal/70 font-light">
              We cultivate rituals rather than schedules. Immerse yourself in stillness, culinary mindfulness, and nature.
            </p>
          </div>

          <div className="space-y-24">
            
            {/* Experience 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              <div className="lg:col-span-7 order-2 lg:order-1">
                <div className="aspect-[16/10] rounded-lg overflow-hidden shadow-xl img-zoom-hover">
                  <img
                    src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=85"
                    alt="Slow mornings tea ritual"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col justify-center">
                <span className="text-[11px] font-semibold tracking-widest uppercase text-bronze mb-2">01 · RITUAL</span>
                <h3 className="font-serif text-3xl sm:text-4xl text-forest-deep mb-4">Slow Mornings</h3>
                <p className="text-sm sm:text-base text-charcoal/75 font-light leading-relaxed mb-6">
                  Begin each day without haste. Sip small-batch orthodox tea grown in the eastern foothills of Ilam, poured quietly on your private terrace as the dawn mist clears from Machapuchare.
                </p>
                <ul className="space-y-2 text-xs text-charcoal/80 mb-6">
                  <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-bronze" /> Sunrise meditation & gentle yoga terrace</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-bronze" /> Single-origin artisan coffee tasting</li>
                </ul>
              </div>
            </div>

            {/* Experience 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              <div className="lg:col-span-5 flex flex-col justify-center">
                <span className="text-[11px] font-semibold tracking-widest uppercase text-bronze mb-2">02 · GASTRONOMY</span>
                <h3 className="font-serif text-3xl sm:text-4xl text-forest-deep mb-4">Thoughtful Dining</h3>
                <p className="text-sm sm:text-base text-charcoal/75 font-light leading-relaxed mb-6">
                  Our kitchen honors the organic rhythms of Pokhara valley farmers. Wild mountain herbs, stone-ground heirloom grains, and honest flavours prepared with simplicity and deep care.
                </p>
                <ul className="space-y-2 text-xs text-charcoal/80 mb-6">
                  <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-bronze" /> Farm-to-table seasonal harvest menus</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-bronze" /> Fireside private courtyard dinners</li>
                </ul>
              </div>
              <div className="lg:col-span-7">
                <div className="aspect-[16/10] rounded-lg overflow-hidden shadow-xl img-zoom-hover">
                  <img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85"
                    alt="Thoughtful dining experience"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Experience 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              <div className="lg:col-span-7 order-2 lg:order-1">
                <div className="aspect-[16/10] rounded-lg overflow-hidden shadow-xl img-zoom-hover">
                  <img
                    src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85"
                    alt="Peaceful library space"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col justify-center">
                <span className="text-[11px] font-semibold tracking-widest uppercase text-bronze mb-2">03 · STILLNESS</span>
                <h3 className="font-serif text-3xl sm:text-4xl text-forest-deep mb-4">Peaceful Spaces</h3>
                <p className="text-sm sm:text-base text-charcoal/75 font-light leading-relaxed mb-6">
                  Wander into our cedar-lined reading salon, curl up beside a hearth with Himalayan folklore, or rest by the stone reflection pool that echoes the stillness of the peaks.
                </p>
                <ul className="space-y-2 text-xs text-charcoal/80 mb-6">
                  <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-bronze" /> Sound therapy with authentic singing bowls</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-bronze" /> Curated architectural & nature library</li>
                </ul>
              </div>
            </div>

          </div>

          <div className="text-center mt-16">
            <Link
              to="/experiences"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-semibold tracking-luxury uppercase bg-forest text-ivory hover:bg-forest-deep rounded transition-colors"
            >
              <span>Explore All Guest Experiences</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>


      {/* 3.6 About Preview — Hospitality with a little more heart */}
      <section className="py-24 bg-forest-deep text-ivory px-6 sm:px-8 lg:px-12 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-bronze block mb-4">
            OUR PHILOSOPHY
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white mb-8 leading-tight">
            "Hospitality with a little more heart."
          </h2>
          <p className="text-base sm:text-lg text-ivory/80 font-light leading-relaxed max-w-3xl mx-auto mb-10">
            Havenora was created not as a bustling hotel, but as a refuge from the velocity of modern life. We believe luxury is not ornate excess; it is space, clean mountain air, privacy, and genuine warmth.
          </p>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-semibold tracking-luxury uppercase bg-bronze text-white hover:bg-bronze-light transition-all rounded shadow-md"
          >
            <span>Read Our Full Story</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>


      {/* 3.7 Gallery Preview — Asymmetrical Gallery */}
      <section className="py-24 bg-white px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-6">
            <div>
              <span className="text-xs font-semibold tracking-[0.25em] uppercase text-bronze block mb-2">
                VISUAL JOURNAL
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-forest-deep">
                Atmospheres of Havenora
              </h2>
            </div>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-luxury uppercase text-forest hover:text-bronze transition-colors"
            >
              <span>View Full Gallery ({gallery.length})</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Asymmetrical Masonry Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {previewGallery.map((item, idx) => (
              <div
                key={item.id}
                className={`group relative overflow-hidden rounded-lg bg-sand/30 shadow-sm ${
                  idx === 0
                    ? 'col-span-2 row-span-2 aspect-[4/3]'
                    : idx === 1
                    ? 'aspect-[3/4]'
                    : 'aspect-square'
                }`}
              >
                <img
                  src={item.imageUrl}
                  alt={item.caption}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-xs text-white font-light">{item.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 3.8 Location — Between the mountains and the moment */}
      <section className="py-24 bg-ivory px-6 sm:px-8 lg:px-12 border-t border-sand-dark/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 flex flex-col">
              <span className="text-xs font-semibold tracking-[0.25em] uppercase text-bronze mb-3">
                THE SETTING
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-forest-deep mb-6">
                Between the mountains and the moment.
              </h2>
              <p className="text-sm sm:text-base text-charcoal/80 font-light leading-relaxed mb-6">
                Havenora sits elevated along the Sarangkot ridge overlooking Pokhara, Nepal. Far enough from the bustling lakeside to enjoy pristine birdsong and night skies, yet merely a gentle 20-minute descent to Phewa Lake.
              </p>
              
              <div className="space-y-3 mb-8 text-xs text-charcoal/70">
                <p className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-bronze shrink-0" />
                  <span>25 minutes from Pokhara International Airport (PIA)</span>
                </p>
                <p className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-bronze shrink-0" />
                  <span>Direct panoramic vistas of Annapurna South, Machapuchare & Dhaulagiri</span>
                </p>
              </div>

              <Link
                to="/location"
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-luxury uppercase text-forest hover:text-bronze transition-colors"
              >
                <span>Read Location & Arrival Guide</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="lg:col-span-7">
              <div className="aspect-[16/10] rounded-xl overflow-hidden shadow-xl border border-sand-dark/30 bg-sand/30 relative">
                <iframe
                  title="Havenora Pokhara Location Map"
                  src={settings.mapEmbedUrl}
                  className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* 3.9 Final CTA — Your next escape starts here */}
      <section className="py-24 bg-forest-deep text-ivory text-center px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-bronze block mb-4">
            BEGIN YOUR JOURNEY
          </span>
          <h2 className="font-serif text-4xl sm:text-6xl text-white mb-6">
            Your next escape starts here.
          </h2>
          <p className="text-sm sm:text-base text-ivory/80 font-light max-w-xl mx-auto mb-10 leading-relaxed">
            Reserve your quiet moments with us in Pokhara. Whether for deep creative work, renewal, or quiet companionship.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-10 py-4 text-xs font-semibold tracking-luxury uppercase bg-bronze hover:bg-bronze-light text-white rounded shadow-xl transition-all active:scale-95"
          >
            <span>MAKE AN ENQUIRY</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
};
