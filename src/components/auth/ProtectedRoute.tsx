import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-forest-deep flex flex-col items-center justify-center text-ivory">
        <div className="w-8 h-8 border-2 border-sand border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-xs font-semibold tracking-luxury uppercase text-sand">
          Verifying Owner Authorization...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/owner/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
