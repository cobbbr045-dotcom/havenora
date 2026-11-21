import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  Inbox,
  BedDouble,
  Image as ImageIcon,
  Sliders,
  User,
  LogOut,
  ExternalLink,
  ShieldCheck,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface OwnerSidebarProps {
  onCloseMobile?: () => void;
}

export const OwnerSidebar: React.FC<OwnerSidebarProps> = ({ onCloseMobile }) => {
  const { user, logout } = useAuth();
  const { enquiries, bookings, settings } = useData();
  const navigate = useNavigate();

  const newEnquiriesCount = enquiries.filter((e) => e.status === 'New').length;
  const pendingBookingsCount = bookings.filter((b) => b.status === 'Pending').length;

  const handleLogout = () => {
    logout();
    navigate('/owner/login');
  };

  const navItems = [
    { label: 'Overview', path: '/owner/dashboard', icon: LayoutDashboard },
    {
      label: 'Hourly Bookings',
      path: '/owner/bookings',
      icon: CalendarCheck,
      badge: pendingBookingsCount > 0 ? pendingBookingsCount : undefined
    },
    {
      label: 'Enquiries',
      path: '/owner/enquiries',
      icon: Inbox,
      badge: newEnquiriesCount > 0 ? newEnquiriesCount : undefined
    },
    { label: 'Rooms', path: '/owner/rooms', icon: BedDouble },
    { label: 'Gallery', path: '/owner/gallery', icon: ImageIcon },
    { label: 'Website Settings', path: '/owner/website-settings', icon: Sliders },
    { label: 'Account', path: '/owner/account', icon: User },
  ];

  return (
    <aside className="w-64 bg-forest-deep text-ivory flex flex-col h-full border-r border-forest-light/20 select-none">
      
      {/* Brand Header */}
      <div className="p-6 border-b border-forest-light/20 flex items-center justify-between">
        <div>
          <Link to="/owner/dashboard" className="block">
            <span className="font-serif text-2xl font-light tracking-[0.25em] text-ivory uppercase">
              {settings.hotelName || 'HAVENORA'}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] tracking-widest uppercase font-semibold text-bronze">
                Owner Portal
              </span>
            </div>
          </Link>
        </div>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 text-ivory/70 hover:text-white"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Quick link to public website */}
      <div className="px-5 py-3 border-b border-forest-light/10">
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 text-xs text-sand/80 hover:text-ivory bg-forest/40 hover:bg-forest/80 rounded transition-colors group"
        >
          <span className="font-medium">View Live Website</span>
          <ExternalLink className="w-3.5 h-3.5 text-bronze transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium tracking-wider uppercase transition-all ${
                  isActive
                    ? 'bg-forest text-ivory font-semibold shadow-inner border-l-4 border-bronze'
                    : 'text-ivory/70 hover:bg-forest/40 hover:text-ivory'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-sand" />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-bronze text-white shadow-sm">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Storage and Auth Mode Note */}
      <div className="p-4 mx-4 mb-3 rounded-lg bg-forest/30 border border-forest-light/20 text-[11px] text-ivory/60 space-y-1">
        <div className="flex items-center gap-1.5 text-bronze font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Sync Active</span>
        </div>
        <p className="text-[10px] text-ivory/50 leading-tight">
          Live reactive data layer. Changes persist locally and reflect immediately on the public site.
        </p>
      </div>

      {/* User profile & Logout */}
      <div className="p-4 border-t border-forest-light/20 flex items-center justify-between bg-forest-dark/40">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-bronze flex items-center justify-center font-serif text-sm font-semibold text-white shrink-0">
            {user?.fullName?.charAt(0) || 'O'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-medium text-ivory truncate">{user?.fullName || 'Property Owner'}</p>
            <p className="text-[10px] text-ivory/50 truncate">{user?.email || 'owner@havenora.com'}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 text-ivory/60 hover:text-red-300 hover:bg-forest/60 rounded transition-colors"
          title="Sign Out"
          aria-label="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
