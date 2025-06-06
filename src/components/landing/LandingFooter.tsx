
import React from 'react';
import { Github } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-black text-white py-8 border-t border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-400 mb-2">
              Made with love (and Lovable) by{' '}
              <a 
                href="https://github.com/GuidoPenta" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-red-500 hover:text-red-400 underline"
              >
                Guido Penta
              </a>
              {' '}and{' '}
              <a 
                href="https://github.com/SalvatoreCampagnese" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-red-500 hover:text-red-400 underline"
              >
                Salvatore Saraceno
              </a>
            </p>
            <p className="text-sm text-gray-400">
              © 2025 TrackZilla. Supercharge your job hunt like a boss! 🚀
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>This is an Open Source Project, come and contribute</span>
            <a 
              href="https://github.com/your-repo-url" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-red-500 hover:text-red-400"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
