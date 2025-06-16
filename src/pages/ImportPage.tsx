
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const ImportPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (loading) return;
    
    const description = searchParams.get('description');
    
    // If description is empty, redirect to home
    if (!description || description.trim() === '') {
      navigate('/');
      return;
    }
    
    // If user is not logged in, redirect to home (they'll see auth page)
    if (!user) {
      navigate('/');
      return;
    }
    
    // If user is logged in and has description, redirect to add-job with description
    navigate(`/add-job?description=${encodeURIComponent(description.trim())}`);
  }, [loading, user, searchParams, navigate]);

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-white">Processing...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default ImportPage;
