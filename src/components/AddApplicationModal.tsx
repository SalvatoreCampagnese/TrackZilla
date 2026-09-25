
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { JobApplication, JobStatus } from '@/types/job';
import { useTranslation } from 'react-i18next';
import { useTranslatedLabels } from '@/hooks/useTranslatedLabels';

interface AddApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddApplication: (application: Omit<JobApplication, 'id' | 'createdAt'>) => Promise<void>;
}

export const AddApplicationModal: React.FC<AddApplicationModalProps> = ({
  open,
  onOpenChange,
  onAddApplication
}) => {
  const { t } = useTranslation();
  const { workModeOptions } = useTranslatedLabels();
  const [formData, setFormData] = useState({
    companyName: '',
    roleDescription: '',
    jobDescription: '',
    salary: 'ND',
    workMode: 'ND' as JobApplication['workMode'],
    status: 'in-corso' as JobStatus,
    applicationDate: new Date().toISOString().split('T')[0],
    tags: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddApplication(formData);
    onOpenChange(false);
    setFormData({
      companyName: '',
      roleDescription: '',
      jobDescription: '',
      salary: 'ND',
      workMode: 'ND',
      status: 'in-corso',
      applicationDate: new Date().toISOString().split('T')[0],
      tags: []
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('addJob.addNewApplication')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="companyName">{t('addJob.companyName')}</Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="roleDescription">{t('applications.role')}</Label>
            <Input
              id="roleDescription"
              value={formData.roleDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, roleDescription: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="jobDescription">{t('addJob.jobDescription')}</Label>
            <Textarea
              id="jobDescription"
              value={formData.jobDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="salary">{t('addJob.salary')}</Label>
            <Input
              id="salary"
              value={formData.salary}
              onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="workMode">{t('addJob.workMode')}</Label>
            <Select value={formData.workMode} onValueChange={(value) => setFormData(prev => ({ ...prev, workMode: value as JobApplication['workMode'] }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {workModeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="applicationDate">{t('addJob.applicationDate')}</Label>
            <Input
              id="applicationDate"
              type="date"
              value={formData.applicationDate}
              onChange={(e) => setFormData(prev => ({ ...prev, applicationDate: e.target.value }))}
              required
            />
          </div>
          
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">{t('addJob.addApplication')}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
