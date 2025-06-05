
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento candidature...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-xl">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Job Tracker</h1>
                <p className="text-gray-600">Benvenuto, {user?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => setShowSettings(true)}
                variant="outline"
                size="icon"
              >
                <Settings className="w-4 h-4" />
              </Button>
              
              <Button 
                onClick={handleSignOut}
                variant="outline"
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Esci
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">
                  {applications.length} candidature totali
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  {applications.filter(app => app.status === 'in-corso').length} in corso
                </span>
              </div>
            </div>
            
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Aggiungi Candidatura
            </Button>
          </div>

          {/* Counter rapidi */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Totali</p>
                  <p className="text-2xl font-bold text-gray-900">{totalApplications}</p>
                </div>
                <Target className="w-8 h-8 text-blue-600" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tasso Risposta</p>
                  <p className="text-2xl font-bold text-green-600">{responseRate.toFixed(1)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Colloqui</p>
                  <p className="text-2xl font-bold text-purple-600">{interviewsObtained}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tempo Medio</p>
                  <p className="text-2xl font-bold text-orange-600">{avgFeedbackTime}g</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="applications">Candidature</TabsTrigger>
            <TabsTrigger value="statistics">Statistiche</TabsTrigger>
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
