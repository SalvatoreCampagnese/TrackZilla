
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useJobApplications } from '@/hooks/useJobApplications';
import { AddJobForm } from '@/components/AddJobForm';
import { AddJobHeader } from '@/components/addJob/AddJobHeader';
import { JobApplication } from '@/types/job';

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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <AddJobHeader />
        
        {/* Add Form - always open as a page */}
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
