
import React from 'react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="text-center max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Trasforma la tua ricerca di lavoro in un
          <span className="text-blue-600 dark:text-blue-400"> processo organizzato</span>
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Tieni traccia delle tue candidature, monitora i progressi e ottieni insights per migliorare il tuo tasso di successo nella ricerca di lavoro.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            Inizia gratis
          </Button>
          <Button 
            variant="outline"
            size="lg"
            className="border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 px-8 py-3 text-lg"
          >
            Scopri come funziona
          </Button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="mt-12 sm:mt-16 max-w-4xl mx-auto">
        <div className="bg-white dark:bg-blue-900/50 rounded-2xl shadow-2xl p-4 sm:p-8 border dark:border-blue-800">
          <img 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            alt="Dashboard preview"
            className="w-full h-64 sm:h-96 object-cover rounded-xl"
          />
        </div>
      </div>
    </section>
  );
};
