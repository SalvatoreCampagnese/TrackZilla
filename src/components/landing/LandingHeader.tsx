
import React from 'react';
import { Button } from '@/components/ui/button';

interface LandingHeaderProps {
  onLogin: () => void;
  onSignup: () => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({ onLogin, onSignup }) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden">
              <img 
                src="/lovable-uploads/95407aee-75ac-4d31-a281-db4fc0472751.png" 
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
              className="text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 rounded-full"
            >
              Sign In
            </Button>
            <Button 
              onClick={onSignup}
              className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-500 dark:hover:bg-red-600 rounded-full"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
