import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const PublicHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { settings } = useData();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page transition
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Stay', path: '/rooms' },
    { label: 'Book Slot', path: '/book' },
    { label: 'Experiences', path: '/experiences' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Our Story', path: '/about' },
    { label: 'Location', path: '/location' },
  ];

  // Header background style
  const headerBgClass = isHome
    ? isScrolled
      ? 'bg-forest-deep/95 backdrop-blur-md py-4 text-ivory border-b border-forest-light/20 shadow-lg'
      : 'bg-gradient-to-b from-black/70 via-black/30 to-transparent py-6 text-ivory'
    : 'bg-forest-deep py-4 text-ivory border-b border-forest-light/30 shadow-md';

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${headerBgClass}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
        
        {/* Brand Wordmark */}
        <Link 
          to="/" 
          className="group flex flex-col items-start focus:outline-none"
        >
          <span className="font-serif text-2xl sm:text-3xl font-light tracking-[0.28em] text-ivory group-hover:text-sand transition-colors uppercase">
            {settings.hotelName || 'HAVENORA'}
          </span>
          <span className="text-[9px] font-sans tracking-[0.35em] text-bronze uppercase -mt-1 font-semibold">
            Pokhara · Nepal
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs font-medium tracking-[0.2em] uppercase transition-colors relative py-1 ${
                  isActive
                    ? 'text-bronze font-semibold'
                    : 'text-ivory/80 hover:text-ivory'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-bronze transition-all" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action: Enquire Now Button */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/contact"
            className="group relative inline-flex items-center gap-2 px-6 py-2.5 text-[11px] font-semibold tracking-luxury uppercase bg-bronze text-white hover:bg-bronze-light transition-all duration-300 rounded-sm shadow-sm"
          >
            <span>Enquire Now</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-ivory focus:outline-none"
          aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] bg-forest-deep z-50 flex flex-col justify-between px-8 py-10 overflow-y-auto border-t border-forest-light/30">
          <div className="flex flex-col space-y-6">
            <span className="text-[10px] tracking-[0.3em] uppercase text-bronze font-semibold">
              Explore Retreat
            </span>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-2xl font-serif tracking-wider ${
                  location.pathname === link.path ? 'text-bronze' : 'text-ivory hover:text-sand'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-8 border-t border-forest-light/30 flex flex-col space-y-4">
            <Link
              to="/contact"
              className="w-full text-center py-3.5 text-xs font-semibold tracking-luxury uppercase bg-bronze text-white rounded-sm"
            >
              Make an Enquiry
            </Link>
            <div className="text-center text-xs text-ivory/60">
              <p>{settings.phone}</p>
              <p>{settings.email}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
