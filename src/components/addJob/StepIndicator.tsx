
import React from 'react';
import { useTranslation } from 'react-i18next';

interface StepIndicatorProps {
  currentStep: 'extract' | 'details';
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
        currentStep === 'extract' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
      }`}>
        1
      </div>
      <span className={`text-sm ${
        currentStep === 'extract' ? 'text-red-600 font-medium' : 'text-green-600'
      }`}>
        {t('addJob.stepExtraction')}
      </span>
      <div className="w-8 h-0.5 bg-white/20"></div>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
        currentStep === 'details' ? 'bg-red-600 text-white' : 'bg-white/20 text-white/60'
      }`}>
        2
      </div>
      <span className={`text-sm ${
        currentStep === 'details' ? 'text-red-600 font-medium' : 'text-white/60'
      }`}>
        {t('addJob.stepDetails')}
      </span>
    </div>
  );
};
