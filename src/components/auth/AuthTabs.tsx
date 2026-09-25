
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MagicLinkButton } from './MagicLinkButton';
import { useTranslation } from 'react-i18next';

interface AuthTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
  magicLinkLoading: boolean;
  onFormSubmit: (e: React.FormEvent) => void;
  onMagicLink: () => void;
}

const TermsNotice = () => {
  const { t } = useTranslation();
  return (
    <p className="text-xs text-white/70 text-center mt-4">
      {t('auth.termsNotice')}{' '}
      <a 
        href="/terms" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-white underline hover:text-white/90"
      >
        {t('auth.termsLink')}
      </a>
    </p>
  );
};

export const AuthTabs: React.FC<AuthTabsProps> = ({
  activeTab,
  setActiveTab,
  email,
  setEmail,
  password,
  setPassword,
  loading,
  magicLinkLoading,
  onFormSubmit,
  onMagicLink,
}) => {
  const { t } = useTranslation();
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-md border border-white/20">
        <TabsTrigger value="signin" className="text-white/70 data-[state=active]:bg-white/20 data-[state=active]:text-white">
          {t('auth.login')}
        </TabsTrigger>
        <TabsTrigger value="signup" className="text-white/70 data-[state=active]:bg-white/20 data-[state=active]:text-white">
          {t('auth.register')}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="signin" className="space-y-4 mt-4">
        <form onSubmit={onFormSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signin-email" className="text-white">{t('auth.email')}</Label>
            <Input
              id="signin-email"
              type="email"
              placeholder={t('auth.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signin-password" className="text-white">{t('auth.password')}</Label>
            <Input
              id="signin-password"
              type="password"
              placeholder={t('auth.passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
            />
          </div>
          <Button 
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl" 
            disabled={loading}
          >
            {loading ? t('auth.signingIn') : t('auth.login')}
          </Button>
        </form>

        <MagicLinkButton onClick={onMagicLink} loading={magicLinkLoading} />
        <TermsNotice />
      </TabsContent>
      
      <TabsContent value="signup" className="space-y-4 mt-4">
        <form onSubmit={onFormSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signup-email" className="text-white">{t('auth.email')}</Label>
            <Input
              id="signup-email"
              type="email"
              placeholder={t('auth.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password" className="text-white">{t('auth.password')}</Label>
            <Input
              id="signup-password"
              type="password"
              placeholder={t('auth.createPasswordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
            />
          </div>
          <Button 
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl" 
            disabled={loading}
          >
            {loading ? t('auth.creatingAccount') : t('auth.register')}
          </Button>
        </form>
        <TermsNotice />
      </TabsContent>
    </Tabs>
  );
};
