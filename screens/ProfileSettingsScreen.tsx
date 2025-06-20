
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import { User, Mail, Bell, CreditCard, LogOut, ChevronRight, Shield, HelpCircle, Edit3 } from 'lucide-react';

interface ProfileLinkProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
  showChevron?: boolean;
}

const ProfileLink: React.FC<ProfileLinkProps> = ({ icon, label, value, onClick, showChevron = true }) => {
  const content = (
    <>
      <div className="flex items-center">
        <span className="mr-3 text-primary">{icon}</span>
        <div>
          <span className="text-md font-medium text-gray-700">{label}</span>
          {value && <p className="text-sm text-gray-500">{value}</p>}
        </div>
      </div>
      {showChevron && <ChevronRight size={20} className="text-gray-400" />}
    </>
  );

  if (onClick) {
    return (
      <button 
        onClick={onClick} 
        className="w-full flex justify-between items-center py-4 px-1 hover:bg-gray-50 rounded-md transition-colors"
      >
        {content}
      </button>
    );
  }
  return <div className="w-full flex justify-between items-center py-4 px-1">{content}</div>;
};


const ProfileSettingsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    // This case should ideally be handled by ProtectedRoute
    return <div className="p-4 text-center">Loading user profile...</div>;
  }

  return (
    <div className="pb-4">
      {/* User Info Header */}
      <div className="bg-white p-6 rounded-lg shadow-xl mb-6 text-center">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <img 
            src={`https://picsum.photos/seed/${user.id}/200`} // Placeholder avatar
            alt={user.fullName}
            className="w-24 h-24 rounded-full object-cover border-4 border-primary"
          />
           <button 
              onClick={() => navigate('/profile-setup')} // Reuse profile setup screen for editing
              className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-md hover:bg-orange-600 transition-colors"
              aria-label="Edit Profile"
            >
            <Edit3 size={16} />
          </button>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{user.fullName}</h2>
        <p className="text-md text-gray-600">{user.mobileNumber}</p>
        {user.email && <p className="text-sm text-gray-500">{user.email}</p>}
      </div>

      {/* Settings Links */}
      <div className="bg-white p-2 sm:p-4 rounded-lg shadow-xl">
        <ProfileLink 
          icon={<User size={22} />} 
          label="Edit Profile" 
          onClick={() => navigate('/profile-setup')} 
        />
        <div className="border-t border-gray-100 my-1"></div>
        <ProfileLink 
          icon={<CreditCard size={22} />} 
          label="Manage Payment Methods" 
          onClick={() => alert("Manage payments (Not implemented)")} 
        />
        <div className="border-t border-gray-100 my-1"></div>
        <ProfileLink 
          icon={<Bell size={22} />} 
          label="Notification Preferences" 
          onClick={() => alert("Notification settings (Not implemented)")} 
        />
         <div className="border-t border-gray-100 my-1"></div>
        <ProfileLink 
          icon={<HelpCircle size={22} />} 
          label="Help & Support" 
          onClick={() => navigate('/help-support')} 
        />
        <div className="border-t border-gray-100 my-1"></div>
        <ProfileLink 
          icon={<Shield size={22} />} 
          label="Privacy Policy" 
          onClick={() => window.open('/privacy', '_blank')} 
        />
      </div>

      {/* Logout Button */}
      <div className="mt-8 px-2 sm:px-0">
        <Button 
          variant="danger" 
          fullWidth 
          onClick={handleLogout} 
          isLoading={isLoading}
          leftIcon={<LogOut size={20} />}
          size="lg"
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default ProfileSettingsScreen;
