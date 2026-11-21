import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { GalleryCategory } from '../../types';

export const GalleryPage: React.FC = () => {
  const { gallery } = useData();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ['All', 'Architecture', 'Rooms', 'Interiors', 'Dining', 'Nature', 'Details'];

  const publishedItems = gallery.filter((item) => item.published);

  const filteredItems = activeCategory === 'All'
    ? publishedItems
    : publishedItems.filter((item) => item.category === activeCategory);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = 'unset';
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  return (
    <div className="pt-28 pb-24 bg-ivory min-h-screen">
      
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-16 text-center">
        <span className="text-xs font-semibold tracking-[0.25em] uppercase text-bronze block mb-3">
          VISUAL CHRONICLE
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-forest-deep mb-6">
          Atmospheres of Havenora
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-charcoal/70 font-light leading-relaxed mb-8">
          A glimpse into the architectural stillness, warm timber spaces, and mountain vistas that define our Pokhara retreat.
        </p>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-full transition-all ${
                activeCategory === cat
                  ? 'bg-forest text-ivory shadow-sm'
                  : 'bg-white text-charcoal/70 hover:bg-sand/30 border border-sand-dark/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Asymmetrical Gallery Grid */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => openLightbox(idx)}
              className="group relative cursor-pointer overflow-hidden rounded-xl bg-sand/30 shadow-sm border border-sand-dark/20 aspect-[4/3] sm:aspect-auto sm:min-h-[300px]"
            >
              <img
                src={item.imageUrl}
                alt={item.caption}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                <div className="self-end p-2 bg-white/20 backdrop-blur-md rounded-full text-white">
                  <Maximize2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-bronze-light block mb-1">
                    {item.category}
                  </span>
                  <p className="text-sm font-light text-white leading-snug">
                    {item.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20 text-charcoal/50">
            No photographs available in this category.
          </div>
        )}
      </section>

      {/* Fullscreen Lightbox Modal */}
      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 sm:p-8"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-2 text-white/80 hover:text-white bg-white/10 rounded-full z-50"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Prev */}
          <button
            onClick={prevImage}
            className="absolute left-4 sm:left-8 p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-50"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Active Image and Caption */}
          <div
            className="relative max-w-5xl max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filteredItems[lightboxIndex].imageUrl}
              alt={filteredItems[lightboxIndex].caption}
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
            />
            <div className="mt-4 text-center text-ivory">
              <span className="text-[10px] font-semibold tracking-luxury uppercase text-bronze block mb-1">
                {filteredItems[lightboxIndex].category} · {lightboxIndex + 1} of {filteredItems.length}
              </span>
              <p className="text-sm font-light text-ivory/90 max-w-xl mx-auto">
                {filteredItems[lightboxIndex].caption}
              </p>
            </div>
          </div>

          {/* Navigation Next */}
          <button
            onClick={nextImage}
            className="absolute right-4 sm:right-8 p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-50"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

    </div>
  );
};
