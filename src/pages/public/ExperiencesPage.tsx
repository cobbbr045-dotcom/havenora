import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Sun, Coffee, Compass, Heart, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const ExperiencesPage: React.FC = () => {
  const experiences = [
    {
      id: 'slow-mornings',
      tag: 'DAILY RITUAL',
      title: 'Slow Mornings & Herbal Tea',
      quote: 'Awaken with the mountain, without the urgency of the world.',
      description: 'At Havenora, mornings are sacred. We encourage guests to rise naturally as golden sunlight strikes the summit of Machapuchare. Our retreat host brings freshly steeped single-estate teas from Ilam, accompanied by warm mountain buckwheat honey pastries.',
      highlights: [
        'Dawn guided mindfulness on the panoramic yoga deck',
        'Single-origin orthodox teas selected by regional masters',
        'In-room silent breakfast service upon request'
      ],
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=85'
    },
    {
      id: 'thoughtful-dining',
      tag: 'CULINARY PHILOSOPHY',
      title: 'The Hearth & Seasonal Gastronomy',
      quote: 'Rooted in Himalayan soil, crafted with subtle restraint.',
      description: 'Our open dining pavilion operates on the principle of conscious consumption. We work directly with small organic growers in the Pokhara valley and mountain foragers to craft daily changing menus based on what nature provides.',
      highlights: [
        'Open hearth wood-fire cooking with indigenous herbs',
        'Heirloom Himalayan grains (millet, buckwheat, red rice)',
        'Private candlelit stone terrace dining by the pines'
      ],
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85'
    },
    {
      id: 'peaceful-spaces',
      tag: 'SANCTUARY',
      title: 'Quiet Spaces & Reflection Courtyards',
      quote: 'Spaces intentionally conceived to restore peace of mind.',
      description: 'Find solace in our curated library salon featuring Himalayan architectural studies, art collections, and cozy reading alcoves. Outside, tranquil reflection pools mirror passing clouds, and the sound of wind chimes marks the afternoon breeze.',
      highlights: [
        'Acoustic sound immersion with handmade Tibetan singing bowls',
        'Cedar-lined reading room with wood-burning fireplace',
        'Stone walking labyrinth designed for quiet contemplative walks'
      ],
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85'
    },
    {
      id: 'discover-pokhara',
      tag: 'EXPEDITION',
      title: 'Discover Pokhara Valley & Annapurna',
      quote: 'Explore the majesty of the valley at a contemplative pace.',
      description: 'Havenora provides private, gentle excursions for guests wishing to experience the natural beauty of Pokhara away from tourist crowds. Drift quietly across Phewa Lake in a handcrafted wooden boat, or embark on a dawn forest ridge walk with our resident naturalist.',
      highlights: [
        'Private sunrise excursion along the Sarangkot ridgeline',
        'Peaceful wooden boat crossing to secluded lake coves',
        'Visits to traditional stone villages and ancient monasteries'
      ],
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85'
    }
  ];

  return (
    <div className="pt-28 pb-24 bg-ivory min-h-screen">
      
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-20 text-center">
        <span className="text-xs font-semibold tracking-[0.25em] uppercase text-bronze block mb-3">
          RETREAT LIFE
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-forest-deep mb-6">
          Moments Worth Staying For
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-charcoal/75 font-light leading-relaxed">
          At Havenora, every experience is carefully designed to foster stillness, connection, and harmony with the mountain sanctuary of Pokhara.
        </p>
      </section>

      {/* Editorial Section Cards */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-24">
        {experiences.map((exp, idx) => (
          <div
            key={exp.id}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center"
          >
            {/* Image */}
            <div className={`lg:col-span-7 ${idx % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
              <div className="aspect-[16/11] rounded-xl overflow-hidden shadow-xl bg-sand/30 img-zoom-hover">
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div className={`lg:col-span-5 ${idx % 2 === 1 ? 'lg:order-1' : 'lg:order-2'} flex flex-col justify-center`}>
              <span className="text-xs font-semibold tracking-[0.25em] uppercase text-bronze mb-2 block">
                {exp.tag}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-forest-deep mb-3">
                {exp.title}
              </h2>
              <blockquote className="font-serif italic text-base text-charcoal/70 border-l-2 border-bronze pl-4 py-1 mb-5">
                "{exp.quote}"
              </blockquote>
              <p className="text-sm text-charcoal/80 font-light leading-relaxed mb-6">
                {exp.description}
              </p>

              {/* Highlights */}
              <div className="space-y-2.5 mb-8">
                {exp.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-charcoal/80">
                    <CheckCircle2 className="w-4 h-4 text-bronze shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              <div>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-xs font-semibold tracking-luxury uppercase text-forest hover:text-bronze transition-colors"
                >
                  <span>Inquire about custom experiences</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Bottom CTA */}
      <section className="max-w-4xl mx-auto px-6 mt-28 text-center bg-white rounded-xl p-10 sm:p-14 border border-sand-dark/30 shadow-md">
        <h3 className="font-serif text-3xl text-forest-deep mb-4">
          Personalized Itineraries & Retreats
        </h3>
        <p className="text-sm text-charcoal/70 font-light max-w-xl mx-auto mb-8 leading-relaxed">
          Whether you are traveling for solitary creative focus, a milestone celebration, or mindful restoration, our hosts will tailor every detail.
        </p>
        <Link
          to="/contact"
          className="btn-luxury-primary"
        >
          Plan Your Experience
        </Link>
      </section>

    </div>
  );
};
