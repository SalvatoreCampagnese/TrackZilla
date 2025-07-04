
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useJobApplications } from '@/hooks/useJobApplications';
import { AddJobForm } from '@/components/AddJobForm';
import { JobApplication } from '@/types/job';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AddJobPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addApplication } = useJobApplications();
  
  // Get description from URL params if available
  const initialDescription = searchParams.get('description') || '';

  const handleAddApplication = async (applicationData: JobApplication) => {
    await addApplication(applicationData);
    navigate('/'); // Navigate back to main page after adding
  };

  const handleCancel = () => {
    navigate('/'); // Navigate back to main page on cancel
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Mobile-friendly header */}
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 sm:p-6 border-b border-white/20 bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Button
            onClick={handleCancel}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 h-8 w-8 sm:h-10 sm:w-10"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Add New Application</h1>
            <p className="text-xs sm:text-sm text-white/70 hidden sm:block">Track your job applications effortlessly</p>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-4xl">
        {/* Add Form - Mobile optimized */}
        <AddJobForm
          open={true}
          onAdd={handleAddApplication}
          onCancel={handleCancel}
          initialDescription={initialDescription}
        />
      </div>
    </div>
  );
};

export default AddJobPage;
