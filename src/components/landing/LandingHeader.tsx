
import React from 'react';
import { Button } from '@/components/ui/button';

interface LandingHeaderProps {
  onLogin: () => void;
  onSignup: () => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({ onLogin, onSignup }) => {
  return (
    <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden">
            <img 
              src="/lovable-uploads/9220c273-bc96-45f3-9a49-e598c00750a0.png" 
              alt="TrackZilla Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">TrackZilla</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={onLogin}
            variant="ghost"
            className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
          >
            Sign In
          </Button>
          <Button 
            onClick={onSignup}
            className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};
