
import React, { useState } from 'react';
import { JobApplication } from '@/types/job';
import { AddJobForm } from './AddJobForm';
import { JobList } from './JobList';
import { Briefcase, Plus, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
          
          <div className="flex items-center justify-between">
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

        {/* Job List */}
        <JobList
          applications={applications}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDeleteApplication}
        />
      </div>
    </div>
  );
};
