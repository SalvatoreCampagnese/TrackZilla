
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
  subscription_status: string | null;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    subscribed: false,
    subscription_tier: null,
    subscription_end: null,
    subscription_status: null,
  });
  const [loading, setLoading] = useState(true);

  const checkSubscription = async () => {
    if (!user) {
      setSubscriptionData({
        subscribed: false,
        subscription_tier: null,
        subscription_end: null,
        subscription_status: null,
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) throw error;
      
      setSubscriptionData({
        subscribed: data.subscribed || false,
        subscription_tier: data.subscription_tier || null,
        subscription_end: data.subscription_end || null,
        subscription_status: data.subscription_status || null,
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
      toast({
        title: "Errore",
        description: "Impossibile verificare lo stato dell'abbonamento.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Check subscription on mount and when user changes
  useEffect(() => {
    checkSubscription();
  }, [user]);

  // Set up real-time subscription updates
  useEffect(() => {
    if (!user?.email) return;

    const channel = supabase
      .channel('subscription-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscribers',
          filter: `email=eq.${user.email}`,
        },
        (payload) => {
          console.log('Subscription updated:', payload);
          if (payload.new && typeof payload.new === 'object') {
            const newData = payload.new as any;
            setSubscriptionData({
              subscribed: newData.subscribed || false,
              subscription_tier: newData.subscription_tier || null,
              subscription_end: newData.subscription_end || null,
              subscription_status: newData.subscription_status || null,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.email]);

  return {
    ...subscriptionData,
    loading,
    checkSubscription,
  };
};
