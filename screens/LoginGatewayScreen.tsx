
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { APP_NAME, TERMS_AND_CONDITIONS_URL, PRIVACY_POLICY_URL } from '../constants';
import { Phone, Zap } from 'lucide-react';

const LoginGatewayScreen: React.FC = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber.trim() || !/^\+?[0-9]{10,15}$/.test(mobileNumber)) {
      setError('Please enter a valid mobile number (e.g., +91XXXXXXXXXX or XXXXXXXXXX).');
      return;
    }
    setError('');
    // Simulate sending OTP request
    console.log('Requesting OTP for:', mobileNumber);
    navigate('/otp', { state: { mobileNumber } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
        <div className="text-center mb-8">
          <Zap size={64} className="mx-auto text-primary mb-4" />
          <h1 className="text-3xl font-bold text-gray-800">{APP_NAME}</h1>
          <p className="text-lg text-gray-600 mt-2">Fuel delivered to your doorstep in 10 minutes.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Enter Mobile Number"
            name="mobileNumber"
            type="tel"
            placeholder="+91 XXXXXXXXXX"
            value={mobileNumber}
            onChange={(e) => {
              setMobileNumber(e.target.value);
              if (error) setError('');
            }}
            leftIcon={<Phone size={18} className="text-gray-400" />}
            error={error}
            autoFocus
          />
          <Button type="submit" fullWidth isLoading={false} size="lg">
            Send OTP
          </Button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>By continuing, you agree to our</p>
          <a href={TERMS_AND_CONDITIONS_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
            Terms & Conditions
          </a>
          <span> and </span>
          <a href={PRIVACY_POLICY_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
            Privacy Policy
          </a>.
        </div>
      </div>
       <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#FFD2A6,transparent)] opacity-30"></div>
      </div>
    </div>
  );
};

export default LoginGatewayScreen;
