
import React from 'react';
import { Button } from '@/components/ui/button';
import { Briefcase } from 'lucide-react';

interface LandingHeaderProps {
  onLogin: () => void;
  onSignup: () => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({ onLogin, onSignup }) => {
  return (
    <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 dark:bg-blue-500 rounded-xl">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Flow Guru</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={onLogin}
            variant="ghost"
            className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
          >
            Accedi
          </Button>
          <Button 
            onClick={onSignup}
            className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Registrati
          </Button>
        </div>
      </div>
    </header>
  );
};
