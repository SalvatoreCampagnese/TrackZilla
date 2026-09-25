
import React from 'react';
import { JobStatus } from '@/types/job';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Wand2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTranslatedLabels } from '@/hooks/useTranslatedLabels';

interface JobDetailsFormProps {
  parsedData: {
    companyName: string;
    roleDescription: string;
    salary: string;
    workMode: 'remoto' | 'ibrido' | 'in-presenza' | 'ND';
  };
  setParsedData: React.Dispatch<React.SetStateAction<{
    companyName: string;
    roleDescription: string;
    salary: string;
    workMode: 'remoto' | 'ibrido' | 'in-presenza' | 'ND';
  }>>;
  status: JobStatus;
  setStatus: (status: JobStatus) => void;
}

export const JobDetailsForm: React.FC<JobDetailsFormProps> = ({
  parsedData,
  setParsedData,
  status,
  setStatus
}) => {
  const { t } = useTranslation();
  const { getJobStatusLabel, getWorkModeLabel } = useTranslatedLabels();
  return (
    <div className="space-y-4 p-3 sm:p-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 w-full">
      <h3 className="font-medium text-white flex items-center gap-2 text-sm sm:text-base">
        <Wand2 className="w-4 h-4" />
        {t('addJob.extractedDataEditable')}
      </h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="companyName" className="text-white font-medium text-sm sm:text-base">{t('addJob.companyName')} *</Label>
          <Input
            id="companyName"
            value={parsedData.companyName}
            onChange={(e) => setParsedData(prev => ({
              ...prev,
              companyName: e.target.value
            }))}
            className="mt-1 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/50 focus-visible:ring-red-500 focus-visible:border-red-500 text-sm sm:text-base h-10 sm:h-11"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="salary" className="text-white font-medium text-sm sm:text-base">{t('addJob.salary')}</Label>
            <Input
              id="salary"
              value={parsedData.salary}
              onChange={(e) => setParsedData(prev => ({
                ...prev,
                salary: e.target.value
              }))}
              className="mt-1 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/50 focus-visible:ring-red-500 focus-visible:border-red-500 text-sm sm:text-base h-10 sm:h-11"
              placeholder={t('addJob.salaryPlaceholder')}
            />
          </div>

          <div>
            <Label htmlFor="workMode" className="text-white font-medium text-sm sm:text-base">{t('addJob.workMode')}</Label>
            <select
              id="workMode"
              value={parsedData.workMode}
              onChange={(e) => setParsedData(prev => ({
                ...prev,
                workMode: e.target.value as 'remoto' | 'ibrido' | 'in-presenza' | 'ND'
              }))}
              className="mt-1 w-full px-3 py-2 sm:py-3 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white/10 backdrop-blur-md text-white text-sm sm:text-base h-10 sm:h-11"
            >
              <option value="ND" className="bg-gray-800 text-white">{getWorkModeLabel('ND')}</option>
              <option value="remoto" className="bg-gray-800 text-white">{getWorkModeLabel('remoto')}</option>
              <option value="ibrido" className="bg-gray-800 text-white">{getWorkModeLabel('ibrido')}</option>
              <option value="in-presenza" className="bg-gray-800 text-white">{getWorkModeLabel('in-presenza')}</option>
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="status" className="text-white font-medium text-sm sm:text-base">{t('addJob.applicationStatus')}</Label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as JobStatus)}
            className="mt-1 w-full px-3 py-2 sm:py-3 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white/10 backdrop-blur-md text-white text-sm sm:text-base h-10 sm:h-11"
          >
            <option value="in-corso" className="bg-gray-800 text-white">{getJobStatusLabel('in-corso')}</option>
            <option value="primo-colloquio" className="bg-gray-800 text-white">{getJobStatusLabel('primo-colloquio')}</option>
            <option value="secondo-colloquio" className="bg-gray-800 text-white">{getJobStatusLabel('secondo-colloquio')}</option>
            <option value="colloquio-tecnico" className="bg-gray-800 text-white">{getJobStatusLabel('colloquio-tecnico')}</option>
            <option value="colloquio-finale" className="bg-gray-800 text-white">{getJobStatusLabel('colloquio-finale')}</option>
            <option value="offerta-ricevuta" className="bg-gray-800 text-white">{getJobStatusLabel('offerta-ricevuta')}</option>
            <option value="rifiutato" className="bg-gray-800 text-white">{getJobStatusLabel('rifiutato')}</option>
            <option value="ghosting" className="bg-gray-800 text-white">{getJobStatusLabel('ghosting')}</option>
            <option value="ritirato" className="bg-gray-800 text-white">{getJobStatusLabel('ritirato')}</option>
          </select>
        </div>

        <div>
          <Label htmlFor="roleDescription" className="text-white font-medium text-sm sm:text-base">{t('addJob.roleDescription')}</Label>
          <Textarea
            id="roleDescription"
            value={parsedData.roleDescription}
            onChange={(e) => setParsedData(prev => ({
              ...prev,
              roleDescription: e.target.value
            }))}
            className="mt-1 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/50 resize-none focus-visible:ring-red-500 focus-visible:border-red-500 text-sm sm:text-base"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};
