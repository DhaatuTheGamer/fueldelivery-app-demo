
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { VehicleProvider } from './contexts/VehicleContext';
import { OrderProvider } from './contexts/OrderContext';

import SplashScreen from './screens/SplashScreen';
import LoginGatewayScreen from './screens/LoginGatewayScreen';
import OTPScreen from './screens/OTPScreen';
import ProfileSetupScreen from './screens/ProfileSetupScreen';
import HomeScreen from './screens/HomeScreen';
import AddEditVehicleScreen from './screens/AddEditVehicleScreen';
import OrderConfigScreen from './screens/OrderConfigScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import OrderPlacedScreen from './screens/OrderPlacedScreen';
import LiveTrackingScreen from './screens/LiveTrackingScreen';
import RateExperienceScreen from './screens/RateExperienceScreen';
import MyOrdersScreen from './screens/MyOrdersScreen';
import HelpSupportScreen from './screens/HelpSupportScreen';
import ProfileSettingsScreen from './screens/ProfileSettingsScreen';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <VehicleProvider>
        <OrderProvider>
          <HashRouter>
            <Routes>
              <Route path="/splash" element={<SplashScreen />} />
              <Route path="/login" element={<LoginGatewayScreen />} />
              <Route path="/otp" element={<OTPScreen />} />
              <Route path="/profile-setup" element={<ProfileSetupScreen />} />
              
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/home" element={<HomeScreen />} />
                  <Route path="/add-vehicle" element={<AddEditVehicleScreen />} />
                  <Route path="/edit-vehicle/:id" element={<AddEditVehicleScreen />} />
                  <Route path="/order-config" element={<OrderConfigScreen />} />
                  <Route path="/checkout" element={<CheckoutScreen />} />
                  <Route path="/order-placed" element={<OrderPlacedScreen />} />
                  <Route path="/tracking/:orderId" element={<LiveTrackingScreen />} />
                  <Route path="/rate-experience/:orderId" element={<RateExperienceScreen />} />
                  <Route path="/my-orders" element={<MyOrdersScreen />} />
                  <Route path="/help-support" element={<HelpSupportScreen />} />
                  <Route path="/profile" element={<ProfileSettingsScreen />} />
                </Route>
              </Route>
              
              <Route path="*" element={<Navigate to="/splash" />} />
            </Routes>
          </HashRouter>
        </OrderProvider>
      </VehicleProvider>
    </AuthProvider>
  );
};

export default App;
