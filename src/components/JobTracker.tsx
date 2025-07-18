
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useJobApplications } from '@/hooks/useJobApplications';
import { useSubscription } from '@/hooks/useSubscription';
import { JobApplication, JobStatus } from '@/types/job';
import { JobList } from './JobList';
import { Statistics } from './Statistics';
import { SubscriptionContent } from './SubscriptionContent';
import { KanbanBoard } from './KanbanBoard';
import { AppSidebar } from './AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { FilterControls } from './dashboard/FilterControls';
import { QuickStats } from './dashboard/QuickStats';
import { SettingsModal } from './SettingsModal';
import { AddApplicationModal } from './AddApplicationModal';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import ProPage from '@/pages/ProPage';

export const JobTracker = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { subscribed } = useSubscription();
  
  const [activeTab, setActiveTab] = useState<string>('applications');
  const [showSettings, setShowSettings] = useState(false);
  const [showAddApplication, setShowAddApplication] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'kanban'>('list');
  const [sortBy, setSortBy] = useState<'date' | 'company' | 'status'>('date');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const {
    applications,
    loading,
    addApplication,
    updateApplicationStatus,
    deleteApplication,
    refetch
  } = useJobApplications();

  const handleUpdateStatus = async (id: string, status: JobStatus) => {
    try {
      await updateApplicationStatus(id, status);
      toast({
        title: t('applications.applicationAdded'),
        description: t('applications.applicationAddedDescription'),
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: t('common.error'),
        description: t('applications.errorAddingApplication'),
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteApplication(id);
      toast({
        title: t('deleteConfirmation.applicationDeleted'),
        description: t('deleteConfirmation.applicationDeletedDescription'),
      });
    } catch (error) {
      console.error('Error deleting application:', error);
      toast({
        title: t('common.error'),
        description: t('deleteConfirmation.errorDeletingApplication'),
        variant: "destructive",
      });
    }
  };

  const handleProClick = () => {
    setActiveTab('pro');
  };

  const handleAddApplication = () => {
    // Check if user has reached the 50 application limit for free users
    if (!subscribed && applications.length >= 50) {
      toast({
        title: t('applications.applicationLimit'),
        description: t('applications.applicationLimitMessage'),
        variant: "destructive",
      });
      handleProClick();
      return;
    }
    setShowAddApplication(true);
  };

  // Check if add button should be disabled
  const canAddApplication = subscribed || applications.length < 50;

  // Filter and sort applications
  const filteredApplications = applications.filter(app => {
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.roleDescription.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    switch (sortBy) {
      case 'company':
        return a.companyName.localeCompare(b.companyName);
      case 'status':
        return a.status.localeCompare(b.status);
      case 'date':
      default:
        return new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime();
    }
  });

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-white">{t('auth.loginRequired')}</div>
    </div>;
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-white">{t('common.loading')}</div>
    </div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <AppSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSettingsClick={() => setShowSettings(true)}
          onProClick={handleProClick}
        />
        
        <SidebarInset className="flex-1 min-w-0">
          <div className="flex flex-col h-full">
            <DashboardHeader 
              activeTab={activeTab}
              onAddApplication={handleAddApplication}
              onProClick={handleProClick}
              canAddApplication={canAddApplication}
            />
            
            <div className="flex-1 p-2 sm:p-3 md:p-4 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6 overflow-auto">
              {activeTab === 'applications' && (
                <>
                  <div className="w-full">
                    <QuickStats applications={applications} />
                  </div>
                  
                  <div className="w-full">
                    <FilterControls
                      viewMode={viewMode}
                      onViewModeChange={setViewMode}
                      sortBy={sortBy}
                      onSortByChange={setSortBy}
                      filterStatus={filterStatus}
                      onFilterStatusChange={setFilterStatus}
                      searchTerm={searchTerm}
                      onSearchTermChange={setSearchTerm}
                      onProClick={handleProClick}
                    />
                  </div>

                  <div className="w-full">
                    {viewMode === 'kanban' ? (
                      <KanbanBoard
                        applications={sortedApplications}
                        onUpdateStatus={handleUpdateStatus}
                        onDelete={handleDelete}
                      />
                    ) : (
                      <JobList
                        applications={sortedApplications}
                        onUpdateStatus={handleUpdateStatus}
                        onDelete={handleDelete}
                        viewMode={viewMode}
                      />
                    )}
                  </div>
                </>
              )}

              {activeTab === 'statistics' && (
                <div className="w-full">
                  <Statistics applications={applications} />
                </div>
              )}

              {activeTab === 'subscription' && (
                <div className="w-full">
                  <SubscriptionContent />
                </div>
              )}

              {activeTab === 'pro' && (
                <div className="w-full">
                  <ProPage />
                </div>
              )}
            </div>
          </div>
        </SidebarInset>

        <SettingsModal 
          open={showSettings} 
          onOpenChange={setShowSettings}
        />

        <AddApplicationModal
          open={showAddApplication}
          onOpenChange={setShowAddApplication}
          onAddApplication={addApplication}
        />
      </div>
    </SidebarProvider>
  );
};
