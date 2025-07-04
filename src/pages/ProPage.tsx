
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-8 h-8 text-yellow-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TrackZilla Pro
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sblocca tutto il potenziale del tuo job tracking. 
            Gestisci infinite candidature con strumenti professionali.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Free Plan */}
          <Card className="relative border-2 border-gray-200">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-bold text-gray-700">Free</CardTitle>
              <div className="text-4xl font-bold text-gray-900 mt-4">
                €0<span className="text-lg font-normal text-gray-500">/mese</span>
              </div>
              <Badge variant="secondary" className="mt-2">Attuale</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.free.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  {feature.icon}
                  <div>
                    <h4 className="font-medium text-gray-900">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="relative border-2 border-blue-500 shadow-2xl scale-105">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1">
                🚀 Consigliato
              </Badge>
            </div>
            <CardHeader className="text-center pb-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
              <div className="flex items-center justify-center gap-2">
                <Crown className="w-6 h-6 text-yellow-300" />
                <CardTitle className="text-2xl font-bold">Pro</CardTitle>
              </div>
              <div className="text-4xl font-bold mt-4">
                €9.99<span className="text-lg font-normal opacity-80">/mese</span>
              </div>
              <p className="text-blue-100 mt-2">Tutto incluso</p>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {features.pro.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
              
              <div className="pt-6">
                <Button 
                  onClick={handleUpgrade}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 text-lg"
                  size="lg"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Diventa Pro Ora
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Comparison */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Confronto Dettagliato</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4">Funzionalità</th>
                    <th className="text-center py-4 px-4">Free</th>
                    <th className="text-center py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Crown className="w-4 h-4 text-yellow-500" />
                        Pro
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-medium">Numero candidature</td>
                    <td className="text-center py-4 px-4">50 max</td>
                    <td className="text-center py-4 px-4 text-green-600 font-semibold">Illimitate</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-medium">Vista Kanban</td>
                    <td className="text-center py-4 px-4">
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    </td>
                    <td className="text-center py-4 px-4">
                      <Check className="w-5 h-5 text-green-600 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-medium">Domande interview</td>
                    <td className="text-center py-4 px-4">
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    </td>
                    <td className="text-center py-4 px-4">
                      <Check className="w-5 h-5 text-green-600 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium">Risorse premium</td>
                    <td className="text-center py-4 px-4">
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    </td>
                    <td className="text-center py-4 px-4">
                      <Check className="w-5 h-5 text-green-600 mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Pronto per il prossimo livello?</h2>
          <p className="text-xl mb-6 opacity-90">
            Unisciti a migliaia di professionisti che hanno potenziato il loro job search
          </p>
          <Button 
            onClick={handleUpgrade}
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3 text-lg"
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
            className="text-gray-600 hover:text-gray-900"
          >
            ← Torna alla dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProPage;
