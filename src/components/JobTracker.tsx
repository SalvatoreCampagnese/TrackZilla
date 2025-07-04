
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
import { Plus, Target, TrendingUp, Clock, CheckCircle, List, Columns } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 sm:h-32 sm:w-32 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-white text-sm sm:text-base">Loading applications...</p>
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex w-full">
        <AppSidebar 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSettingsClick={handleSettingsClick}
        />
        
        <main className="flex-1 flex flex-col min-w-0">
          {/* Sticky Header */}
          <header className="sticky top-0 z-10 flex items-center justify-between p-4 lg:p-6 border-b border-white/20 bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-white hover:bg-white/10 h-8 w-8" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">TrackZilla</h1>
              </div>
            </div>
            
            <Button 
              onClick={handleAddApplication}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200 text-white shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Application
            </Button>
          </header>

          <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-full">
            {/* Applications counter and filters */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full lg:w-auto">
                <div className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
                  <Target className="w-5 h-5 text-red-500" />
                  <span className="text-sm text-white/70">
                    {applications.length} total applications
                  </span>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-white/70">
                    {inProgressApplications} in progress
                  </span>
                </div>
              </div>

              {/* Filters and View Mode Switcher - Only show on applications tab */}
              {activeTab === 'applications' && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
                  {/* Status Filter */}
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px] border-white/20 bg-white/10 hover:bg-white/20 text-white">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-white/20">
                      <SelectItem value="all" className="text-white hover:bg-white/10">All Applications</SelectItem>
                      {uniqueStatuses.map((status) => (
                        <SelectItem key={status} value={status} className="text-white hover:bg-white/10">
                          {status === 'in-corso' ? 'In Progress' :
                           status === 'primo-colloquio' ? 'First Interview' :
                           status === 'secondo-colloquio' ? 'Second Interview' :
                           status === 'colloquio-tecnico' ? 'Technical Interview' :
                           status === 'colloquio-finale' ? 'Final Interview' :
                           status === 'offerta-ricevuta' ? 'Offer Received' :
                           status === 'rifiutato' ? 'Rejected' :
                           status === 'ghosting' ? 'Ghosting' :
                           status === 'ritirato' ? 'Withdrawn' : status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* View Mode Switcher */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                      onClick={() => setViewMode('list')}
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      className={viewMode === 'list' 
                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                        : 'border-white/20 bg-white/10 hover:bg-white/20 text-white'
                      }
                    >
                      <List className="w-4 h-4 mr-2" />
                      List
                    </Button>
                    <Button
                      onClick={() => setViewMode('kanban')}
                      variant={viewMode === 'kanban' ? 'default' : 'outline'}
                      size="sm"
                      className={viewMode === 'kanban' 
                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                        : 'border-white/20 bg-white/10 hover:bg-white/20 text-white'
                      }
                    >
                      <Columns className="w-4 h-4 mr-2" />
                      Kanban
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick counters - Only show on applications tab */}
            {activeTab === 'applications' && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-lg">
                  <CardContent className="flex items-center justify-between p-3 sm:p-4 lg:p-6">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-white/70 mb-1">Total</p>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{totalApplications}</p>
                    </div>
                    <div className="p-2 sm:p-3 bg-white/10 rounded-xl">
                      <Target className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-lg">
                  <CardContent className="flex items-center justify-between p-3 sm:p-4 lg:p-6">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-white/70 mb-1">Response Rate</p>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-400">{responseRate.toFixed(1)}%</p>
                    </div>
                    <div className="p-2 sm:p-3 bg-white/10 rounded-xl">
                      <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-lg">
                  <CardContent className="flex items-center justify-between p-3 sm:p-4 lg:p-6">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-white/70 mb-1">Interviews</p>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-400">{interviewsObtained}</p>
                    </div>
                    <div className="p-2 sm:p-3 bg-white/10 rounded-xl">
                      <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-purple-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-lg">
                  <CardContent className="flex items-center justify-between p-3 sm:p-4 lg:p-6">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-white/70 mb-1">Avg Time</p>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-400">{avgFeedbackTime}d</p>
                    </div>
                    <div className="p-2 sm:p-3 bg-white/10 rounded-xl">
                      <Clock className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-orange-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>
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
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
