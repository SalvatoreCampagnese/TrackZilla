
import React from 'react';
import { Button } from '@/components/ui/button';
import { Briefcase, Target, TrendingUp } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-blue-600 dark:bg-blue-500 rounded-2xl">
            <Briefcase className="w-12 h-12 text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Ottimizza la tua ricerca di lavoro con{' '}
          <span className="text-blue-600 dark:text-blue-400">TrackZilla</span>
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
          Traccia le tue candidature, monitora i progressi e ottimizza la tua strategia di ricerca del lavoro. 
          Non perdere mai più di vista una candidatura importante.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg dark:bg-blue-500 dark:hover:bg-blue-600"
            onClick={onGetStarted}
          >
            Inizia Subito
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Organizzazione Totale</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Mantieni tutte le tue candidature organizzate in un unico posto
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Analisi Dettagliate</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Scopri pattern e tendenze per migliorare il tuo tasso di successo
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Briefcase className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Tracciamento Intelligente</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Monitora automaticamente lo stato delle tue candidature
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
