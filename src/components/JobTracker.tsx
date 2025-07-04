
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useJobApplications } from '@/hooks/useJobApplications';
import { useGhostingUpdater } from '@/hooks/useGhostingUpdater';
import { JobList } from './JobList';
import { Statistics } from './Statistics';
import { KanbanBoard } from './kanban/KanbanBoard';
import { AppSidebar } from './AppSidebar';
import { SettingsContent } from './SettingsContent';
import ProPage from '@/pages/ProPage';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { ApplicationsCounter } from './dashboard/ApplicationsCounter';
import { QuickStats } from './dashboard/QuickStats';
import { FilterControls } from './dashboard/FilterControls';

export const JobTracker = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { applications, loading, updateApplicationStatus, deleteApplication, refetch } = useJobApplications();
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [activeTab, setActiveTab] = useState('applications');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Initialize the ghosting updater
  useGhostingUpdater();

  const handleUpdateStatus = async (id: string, status: any) => {
    await updateApplicationStatus(id, status);
    await refetch();
  };

  const handleAddApplication = () => {
    navigate('/add-job');
  };

  const handleSettingsClick = () => {
    setActiveTab('settings');
  };

  const handleProClick = () => {
    setActiveTab('pro');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-200 border-t-purple-500 mx-auto"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 animate-pulse"></div>
          </div>
          <p className="mt-6 text-white text-lg font-medium">Loading applications...</p>
          <div className="mt-2 flex items-center justify-center gap-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  // Filter applications based on status
  const filteredApplications = statusFilter === 'all' 
    ? applications 
    : applications.filter(app => app.status === statusFilter);

  // Calculations for quick counters
  const totalApplications = filteredApplications.length;
  const responsesReceived = filteredApplications.filter(app => 
    !['in-corso', 'ghosting'].includes(app.status)
  ).length;
  const responseRate = totalApplications > 0 ? (responsesReceived / totalApplications * 100) : 0;
  const interviewsObtained = filteredApplications.filter(app => 
    ['primo-colloquio', 'secondo-colloquio', 'colloquio-tecnico', 'colloquio-finale', 'offerta-ricevuta'].includes(app.status)
  ).length;
  const avgFeedbackTime = filteredApplications.length > 0 
    ? Math.round(filteredApplications.reduce((acc, app) => {
        const daysSinceApplication = Math.floor((new Date().getTime() - new Date(app.applicationDate).getTime()) / (1000 * 60 * 60 * 24));
        return acc + daysSinceApplication;
      }, 0) / filteredApplications.length)
    : 0;

  // Calculate applications in progress (excluding ghosting, retired, and refused)
  const inProgressApplications = filteredApplications.filter(app => 
    !['ghosting', 'ritirato', 'rifiutato'].includes(app.status)
  ).length;

  // Get unique statuses for filter dropdown
  const uniqueStatuses = [...new Set(applications.map(app => app.status))];

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex w-full relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        <AppSidebar 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSettingsClick={handleSettingsClick}
          onProClick={handleProClick}
        />
        
        <main className="flex-1 flex flex-col min-w-0 relative z-10">
          {/* Mobile Sidebar Trigger - Always visible on mobile */}
          <div className="md:hidden fixed top-4 left-4 z-30">
            <SidebarTrigger className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 h-10 w-10 rounded-xl transition-all duration-200 hover:scale-105" />
          </div>

          <DashboardHeader 
            activeTab={activeTab}
            onAddApplication={handleAddApplication}
          />

          <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-full space-y-6 sm:space-y-8">
            {/* Enhanced Applications counter */}
            {activeTab === 'applications' && (
              <ApplicationsCounter 
                totalApplications={applications.length}
                inProgressApplications={inProgressApplications}
              />
            )}

            {/* Enhanced Quick counters */}
            {activeTab === 'applications' && (
              <QuickStats 
                totalApplications={totalApplications}
                responseRate={responseRate}
                interviewsObtained={interviewsObtained}
                avgFeedbackTime={avgFeedbackTime}
              />
            )}

            {/* Enhanced Filters and View Mode Switcher */}
            {activeTab === 'applications' && (
              <FilterControls 
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                uniqueStatuses={uniqueStatuses}
              />
            )}

            {/* Content based on active tab */}
            {activeTab === 'applications' && (
              <div className="overflow-hidden">
                {viewMode === 'list' ? (
                  <JobList
                    applications={filteredApplications}
                    onUpdateStatus={handleUpdateStatus}
                    onDelete={deleteApplication}
                  />
                ) : (
                  <KanbanBoard
                    applications={filteredApplications}
                    onUpdateStatus={handleUpdateStatus}
                    onDelete={deleteApplication}
                  />
                )}
              </div>
            )}
            
            {activeTab === 'statistics' && (
              <Statistics applications={applications} />
            )}
            
            {activeTab === 'settings' && (
              <SettingsContent />
            )}

            {activeTab === 'pro' && (
              <ProPage />
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
