import { useTranslation } from 'react-i18next';
import { JobStatus } from '@/types/job';

export const useTranslatedLabels = () => {
  const { t } = useTranslation();

  const getJobStatusLabel = (status: JobStatus): string => {
    return t(`jobStatus.${status}`);
  };

  const getWorkModeLabel = (workMode: string): string => {
    return t(`workMode.${workMode}`);
  };

  const jobStatusOptions = [
    { value: 'in-corso', label: t('jobStatus.in-corso') },
    { value: 'ghosting', label: t('jobStatus.ghosting') },
    { value: 'primo-colloquio', label: t('jobStatus.primo-colloquio') },
    { value: 'secondo-colloquio', label: t('jobStatus.secondo-colloquio') },
    { value: 'colloquio-tecnico', label: t('jobStatus.colloquio-tecnico') },
    { value: 'colloquio-finale', label: t('jobStatus.colloquio-finale') },
    { value: 'offerta-ricevuta', label: t('jobStatus.offerta-ricevuta') },
    { value: 'rifiutato', label: t('jobStatus.rifiutato') },
    { value: 'ritirato', label: t('jobStatus.ritirato') },
  ];

  const workModeOptions = [
    { value: 'remoto', label: t('workMode.remoto') },
    { value: 'ibrido', label: t('workMode.ibrido') },
    { value: 'in-presenza', label: t('workMode.in-presenza') },
    { value: 'ND', label: t('workMode.ND') },
  ];

  return {
    getJobStatusLabel,
    getWorkModeLabel,
    jobStatusOptions,
    workModeOptions,
  };
};