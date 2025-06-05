
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, TrendingUp, Clock, BarChart3, CheckCircle, Zap } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Target,
      title: "Traccia ogni candidatura",
      description: "Organizza tutte le tue candidature in un unico posto. Monitora lo stato, le date e i dettagli di ogni opportunità.",
      color: "blue"
    },
    {
      icon: TrendingUp,
      title: "Analytics avanzate",
      description: "Visualizza statistiche dettagliate sul tuo tasso di risposta, tempi di feedback e performance generale.",
      color: "green"
    },
    {
      icon: Clock,
      title: "Follow-up automatici",
      description: "Non perdere mai un'opportunità. Il sistema rileva automaticamente le candidature in ghosting.",
      color: "purple"
    },
    {
      icon: BarChart3,
      title: "Dashboard intuitiva",
      description: "Visualizza rapidamente i tuoi progressi con metriche chiare e grafici informativi.",
      color: "orange"
    },
    {
      icon: CheckCircle,
      title: "Stati personalizzabili",
      description: "Traccia ogni fase del processo: candidatura, colloqui, feedback e offerte ricevute.",
      color: "red"
    },
    {
      icon: Zap,
      title: "Setup rapido",
      description: "Inizia in pochi secondi. Interfaccia semplice e intuitiva per massimizzare la produttività.",
      color: "indigo"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400",
      green: "bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400",
      purple: "bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-400",
      orange: "bg-orange-100 dark:bg-orange-800 text-orange-600 dark:text-orange-400",
      red: "bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-400",
      indigo: "bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-400"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section className="bg-white dark:bg-blue-900/30 py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h3 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Tutto quello che ti serve per il job hunting
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Strumenti potenti per organizzare, tracciare e ottimizzare la tua ricerca di lavoro
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="border-gray-200 dark:border-blue-800 bg-white dark:bg-blue-900/50">
              <CardHeader>
                <div className={`w-12 h-12 ${getColorClasses(feature.color)} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-gray-900 dark:text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
