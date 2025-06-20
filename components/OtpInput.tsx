import React, { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { OTP_LENGTH } from '../constants';

interface OtpInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  disabled?: boolean;
}

const OtpInput: React.FC<OtpInputProps> = ({ length = OTP_LENGTH, onComplete, disabled = false }) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only the last digit
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every(digit => digit !== '')) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center space-x-2 sm:space-x-3">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el: HTMLInputElement | null) => { inputRefs.current[index] = el; }}
          type="tel" // Use tel for numeric keypad on mobile
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          disabled={disabled}
          className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-semibold border border-gray-300 rounded-md focus:ring-primary focus:border-primary transition-all duration-150 ease-in-out"
        />
      ))}
    </div>
  );
};

export default OtpInput;