
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useJobApplications } from '@/hooks/useJobApplications';
import { useGhostingUpdater } from '@/hooks/useGhostingUpdater';
import { JobList } from './JobList';
import { Statistics } from './Statistics';
import { KanbanBoard } from './kanban/KanbanBoard';
import { SettingsModal } from './SettingsModal';
import { Plus, Target, TrendingUp, Clock, CheckCircle, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

export const JobTracker = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { applications, loading, updateApplicationStatus, deleteApplication, refetch } = useJobApplications();
  const [showSettings, setShowSettings] = useState(false);

  // Initialize the ghosting updater
  useGhostingUpdater();

  const handleSignOut = async () => {
    await signOut();
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-lg">
                <img src="/lovable-uploads/95407aee-75ac-4d31-a281-db4fc0472751.png" alt="TrackZilla Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">TrackZilla</h1>
                <p className="text-sm sm:text-base text-white/70">Welcome back, {user?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button 
                onClick={() => setShowSettings(true)}
                variant="outline"
                size="icon"
                className="border-white/20 bg-white/10 hover:bg-white/20 hover:border-white/30 text-white flex-shrink-0"
              >
                <Settings className="w-4 h-4" />
              </Button>
              
              <Button 
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-white/20 bg-white/10 hover:bg-white/20 hover:border-white/30 text-white text-xs sm:text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden xs:inline">Sign Out</span>
              </Button>
            </div>
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
            
            <Button 
              onClick={handleAddApplication}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200 text-white w-full sm:w-auto text-sm shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span className="sm:hidden">Add</span>
              <span className="hidden sm:inline">Add Application</span>
            </Button>
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
        </div>

        {/* Settings Modal */}
        <SettingsModal 
          open={showSettings} 
          onOpenChange={setShowSettings} 
        />

        {/* Tabs */}
        <Tabs defaultValue="applications" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-md border border-white/20 h-12 rounded-xl shadow-lg">
            <TabsTrigger 
              value="applications" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white text-white/70 hover:text-white transition-all duration-200 text-sm font-medium rounded-lg"
            >
              <span className="sm:hidden">List</span>
              <span className="hidden sm:inline">Applications</span>
            </TabsTrigger>
            <TabsTrigger 
              value="kanban" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white text-white/70 hover:text-white transition-all duration-200 text-sm font-medium rounded-lg"
            >
              <span className="sm:hidden">Board</span>
              <span className="hidden sm:inline">Kanban</span>
            </TabsTrigger>
            <TabsTrigger 
              value="statistics" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white text-white/70 hover:text-white transition-all duration-200 text-sm font-medium rounded-lg"
            >
              <span className="sm:hidden">Stats</span>
              <span className="hidden sm:inline">Statistics</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="applications" className="mt-6">
            <JobList
              applications={applications}
              onUpdateStatus={handleUpdateStatus}
              onDelete={deleteApplication}
            />
          </TabsContent>
          
          <TabsContent value="kanban" className="mt-6">
            <KanbanBoard
              applications={applications}
              onUpdateStatus={handleUpdateStatus}
              onDelete={deleteApplication}
            />
          </TabsContent>
          
          <TabsContent value="statistics" className="mt-6">
            <Statistics applications={applications} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
