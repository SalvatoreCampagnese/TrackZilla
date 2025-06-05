
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { JobApplication, JobStatus } from '@/types/job';
import { toast } from '@/hooks/use-toast';

export const useJobApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    if (!user) {
      setApplications([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedApplications: JobApplication[] = data.map(app => ({
        id: app.id,
        jobDescription: app.job_description,
        applicationDate: app.application_date,
        companyName: app.company_name,
        roleDescription: app.role_description,
        salary: app.salary,
        workMode: app.work_mode as JobApplication['workMode'],
        status: app.status as JobStatus,
        tags: app.tags || [],
        createdAt: app.created_at
      }));

      setApplications(mappedApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Errore nel caricamento",
        description: "Impossibile caricare le candidature",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addApplication = async (application: Omit<JobApplication, 'id' | 'createdAt'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('job_applications')
        .insert({
          user_id: user.id,
          job_description: application.jobDescription,
          application_date: application.applicationDate,
          company_name: application.companyName,
          role_description: application.roleDescription,
          salary: application.salary,
          work_mode: application.workMode,
          status: application.status,
          tags: application.tags
        })
        .select()
        .single();

      if (error) throw error;

      const newApplication: JobApplication = {
        id: data.id,
        jobDescription: data.job_description,
        applicationDate: data.application_date,
        companyName: data.company_name,
        roleDescription: data.role_description,
        salary: data.salary,
        workMode: data.work_mode,
        status: data.status,
        tags: data.tags || [],
        createdAt: data.created_at
      };

      setApplications(prev => [newApplication, ...prev]);
      
      toast({
        title: "Candidatura aggiunta",
        description: `Candidatura per ${application.companyName} salvata con successo`
      });
    } catch (error) {
      console.error('Error adding application:', error);
      toast({
        title: "Errore nel salvataggio",
        description: "Impossibile salvare la candidatura",
        variant: "destructive"
      });
    }
  };

  const updateApplicationStatus = async (id: string, status: JobStatus) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setApplications(prev => 
        prev.map(app => 
          app.id === id ? { ...app, status } : app
        )
      );

      toast({
        title: "Stato aggiornato",
        description: "Lo stato della candidatura è stato aggiornato"
      });
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: "Errore nell'aggiornamento",
        description: "Impossibile aggiornare lo stato",
        variant: "destructive"
      });
    }
  };

  const deleteApplication = async (id: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setApplications(prev => prev.filter(app => app.id !== id));
      
      toast({
        title: "Candidatura eliminata",
        description: "La candidatura è stata eliminata con successo"
      });
    } catch (error) {
      console.error('Error deleting application:', error);
      toast({
        title: "Errore nell'eliminazione",
        description: "Impossibile eliminare la candidatura",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [user]);

  return {
    applications,
    loading,
    addApplication,
    updateApplicationStatus,
    deleteApplication,
    refetch: fetchApplications
  };
};
