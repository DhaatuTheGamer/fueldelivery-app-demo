
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LocationState } from '../types';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname } as LocationState} replace />;
  }
  
  // If authenticated but profile is not complete, redirect to profile setup
  // Allow access to profile setup page itself if user is authenticated but profile is incomplete.
  if (isAuthenticated && (!user?.fullName) && location.pathname !== '/profile-setup') {
     return <Navigate to="/profile-setup" state={{ from: location.pathname } as LocationState} replace />;
  }


  return <Outlet />;
};

export default ProtectedRoute;
