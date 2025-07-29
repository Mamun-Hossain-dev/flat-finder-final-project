import React from 'react';
import { Home } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center">
        <div className="relative">
          <Home className="text-6xl text-blue-500" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
        <p className="mt-4 text-xl text-gray-700">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;