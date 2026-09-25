
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ImportProcessor } from '@/components/import/ImportProcessor';
import { useTranslation } from 'react-i18next';

const ImportPage = () => {
  const { t } = useTranslation();
  const { loading } = useAuth();

  // Show loading while checking auth status
  if (loading) {
    return <LoadingSpinner text={t('importPage.processing')} />;
  }

  return <ImportProcessor />;
};

export default ImportPage;
