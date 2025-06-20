
import React from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, ListOrdered, User, HelpCircle, ChevronLeft } from 'lucide-react';
import { APP_NAME } from '../constants';

const navItems = [
  { path: '/home', label: 'Home', icon: Home },
  { path: '/my-orders', label: 'Orders', icon: ListOrdered },
  { path: '/profile', label: 'Profile', icon: User },
];

const MainLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const noNavPaths = ['/order-config', '/checkout', '/order-placed', '/tracking', '/rate-experience', '/add-vehicle', '/edit-vehicle'];
  const showNav = !noNavPaths.some(path => location.pathname.startsWith(path));

  // Determine if a header should be shown
  const pathsWithCustomHeader = ['/my-orders', '/help-support', '/profile', '/add-vehicle', '/edit-vehicle', '/order-config', '/checkout'];
  const showHeader = pathsWithCustomHeader.some(path => location.pathname.startsWith(path));
  
  const getHeaderTitle = () => {
    if (location.pathname.startsWith('/my-orders')) return 'My Orders';
    if (location.pathname.startsWith('/help-support')) return 'Help & Support';
    if (location.pathname.startsWith('/profile')) return 'Profile & Settings';
    if (location.pathname.startsWith('/add-vehicle')) return 'Add Vehicle';
    if (location.pathname.startsWith('/edit-vehicle')) return 'Edit Vehicle';
    if (location.pathname.startsWith('/order-config')) return 'Configure Order';
    if (location.pathname.startsWith('/checkout')) return 'Checkout';
    return APP_NAME;
  };

  const pathsRequiringBackButton = ['/add-vehicle', '/order-config', '/help-support'];
  const editVehicleRegex = /^\/edit-vehicle\/.+/;
  const shouldShowBackButton = 
    pathsRequiringBackButton.includes(location.pathname) || 
    editVehicleRegex.test(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {showHeader && (
         <header className="bg-primary text-white p-4 shadow-md sticky top-0 z-50 flex items-center">
          <div className="w-1/5"> {/* Left item container */}
            {shouldShowBackButton && (
              <button 
                onClick={() => navigate(-1)} 
                className="p-1.5 rounded-full hover:bg-white/20 transition-colors -ml-1.5"
                aria-label="Go back"
              >
                <ChevronLeft size={28} />
              </button>
            )}
          </div>
          <h1 className="text-xl font-semibold text-center flex-grow whitespace-nowrap overflow-hidden text-ellipsis">
            {getHeaderTitle()}
          </h1>
          <div className="w-1/5"></div> {/* Right spacer to balance title */}
        </header>
      )}
      <main className="flex-grow container mx-auto px-4 py-2 sm:py-6 max-w-2xl">
        <Outlet />
      </main>
      {showNav && (
        <nav className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-t-lg z-50">
          <div className="max-w-2xl mx-auto flex justify-around items-center h-16">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center space-y-1 p-2 rounded-md transition-colors duration-200 ${
                    isActive ? 'text-primary' : 'text-gray-500 hover:text-primary'
                  }`
                }
              >
                <item.icon size={24} />
                <span className="text-xs font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
};

export default MainLayout;
