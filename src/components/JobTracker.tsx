
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useJobApplications } from '@/hooks/useJobApplications';
import { useGhostingUpdater } from '@/hooks/useGhostingUpdater';
import { AddJobForm } from './AddJobForm';
import { JobList } from './JobList';
import { Statistics } from './Statistics';
import { SettingsModal } from './SettingsModal';
import { Briefcase, Plus, Target, TrendingUp, Clock, CheckCircle, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

export const JobTracker = () => {
  const { user, signOut } = useAuth();
  const { applications, loading, addApplication, updateApplicationStatus, deleteApplication, refetch } = useJobApplications();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Initialize the ghosting updater
  useGhostingUpdater();

  const handleAddApplication = async (applicationData: any) => {
    await addApplication(applicationData);
    setShowAddForm(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleUpdateStatus = async (id: string, status: any) => {
    await updateApplicationStatus(id, status);
    // Refetch applications to ensure UI is updated
    await refetch();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-background dark:to-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 sm:h-32 sm:w-32 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-foreground text-sm sm:text-base">Loading applications...</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-background dark:to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-blue-600 dark:bg-blue-500 rounded-xl">
                <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-foreground">TrackZilla</h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-muted-foreground">Welcome back, {user?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button 
                onClick={() => setShowSettings(true)}
                variant="outline"
                size="icon"
                className="border-gray-300 dark:border-border dark:text-foreground dark:hover:bg-accent flex-shrink-0"
              >
                <Settings className="w-4 h-4" />
              </Button>
              
              <Button 
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-gray-300 dark:border-border dark:text-foreground dark:hover:bg-accent text-xs sm:text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden xs:inline">Sign Out</span>
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-xs sm:text-sm text-gray-600 dark:text-muted-foreground">
                  {applications.length} total applications
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs sm:text-sm text-gray-600 dark:text-muted-foreground">
                  {applications.filter(app => app.status === 'in-corso').length} in progress
                </span>
              </div>
            </div>
            
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors text-white w-full sm:w-auto text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span className="sm:hidden">Add</span>
              <span className="hidden sm:inline">Add Application</span>
            </Button>
          </div>

          {/* Quick counters */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Card className="bg-white dark:bg-card border-gray-200 dark:border-border">
              <CardContent className="flex items-center justify-between p-3 sm:p-4">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-muted-foreground">Total</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-foreground">{totalApplications}</p>
                </div>
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-card border-gray-200 dark:border-border">
              <CardContent className="flex items-center justify-between p-3 sm:p-4">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-muted-foreground">Response Rate</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400">{responseRate.toFixed(1)}%</p>
                </div>
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400" />
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-card border-gray-200 dark:border-border">
              <CardContent className="flex items-center justify-between p-3 sm:p-4">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-muted-foreground">Interviews</p>
                  <p className="text-lg sm:text-2xl font-bold text-purple-600 dark:text-purple-400">{interviewsObtained}</p>
                </div>
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400" />
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-card border-gray-200 dark:border-border">
              <CardContent className="flex items-center justify-between p-3 sm:p-4">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-muted-foreground">Avg Time</p>
                  <p className="text-lg sm:text-2xl font-bold text-orange-600 dark:text-orange-400">{avgFeedbackTime}d</p>
                </div>
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 dark:text-orange-400" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Form Modal */}
        <AddJobForm
          open={showAddForm}
          onAdd={handleAddApplication}
          onCancel={() => setShowAddForm(false)}
        />

        {/* Settings Modal */}
        <SettingsModal 
          open={showSettings} 
          onOpenChange={setShowSettings} 
        />

        {/* Tabs */}
        <Tabs defaultValue="applications" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-muted h-9 sm:h-10">
            <TabsTrigger value="applications" className="dark:text-muted-foreground dark:data-[state=active]:bg-background dark:data-[state=active]:text-foreground text-xs sm:text-sm">
              <span className="sm:hidden">Applications</span>
              <span className="hidden sm:inline">Applications</span>
            </TabsTrigger>
            <TabsTrigger value="statistics" className="dark:text-muted-foreground dark:data-[state=active]:bg-background dark:data-[state=active]:text-foreground text-xs sm:text-sm">
              <span className="sm:hidden">Stats</span>
              <span className="hidden sm:inline">Statistics</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="applications" className="mt-4 sm:mt-6">
            <JobList
              applications={applications}
              onUpdateStatus={handleUpdateStatus}
              onDelete={deleteApplication}
            />
          </TabsContent>
          
          <TabsContent value="statistics" className="mt-4 sm:mt-6">
            <Statistics applications={applications} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
