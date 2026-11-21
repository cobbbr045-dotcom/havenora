import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { OwnerSidebar } from './OwnerSidebar';
import { OwnerHeader } from './OwnerHeader';

export const OwnerLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-charcoal flex">
      
      {/* Desktop Fixed Sidebar */}
      <div className="hidden md:block w-64 shrink-0 h-screen sticky top-0">
        <OwnerSidebar />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-charcoal/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-64 max-w-[80vw] h-full z-10">
            <OwnerSidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <OwnerHeader onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
