
import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text = "Loading..." }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto"></div>
        <p className="mt-4 text-gray-300">{text}</p>
      </div>
    </div>
  );
};
