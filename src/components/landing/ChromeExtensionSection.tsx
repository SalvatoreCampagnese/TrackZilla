
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Chrome, Download, Zap, ArrowRight, CheckCircle } from 'lucide-react';

export const ChromeExtensionSection: React.FC = () => {
  const { t } = useTranslation();
  const features = t('landing.extension.features', { returnObjects: true }) as string[];

  const handleDownloadExtension = () => {
    window.open('https://chromewebstore.google.com/detail/trackzilla-extension/keoknoalfmlpdnjbdcocleagpiepfpcb?authuser=0&hl=it', '_blank');
  };

  return (
    <section className="relative py-12 lg:py-16 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/6 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/6 w-80 h-80 bg-green-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-white/90 mb-6">
            <Chrome className="w-4 h-4 mr-2" />
            {t('landing.extension.badge')}
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            {t('landing.extension.titleStart')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">{t('landing.extension.titleHighlight')}</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto font-light">
            {t('landing.extension.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left side - Features */}
          <div className="space-y-8 animate-slide-up">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">
                {t('landing.extension.stopTitle')}
              </h3>
              <p className="text-white/70 text-lg mb-8">
                {t('landing.extension.description')}
              </p>
            </div>
            
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white/80">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={handleDownloadExtension}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-8 py-4 text-lg rounded-2xl font-semibold shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Download className="w-5 h-5 mr-2" />
                {t('landing.extension.install')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <div className="flex items-center text-white/60 text-sm">
                <Chrome className="w-4 h-4 mr-2" />
                {t('landing.extension.compatibility')}
              </div>
            </div>
          </div>

          {/* Right side - Visual */}
          <div className="relative animate-slide-up">
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-0">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl mb-6">
                    <img src="/lovable-uploads/6954c22b-6d42-46f9-b18b-cb4bb816b599.png" alt={t('landing.extension.cardAlt')} className="w-100 h-100" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-4">
                    {t('landing.extension.cardTitle')}
                  </h4>
                  <p className="text-white/70 mb-6">
                    {t('landing.extension.cardDescription')}
                  </p>
                  
                  {/* Mock extension interface */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="text-left space-y-2 text-sm">
                      <div className="bg-blue-500/20 text-blue-200 px-3 py-2 rounded">
                        {t('landing.extension.mockDetected')}
                      </div>
                      <div className="bg-green-500/20 text-green-200 px-3 py-2 rounded">
                        {t('landing.extension.mockExtracted')}
                      </div>
                      <div className="bg-purple-500/20 text-purple-200 px-3 py-2 rounded">
                        {t('landing.extension.mockAdded')}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
