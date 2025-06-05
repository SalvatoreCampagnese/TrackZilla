
import React from 'react';
import { Briefcase } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-gray-900 dark:bg-blue-950 text-white py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <div className="p-1 bg-blue-600 rounded-lg">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">Flow Guru</span>
          </div>
          <p className="text-sm text-gray-400">
            © 2024 Flow Guru. Ottimizza la tua ricerca di lavoro.
          </p>
        </div>
      </div>
    </footer>
  );
};
