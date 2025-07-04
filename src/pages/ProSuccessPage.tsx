
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { Crown, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ProSuccessPage = () => {
  const navigate = useNavigate();
  const { checkSubscription } = useSubscription();

  useEffect(() => {
    // Check subscription status when page loads
    checkSubscription();
  }, [checkSubscription]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <Card className="bg-white/10 backdrop-blur-md border-white/20 max-w-2xl w-full">
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full">
              <CheckCircle className="w-16 h-16 text-green-400" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-2">
            <Crown className="w-8 h-8 text-yellow-500" />
            Benvenuto in ProZilla!
          </CardTitle>
          <p className="text-lg text-white/80">
            Il tuo abbonamento è stato attivato con successo
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-6 border border-yellow-500/30">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              Ora hai accesso a:
            </h3>
            <ul className="space-y-3 text-white/90">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>Candidature illimitate</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>Vista Kanban avanzata</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>Domande di colloquio visibili</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>Accesso alle risorse consigliate</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>Statistiche avanzate</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => navigate('/')}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3"
            >
              Inizia ad usare ProZilla
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={() => navigate('/pro')}
              variant="outline"
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              Gestisci Abbonamento
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProSuccessPage;
