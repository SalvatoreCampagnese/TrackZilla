
import React, { useState } from 'react';
import { JobApplication } from '@/types/job';
import { AddJobForm } from './AddJobForm';
import { JobList } from './JobList';
import { Statistics } from './Statistics';
import { Briefcase, Plus, Target, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

export const JobTracker = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddApplication = (application: JobApplication) => {
    setApplications(prev => [application, ...prev]);
    setShowAddForm(false);
  };

  const handleUpdateStatus = (id: string, status: JobApplication['status']) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === id ? { ...app, status } : app
      )
    );
  };

  const handleDeleteApplication = (id: string) => {
    setApplications(prev => prev.filter(app => app.id !== id));
  };

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
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Job Tracker</h1>
              <p className="text-gray-600">Traccia le tue candidature lavorative</p>
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

        {/* Tabs */}
        <Tabs defaultValue="applications" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="applications">Candidature</TabsTrigger>
            <TabsTrigger value="statistics">Statistiche</TabsTrigger>
          </TabsList>
          
          <TabsContent value="applications" className="mt-6">
            <JobList
              applications={applications}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDeleteApplication}
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
