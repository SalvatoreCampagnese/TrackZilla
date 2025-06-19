
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ImportProcessor } from '@/components/import/ImportProcessor';

const ImportPage = () => {
  const { loading } = useAuth();

  // Show loading while checking auth status
  if (loading) {
    return <LoadingSpinner text="Processing..." />;
  }

  return <ImportProcessor />;
};

export default ImportPage;
