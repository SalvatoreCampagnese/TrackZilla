
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Crown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscription } from '@/hooks/useSubscription';
import { useTranslation } from 'react-i18next';

const SuccessPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { checkSubscription } = useSubscription();

  useEffect(() => {
    // Refresh subscription status when user lands on success page
    checkSubscription();
  }, [checkSubscription]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-gradient-to-br from-green-900/20 to-green-800/20 backdrop-blur-md border-2 border-green-500">
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-white mb-4">
            {t('success.title')}
          </CardTitle>
          <p className="text-xl text-green-100">
            {t('success.subtitle')}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6 text-center">
          <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Crown className="w-6 h-6 text-yellow-400" />
              <h3 className="text-xl font-semibold text-white">{t('success.welcome')}</h3>
            </div>
            <p className="text-green-100 mb-4">
              {t('success.accessIntro')}
            </p>
            <ul className="text-left text-green-100 space-y-2 max-w-md mx-auto">
              {(t('success.features', { returnObjects: true }) as string[]).map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
              size="lg"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              {t('success.startUsing')}
            </Button>
            <Button 
              onClick={() => navigate('/subscription')}
              variant="outline"
              className="border-green-500 text-green-400 hover:bg-green-500/10"
              size="lg"
            >
              {t('success.manageSubscription')}
            </Button>
          </div>

          <div className="text-sm text-green-200 mt-8">
            <p>{t('success.footer')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuccessPage;
