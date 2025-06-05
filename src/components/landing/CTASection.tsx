
import React from 'react';
import { Button } from '@/components/ui/button';

interface CTASectionProps {
  onGetStarted: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onGetStarted }) => {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-600 dark:bg-blue-700 rounded-2xl px-6 sm:px-12 py-12 sm:py-16 text-center">
          <h3 className="text-2xl sm:text-4xl font-bold text-white mb-4">
            Pronto a ottimizzare la tua ricerca di lavoro?
          </h3>
          <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Unisciti a migliaia di professionisti che hanno migliorato il loro processo di job hunting con Flow Guru.
          </p>
          <Button 
            onClick={onGetStarted}
            size="lg"
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
          >
            Inizia gratis ora
          </Button>
        </div>
      </div>
    </section>
  );
};
