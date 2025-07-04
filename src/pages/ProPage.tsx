
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Check, X, Zap, Eye, Kanban, Infinity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ProPage = () => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    // Placeholder per l'integrazione con Stripe
    console.log('Avvio processo di upgrade...');
  };

  const features = {
    pro: [
      {
        icon: <Infinity className="w-5 h-5" />,
        title: "Candidature illimitate",
        description: "Tieni traccia di tutte le tue application senza limiti"
      },
      {
        icon: <Kanban className="w-5 h-5" />,
        title: "Vista Kanban completa",
        description: "Organizza le tue candidature con drag & drop"
      },
      {
        icon: <Eye className="w-5 h-5" />,
        title: "Domande interview in anticipo",
        description: "Preparati al meglio per i colloqui"
      },
      {
        icon: <Zap className="w-5 h-5" />,
        title: "Risorse consigliate",
        description: "Accesso esclusivo a contenuti premium"
      }
    ],
    free: [
      {
        icon: <X className="w-5 h-5 text-red-500" />,
        title: "Limite 50 candidature",
        description: "Tracciamento limitato delle application"
      },
      {
        icon: <X className="w-5 h-5 text-red-500" />,
        title: "Vista Kanban bloccata",
        description: "Solo vista lista disponibile"
      },
      {
        icon: <X className="w-5 h-5 text-red-500" />,
        title: "Domande nascoste",
        description: "Nessuna preparazione anticipata"
      },
      {
        icon: <X className="w-5 h-5 text-red-500" />,
        title: "Nessuna risorsa premium",
        description: "Contenuti base solamente"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
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
                €9.99<span className="text-lg font-normal opacity-80">/mese</span>
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
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 text-lg"
                  size="lg"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Diventa ProZilla Ora
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

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Pronto per il prossimo livello?</h2>
          <p className="text-xl mb-6 opacity-90">
            Unisciti a migliaia di professionisti che hanno potenziato il loro job search
          </p>
          <Button 
            onClick={handleUpgrade}
            size="lg"
            className="bg-white text-red-600 hover:bg-gray-100 font-semibold px-8 py-3 text-lg"
          >
            <Crown className="w-5 h-5 mr-2" />
            Inizia la prova gratuita
          </Button>
          <p className="text-sm mt-4 opacity-75">
            Nessun impegno • Cancella quando vuoi
          </p>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            ← Torna alla dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProPage;
