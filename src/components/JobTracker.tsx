
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useJobApplications } from '@/hooks/useJobApplications';
import { useSubscription } from '@/hooks/useSubscription';
import { JobApplication } from '@/types/job';
import { JobList } from './JobList';
import { Statistics } from './Statistics';
import { AppSidebar } from './AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { FilterControls } from './dashboard/FilterControls';
import { QuickStats } from './dashboard/QuickStats';
import { SettingsModal } from './SettingsModal';
import { AddApplicationModal } from './AddApplicationModal';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const JobTracker = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { subscribed } = useSubscription();
  
  const [activeTab, setActiveTab] = useState<string>('applications');
  const [showSettings, setShowSettings] = useState(false);
  const [showAddApplication, setShowAddApplication] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortBy, setSortBy] = useState<'date' | 'company' | 'status'>('date');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const {
    applications,
    loading,
    error,
    updateApplication,
    addApplication,
    deleteApplication,
    refetch
  } = useJobApplications();

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateApplication(id, { status });
      toast({
        title: "Status updated",
        description: "Application status has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update application status.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteApplication(id);
      toast({
        title: "Application deleted",
        description: "Job application has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting application:', error);
      toast({
        title: "Error",
        description: "Failed to delete application.",
        variant: "destructive",
      });
    }
  };

  const handleProClick = () => {
    navigate('/pro');
  };

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
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-white">Please log in to continue</div>
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
        
        <SidebarInset className="flex-1">
          <div className="flex flex-col h-full">
            <DashboardHeader 
              activeTab={activeTab}
              onAddApplication={() => setShowAddApplication(true)}
            />
            
            <div className="flex-1 p-4 lg:p-6 space-y-4 lg:space-y-6 overflow-auto">
              {activeTab === 'applications' && (
                <>
                  <QuickStats applications={applications} />
                  
                  <FilterControls
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    sortBy={sortBy}
                    onSortByChange={setSortBy}
                    filterStatus={filterStatus}
                    onFilterStatusChange={setFilterStatus}
                    searchTerm={searchTerm}
                    onSearchTermChange={setSearchTerm}
                  />

                  <JobList
                    applications={sortedApplications}
                    onUpdateStatus={handleUpdateStatus}
                    onDelete={handleDelete}
                  />
                </>
              )}

              {activeTab === 'statistics' && (
                <Statistics applications={applications} />
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
