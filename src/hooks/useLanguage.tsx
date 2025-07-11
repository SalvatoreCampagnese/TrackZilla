
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useLanguage = () => {
  const { i18n, t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  // Load user's language preference from profile
  useEffect(() => {
    const loadUserLanguage = async () => {
      console.log('Loading user language for user:', user?.id);
      
      if (!user) {
        console.log('No user found, setting loading to false');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('language_preference')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading language preference:', error);
          setLoading(false);
          return;
        }

        const languagePreference = profile?.language_preference || 'en';
        console.log('Found language preference:', languagePreference);
        
        if (languagePreference && i18n.language !== languagePreference) {
          console.log('Changing language from', i18n.language, 'to', languagePreference);
          await i18n.changeLanguage(languagePreference);
        }
      } catch (error) {
        console.error('Error loading user language:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserLanguage();
  }, [user, i18n]);

  const changeLanguage = async (language: 'it' | 'en') => {
    if (!user) {
      // If user is not logged in, just change the language locally
      await i18n.changeLanguage(language);
      return;
    }

    setLoading(true);
    try {
      // Change language in i18n
      await i18n.changeLanguage(language);

      // Update user profile in database
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          language_preference: language,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        throw error;
      }

      toast({
        title: t('settings.languageUpdated'),
        description: t('settings.languageUpdatedDescription'),
      });
    } catch (error) {
      console.error('Error updating language:', error);
      toast({
        title: t('common.error'),
        description: t('settings.errorUpdatingLanguage'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    currentLanguage: i18n.language as 'it' | 'en',
    changeLanguage,
    loading,
    t
  };
};
