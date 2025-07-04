
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Crown, Check, X, Zap, Eye, Kanban, Infinity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ProPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!user) {
      toast({
        title: "Accesso richiesto",
        description: "Devi effettuare l'accesso per procedere con l'upgrade.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId: 'price_1Rh8BAJyLFziZ5rmdoQu3djS'
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'avvio del checkout. Riprova.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const features = {
    pro: [{
      icon: <Infinity className="w-5 h-5" />,
      title: "Candidature illimitate",
      description: "Tieni traccia di tutte le tue application senza limiti"
    }, {
      icon: <Kanban className="w-5 h-5" />,
      title: "Vista Kanban completa",
      description: "Organizza le tue candidature con drag & drop"
    }, {
      icon: <Eye className="w-5 h-5" />,
      title: "Domande interview in anticipo",
      description: "Preparati al meglio per i colloqui"
    }, {
      icon: <Zap className="w-5 h-5" />,
      title: "Risorse consigliate",
      description: "Accesso esclusivo a contenuti premium"
    }],
    free: [{
      icon: <X className="w-5 h-5 text-red-500" />,
      title: "Limite 50 candidature",
      description: "Tracciamento limitato delle application"
    }, {
      icon: <X className="w-5 h-5 text-red-500" />,
      title: "Vista Kanban bloccata",
      description: "Solo vista lista disponibile"
    }, {
      icon: <X className="w-5 h-5 text-red-500" />,
      title: "Domande nascoste",
      description: "Nessuna preparazione anticipata"
    }, {
      icon: <X className="w-5 h-5 text-red-500" />,
      title: "Nessuna risorsa premium",
      description: "Contenuti base solamente"
    }]
  };

  return (
    <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Crown className="w-8 h-8 text-red-500" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
            ProZilla
          </h1>
        </div>
        <p className="text-xl text-white/80 max-w-2xl mx-auto">
          Sblocca tutto il potenziale del tuo job tracking. 
          Gestisci infinite candidature con strumenti professionali.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Free Plan */}
        <Card className="relative border-2 border-white/20 bg-white/10 backdrop-blur-md">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-2xl font-bold text-white/90">Free</CardTitle>
            <div className="text-4xl font-bold text-white mt-4">
              €0<span className="text-lg font-normal text-white/70">/mese</span>
            </div>
            <Badge variant="secondary" className="mt-2 bg-white/20 text-white">Attuale</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {features.free.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                {feature.icon}
                <div>
                  <h4 className="font-medium text-white">{feature.title}</h4>
                  <p className="text-sm text-white/70">{feature.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className="relative border-2 border-red-500 shadow-2xl scale-105 bg-gradient-to-br from-red-900/20 to-red-800/20 backdrop-blur-md">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-1">
              🚀 Consigliato
            </Badge>
          </div>
          <CardHeader className="text-center pb-8 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-lg">
            <div className="flex items-center justify-center gap-2">
              <Crown className="w-6 h-6 text-yellow-300" />
              <CardTitle className="text-2xl font-bold">ProZilla</CardTitle>
            </div>
            <div className="text-4xl font-bold mt-4">
              €4.79<span className="text-lg font-normal opacity-80">/mese</span>
            </div>
            <p className="text-red-100 mt-2">Tutto incluso</p>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {features.pro.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white">{feature.title}</h4>
                  <p className="text-sm text-white/70">{feature.description}</p>
                </div>
              </div>
            ))}
            
            <div className="pt-6">
              <Button 
                onClick={handleUpgrade} 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 text-lg" 
                size="lg"
              >
                <Crown className="w-5 h-5 mr-2" />
                {isLoading ? "Caricamento..." : "Diventa ProZilla Ora"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Comparison */}
      <Card className="mb-8 bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-white">Confronto Dettagliato</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-4 px-4 text-white">Funzionalità</th>
                  <th className="text-center py-4 px-4 text-white">Free</th>
                  <th className="text-center py-4 px-4">
                    <div className="flex items-center justify-center gap-2 text-white">
                      <Crown className="w-4 h-4 text-red-500" />
                      ProZilla
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/20">
                  <td className="py-4 px-4 font-medium text-white">Numero candidature</td>
                  <td className="text-center py-4 px-4 text-white/70">50 max</td>
                  <td className="text-center py-4 px-4 text-green-400 font-semibold">Illimitate</td>
                </tr>
                <tr className="border-b border-white/20">
                  <td className="py-4 px-4 font-medium text-white">Vista Kanban</td>
                  <td className="text-center py-4 px-4">
                    <X className="w-5 h-5 text-red-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <Check className="w-5 h-5 text-green-400 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-white/20">
                  <td className="py-4 px-4 font-medium text-white">Domande interview</td>
                  <td className="text-center py-4 px-4">
                    <X className="w-5 h-5 text-red-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <Check className="w-5 h-5 text-green-400 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-white">Risorse premium</td>
                  <td className="text-center py-4 px-4">
                    <X className="w-5 h-5 text-red-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <Check className="w-5 h-5 text-green-400 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProPage;
