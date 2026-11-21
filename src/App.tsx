import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ToastProvider } from './components/ui/Toast';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Public Layout & Pages
import { PublicLayout } from './components/layout/PublicLayout';
import { HomePage } from './pages/public/HomePage';
import { RoomsPage } from './pages/public/RoomsPage';
import { RoomDetailPage } from './pages/public/RoomDetailPage';
import { ExperiencesPage } from './pages/public/ExperiencesPage';
import { GalleryPage } from './pages/public/GalleryPage';
import { AboutPage } from './pages/public/AboutPage';
import { LocationPage } from './pages/public/LocationPage';
import { ContactPage } from './pages/public/ContactPage';
import { BookingPage } from './pages/public/BookingPage';
import { PrivacyPolicyPage } from './pages/public/PrivacyPolicyPage';

// Owner Layout & Pages
import { LoginPage } from './pages/owner/LoginPage';
import { OwnerLayout } from './components/layout/OwnerLayout';
import { DashboardPage } from './pages/owner/DashboardPage';
import { BookingsPage } from './pages/owner/BookingsPage';
import { EnquiriesPage } from './pages/owner/EnquiriesPage';
import { RoomsManagementPage } from './pages/owner/RoomsManagementPage';
import { GalleryManagementPage } from './pages/owner/GalleryManagementPage';
import { WebsiteSettingsPage } from './pages/owner/WebsiteSettingsPage';
import { AccountPage } from './pages/owner/AccountPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <ToastProvider>
            <Routes>
              
              {/* Public Website Routes */}
              <Route path="/" element={<PublicLayout />}>
                <Route index element={<HomePage />} />
                <Route path="rooms" element={<RoomsPage />} />
                <Route path="rooms/:slug" element={<RoomDetailPage />} />
                <Route path="experiences" element={<ExperiencesPage />} />
                <Route path="gallery" element={<GalleryPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="location" element={<LocationPage />} />
                <Route path="book" element={<BookingPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
              </Route>

              {/* Owner Authentication */}
              <Route path="/owner/login" element={<LoginPage />} />

              {/* Private Protected Owner Portal */}
              <Route
                path="/owner"
                element={
                  <ProtectedRoute>
                    <OwnerLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/owner/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="bookings" element={<BookingsPage />} />
                <Route path="enquiries" element={<EnquiriesPage />} />
                <Route path="rooms" element={<RoomsManagementPage />} />
                <Route path="gallery" element={<GalleryManagementPage />} />
                <Route path="website-settings" element={<WebsiteSettingsPage />} />
                <Route path="account" element={<AccountPage />} />
              </Route>

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </ToastProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};
