
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { User } from 'lucide-react';

const ProfileSetupScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, completeProfile, isLoading, isAuthenticated } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login'); // Should not happen if ProtectedRoute is working
    }
    if (user?.fullName) { // If profile is already complete
        setFullName(user.fullName);
    }
    if (user?.email) {
        setEmail(user.email);
    }
  }, [user, isAuthenticated, navigate]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setFormError('Full Name is required.');
      return;
    }
    setFormError('');
    try {
      await completeProfile(fullName, email);
      navigate('/home');
    } catch (err) {
      setFormError((err as Error).message || 'Failed to save profile. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
        <div className="text-center mb-8">
          <User size={50} className="mx-auto text-primary mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800">Just one last step!</h2>
          <p className="text-gray-600 mt-1">Let's get to know you better.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Full Name"
            name="fullName"
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (formError) setFormError('');
            }}
            maxLength={100}
            error={formError && formError.includes('Name') ? formError : undefined}
            required
          />
          <Input
            label="Email Address (Optional)"
            name="email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          {formError && !formError.includes('Name') && <p className="text-red-500 text-sm -mt-3 mb-3">{formError}</p>}

          <Button type="submit" fullWidth isLoading={isLoading} size="lg">
            {user?.fullName ? 'Update Profile' : "Let's Go!"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetupScreen;
