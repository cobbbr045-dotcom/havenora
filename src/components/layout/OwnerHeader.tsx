import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, Bell, ExternalLink, RefreshCw } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../ui/Toast';

interface OwnerHeaderProps {
  onOpenMobileMenu: () => void;
}

export const OwnerHeader: React.FC<OwnerHeaderProps> = ({ onOpenMobileMenu }) => {
  const location = useLocation();
  const { enquiries, resetToDefaultData } = useData();
  const { showToast } = useToast();

  const newCount = enquiries.filter((e) => e.status === 'New').length;

  // Title based on path
  const getPageInfo = () => {
    switch (location.pathname) {
      case '/owner/dashboard':
        return { title: 'Dashboard Overview', subtitle: 'Property performance and recent activity' };
      case '/owner/bookings':
        return { title: 'Hourly Bookings', subtitle: 'Manage hourly slot reservations, approvals, and blocked times' };
      case '/owner/enquiries':
        return { title: 'Guest Enquiries', subtitle: 'Manage reservations, contact states and guest notes' };
      case '/owner/rooms':
        return { title: 'Room Management', subtitle: 'Configure suites, pricing, descriptions and gallery' };
      case '/owner/gallery':
        return { title: 'Visual Gallery', subtitle: 'Curate hotel photography and categorized visual assets' };
      case '/owner/website-settings':
        return { title: 'Website Settings', subtitle: 'Update brand identity, hero texts, and contact details' };
      case '/owner/account':
        return { title: 'Owner Account', subtitle: 'Account preferences and security credentials' };
      default:
        return { title: 'Owner Portal', subtitle: 'Property Management' };
    }
  };

  const { title, subtitle } = getPageInfo();

  const handleResetData = () => {
    if (window.confirm('Reset all rooms, enquiries, and settings back to original demonstration data?')) {
      resetToDefaultData();
      showToast('Demonstration data restored successfully.', 'info');
    }
  };

  return (
    <header className="bg-white border-b border-sand-dark/20 h-18 px-6 sm:px-8 flex items-center justify-between shadow-xs sticky top-0 z-30">
      
      {/* Left: Mobile trigger & breadcrumb title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 text-charcoal/70 hover:text-charcoal hover:bg-ivory rounded-lg"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg font-serif font-semibold text-charcoal leading-none">
            {title}
          </h1>
          <p className="text-xs text-charcoal/50 mt-1 hidden sm:block">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        
        {/* Reset Demo Data Button */}
        <button
          onClick={handleResetData}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-charcoal/70 hover:text-charcoal hover:bg-ivory border border-sand-dark/30 rounded transition-colors"
          title="Restore default mock data"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Demo</span>
        </button>

        {/* View Website Link */}
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase text-forest hover:text-forest-deep bg-ivory hover:bg-sand/30 border border-sand-dark/30 rounded transition-colors"
        >
          <span className="hidden sm:inline">Live Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Notifications Icon with Badge */}
        <Link
          to="/owner/enquiries"
          className="relative p-2 text-charcoal/70 hover:text-charcoal hover:bg-ivory rounded-full transition-colors"
          title={`${newCount} new enquiries`}
        >
          <Bell className="w-5 h-5" />
          {newCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-bronze text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
              {newCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};
