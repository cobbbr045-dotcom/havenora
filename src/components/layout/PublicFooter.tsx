import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Shield, Lock, MapPin, Phone, Mail } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const PublicFooter: React.FC = () => {
  const { settings } = useData();

  return (
    <footer className="bg-forest-deep text-ivory pt-20 pb-12 border-t border-forest-light/30">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-forest-light/20">
          
          {/* Col 1: Brand & Philosophy */}
          <div className="md:col-span-5 flex flex-col space-y-6">
            <Link to="/" className="inline-block">
              <span className="font-serif text-3xl font-light tracking-[0.25em] text-ivory uppercase">
                {settings.hotelName || 'HAVENORA'}
              </span>
              <p className="text-[10px] tracking-[0.3em] text-bronze uppercase mt-1 font-medium">
                Boutique Retreat · Pokhara, Nepal
              </p>
            </Link>
            <p className="text-sm font-light text-ivory/70 leading-relaxed max-w-sm">
              {settings.tagline || 'Where Every Stay Finds Its Calm.'}
              <br />
              A sanctuary of architectural stillness situated high above Phewa Lake, shaped around natural beauty, organic textures, and peaceful hospitality.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              {settings.socialLinks?.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-forest-light/50 flex items-center justify-center text-ivory/70 hover:text-bronze hover:border-bronze transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}
              {settings.socialLinks?.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-forest-light/50 flex items-center justify-center text-ivory/70 hover:text-bronze hover:border-bronze transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="md:col-span-3 flex flex-col space-y-4">
            <h4 className="text-xs font-semibold tracking-luxury uppercase text-bronze">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm font-light text-ivory/80">
              <li>
                <Link to="/" className="hover:text-sand transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/rooms" className="hover:text-sand transition-colors">Rooms & Suites</Link>
              </li>
              <li>
                <Link to="/experiences" className="hover:text-sand transition-colors">Guest Experiences</Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-sand transition-colors">Visual Gallery</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-sand transition-colors">Our Story & Heritage</Link>
              </li>
              <li>
                <Link to="/location" className="hover:text-sand transition-colors">Location & Arrival</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-sand transition-colors">Booking Enquiries</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Location */}
          <div className="md:col-span-4 flex flex-col space-y-4">
            <h4 className="text-xs font-semibold tracking-luxury uppercase text-bronze">
              Retreat Location
            </h4>
            <div className="space-y-3 text-sm font-light text-ivory/70">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-bronze shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-bronze shrink-0" />
                <span>{settings.phone}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-bronze shrink-0" />
                <span>{settings.email}</span>
              </p>
            </div>

            <div className="pt-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-luxury uppercase text-bronze hover:text-sand transition-colors"
              >
                <span>Request Stay Availability</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Demonstration Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-ivory/50">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <p>© {new Date().getFullYear()} HAVENORA Boutique Retreat. All rights reserved.</p>
            <span className="hidden sm:inline">·</span>
            <Link to="/privacy-policy" className="hover:text-ivory transition-colors">
              Privacy Policy
            </Link>
          </div>

          {/* Owner Portal Discreet Link */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-ivory/40">Demonstration Platform</span>
            <Link
              to="/owner/login"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-forest-light/40 text-[11px] tracking-wider uppercase text-ivory/70 hover:text-bronze hover:border-bronze transition-colors"
            >
              <Lock className="w-3 h-3 text-bronze" />
              <span>Owner Portal</span>
            </Link>
          </div>
        </div>

        {/* Small Note */}
        <div className="mt-4 pt-4 border-t border-forest-light/10 text-center text-[10px] text-ivory/40">
          Havenora is a conceptual hotel portfolio project created by Anuj Digital showcasing complete luxury digital hospitality and proprietary management software.
        </div>
      </div>
    </footer>
  );
};
