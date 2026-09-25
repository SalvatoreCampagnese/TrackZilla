
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface JobExtractionStepProps {
  jobDescription: string;
  setJobDescription: (value: string) => void;
  applicationDate: string;
  setApplicationDate: (value: string) => void;
}

export const JobExtractionStep: React.FC<JobExtractionStepProps> = ({
  jobDescription,
  setJobDescription,
  applicationDate,
  setApplicationDate
}) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <Label htmlFor="jobDescription" className="text-white font-medium text-sm sm:text-base">{t('addJob.jobDescription')} *</Label>
        <Textarea
          id="jobDescription"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder={t('addJob.jobDescriptionPlaceholder')}
          className="mt-2 min-h-[200px] sm:min-h-[300px] !bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/50 resize-none focus-visible:ring-red-500 focus-visible:border-red-500 text-sm sm:text-base"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          required
        />
        <p className="text-xs sm:text-sm text-white/70 mt-2">
          {t('addJob.jobDescriptionHint')}
        </p>
      </div>

      <div>
        <Label htmlFor="applicationDate" className="text-white font-medium text-sm sm:text-base">{t('addJob.applicationDate')}</Label>
        <div className="relative w-full mt-2">
          <Input
            id="applicationDate"
            type="date"
            value={applicationDate}
            onChange={(e) => setApplicationDate(e.target.value)}
            className="!bg-white/10 backdrop-blur-md border-white/20 text-white pr-10 w-full [&::-webkit-calendar-picker-indicator]:opacity-0 focus-visible:ring-red-500 focus-visible:border-red-500 text-sm sm:text-base h-10 sm:h-11"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            required
          />
          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
