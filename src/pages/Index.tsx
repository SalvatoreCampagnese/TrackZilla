
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthPage } from '@/components/AuthPage';
import { JobTracker } from '@/components/JobTracker';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return user ? <JobTracker /> : <AuthPage />;
};

export default Index;
