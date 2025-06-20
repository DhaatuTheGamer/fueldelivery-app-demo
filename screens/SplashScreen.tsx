
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_NAME, SPLASH_TIMEOUT } from '../constants';
import { Zap } from 'lucide-react'; 
import { useAuth } from '../contexts/AuthContext';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return; // Wait for auth check to complete

    const timer = setTimeout(() => {
      if (isAuthenticated) {
        if (user?.fullName) {
          navigate('/home');
        } else {
          navigate('/profile-setup');
        }
      } else {
        navigate('/login');
      }
    }, SPLASH_TIMEOUT);

    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated, user, authLoading]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary to-orange-400 text-white p-6">
      <Zap size={100} className="mb-6 animate-pulse" />
      <h1 className="text-5xl font-bold mb-3">{APP_NAME}</h1>
      <p className="text-xl text-orange-100">Fuel delivered fast.</p>
      <div className="absolute bottom-10">
        <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default SplashScreen;
