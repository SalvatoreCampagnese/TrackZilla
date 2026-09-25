
import React from 'react';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

export const AuthHeader = () => {
  const { t } = useTranslation();
  return (
    <CardHeader className="text-center">
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 rounded-xl overflow-hidden">
          <img src="/lovable-uploads/95407aee-75ac-4d31-a281-db4fc0472751.png" alt={t('auth.logoAlt')} className="w-full h-full object-cover" />
        </div>
      </div>
      <CardTitle className="text-2xl font-bold text-white">TrackZilla</CardTitle>
      <CardDescription className="text-white/70">
        {t('auth.tagline')}
      </CardDescription>
    </CardHeader>
  );
};
