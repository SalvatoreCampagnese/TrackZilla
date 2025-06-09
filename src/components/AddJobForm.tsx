
import React, { useState, useCallback } from 'react';
import { JobApplication, JobStatus } from '@/types/job';
import { parseJobDescription } from '@/utils/jobParser';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { StepIndicator } from './addJob/StepIndicator';
import { JobExtractionStep } from './addJob/JobExtractionStep';
import { JobDetailsForm } from './addJob/JobDetailsForm';
import { TagsManager } from './addJob/TagsManager';

interface AddJobFormProps {
  onAdd: (application: JobApplication) => void;
  onCancel: () => void;
  open: boolean;
}

export const AddJobForm: React.FC<AddJobFormProps> = ({
  onAdd,
  onCancel,
  open
}) => {
  const [step, setStep] = useState<'extract' | 'details'>('extract');
  const [jobDescription, setJobDescription] = useState('');
  const [applicationDate, setApplicationDate] = useState(new Date().toISOString().split('T')[0]);
  const [parsedData, setParsedData] = useState<{
    companyName: string;
    roleDescription: string;
    salary: string;
    workMode: 'remoto' | 'ibrido' | 'in-presenza' | 'ND';
  }>({
    companyName: '',
    roleDescription: '',
    salary: '',
    workMode: 'ND'
  });
  const [status, setStatus] = useState<JobStatus>('in-corso');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const handleParseJob = useCallback(() => {
    if (!jobDescription.trim()) {
      toast({
        title: "Error",
        description: "Please enter the job description first",
        variant: "destructive"
      });
      return;
    }
    const parsed = parseJobDescription(jobDescription);
    setParsedData(parsed);
    setStep('details');
    toast({
      title: "Data extracted!",
      description: "Data has been automatically extracted. Now complete the details."
    });
    // Auto-dismiss toast faster for better UX
    setTimeout(() => {
      const toastElement = document.querySelector('[data-state="open"]');
      if (toastElement) {
        (toastElement as any).click?.();
      }
    }, 1500);
  }, [jobDescription]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!parsedData.companyName.trim()) {
      toast({
        title: "Error",
        description: "Company name is required",
        variant: "destructive"
      });
      return;
    }
    const application: JobApplication = {
      id: Date.now().toString(),
      jobDescription,
      applicationDate,
      companyName: parsedData.companyName,
      roleDescription: parsedData.roleDescription || 'ND',
      salary: parsedData.salary || 'ND',
      workMode: parsedData.workMode,
      status,
      tags,
      createdAt: new Date().toISOString()
    };
    onAdd(application);
    toast({
      title: "Application added!",
      description: "The application has been successfully saved"
    });
  }, [parsedData, jobDescription, applicationDate, status, tags, onAdd]);

  const handleClose = useCallback(() => {
    setStep('extract');
    setJobDescription('');
    setApplicationDate(new Date().toISOString().split('T')[0]);
    setParsedData({
      companyName: '',
      roleDescription: '',
      salary: '',
      workMode: 'ND'
    });
    setStatus('in-corso');
    setTags([]);
    setNewTag('');
    onCancel();
  }, [onCancel]);

  if (!open) return null;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 sm:p-6 shadow-xl">
        {/* Header with step indicator */}
        <div className="mb-6">
          <StepIndicator currentStep={step} />
        </div>

        {/* Form content */}
        <div className="space-y-6">
          {step === 'extract' && (
            <JobExtractionStep
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
              applicationDate={applicationDate}
              setApplicationDate={setApplicationDate}
            />
          )}

          {step === 'details' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <JobDetailsForm
                parsedData={parsedData}
                setParsedData={setParsedData}
                status={status}
                setStatus={setStatus}
              />

              <TagsManager
                tags={tags}
                setTags={setTags}
                newTag={newTag}
                setNewTag={setNewTag}
              />
            </form>
          )}
        </div>

        {/* Footer buttons */}
        <div className="pt-6 border-t border-white/20 mt-6">
          {step === 'extract' ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="w-full sm:flex-1 text-white border-white/20 hover:bg-white/20 h-11 rounded-full order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleParseJob}
                className="w-full sm:flex-1 bg-red-600 hover:bg-red-700 text-white h-11 rounded-full order-1 sm:order-2"
                disabled={!jobDescription.trim()}
              >
                <Wand2 className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Extract Data and Continue</span>
                <span className="sm:hidden">Extract Data</span>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('extract')}
                className="w-full sm:flex-1 text-white border-white/20 hover:bg-white/20 h-11 rounded-full order-2 sm:order-1"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-red-600 hover:bg-red-700 text-white w-full sm:flex-1 h-11 rounded-full order-1 sm:order-2"
              >
                Add Application
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
