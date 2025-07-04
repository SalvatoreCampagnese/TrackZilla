
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { 
  Crown, 
  Zap, 
  Target, 
  Eye, 
  BookOpen, 
  Check, 
  X,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

const ProPage = () => {
  const { isPro, createCheckoutSession, openCustomerPortal, loading } = useSubscription();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleUpgrade = async () => {
    if (!user) {
      toast.error('Devi essere loggato per aggiornare il tuo account');
      return;
    }

    try {
      await createCheckoutSession();
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Errore durante la creazione della sessione di pagamento');
    }
  };

  const handleManageSubscription = async () => {
    try {
      await openCustomerPortal();
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast.error('Errore durante l\'apertura del portale clienti');
    }
  };

  const features = [
    {
      name: 'Candidature',
      free: '50 candidature',
      pro: 'Illimitate',
      icon: Target,
    },
    {
      name: 'Vista Kanban',
      free: 'Bloccata',
      pro: 'Sbloccata',
      icon: Zap,
    },
    {
      name: 'Domande Anticipate',
      free: 'Nascoste',
      pro: 'Visibili',
      icon: Eye,
    },
    {
      name: 'Risorse Consigliate',
      free: 'Non disponibili',
      pro: 'Accesso completo',
      icon: BookOpen,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Torna alla Dashboard
          </Button>
        </div>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="w-12 h-12 text-yellow-500" />
            <h1 className="text-4xl sm:text-5xl font-bold text-white">
              TrackZilla <span className="text-yellow-500">Pro</span>
            </h1>
          </div>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Sblocca tutto il potenziale del tuo job tracking con funzionalità avanzate
          </p>
        </div>

        {/* Current Status */}
        {isPro && (
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Crown className="w-6 h-6 text-yellow-500" />
                  <span className="text-xl font-semibold text-white">Sei già un utente Pro!</span>
                </div>
                <p className="text-white/70 mb-4">
                  Goditi tutte le funzionalità premium di TrackZilla
                </p>
                <Button
                  onClick={handleManageSubscription}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  disabled={loading}
                >
                  Gestisci Abbonamento
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Free Plan */}
          <Card className="bg-white/5 backdrop-blur-md border-white/20 relative">
            <CardHeader className="text-center pb-2">
              <Badge variant="secondary" className="w-fit mx-auto mb-2 bg-gray-600 text-white">
                Attuale
              </Badge>
              <CardTitle className="text-2xl font-bold text-white">Free</CardTitle>
              <div className="text-4xl font-bold text-white">€0</div>
              <p className="text-white/60">per sempre</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.map((feature) => (
                <div key={feature.name} className="flex items-center gap-3">
                  <feature.icon className="w-5 h-5 text-gray-400" />
                  <span className="text-white/70">{feature.free}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4">
                🚀 Più Popolare
              </Badge>
            </div>
            <CardHeader className="text-center pb-2 pt-6">
              <CardTitle className="text-2xl font-bold text-white">ProZilla</CardTitle>
              <div className="text-4xl font-bold text-white">€9.99</div>
              <p className="text-white/60">al mese</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.map((feature) => (
                <div key={feature.name} className="flex items-center gap-3">
                  <feature.icon className="w-5 h-5 text-yellow-500" />
                  <span className="text-white font-medium">{feature.pro}</span>
                </div>
              ))}
              {!isPro && (
                <Button
                  onClick={handleUpgrade}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 mt-6"
                  size="lg"
                  disabled={loading}
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Diventa ProZilla
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Feature Comparison */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Confronto Dettagliato
          </h2>
          <Card className="bg-white/5 backdrop-blur-md border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left p-4 text-white font-semibold">Caratteristiche</th>
                    <th className="text-center p-4 text-white font-semibold">Free</th>
                    <th className="text-center p-4 text-yellow-500 font-semibold">ProZilla</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {features.map((feature) => (
                    <tr key={feature.name}>
                      <td className="p-4 text-white flex items-center gap-2">
                        <feature.icon className="w-5 h-5" />
                        {feature.name}
                      </td>
                      <td className="p-4 text-center text-white/70">{feature.free}</td>
                      <td className="p-4 text-center text-yellow-500 font-medium">{feature.pro}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Call to Action */}
        {!isPro && (
          <div className="text-center">
            <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Pronto a potenziare il tuo job tracking?
                </h3>
                <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                  Unisciti a migliaia di professionisti che hanno scelto ProZilla per 
                  gestire le loro candidature in modo più efficace e organizzato.
                </p>
                <Button
                  onClick={handleUpgrade}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold px-8 py-3"
                  size="lg"
                  disabled={loading}
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Inizia con ProZilla - €9.99/mese
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProPage;
