
import React from 'react';
import { Github } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="relative py-12 border-t border-white/10 bg-black/20 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <p className="text-sm text-white/60 mb-2">
              Made with love (and Lovable) by{' '}
              <a 
                href="https://github.com/GuidoPenta" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-red-400 hover:text-red-300 underline transition-colors duration-300"
              >
                Guido Penta
              </a>
              {' '}and{' '}
              <a 
                href="https://github.com/SalvatoreCampagnese" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-red-400 hover:text-red-300 underline transition-colors duration-300"
              >
                Salvatore Campagnese
              </a>
            </p>
            <p className="text-sm text-white/60">
              © 2025 TrackZilla. Supercharge your job hunt like a boss! 🚀
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-white/60">
            <span>This is an Open Source Project, come and contribute</span>
            <a 
              href="https://github.com/SalvatoreCampagnese/TrackZilla" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-red-400 hover:text-red-300 transition-colors duration-300 hover:scale-110 transform"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
