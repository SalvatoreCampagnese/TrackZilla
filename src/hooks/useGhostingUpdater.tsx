
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useGhostingUpdater = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateGhostedApplications = async () => {
    try {
      // Get ghosting threshold from localStorage (default to 14 days)
      const ghostingDays = parseInt(localStorage.getItem('ghostingDays') || '14');
      
      // Calculate the cutoff date
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - ghostingDays);
      
      console.log(`Checking for applications older than ${ghostingDays} days (before ${cutoffDate.toISOString()})`);
      
      // Find applications that should be marked as ghosting
      const { data: applications, error: fetchError } = await supabase
        .from('job_applications')
        .select('id, application_date, status, company_name')
        .eq('status', 'in-corso')
        .lt('application_date', cutoffDate.toISOString().split('T')[0]);

      if (fetchError) {
        console.error('Error fetching applications for ghosting update:', fetchError);
        return;
      }

      if (!applications || applications.length === 0) {
        console.log('No applications to update to ghosting status');
        return;
      }

      console.log(`Found ${applications.length} applications to mark as ghosting`);

      // Update each application to ghosting status
      const updatePromises = applications.map(async (app) => {
        const { error } = await supabase
          .from('job_applications')
          .update({ status: 'ghosting' })
          .eq('id', app.id);

        if (error) {
          console.error(`Error updating application ${app.id}:`, error);
          return { success: false, id: app.id, company: app.company_name };
        }

        console.log(`Updated ${app.company_name} to ghosting status`);
        return { success: true, id: app.id, company: app.company_name };
      });

      const results = await Promise.all(updatePromises);
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);

      if (successful.length > 0) {
        toast({
          title: "Candidature aggiornate",
          description: `${successful.length} candidature sono state automaticamente marcate come "ghosting"`
        });
      }

      if (failed.length > 0) {
        toast({
          title: "Errore aggiornamento",
          description: `Impossibile aggiornare ${failed.length} candidature`,
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error('Error in ghosting updater:', error);
    }
  };

  const startGhostingUpdater = () => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Run immediately on start
    updateGhostedApplications();

    // Set up interval to run every hour (3600000 ms)
    intervalRef.current = setInterval(() => {
      updateGhostedApplications();
    }, 3600000); // 1 hour

    console.log('Ghosting updater started - will check every hour');
  };

  const stopGhostingUpdater = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log('Ghosting updater stopped');
    }
  };

  useEffect(() => {
    startGhostingUpdater();

    return () => {
      stopGhostingUpdater();
    };
  }, []);

  return {
    updateGhostedApplications,
    startGhostingUpdater,
    stopGhostingUpdater
  };
};
