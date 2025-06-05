
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useJobApplications } from '@/hooks/useJobApplications';
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
  const { applications, loading, addApplication, updateApplicationStatus, deleteApplication } = useJobApplications();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleAddApplication = async (applicationData: any) => {
    await addApplication(applicationData);
    setShowAddForm(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-white">Caricamento candidature...</p>
        </div>
      </div>
    );
  }

  // Calcoli per i counter rapidi
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-blue-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 dark:bg-blue-500 rounded-xl">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Job Tracker</h1>
                <p className="text-gray-600 dark:text-gray-200">Benvenuto, {user?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => setShowSettings(true)}
                variant="outline"
                size="icon"
                className="border-gray-300 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
              >
                <Settings className="w-4 h-4" />
              </Button>
              
              <Button 
                onClick={handleSignOut}
                variant="outline"
                className="flex items-center gap-2 border-gray-300 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
              >
                <LogOut className="w-4 h-4" />
                Esci
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-gray-600 dark:text-gray-200">
                  {applications.length} candidature totali
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-200">
                  {applications.filter(app => app.status === 'in-corso').length} in corso
                </span>
              </div>
            </div>
            
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Aggiungi Candidatura
            </Button>
          </div>

          {/* Counter rapidi */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white dark:bg-blue-900/50 border-gray-200 dark:border-blue-800">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-200">Totali</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalApplications}</p>
                </div>
                <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-blue-900/50 border-gray-200 dark:border-blue-800">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-200">Tasso Risposta</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{responseRate.toFixed(1)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-blue-900/50 border-gray-200 dark:border-blue-800">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-200">Colloqui</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{interviewsObtained}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-blue-900/50 border-gray-200 dark:border-blue-800">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-200">Tempo Medio</p>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{avgFeedbackTime}g</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-blue-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border dark:border-blue-800">
              <AddJobForm
                onAdd={handleAddApplication}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          </div>
        )}

        {/* Settings Modal */}
        <SettingsModal 
          open={showSettings} 
          onOpenChange={setShowSettings} 
        />

        {/* Tabs */}
        <Tabs defaultValue="applications" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-blue-900/50">
            <TabsTrigger value="applications" className="dark:text-white dark:data-[state=active]:bg-blue-800 dark:data-[state=active]:text-white">Candidature</TabsTrigger>
            <TabsTrigger value="statistics" className="dark:text-white dark:data-[state=active]:bg-blue-800 dark:data-[state=active]:text-white">Statistiche</TabsTrigger>
          </TabsList>
          
          <TabsContent value="applications" className="mt-6">
            <JobList
              applications={applications}
              onUpdateStatus={updateApplicationStatus}
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
