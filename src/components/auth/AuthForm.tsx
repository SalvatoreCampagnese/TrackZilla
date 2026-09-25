
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AuthHeader } from './AuthHeader';
import { AuthTabs } from './AuthTabs';
import { useTranslation } from 'react-i18next';

interface AuthFormProps {
  onBack: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onBack, activeTab, setActiveTab }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);
  const { signIn, signUp, signInWithMagicLink } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleAuth = async (type: 'signin' | 'signup') => {
    if (!email || !password) {
      toast({
        title: t('common.error'),
        description: t('auth.enterEmailAndPassword'),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (type === 'signin') {
        const { error } = await signIn(email, password);
        if (error) {
          // Check if it's an invalid credentials error
          if (error.message.includes('Invalid login credentials') || error.message.includes('Email not confirmed')) {
            toast({
              title: t('auth.loginFailed'),
              description: t('auth.accountNotFound'),
              variant: "destructive",
            });
          } else {
            toast({
              title: t('common.error'),
              description: error.message || t('auth.loginError'),
              variant: "destructive",
            });
          }
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          toast({
            title: t('common.error'),
            description: error.message || t('auth.registrationError'),
            variant: "destructive",
          });
        } else {
          toast({
            title: t('auth.registrationCompleted'),
            description: t('auth.confirmEmailDescription'),
          });
        }
      }
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message || t('auth.genericError'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      toast({
        title: t('common.error'),
        description: t('auth.enterEmailAbove'),
        variant: "destructive",
      });
      return;
    }

    setMagicLinkLoading(true);
    try {
      await signInWithMagicLink(email);
      toast({
        title: t('auth.magicLinkSent'),
        description: t('auth.magicLinkSentDescription'),
      });
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message || t('auth.genericError'),
        variant: "destructive",
      });
    } finally {
      setMagicLinkLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAuth(activeTab as 'signin' | 'signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('auth.backToHome')}
        </Button>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
          <AuthHeader />
          <CardContent>
            <AuthTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              loading={loading}
              magicLinkLoading={magicLinkLoading}
              onFormSubmit={handleFormSubmit}
              onMagicLink={handleMagicLink}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
