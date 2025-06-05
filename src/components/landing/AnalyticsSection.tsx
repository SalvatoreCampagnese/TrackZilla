
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface AnalyticsSectionProps {
  onGetStarted: () => void;
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ onGetStarted }) => {
  const benefits = [
    "Tracciamento automatico dei tempi di risposta",
    "Identificazione delle aziende più reattive",
    "Suggerimenti per migliorare il tuo approccio"
  ];

  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <img 
              src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Analisi delle candidature"
              className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-2xl shadow-xl"
            />
          </div>
          <div className="order-1 lg:order-2">
            <h3 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Analizza e migliora le tue performance
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Con Flow Guru puoi visualizzare statistiche dettagliate sui tuoi tassi di risposta, identificare i pattern di successo e ottimizzare la tua strategia di ricerca lavoro.
            </p>
            <ul className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                </li>
              ))}
            </ul>
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              Inizia l'analisi gratuita
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
