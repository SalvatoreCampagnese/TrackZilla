
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobApplications } from '@/hooks/useJobApplications';
import { AddJobForm } from '@/components/AddJobForm';
import { JobApplication } from '@/types/job';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AddJobPage = () => {
  const navigate = useNavigate();
  const { addApplication } = useJobApplications();

  const handleAddApplication = async (applicationData: JobApplication) => {
    await addApplication(applicationData);
    navigate('/'); // Navigate back to main page after adding
  };

  const handleCancel = () => {
    navigate('/'); // Navigate back to main page on cancel
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-6">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-white/20 bg-white/10 hover:bg-white/20 hover:border-white/30 text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-lg">
                <img src="/lovable-uploads/95407aee-75ac-4d31-a281-db4fc0472751.png" alt="TrackZilla Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Add New Application</h1>
                <p className="text-sm text-white/70">Track your job application progress</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Form - always open as a page */}
        <AddJobForm
          open={true}
          onAdd={handleAddApplication}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default AddJobPage;
