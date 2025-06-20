
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start with loading true

  useEffect(() => {
    // Simulate checking local storage for persisted auth state
    const storedUser = localStorage.getItem('fuelSwiftUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (mobileNumber: string, otp: string): Promise<void> => {
    setIsLoading(true);
    // Simulate API call for OTP verification
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (otp === '1234') { // Mock OTP
          // Simulate fetching user profile or creating a new one
          let existingUser = localStorage.getItem(`user-${mobileNumber}`);
          let userData: UserProfile;

          if (existingUser) {
            userData = JSON.parse(existingUser);
          } else {
             // If new user, only mobileNumber is set initially
            userData = { id: Date.now().toString(), mobileNumber, fullName: '' }; 
            localStorage.setItem(`user-${mobileNumber}`, JSON.stringify(userData));
          }
          
          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem('fuelSwiftUser', JSON.stringify(userData)); // Persist basic auth
          setIsLoading(false);
          resolve();
        } else {
          setIsLoading(false);
          reject(new Error('Invalid OTP'));
        }
      }, 1000);
    });
  };
  
  const completeProfile = async (fullName: string, email?: string): Promise<void> => {
    setIsLoading(true);
    if (!user) {
      setIsLoading(false);
      throw new Error("User not found for profile completion.");
    }
    // Simulate API call to update profile
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedUser: UserProfile = { ...user, fullName, email: email || user.email };
        setUser(updatedUser);
        localStorage.setItem('fuelSwiftUser', JSON.stringify(updatedUser));
        localStorage.setItem(`user-${user.mobileNumber}`, JSON.stringify(updatedUser)); // Also update the specific user store
        setIsLoading(false);
        resolve();
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('fuelSwiftUser');
    // Potentially navigate to login screen here or let ProtectedRoute handle it
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, completeProfile, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
