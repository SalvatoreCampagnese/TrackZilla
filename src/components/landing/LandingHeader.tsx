
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/common/LanguageSelector';

interface LandingHeaderProps {
  onLogin: () => void;
  onSignup: () => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({
  onLogin,
  onSignup
}) => {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
              <img src="/lovable-uploads/95407aee-75ac-4d31-a281-db4fc0472751.png" alt={t('landing.header.logoAlt')} className="w-full h-full object-cover" />
            </div>
            <h1 className="hidden sm:block text-xl sm:text-2xl font-bold text-white">TrackZilla</h1>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* On mobile only the flag is visible; the full language name appears from sm up */}
            <LanguageSelector
              id="landing-language-select"
              className="h-9 w-[68px] sm:w-[140px] bg-white/5 border-white/20 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
            />
            <Button 
              onClick={onLogin} 
              variant="ghost" 
              className="px-3 sm:px-4 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
            >
              {t('landing.header.signIn')}
            </Button>
            <Button 
              onClick={onSignup} 
              className="px-3 sm:px-4 bg-white text-gray-900 hover:bg-white/90 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105"
            >
              {t('landing.header.huntNow')}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
