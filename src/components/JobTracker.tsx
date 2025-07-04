
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useJobApplications } from '@/hooks/useJobApplications';
import { useGhostingUpdater } from '@/hooks/useGhostingUpdater';
import { JobList } from './JobList';
import { Statistics } from './Statistics';
import { KanbanBoard } from './kanban/KanbanBoard';
import { SettingsModal } from './SettingsModal';
import { DateTimeDisplay } from './dashboard/DateTimeDisplay';
import { AppSidebar } from './AppSidebar';
import { Plus, Target, TrendingUp, Clock, CheckCircle, List, Columns } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export const JobTracker = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { applications, loading, updateApplicationStatus, deleteApplication, refetch } = useJobApplications();
  const [showSettings, setShowSettings] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [activeTab, setActiveTab] = useState('applications');

  // Initialize the ghosting updater
  useGhostingUpdater();

  // Get user's first name from localStorage
  const getUserDisplayName = () => {
    try {
      const userProfile = localStorage.getItem('userProfile');
      if (userProfile) {
        const profile = JSON.parse(userProfile);
        if (profile.firstName) {
          return profile.firstName;
        }
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
    }
    return user?.email;
  };

  const handleUpdateStatus = async (id: string, status: any) => {
    await updateApplicationStatus(id, status);
    // Refetch applications to ensure UI is updated
    await refetch();
  };

  const handleAddApplication = () => {
    navigate('/add-job');
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

  // Calculations for quick counters
  const totalApplications = applications.length;
  const responsesReceived = applications.filter(app => 
    !['in-corso', 'ghosting'].includes(app.status)
  ).length;
  const responseRate = totalApplications > 0 ? (responsesReceived / totalApplications * 100) : 0;
  const interviewsObtained = applications.filter(app => 
    ['primo-colloquio', 'secondo-colloquio', 'colloquio-tecnico', 'colloquio-finale', 'offerta-ricevuta'].includes(app.status)
  ).length;
  const avgFeedbackTime = applications.length > 0 
    ? Math.round(applications.reduce((acc, app) => {
        const daysSinceApplication = Math.floor((new Date().getTime() - new Date(app.applicationDate).getTime()) / (1000 * 60 * 60 * 24));
        return acc + daysSinceApplication;
      }, 0) / applications.length)
    : 0;

  // Calculate applications in progress (excluding ghosting, retired, and refused)
  const inProgressApplications = applications.filter(app => 
    !['ghosting', 'ritirato', 'rifiutato'].includes(app.status)
  ).length;

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex w-full">
        <AppSidebar 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSettingsClick={() => setShowSettings(true)}
        />
        
        <main className="flex-1 flex flex-col">
          {/* Header with trigger */}
          <header className="flex items-center justify-between p-4 border-b border-white/20">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-white hover:bg-white/10" />
              <div>
                <h1 className="text-2xl font-bold text-white">TrackZilla</h1>
                <p className="text-sm text-white/70">Welcome back, {getUserDisplayName()}</p>
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

          <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            {/* Date and Time Display */}
            <div className="mb-6">
              <DateTimeDisplay />
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
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
            </div>

            {/* Quick counters */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-lg">
                <CardContent className="flex items-center justify-between p-4 sm:p-6">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-white/70 mb-1">Total</p>
                    <p className="text-2xl sm:text-3xl font-bold text-white">{totalApplications}</p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-xl">
                    <Target className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-lg">
                <CardContent className="flex items-center justify-between p-4 sm:p-6">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-white/70 mb-1">Response Rate</p>
                    <p className="text-2xl sm:text-3xl font-bold text-green-400">{responseRate.toFixed(1)}%</p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-xl">
                    <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-lg">
                <CardContent className="flex items-center justify-between p-4 sm:p-6">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-white/70 mb-1">Interviews</p>
                    <p className="text-2xl sm:text-3xl font-bold text-purple-400">{interviewsObtained}</p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-xl">
                    <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-lg">
                <CardContent className="flex items-center justify-between p-4 sm:p-6">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-white/70 mb-1">Avg Time</p>
                    <p className="text-2xl sm:text-3xl font-bold text-orange-400">{avgFeedbackTime}d</p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-xl">
                    <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Settings Modal */}
            <SettingsModal 
              open={showSettings} 
              onOpenChange={setShowSettings} 
            />

            {/* Content based on active tab */}
            {activeTab === 'applications' && (
              <div>
                {/* View Mode Switcher */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
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

                {/* Conditional View Rendering */}
                {viewMode === 'list' ? (
                  <JobList
                    applications={applications}
                    onUpdateStatus={handleUpdateStatus}
                    onDelete={deleteApplication}
                  />
                ) : (
                  <KanbanBoard
                    applications={applications}
                    onUpdateStatus={handleUpdateStatus}
                    onDelete={deleteApplication}
                  />
                )}
              </div>
            )}
            
            {activeTab === 'statistics' && (
              <Statistics applications={applications} />
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
