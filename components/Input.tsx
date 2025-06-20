
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

const Input: React.FC<InputProps> = ({ label, name, error, leftIcon, rightIcon, containerClassName, className, id, ...props }) => {
  const inputId = id || name;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={`mb-4 ${containerClassName || ''}`}>
      {label && <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          name={name}
          className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''} ${error ? 'border-red-500' : ''} ${className || ''}`}
          aria-invalid={!!error}
          aria-describedby={errorId}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p id={errorId} className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
