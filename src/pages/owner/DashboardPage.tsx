import React from 'react';
import { Link } from 'react-router-dom';
import {
  Inbox,
  Clock,
  CheckCircle2,
  Calendar,
  CalendarCheck,
  BedDouble,
  Sliders,
  Image as ImageIcon,
  ArrowRight,
  TrendingUp,
  UserCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const { enquiries, rooms, gallery, settings, bookings, blockedSlots } = useData();
  const { user } = useAuth();

  const getTodayString = () => new Date().toISOString().split('T')[0];

  // Stats calculation
  const totalEnquiries = enquiries.length;
  const newEnquiries = enquiries.filter((e) => e.status === 'New').length;
  const pendingEnquiries = enquiries.filter((e) => e.status === 'Pending').length;
  const confirmedEnquiries = enquiries.filter((e) => e.status === 'Confirmed').length;
  const publishedRoomsCount = rooms.filter((r) => r.published).length;

  const todayBookings = bookings.filter((b) => b.bookingDate === getTodayString() && b.status !== 'Cancelled');
  const pendingBookings = bookings.filter((b) => b.status === 'Pending');

  const recentEnquiries = enquiries.slice(0, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Contacted':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Pending':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-sand-dark/20 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold tracking-luxury uppercase text-bronze block mb-1">
            RETREAT OPERATIONS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-forest-deep">
            Good morning, {user?.fullName || 'Property Owner'}
          </h2>
          <p className="text-xs sm:text-sm text-charcoal/60 mt-1">
            Here's what's happening with your property today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/owner/bookings"
            className="px-4 py-2.5 text-xs font-semibold tracking-wider uppercase bg-forest hover:bg-forest-deep text-ivory rounded-lg transition-colors shadow-sm flex items-center gap-2"
          >
            <CalendarCheck className="w-4 h-4 text-sand" />
            <span>Hourly Bookings ({pendingBookings.length} Pending)</span>
          </Link>
          <Link
            to="/owner/enquiries"
            className="px-4 py-2.5 text-xs font-semibold tracking-wider uppercase border border-sand-dark/40 hover:bg-sand/20 text-charcoal rounded-lg transition-colors shadow-xs flex items-center gap-2"
          >
            <Inbox className="w-4 h-4 text-bronze" />
            <span>Enquiries ({newEnquiries})</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Enquiries */}
        <div className="bg-white rounded-xl p-5 border border-sand-dark/20 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal/50">Total Enquiries</span>
            <div className="p-2 rounded-lg bg-ivory text-charcoal/70">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif font-semibold text-charcoal">{totalEnquiries}</span>
            <span className="text-xs text-emerald-600 font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +14% this month
            </span>
          </div>
          <p className="text-[11px] text-charcoal/50 mt-1">Lifetime booking enquiries</p>
        </div>

        {/* New Enquiries */}
        <div className="bg-white rounded-xl p-5 border border-sand-dark/20 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal/50">New Enquiries</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif font-semibold text-blue-700">{newEnquiries}</span>
            {newEnquiries > 0 && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-medium">
                Action required
              </span>
            )}
          </div>
          <p className="text-[11px] text-charcoal/50 mt-1">Awaiting initial reply</p>
        </div>

        {/* Pending Follow-up */}
        <div className="bg-white rounded-xl p-5 border border-sand-dark/20 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal/50">Pending Review</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif font-semibold text-purple-700">{pendingEnquiries}</span>
            <span className="text-xs text-charcoal/60">in conversation</span>
          </div>
          <p className="text-[11px] text-charcoal/50 mt-1">Awaiting guest decision</p>
        </div>

        {/* Confirmed Stays */}
        <div className="bg-white rounded-xl p-5 border border-sand-dark/20 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal/50">Confirmed Stays</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif font-semibold text-emerald-700">{confirmedEnquiries}</span>
            <span className="text-xs text-emerald-600 font-medium">Upcoming stays</span>
          </div>
          <p className="text-[11px] text-charcoal/50 mt-1">Guests confirmed for season</p>
        </div>

      </div>

      {/* Today's Hourly Bookings Bar */}
      <div className="bg-white rounded-xl p-6 border border-sand-dark/20 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-bronze" />
            <h3 className="font-serif text-xl text-forest-deep font-medium">
              Today's Hourly Schedule ({getTodayString()})
            </h3>
          </div>
          <Link
            to="/owner/bookings"
            className="text-xs font-semibold tracking-wider uppercase text-forest hover:text-bronze flex items-center gap-1"
          >
            <span>Open Schedule Manager</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {todayBookings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {todayBookings.map((b) => (
              <div key={b.id} className="p-3.5 rounded-lg bg-ivory/60 border border-sand-dark/20 flex items-start justify-between text-xs">
                <div>
                  <span className="font-mono text-xs font-bold text-forest block">{b.timeSlot}</span>
                  <p className="font-medium text-charcoal mt-1">{b.customerName}</p>
                  <p className="text-[11px] text-charcoal/50">{b.bookingType}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                  b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-charcoal/50 italic py-2">
            No customer reservations scheduled for today yet.
          </p>
        )}
      </div>

      {/* Main Grid: Activity Chart & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Activity Chart & Recent Enquiries */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Enquiry Volume Chart */}
          <div className="bg-white rounded-xl p-6 border border-sand-dark/20 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-serif text-xl text-forest-deep font-medium">
                  Enquiry Activity
                </h3>
                <p className="text-xs text-charcoal/50">
                  Weekly guest inquiry velocity across suites
                </p>
              </div>
              <span className="text-xs px-3 py-1 bg-ivory rounded text-charcoal/70 border border-sand-dark/30">
                Last 30 Days
              </span>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="h-44 w-full flex items-end justify-between gap-3 pt-6 px-2">
              {[
                { day: 'Mon', count: 4, height: '40%' },
                { day: 'Tue', count: 6, height: '60%' },
                { day: 'Wed', count: 5, height: '50%' },
                { day: 'Thu', count: 8, height: '80%' },
                { day: 'Fri', count: 9, height: '90%' },
                { day: 'Sat', count: 11, height: '100%' },
                { day: 'Sun', count: 7, height: '70%' },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-semibold text-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity">
                    {bar.count}
                  </span>
                  <div
                    style={{ height: bar.height }}
                    className="w-full max-w-[36px] bg-forest/20 group-hover:bg-forest rounded-t transition-all duration-300"
                  />
                  <span className="text-[11px] text-charcoal/50">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Enquiries Table */}
          <div className="bg-white rounded-xl p-6 border border-sand-dark/20 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-serif text-xl text-forest-deep font-medium">
                  Recent Enquiries
                </h3>
                <p className="text-xs text-charcoal/50">
                  Latest reservation requests from website visitors
                </p>
              </div>
              <Link
                to="/owner/enquiries"
                className="text-xs font-semibold tracking-wider uppercase text-forest hover:text-bronze flex items-center gap-1"
              >
                <span>View All ({enquiries.length})</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {recentEnquiries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-sand-dark/20 text-charcoal/50 uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Guest</th>
                      <th className="pb-3 font-semibold">Suite</th>
                      <th className="pb-3 font-semibold">Dates</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand/30">
                    {recentEnquiries.map((enq) => (
                      <tr key={enq.id} className="hover:bg-ivory/50 transition-colors">
                        <td className="py-3.5 pr-3">
                          <p className="font-medium text-charcoal">{enq.guestName}</p>
                          <p className="text-[11px] text-charcoal/50">{enq.email}</p>
                        </td>
                        <td className="py-3.5 pr-3 text-charcoal/80 font-medium">
                          {enq.roomName || 'General'}
                        </td>
                        <td className="py-3.5 pr-3 text-charcoal/60">
                          {enq.checkIn} → {enq.checkOut}
                        </td>
                        <td className="py-3.5 pr-3">
                          <span className={`inline-block px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full border ${getStatusBadge(enq.status)}`}>
                            {enq.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <Link
                            to="/owner/enquiries"
                            className="text-forest hover:text-bronze font-medium tracking-wider uppercase text-[11px]"
                          >
                            Review →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 text-charcoal/50 text-xs">
                No customer enquiries recorded yet.
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Quick Actions & Property Overview */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 border border-sand-dark/20 shadow-xs">
            <h3 className="font-serif text-lg text-forest-deep mb-4 font-medium">
              Quick Actions
            </h3>
            <div className="space-y-2.5">
              <Link
                to="/owner/enquiries"
                className="w-full flex items-center justify-between p-3 rounded-lg bg-ivory/70 hover:bg-sand/30 border border-sand-dark/30 text-xs font-medium text-charcoal transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Inbox className="w-4 h-4 text-bronze" />
                  <span>View All Enquiries</span>
                </div>
                <ArrowRight className="w-4 h-4 text-charcoal/40" />
              </Link>

              <Link
                to="/owner/rooms"
                className="w-full flex items-center justify-between p-3 rounded-lg bg-ivory/70 hover:bg-sand/30 border border-sand-dark/30 text-xs font-medium text-charcoal transition-colors"
              >
                <div className="flex items-center gap-3">
                  <BedDouble className="w-4 h-4 text-bronze" />
                  <span>Manage Suite Inventory</span>
                </div>
                <ArrowRight className="w-4 h-4 text-charcoal/40" />
              </Link>

              <Link
                to="/owner/gallery"
                className="w-full flex items-center justify-between p-3 rounded-lg bg-ivory/70 hover:bg-sand/30 border border-sand-dark/30 text-xs font-medium text-charcoal transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ImageIcon className="w-4 h-4 text-bronze" />
                  <span>Update Visual Gallery</span>
                </div>
                <ArrowRight className="w-4 h-4 text-charcoal/40" />
              </Link>

              <Link
                to="/owner/website-settings"
                className="w-full flex items-center justify-between p-3 rounded-lg bg-ivory/70 hover:bg-sand/30 border border-sand-dark/30 text-xs font-medium text-charcoal transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Sliders className="w-4 h-4 text-bronze" />
                  <span>Edit Website Settings</span>
                </div>
                <ArrowRight className="w-4 h-4 text-charcoal/40" />
              </Link>
            </div>
          </div>

          {/* Property Inventory Status */}
          <div className="bg-white rounded-xl p-6 border border-sand-dark/20 shadow-xs">
            <h3 className="font-serif text-lg text-forest-deep mb-4 font-medium">
              Suites Overview
            </h3>
            <div className="space-y-3">
              {rooms.map((room) => (
                <div key={room.id} className="flex items-center justify-between p-3 bg-ivory/40 rounded-lg text-xs">
                  <div className="flex items-center gap-3">
                    <img src={room.mainImage} alt={room.name} className="w-9 h-9 rounded object-cover" />
                    <div>
                      <p className="font-medium text-charcoal">{room.name}</p>
                      <p className="text-[10px] text-charcoal/50">${room.price} / night</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                    room.published ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {room.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Log Notice */}
          <div className="bg-forest-deep text-ivory rounded-xl p-5 text-xs space-y-2">
            <div className="flex items-center gap-2 text-sand font-medium">
              <Sparkles className="w-4 h-4 text-bronze" />
              <span>Real-Time Sync Ready</span>
            </div>
            <p className="text-[11px] text-ivory/70 font-light leading-relaxed">
              Any changes made in this dashboard update your public website immediately. Guests who submit enquiries will appear here instantly.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
