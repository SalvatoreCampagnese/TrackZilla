
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { Crown, CheckCircle, Sparkles } from 'lucide-react';

const ProSuccessPage = () => {
  const navigate = useNavigate();
  const { checkSubscription } = useSubscription();

  useEffect(() => {
    // Refresh subscription status when user lands on success page
    const timer = setTimeout(() => {
      checkSubscription();
    }, 2000);

    return () => clearTimeout(timer);
  }, [checkSubscription]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50 max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <CheckCircle className="w-16 h-16 text-green-400" />
              <Crown className="w-8 h-8 text-yellow-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Benvenuto in ProZilla! 🎉
            </h1>
            <p className="text-white/70">
              Il tuo abbonamento è stato attivato con successo
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-white/80">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span>Candidature illimitate sbloccate</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span>Vista Kanban attiva</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span>Domande anticipate disponibili</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span>Accesso alle risorse premium</span>
            </div>
          </div>

          <Button
            onClick={() => navigate('/')}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold"
            size="lg"
          >
            Inizia a usare ProZilla
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProSuccessPage;
