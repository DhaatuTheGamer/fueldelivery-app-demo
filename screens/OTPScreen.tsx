
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OtpInput from '../components/OtpInput';
import Button from '../components/Button';
import { OTP_RESEND_COUNTDOWN } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { MessageSquareText } from 'lucide-react';

const OTPScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, user } = useAuth();
  
  const mobileNumber = (location.state as { mobileNumber: string })?.mobileNumber;

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(OTP_RESEND_COUNTDOWN);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!mobileNumber) {
      navigate('/login'); // Redirect if mobile number is not present
    }
  }, [mobileNumber, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleOtpComplete = (completedOtp: string) => {
    setOtp(completedOtp);
    setError(''); // Clear error when user types
    handleSubmit(completedOtp); // Auto-submit on complete
  };

  const handleSubmit = async (currentOtp: string) => {
    if (currentOtp.length !== 4) { // Assuming OTP_LENGTH is 4
      setError('Please enter a valid 4-digit OTP.');
      return;
    }
    setError('');
    try {
      await login(mobileNumber, currentOtp);
      // login success, check if profile is complete
      if (user?.fullName) { // user is updated by login function
        navigate('/home');
      } else {
        navigate('/profile-setup');
      }
    } catch (err) {
      setError((err as Error).message || 'OTP verification failed. Please try again.');
    }
  };

  const handleResendOtp = () => {
    // Simulate resending OTP
    console.log('Resending OTP to:', mobileNumber);
    setCountdown(OTP_RESEND_COUNTDOWN);
    setCanResend(false);
    setError(''); 
    // Here you would typically call an API to resend OTP
  };

  if (!mobileNumber) return null; // Or a loading/error state

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl text-center">
        <MessageSquareText size={50} className="mx-auto text-primary mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Verify Mobile Number</h2>
        <p className="text-gray-600 mb-6">
          Enter the 4-digit OTP sent to <span className="font-semibold text-gray-700">{mobileNumber}</span>.
        </p>

        <div className="mb-6">
          <OtpInput onComplete={handleOtpComplete} disabled={isLoading} />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <Button onClick={() => handleSubmit(otp)} fullWidth isLoading={isLoading} disabled={otp.length !== 4 || isLoading} size="lg">
          Verify OTP
        </Button>

        <div className="mt-6 text-sm">
          {canResend ? (
            <button
              onClick={handleResendOtp}
              className="text-primary font-medium hover:underline focus:outline-none"
              disabled={isLoading}
            >
              Resend OTP
            </button>
          ) : (
            <p className="text-gray-500">
              Resend OTP in <span className="font-semibold">{String(countdown).padStart(2, '0')}s</span>
            </p>
          )}
        </div>
         <p className="mt-2 text-xs text-gray-400"> (For demo, use OTP: 1234)</p>
      </div>
    </div>
  );
};

export default OTPScreen;
