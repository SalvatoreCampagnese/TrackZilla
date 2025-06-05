
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Target, TrendingUp, Clock, CheckCircle, BarChart3, Users, Zap } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-blue-950 dark:to-slate-900">
      {/* Header */}
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 dark:bg-blue-500 rounded-xl">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Flow Guru</h1>
          </div>
          <Button 
            onClick={onGetStarted}
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-400 dark:text-blue-400"
          >
            Accedi
          </Button>
        </div>
      </header>

      {/* Hero Section */}
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

        {/* Hero Image Placeholder */}
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

      {/* Features Section */}
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
            <Card className="border-gray-200 dark:border-blue-800 bg-white dark:bg-blue-900/50">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-gray-900 dark:text-white">Traccia ogni candidatura</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Organizza tutte le tue candidature in un unico posto. Monitora lo stato, le date e i dettagli di ogni opportunità.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-blue-800 bg-white dark:bg-blue-900/50">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-gray-900 dark:text-white">Analytics avanzate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Visualizza statistiche dettagliate sul tuo tasso di risposta, tempi di feedback e performance generale.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-blue-800 bg-white dark:bg-blue-900/50">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-800 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-gray-900 dark:text-white">Follow-up automatici</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Non perdere mai un'opportunità. Il sistema rileva automaticamente le candidature in ghosting.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-blue-800 bg-white dark:bg-blue-900/50">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-800 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-gray-900 dark:text-white">Dashboard intuitiva</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Visualizza rapidamente i tuoi progressi con metriche chiare e grafici informativi.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-blue-800 bg-white dark:bg-blue-900/50">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-800 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle className="text-gray-900 dark:text-white">Stati personalizzabili</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Traccia ogni fase del processo: candidatura, colloqui, feedback e offerte ricevute.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-blue-800 bg-white dark:bg-blue-900/50">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-800 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <CardTitle className="text-gray-900 dark:text-white">Setup rapido</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Inizia in pochi secondi. Interfaccia semplice e intuitiva per massimizzare la produttività.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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

      {/* Footer */}
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
    </div>
  );
};
