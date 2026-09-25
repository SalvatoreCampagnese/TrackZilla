
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { JobApplication, JobStatus } from '@/types/job';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

export const useJobApplications = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchApplications = async () => {
    if (!user) {
      setApplications([]);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('deleted', false)
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
      setError(error);
      toast({
        title: t('applications.errorLoadingTitle'),
        description: t('applications.errorLoadingDescription'),
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
          tags: application.tags,
          deleted: false
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
        workMode: data.work_mode as JobApplication['workMode'],
        status: data.status as JobStatus,
        tags: data.tags || [],
        createdAt: data.created_at
      };

      setApplications(prev => [newApplication, ...prev]);
      
      toast({
        title: t('addJob.applicationAdded'),
        description: t('applications.applicationAddedFor', { company: application.companyName })
      });
    } catch (error) {
      console.error('Error adding application:', error);
      toast({
        title: t('common.error'),
        description: t('addJob.errorAddingApplication'),
        variant: "destructive"
      });
    }
  };

  // Bulk insert used by the CSV import. Inserts in chunks, returns how many rows were saved.
  // Validation, duplicate detection and the plan limit are handled by the caller
  // (see src/lib/applicationsCsv.ts). Rows are always owned by the current user (RLS).
  const importApplications = async (
    newApplications: Omit<JobApplication, 'id' | 'createdAt'>[]
  ): Promise<{ inserted: number; failed: number }> => {
    if (!user || newApplications.length === 0) return { inserted: 0, failed: newApplications.length };

    const CHUNK_SIZE = 100;
    let inserted = 0;
    for (let i = 0; i < newApplications.length; i += CHUNK_SIZE) {
      const chunk = newApplications.slice(i, i + CHUNK_SIZE);
      const { error } = await supabase.from('job_applications').insert(
        chunk.map(application => ({
          user_id: user.id,
          job_description: application.jobDescription,
          application_date: application.applicationDate,
          company_name: application.companyName,
          role_description: application.roleDescription,
          salary: application.salary,
          work_mode: application.workMode,
          status: application.status,
          tags: application.tags,
          deleted: false
        }))
      );
      if (error) {
        console.error('Error importing applications:', error);
        break;
      }
      inserted += chunk.length;
    }

    await fetchApplications();
    return { inserted, failed: newApplications.length - inserted };
  };

  // Throws on failure; callers are responsible for showing feedback to the user.
  const updateApplication = async (id: string, updates: Partial<JobApplication>) => {
    const { error } = await supabase
      .from('job_applications')
      .update({
        ...(updates.status && { status: updates.status }),
        ...(updates.jobDescription && { job_description: updates.jobDescription }),
        ...(updates.companyName && { company_name: updates.companyName }),
        ...(updates.roleDescription && { role_description: updates.roleDescription }),
        ...(updates.salary && { salary: updates.salary }),
        ...(updates.workMode && { work_mode: updates.workMode }),
        ...(updates.applicationDate && { application_date: updates.applicationDate }),
        ...(updates.tags && { tags: updates.tags }),
      })
      .eq('id', id)
      .eq('deleted', false);

    if (error) throw error;

    setApplications(prev => 
      prev.map(app => 
        app.id === id ? { ...app, ...updates } : app
      )
    );
  };

  const updateApplicationStatus = async (id: string, status: JobStatus) => {
    await updateApplication(id, { status });
  };

  // Throws on failure; callers are responsible for showing feedback to the user.
  const deleteApplication = async (id: string) => {
    const { error } = await supabase
      .from('job_applications')
      .update({ deleted: true })
      .eq('id', id);

    if (error) throw error;

    setApplications(prev => prev.filter(app => app.id !== id));
  };

  useEffect(() => {
    fetchApplications();
  }, [user]);

  // Set up real-time subscription for job applications only if user exists
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('job-applications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'job_applications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Job application change:', payload);
          // Refetch applications when there's a change
          fetchApplications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    applications,
    loading,
    error,
    addApplication,
    importApplications,
    updateApplication,
    updateApplicationStatus,
    deleteApplication,
    refetch: fetchApplications
  };
};
