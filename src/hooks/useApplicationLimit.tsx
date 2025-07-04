
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';

export const useApplicationLimit = () => {
  const { user } = useAuth();
  const { isPro } = useSubscription();
  const [applicationCount, setApplicationCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const FREE_LIMIT = 50;

  const fetchApplicationCount = async () => {
    if (!user) {
      setApplicationCount(0);
      setLoading(false);
      return;
    }

    try {
      const { count, error } = await supabase
        .from('job_applications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('deleted', false);

      if (error) throw error;
      setApplicationCount(count || 0);
    } catch (error) {
      console.error('Error fetching application count:', error);
      setApplicationCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicationCount();
  }, [user]);

  const canAddApplication = isPro || applicationCount < FREE_LIMIT;
  const remainingApplications = isPro ? Infinity : Math.max(0, FREE_LIMIT - applicationCount);
  
  return {
    applicationCount,
    canAddApplication,
    remainingApplications,
    isAtLimit: !isPro && applicationCount >= FREE_LIMIT,
    freeLimit: FREE_LIMIT,
    loading,
    refetch: fetchApplicationCount,
  };
};
