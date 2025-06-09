
import React from 'react';
import { Button } from '@/components/ui/button';

interface LandingHeaderProps {
  onLogin: () => void;
  onSignup: () => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({
  onLogin,
  onSignup
}) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg">
              <img src="/lovable-uploads/95407aee-75ac-4d31-a281-db4fc0472751.png" alt="TrackZilla Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">TrackZilla</h1>
          </div>
          <div className="flex items-center gap-6">
            <Button 
              onClick={onLogin} 
              variant="ghost" 
              className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
            >
              Sign In
            </Button>
            <Button 
              onClick={onSignup} 
              className="bg-white text-gray-900 hover:bg-white/90 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105"
            >
              Hunt now!
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
