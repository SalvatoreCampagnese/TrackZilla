
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { ArrowLeft, Check, Zap, Crown, Sparkles, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ProPage = () => {
  const navigate = useNavigate();
  const { isPro, createCheckoutSession, openCustomerPortal, loading } = useSubscription();

  const handleUpgrade = async () => {
    try {
      await createCheckoutSession();
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  const handleManageSubscription = async () => {
    try {
      await openCustomerPortal();
    } catch (error) {
      console.error('Error opening customer portal:', error);
    }
  };

  const freeFeatures = [
    'Fino a 50 candidature',
    'Vista lista delle candidature',
    'Statistiche di base',
    'Supporto via email'
  ];

  const proFeatures = [
    'Candidature illimitate',
    'Vista Kanban avanzata',
    'Domande di colloquio visibili',
    'Accesso alle risorse consigliate',
    'Statistiche avanzate',
    'Supporto prioritario',
    'Export dei dati',
    'Backup automatico'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 sm:p-6 border-b border-white/20 bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 h-8 w-8 sm:h-10 sm:w-10"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <Crown className="w-6 h-6 text-yellow-500" />
              ProZilla
            </h1>
            <p className="text-xs sm:text-sm text-white/70 hidden sm:block">Sblocca tutto il potenziale di TrackZilla</p>
          </div>
        </div>
        {isPro && (
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <Sparkles className="w-4 h-4 mr-1" />
            PRO ATTIVO
          </Badge>
        )}
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl">
              <Zap className="w-16 h-16 text-yellow-500" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Potenzia la tua ricerca di lavoro
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Accedi a funzionalità avanzate per gestire le tue candidature in modo più efficace e professionale
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Free Plan */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 relative">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Shield className="w-12 h-12 text-blue-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">Free</CardTitle>
              <div className="text-3xl font-bold text-white">€0<span className="text-sm font-normal">/mese</span></div>
            </CardHeader>
            <CardContent className="space-y-4">
              {freeFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white/90">{feature}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-md border-yellow-500/30 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1">
                CONSIGLIATO
              </Badge>
            </div>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Crown className="w-12 h-12 text-yellow-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">ProZilla</CardTitle>
              <div className="text-3xl font-bold text-white">€9.99<span className="text-sm font-normal">/mese</span></div>
              <p className="text-yellow-200 text-sm">Tutto quello che ti serve per il successo</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {proFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <span className="text-white/90">{feature}</span>
                </div>
              ))}
              <div className="pt-6">
                {isPro ? (
                  <Button
                    onClick={handleManageSubscription}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3"
                    disabled={loading}
                  >
                    Gestisci Abbonamento
                  </Button>
                ) : (
                  <Button
                    onClick={handleUpgrade}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3"
                    disabled={loading}
                  >
                    <Crown className="w-5 h-5 mr-2" />
                    Diventa ProZilla
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Comparison */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white text-center">
              Confronto Dettagliato
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 text-white font-semibold">Funzionalità</th>
                    <th className="text-center py-3 text-white font-semibold">Free</th>
                    <th className="text-center py-3 text-white font-semibold">ProZilla</th>
                  </tr>
                </thead>
                <tbody className="text-white/90">
                  <tr className="border-b border-white/10">
                    <td className="py-3">Numero candidature</td>
                    <td className="text-center py-3">50</td>
                    <td className="text-center py-3 text-yellow-400 font-semibold">Illimitate</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3">Vista Kanban</td>
                    <td className="text-center py-3 text-red-400">✗</td>
                    <td className="text-center py-3 text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3">Domande di colloquio</td>
                    <td className="text-center py-3 text-red-400">Nascoste</td>
                    <td className="text-center py-3 text-green-400">Visibili</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3">Risorse consigliate</td>
                    <td className="text-center py-3 text-red-400">✗</td>
                    <td className="text-center py-3 text-green-400">✓</td>
                  </tr>
                  <tr>
                    <td className="py-3">Supporto</td>
                    <td className="text-center py-3">Email</td>
                    <td className="text-center py-3 text-yellow-400">Prioritario</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProPage;
